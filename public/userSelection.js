// Projektaufgabe Geosoft 1, SoSe 2020 
//@author Judith Becka, 426693
//@author Felix Wenzel

// initialize new global marker-Featuregroup
var markersLayer = L.featureGroup()


// load map
var map2 = L.map('map2').setView([51.9606649, 7.6261347], 11);


// load OSM-Layer
var osmLayer =new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',   
{attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'});

// add OSM-Layer to map
osmLayer.addTo(map2);

// Print name of user that is logged in
$('#userName').text(localStorage.getItem('user'));

/**
* @description This function gets the users current Location
*/

function getLocation(){
if (navigator.geolocation) {
  // get the users current location and use it with the showPosition-function
  navigator.geolocation.getCurrentPosition(showPosition);
} else {
  // if the browser can't access location; Error-Message
  y.innerHTML = "Geolocation is not supported by this browser.";
}
}


/**
* @description This function fills the pnt-array with the users coordinates, creates a marker on that 
* location and zooms onto that marker by calling the function centerLeafletMapOnMarker(). After that
* it calls the function getStations() with the users position.
* @param {array} position - users current location
*/
function showPosition(position) {
const pnt =[]
// push coordinates into array
pnt.push(position.coords.longitude, position.coords.latitude);
console.log(pnt);
// create marker on coordinates
var marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map2);
// zoom to that marker
centerLeafletMapOnMarker(map2, marker);
// call function getStations().
getStations(pnt);
}


/**
* @description This function zooms to a markers current extend
* @param {Leaflet Map} map - a given leaflet Map
* @param {a Laeflet Marker} marker - a given Leaflet Marker
*/
function centerLeafletMapOnMarker(map, marker) {
// get coordinates of Marker
var latLngs = [ marker.getLatLng() ];
// define bounds according to the coordinates
var markerBounds = L.latLngBounds(latLngs);
// zoom to that bounds
map.fitBounds(markerBounds);
}

/**
 * @desc This function checks if the user, that is logged in, took a ride that is marked as a risk.
 * If so, it informs the user with an alert.
 */
window.onload = function checkRisk(){
  // gets all the rides
  $.ajax({  url: "//localhost:3000/rides",     
    type: "GET",
    success: function(rides){
      // get user name
      var user = localStorage.getItem('user');
      var alerted = false;
      // for each ride, that user took, check if risk changed to 'yes'
      rides.forEach(ride => {
        if(ride.user == user){
          if(ride.risk == 'yes'){
            alerted = true
          }
        }
        })
        // inform user with an alert
        if (alerted){
          alert("Risikofahrt genommen. Bitte sehen sie ihr Risiko in den historischen Fahrten ein");
        }
      }
      })
}

/**
 * @desc This function takes a location and calls public transit stations nearby
 * @param {array} location - an array of coordinates
 */
function getStations(location){
  // show given location in map
  var loc = L.circleMarker([location[1], location[0]]).addTo(map2);
  centerLeafletMapOnMarker(map2, loc);
  
  // call developers HERE API to get stations nearby
  $.ajax({  url: "https://transit.hereapi.com/v8/stations?in="+location[1]+","+location[0], 
  dataType: "json",
  // token from token.js
  data: {apiKey: api_key},     
  type: "GET",
  async: false,
  success: function(data){
    stationsToMap(data.stations);
  }  
 });
 }


/**
 * @desc This function takes the next stations and displays them as leaflet markers.
 * Then it calls the 
 */
function stationsToMap(stations){
  stations.forEach(station => {
  var id = station.place.id;
  var location = ([station.place.location.lat, station.place.location.lng])
  var oneMarker = L.marker(location);
  // attach id to marker
  oneMarker.id = id;
  // add to Featuregroup
  oneMarker.addTo(markersLayer);
  })
  // display in map
  markersLayer.addTo(map2);
}

// if marker in FeatureGroup is clicked, call function markerOnClick()
markersLayer.on("click", markerOnClick);

/**
 * @desc This function gets the id of the clicked marker and calls function getDepartures() with that ID
 * @param {event} e - clicked marker
 */
function markerOnClick(e) {
  var clickedMarkerID = e.layer.id;
  getDepartures(clickedMarkerID);
}

/**
 * @desc This function calls the next departures of the clicked station
 * @param {string} ID - id of station
 */
function getDepartures(ID){
  // call developers HERE API to get stations nearby
  $.ajax({  url: "https://transit.hereapi.com/v8/departures?ids="+ID, 
  dataType: "json",
  // token from token.js
  data: {apiKey: api_key},     
  type: "GET",
  async: false,
  success: function(data){
    departuresToTable(data.boards);
    }
  })
}

/**
 * @desc This function displays the next departures of a given station in a table
 * @param {array} departures - array of departures from station
 */
function departuresToTable(departures){
  //initialize execute parameter
  var executed = false;
  //attaches to the table in html
  var table = document.getElementById("table");

  //clears the existing table except the head row
  for (var i = table.rows.length - 1; i > 0; i--){
      table.deleteRow(i); }

    
    departures.forEach(departure => {

    //print name of clicked Busstop
    var busstop = departure.place.name;
    $('#busstop').text(busstop);

    var location = departure.place.location;
    
    (departure.departures).forEach(dep => {
      
      // attach new row below existing
      var row = table.insertRow(-1); 
      
      // insert cells in new row
      var Line = row.insertCell(0);
      var Direction = row.insertCell(1)
      var Time = row.insertCell(2);

      // insert values into cell
      Line.innerHTML = dep.transport.name;
      Direction.innerHTML = dep.transport.headsign;
      Time.innerHTML = dep.time;
    });
  

    // Highlight cells and extract values of cells
    // source: http://jsfiddle.net/65JPw/2/
    $("#table tr").click(function(){

      $(this).addClass('selected').siblings().removeClass('selected');    
      var value=$(this).find('td:first').html();
   
    });
    
    // Hier übergeben an MongoDB
    $('.ok').on('click', function(e){
      
      var line = ($("#table tr.selected td:first").html());
      var timestamp = ($("#table tr.selected td:last").html());
      var user = localStorage.getItem('user');
      //prevent user from selecting 2 departures at the same time and same location
      if(!executed){
      inputRidesToMongo(user, line, busstop, location, timestamp);
      executed = true
      }
    });
  })
}

/**
 * @desc This function takes certain parameters of taken rides and saves them in MongoDB
 * @param {string} user - users name
 * @param {int} line - linenumber of transit
 * @param {string} busstop - name of transit station
 * @param {array} location - coordinates of station
 * @param {time} timestamp - date and time of departure
 */
function inputRidesToMongo(user, line, busstop, location, timestamp){
  
  // if no departure is chosen
  if(line == undefined){
    alert('Bitte zuerst eine Fahrt wählen');
    throw new Error ('keine Fahrt gewählt')
  }
  // attach to server and post departures to MongoDB
  $.ajax({  url: "//localhost:3000/rides",       
            type: "POST",
            data: {user: user, line: line, busstop: busstop, coordinates:location, time: timestamp, risk: 'no'},
            success: function(x){
              console.log("eingefügt!")
              alert('Fahrt gespeichert!')
            }
          })
}  

/**
 * @desc This function logs out a user by clearing the local storage and redirecting to Login side
 */
function logout(){
  localStorage.clear();
  location.replace("http://localhost:3000/LoginRegister");
}
 
