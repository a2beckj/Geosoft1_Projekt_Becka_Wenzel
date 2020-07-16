var markersLayer = L.featureGroup()

var mapDoc = L.map('mapDoc').setView([51.9606649, 7.6261347], 11);

console.log(localStorage)
// load OSM-Layer
var osmLayer =new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',   
{attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'});

// add OSM-Layer to map
osmLayer.addTo(mapDoc);


function getUser(risk){
    $.ajax({  url: "//localhost:3000/user",      
            type: "GET",
            success: function(users){
                var inputName = document.getElementById('user').value;
                var counter = 0;
                    users.forEach(user => {
                        //console.log(user.mail);
                        //console.log(inputName)
                        if (user.mail == inputName){
                            //console.log('name gleich')
                            searchRidesByUser(inputName, risk);
                        }
                        else{ counter ++; }
                    });      
                    if (counter == users.length){
                        alert('Nutzer existiert nicht');
                    }
                
                    }
        })
}


function searchRidesByUser(name, risk){
    $.ajax({  url: "//localhost:3000/rides",     
    type: "GET",
    success: function(rides){
        rides.forEach(ride =>{
            if (ride.user = name){
                changeRiskByUser(ride, risk);
                //console.log(ride._id);
            }
        })
    }
})
}

function changeRiskByUser(ride, risk){
    //console.log(ride);
    $.ajax({  url: "//localhost:3000/rides",       
    type: "PUT",
    data:{_id: ride._id, risk: risk},
    success: function(){
             console.log("Feature aktualisiert");
             alert("Risikostatus für Nutzer geändert");
    }
  })
}

function getRides(){
    $.ajax({  url: "//localhost:3000/rides",     
    type: "GET",
    success: function(rides){
        rides.forEach (ride => {
            var busstop = ride.busstop;
            var newMarker = L.marker(ride.coordinates);
            newMarker.busstop = busstop;
            newMarker.addTo(markersLayer);
        })
        markersLayer.addTo(mapDoc);
        }
    })
}

markersLayer.on("click", markerOnClick);

function markerOnClick(e) {
  var clickedBusstop = e.layer.busstop;
  //var clickedMarkerLocation = e.layer.location
  //clickedMarker.bindPopup(e.layer.name);
  //print name of clicked Busstop
  //var busstop = departure.place.name;
  $('#busstopDoc').text(clickedBusstop);
  getRidesByBusstop(clickedBusstop);
}

function getRidesByBusstop(busstop){
    $.ajax({  url: "//localhost:3000/rides",     
    type: "GET",
    success: function(rides){
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
        //console.log("table clicked")
        $(this).addClass('selected').siblings().removeClass('selected');    
        var value=$(this).find('td:first').html();
        //console.log(value);    
      });

      // Hier übergeben an MongoDB
        $('.ok').on('click', function(e){
        var line = ($("#tableDoc tr.selected td:first").html());
        var timestamp = ($("#tableDoc tr.selected td:last").html());
        //var user = localStorage.getItem('user');
        checkRides(line, timestamp);
    });

    }
})
}

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
        }
    })
}

function checkTimestamp(checkTimestamp, riskTimestamp){
    
    var dateRisk = riskTimestamp.substring(0,10);
    var timeRiskHour = riskTimestamp.substring(11,13);
  
    var dateCheck = checkTimestamp.substring(0,10);
    var timeCheckHour = parseInt(checkTimestamp.substring(11,13));

    if(timeCheckHour == timeRiskHour || (timeCheckHour + 1) == timeRiskHour || (timeCheckHour - 1) == timeRiskHour){
        return true
    }
    else {return false}
}


function changeRiskByRide(ride){
    $.ajax({  url: "//localhost:3000/rides",       
    type: "PUT",
    data:{_id: ride._id, risk: 'yes'},
    success: function(){
             console.log("Feature aktualisiert");
             alert("Fahrt als Risiko markiert!");
    }
  })
}

function logout(){
    localStorage.clear();
    location.replace("http://localhost:3000/userControl");
  }
