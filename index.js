// jshint esversion: 8
// jshint node: true
"use strict";

// This server exposes some database functions to a web interface
//          it translates and forwards get, post, put, and delete items
//
// install mongodb; optionally install mongo client
// see: http://mongodb.github.io/node-mongodb-native/3.1/quick-start/quick-start/
//
// change to the directory containing this file
// $ cd PATH/database-mongodb
// create data folder and run mongod service
// $ mkdir data
// $ mongod --dbpath=./data
//
// $ npm init
// $ npm install --save express mongodb
// $ node .
//
// usage (requires httpie):
// ->
// HTTP GET localhost:3000/
// HTTP POST localhost:3000/item name=foo description=bar
// HTTP PUT localhost:3000/item _id=<itemid> name=foo description=bar
// HTTP DELETE localhost:3000/item _id=<itemid>
//
// perhaps:
// -> open in browser: http://localhost:3000/

// after using: shutdown mongod service
// $ mongod --shutdown
// ... alternatively use mongo shell to send shutdown command
// $ mongo
// > use admin
// > db.shutdownServer()


const express = require("express");



const app = express();
const port = 3000;




// middleware for handling json request data
// https://expressjs.com/en/4x/api.html#express.json
app.use(express.json());

app.use(express.urlencoded({extended: true}));

// middleware for handling urlencoded request data
// https://expressjs.com/en/4x/api.html#express.urlencoded
//app.use(express.urlencoded({ extended: false }));



app.use("/leaflet", express.static(__dirname + "/node_modules/leaflet/dist"));

app.use("/leaflet-draw", express.static(__dirname + "/node_modules/leaflet-draw/dist"));

app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist"));

app.use("/leaflet-heat", express.static(__dirname + "/node_modules/leaflet.heat/dist"));


app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));


// references:
// https://www.w3schools.com/nodejs/nodejs_mongodb.asp
// http://mongodb.github.io/node-mongodb-native/3.1/tutorials/crud/
//

// integrating the database connection in the app using the mongo-driver
//                                        (higher level libraries exist such as "monk" or "mongoose")
// MongoClient provides us with a db connection and database object...
const mongodb = require('mongodb');

app.use('/public', express.static(__dirname + '/public'));
// finish this block before the server starts,
// there are some async tasks inside we need to wait for => declare async so we can use await
(async () => {

try {
// Use connect method to the mongo-client with the mongod-service
//                      and attach connection and db reference to the app
app.locals.dbConnection = await mongodb.MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true });
app.locals.db = await app.locals.dbConnection.db("itemdb");
console.log("Using db: " + app.locals.db.databaseName);
} catch (error) {
console.dir(error);
}

//mongo.close();

})();

// db is now available and we can continue with the webapp




app.get("/page1", (req, res) => {
res.sendFile(__dirname + "/public/geoJson.html");
});

app.get("/pag2", (req, res) => {
res.sendFile(__dirname + "/public/indexpublic.html");
});

// routes for get, post, put, and delete

app.get("/item", (req, res) => {
// find all
app.locals.db.collection('item').find({}).toArray((error, result) => {
if(error){
  console.dir(error);
}
res.json(result);
});
});

app.get("/item", (req, res) => {
// find item
console.log("get item " + req.query._id);
app.locals.db.collection('item').find({_id:new mongodb.ObjectID(req.query._id)}).toArray((error, result) => {
if(error){
  console.dir(error);
}
res.json(result);
});
});

app.post("/item", (req, res) => {
// insert item
console.log("insert item ");
console.log(JSON.stringify(req.body));
app.locals.db.collection('item').insertOne(req.body, (error, result) => {
if(error){
  console.dir(error);
  
}
res.json(result);
});
});

app.put("/item", (req, res) => {
// update item
//console.log("update item " + req.body);
let id = req.body._id;
//delete req.body._id;
console.log(req.body); // => { name:req.body.name, description:req.body.description }
app.locals.db.collection('item').updateOne({_id:new mongodb.ObjectID(id)}, {$set: req.body.geoJSON}, (error, result) => {
if(error){
  console.dir(error);
}
res.json(result);
});
});

app.delete("/item", (req, res) => {
// delete item
console.log("delete item " + req.body._id);
let objectId = "ObjectId(" + req.body._id + ")";
app.locals.db.collection('item').deleteOne({_id:new mongodb.ObjectID(req.body._id)}, (error, result) => {
if(error){
  console.dir(error);
}
res.json(result);
});
});



var server = app.listen(port, () => console.log("Example app listening on port " + port + "!"));


// make sure connections close before stopping process

process.on("SIGTERM", () => {
server.close();
app.locals.dbConnection.close();
console.log("SIGTERM");
process.exit(0);
});

process.on("SIGINT", () => {
server.close();
app.locals.dbConnection.close();
console.log("SIGINT");
process.exit(0);
});



