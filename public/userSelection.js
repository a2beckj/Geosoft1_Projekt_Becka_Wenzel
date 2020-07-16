//var coordlat = 51.90174605758568
//var coordlng = 7.66937971115112
var username;
var doc;

var coordlat = 51.95579743091287
var coordlng = 7.6264750957489005
var markersLayer = L.featureGroup()
// jshint esversion: 6

/**
* Lösung zu Aufgabe 6, Geosoft 1, SoSe 2020
* @author Judith Becka   Matr.Nr.: 426693
*/

// load map
var map2 = L.map('map2').setView([51.9606649, 7.6261347], 11);

//getStations();
// load OSM-Layer
var osmLayer =new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',   
{attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'});

// add OSM-Layer to map
osmLayer.addTo(map2);


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
* it calls the function busstops().
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
console.log(pnt);
// call function busstops().
getStations(pnt);
}

/**
* time
* @desc takes a second-value (as in seconds elapsed from jan 01 1970) of the time and returns the corresponding time.
* source: https://stackoverflow.com/a/35890816
* @param seconds time in milliseconds
*/
function time(seconds) {
seconds = parseInt(seconds); //ensure the value is an integer
var ms = seconds*1000;
var time = new Date(ms).toISOString().slice(11, -5);
return time + " GMT";
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


 

//______________________________________________________________________________

window.onload = function checkRisk(){
  $.ajax({  url: "//localhost:3000/rides",     
    type: "GET",
    success: function(rides){
      var user = localStorage.getItem('user');
      var alerted = false;
      rides.forEach(ride => {
        if(ride.user == user){
          if(ride.risk == 'yes'){
            alerted = true
          }
        }
        })
        if (alerted){
          alert("Risikofahrt genommen. Bitte sehen sie ihr Risiko in den historischen Fahrten ein");
        }
      }
      })
}


function getStations(location){
  console.log(location[1]);
  console.log(coordlat);
  
  
  // call developers HERE API to get stations nearby
  $.ajax({  url: "https://transit.hereapi.com/v8/stations?in="+location[1]+","+location[0], 
  dataType: "json",
  // token from token.js
  data: {apiKey: api_key},     
  type: "GET",
  async: false,
  success: function(data){
    console.log(data)
    stationsToMap(data.stations);
  }  
 });
 }


/**
 * @desc This function takes the next stations and displays them as leaflet markers.
 * Then it calls the 
 */
function stationsToMap(stations){
  console.log(stations)
  stations.forEach(station => {
  var id = station.place.id;
  var location = ([station.place.location.lat, station.place.location.lng])
  var oneMarker = L.marker(location);
  oneMarker.id = id;
  oneMarker.location = location;
  oneMarker.addTo(markersLayer);
  })
  markersLayer.addTo(map2);
}

markersLayer.on("click", markerOnClick);

function markerOnClick(e) {
  var clickedMarkerID = e.layer.id;
  //var clickedMarkerLocation = e.layer.location
  //clickedMarker.bindPopup(e.layer.name);
  getDepartures(clickedMarkerID);
}


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

function departuresToTable(departures){
  var table = document.getElementById("table");
  console.log(departures);
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
      //console.log("table clicked")
      $(this).addClass('selected').siblings().removeClass('selected');    
      var value=$(this).find('td:first').html();
      //console.log(value);    
    });
    
    // Hier übergeben an MongoDB
    $('.ok').on('click', function(e){
      var line = ($("#table tr.selected td:first").html());
      var timestamp = ($("#table tr.selected td:last").html());
      var user = localStorage.getItem('user');
      //var location = (latlng.lat, latlng.lng);

      inputRidesToMongo(user, line, busstop, location, timestamp);
       //alert($("#table tr.selected td:first").html());
    });
  })   
}


/**
 * @desc This function loads the input from the textarea into MongoDB
 */
function inputRidesToMongo(user, line, busstop, location, timestamp){
  console.log(line);
  if(line == undefined){
    alert('Bitte zuerst eine Fahrt wählen');
    throw new Error ('keine fahrt gewählt')
  }
  // attach to server and post locations from textarea to MongoDB
  $.ajax({  url: "//localhost:3000/rides",       
            type: "POST",
            data: {user: user, line: line, busstop: busstop, coordinates:location, time: timestamp, risk: 'no'},
            success: function(x){
              console.log("eingefügt!")
            }
          })
}  
function logout(){
  localStorage.clear();
  location.replace("http://localhost:3000/userControl");
}
 
