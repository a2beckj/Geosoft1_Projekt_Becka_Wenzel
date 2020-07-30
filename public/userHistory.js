// jshint esversion: 6

// Projektaufgabe Geosoft 1, SoSe 2020 
//@author Judith Becka, 426693
//@author Felix Wenzel


// load map
var map = L.map('map').setView([51.9606649, 7.6261347], 11);


// load OSM-Layer
var osmLayer =new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',   
{attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'});

// add OSM-Layer to map
osmLayer.addTo(map);

// Print name of user that is logged in
$('#userName').text(localStorage.getItem('user'));

/**
 * @desc This function gets the rides takes by certain user and displays them in a table. 
 * The station where user started the ride is shown as a marker on a map. If ride is a risk
 * table row of ride is highlighted and risk-marker is added to the map instead of normal marker.
 * @param {string} user - name of user
 */
window.onload = function getHistoricRides(user){
  $.ajax({  url: "//localhost:3000/rides",     
            type: "GET",
            success: function(rides){
                //get username that is logged in
                var user = localStorage.getItem('user');
                // connect to table in html
                var table = document.getElementById("tableHistoric");
           
                rides.forEach(ride => {
                  if (ride.user == user){
                    // attach new row below existing
                    var row = table.insertRow(-1);
                    // if ride is marked as risk
                    if (ride.risk == 'yes'){
                      // highlight table row
                      row.style.backgroundColor = 'red';
                      var riskMarker = L.circleMarker(ride.coordinates, {color: 'red'});
                      // add risk-marker to map on station where ride started
                      riskMarker.addTo(map);
                      }
                    else{
                      // if ride is not a risk, add a normal marker to the map
                      L.marker(ride.coordinates).addTo(map);
                    }
                          
                   // insert cells in new row
                    var Busstop = row.insertCell(0)
                    var Line = row.insertCell(1);
                    var Time = row.insertCell(2);

                    // insert values into cell
                    Busstop.innerHTML = ride.busstop;
                    Line.innerHTML = ride.line;
                    Time.innerHTML = ride.time;

                  }
                  
                });
              }
          })
}
