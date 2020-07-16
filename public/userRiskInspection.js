// jshint esversion: 6

/**
* Lösung zu Aufgabe 6, Geosoft 1, SoSe 2020
* @author Judith Becka   Matr.Nr.: 426693
*/

//const MongoClient = require ('mongodb').MongoClient;
//const mongourl = "mongodb://localhost:27017/";

var map = L.map('map').setView([51.9606649, 7.6261347], 11);


// load OSM-Layer
var osmLayer =new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',   
{attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'});

// add OSM-Layer to map
osmLayer.addTo(map);

  //________________________________________________________________________


  window.onload = function getHistoricRides(user){
    $.ajax({  url: "//localhost:3000/rides",     
              type: "GET",
              success: function(rides){
                console.log(rides);
                var user = localStorage.getItem('user');
                var table = document.getElementById("tableHistoric");
           
                rides.forEach(ride => {
                  if (ride.user == user){
                    // attach new row below existing
                    var row = table.insertRow(-1);
              
                    if (ride.risk == 'yes'){
                      row.style.backgroundColor = 'red';
                      var riskMarker = L.circleMarker(ride.coordinates, {color: 'red'});
                      riskMarker.addTo(map);
                      }
                    else{
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

  function logout(){
    localStorage.clear();
    location.replace("http://localhost:3000/userControl");
  }
