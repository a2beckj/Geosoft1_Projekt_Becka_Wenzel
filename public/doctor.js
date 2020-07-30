// initialize marker featureGroup
var markersLayer = L.featureGroup()

// load map
var mapDoc = L.map('mapDoc').setView([51.9606649, 7.6261347], 11);

// load OSM-Layer
var osmLayer =new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',   
{attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'});

// add OSM-Layer to map
osmLayer.addTo(mapDoc);

// Print name of user that is logged in
$('#userName').text(localStorage.getItem('user'));

/**
 * @desc This function gets the users stored in MongoDB and gets all the rides taken by user by calling function searchRidesByUser()
 * @param {string} risk - risk of user
 */
function getUser(risk){
    $.ajax({  url: "//localhost:3000/user",      
            type: "GET",
            success: function(users){
                // attach to input field in html
                var inputName = document.getElementById('user').value;
                var counter = 0;
                    users.forEach(user => {
                        // search for user-rides
                        if (user.mail == inputName){
                            searchRidesByUser(inputName, risk);
                        }
                        else{ counter ++; }
                    }); 
                    // if given user doesn't exist     
                    if (counter == users.length){
                        alert('User doesnt exist');
                    }
                
                    }
        })
}

/**
 * @desc This function gets the rides and changes the risk-state by calling function changeRiskByUser().
 * @param {string} name - name of user
 * @param {string} risk - risk of user
 */
function searchRidesByUser(name, risk){
    $.ajax({  url: "//localhost:3000/rides",     
    type: "GET",
    success: function(rides){
        rides.forEach(ride =>{
            if (ride.user == name){
                changeRiskByUser(ride, risk);
            }
        })
        alert("Riskstatus has changed!");
        }
    })
}

/**
 * @desc This function changes the risk-state of the user
 * @param {string} ride - ride of user
 * @param {string} risk - risk of user  
 */
function changeRiskByUser(ride, risk){
    $.ajax({  url: "//localhost:3000/rides",       
    type: "PUT",
    data:{_id: ride._id, risk: risk},
    success: function(){
             console.log("Feature aktualisiert");
    }
  })
}

/**
 * @desc This function gets all the rides stored in MongoDB
 */
function getRides(){
    $.ajax({  url: "//localhost:3000/rides",     
    type: "GET",
    success: function(rides){
        rides.forEach (ride => {
            var busstop = ride.busstop;
            // add a marker to all stations, where rides started
            var newMarker = L.marker(ride.coordinates);
            // attach busstop attribute to marker
            newMarker.busstop = busstop;
            // add marker to featureGroup
            newMarker.addTo(markersLayer);
        })
        // add featureGroup to Map
        markersLayer.addTo(mapDoc);
        }
    })
}

// if marker in FeatureGroup is clicked, call function markerOnClick()
markersLayer.on("click", markerOnClick);

/**
 * @desc This function gets the id of the clicked marker and calls function getRidesByBusstop() with that station
 * @param {event} e - clicked marker
 */
function markerOnClick(e) {
  var clickedBusstop = e.layer.busstop;
  // show clicked busstop in html
  $('#busstopDoc').text(clickedBusstop);
  getRidesByBusstop(clickedBusstop);
}

/**
 * @desc This function creates a table with all taken departures from a given station
 * @param {string} busstop - clicked station
 */
function getRidesByBusstop(busstop){
    $.ajax({  url: "//localhost:3000/rides",     
    type: "GET",
    success: function(rides){
        console.log(rides)
        var table = document.getElementById("tableDoc");
        //clears the existing table except the head row
        for (var i = table.rows.length - 1; i > 0; i--){
            table.deleteRow(i); }

        rides.forEach(ride => {
            if(ride.busstop == busstop){
                // attach new row below existing
            var row = table.insertRow(-1); 
      
            // insert cells in new row
            var Line = row.insertCell(0);
            var Time = row.insertCell(1);

            // insert values into cell
            Line.innerHTML = ride.line;
            Time.innerHTML = ride.time;
            }
        });

        // Highlight cells and extract values of cells
    // source: http://jsfiddle.net/65JPw/2/
    $("#tableDoc tr").click(function(){
        $(this).addClass('selected').siblings().removeClass('selected');    
        var value=$(this).find('td:first').html();  
      });

      // Hier übergeben an MongoDB
        $('.ok').on('click', function(e){
        var line = ($("#tableDoc tr.selected td:first").html());
        var timestamp = ($("#tableDoc tr.selected td:last").html());
        checkRides(line, timestamp);
    });

    }
})
}

/**
 * @desc This function gets all rides from MongoDB and checks if the given timestamp is within a timerange of 2 hours
 * to other departures stored in MongoDB by calling function checkTimestamp(). If so, the risk-states of these departures also 
 * have to by marked as risk by calling function changeRiskByRide().
 * @param {int} line - line of ride
 * @param {time} timestamp - date and time of ride
 */
function checkRides(line, timestamp){
    $.ajax({  url: "//localhost:3000/rides",     
    type: "GET",
    success: function(rides){
        rides.forEach(ride => {
            if(ride.line == line){
                if (checkTimestamp(ride.time, timestamp)){
                    changeRiskByRide(ride);
                };
            }
        })
        alert("Ride successfully marked!");
        }
    })
}

/**
 * @desc This function takes timestamp of ride in MongoDB and timestamp of the known ride of risk. 
 * Then it determines whether the risk of the ride in MongoDB has to be changed to risk or not.
 * @param {time} checkTimestamp - timestamp of ride in MongoDB
 * @param {time} riskTimestamp - timestamp of given risk-ride
 */
function checkTimestamp(checkTimestamp, riskTimestamp){
    
    var dateRisk = riskTimestamp.substring(0,10);
    var timeRiskHour = riskTimestamp.substring(11,13);
  
    var dateCheck = checkTimestamp.substring(0,10);
    var timeCheckHour = parseInt(checkTimestamp.substring(11,13));
    // if date is the same
    if (dateCheck == dateRisk){
        // if ride is within 1 hour before or 1 hour after risk-ride
        if(timeCheckHour == timeRiskHour || (timeCheckHour + 1) == timeRiskHour || (timeCheckHour - 1) == timeRiskHour){
        return true
        }
        else {return false}
    }
    else {return false}
}

var alertedRide = false;
/**
 * @desc This function changes the risk state of a given ride
 * @param {array} ride - ride whos risk-state has to be changed
 */
function changeRiskByRide(ride){
    $.ajax({  url: "//localhost:3000/rides",       
    type: "PUT",
    data:{_id: ride._id, risk: 'yes'},
    success: function(){
             console.log("Feature aktualisiert");
    }
  })
}
