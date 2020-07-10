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

//user control
const session = require("express-session");
const bodyParser = require('body-parser');
const router = express.Router();




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

//user control
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));


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
app.locals.db = await app.locals.dbConnection.db("geosoft1");
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

app.get("/userControl", (req, res) => {
  res.sendFile(__dirname + "/public/userControl.html");
});

// routes for get, post, put, and delete

app.get("/user", (req, res) => {
// find all
app.locals.db.collection('user').find({}).toArray((error, result) => {
if(error){
  console.dir(error);
}
res.json(result);
});
});

app.get("/user", (req, res) => {
// find item
console.log("get user " + req.query._id);
app.locals.db.collection('user').find({_id:new mongodb.ObjectID(req.query._id)}).toArray((error, result) => {
if(error){
  console.dir(error);
}
res.json(result);
});
});

app.post("/user", (req, res) => {
// insert item
console.log("insert user ");
console.log(JSON.stringify(req.body));
app.locals.db.collection('user').insertOne(req.body, (error, result) => {
if(error){
  console.dir(error);
  
}
res.json(result);
});
});

app.put("/user", (req, res) => {
// update item
//console.log("update item " + req.body);
let id = req.body._id;
//delete req.body._id;
console.log(req.body); // => { name:req.body.name, description:req.body.description }
app.locals.db.collection('user').updateOne({_id:new mongodb.ObjectID(id)}, {$set: req.body.geoJSON}, (error, result) => {
if(error){
  console.dir(error);
}
res.json(result);
});
});

app.delete("/user", (req, res) => {
// delete item
console.log("delete item " + req.body._id);
let objectId = "ObjectId(" + req.body._id + ")";
app.locals.db.collection('user').deleteOne({_id:new mongodb.ObjectID(req.body._id)}, (error, result) => {
if(error){
  console.dir(error);
}
res.json(result);
});
});

//__________________________________________________________________________________________________________

app.get("/projekt", (req, res) => {
  // find all
  app.locals.db.collection('projekt').find({}).toArray((error, result) => {
  if(error){
    console.dir(error);
  }
  res.json(result);
  });
  });
  
  app.get("/projekt", (req, res) => {
  // find item
  console.log("get projekt " + req.query._id);
  app.locals.db.collection('projekt').find({_id:new mongodb.ObjectID(req.query._id)}).toArray((error, result) => {
  if(error){
    console.dir(error);
  }
  res.json(result);
  });
  });
  
  app.post("/projekt", (req, res) => {
  // insert item
  console.log("insert projekt ");
  console.log(JSON.stringify(req.body));
  app.locals.db.collection('projekt').insertOne(req.body, (error, result) => {
  if(error){
    console.dir(error);
    
  }
  res.json(result);
  });
  });
  
  app.put("/projekt", (req, res) => {
  // update item
  //console.log("update item " + req.body);
  let id = req.body._id;
  //delete req.body._id;
  console.log(req.body); // => { name:req.body.name, description:req.body.description }
  app.locals.db.collection('projekt').updateOne({_id:new mongodb.ObjectID(id)}, {$set: req.body.geoJSON}, (error, result) => {
  if(error){
    console.dir(error);
  }
  res.json(result);
  });
  });
  
  app.delete("/projekt", (req, res) => {
  // delete item
  console.log("delete item " + req.body._id);
  let objectId = "ObjectId(" + req.body._id + ")";
  app.locals.db.collection('projekt').deleteOne({_id:new mongodb.ObjectID(req.body._id)}, (error, result) => {
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

// user control
router.get('/',(req,res) => {
  sess = req.session;
  if(sess.email) {
      return res.redirect('/admin');
  }
  res.sendFile('index.html');
});

router.post('/login',(req,res) => {
  sess = req.session;
  sess.email = req.body.email;
  res.end('done');
});

router.get('/admin',(req,res) => {
  sess = req.session;
  if(sess.email) {
      res.write(`<h1>Hello ${sess.email} </h1><br>`);
      res.end('<a href='+'/logout'+'>Logout</a>');
  }
  else {
      res.write('<h1>Please login first.</h1>');
      res.end('<a href='+'/'+'>Login</a>');
  }
});

router.get('/logout',(req,res) => {
  req.session.destroy((err) => {
      if(err) {
          return console.log(err);
      }
      res.redirect('/');
  });

});

app.use('/', router);

/* app.listen(process.env.PORT || 4000,() => {
  console.log(`App Started on PORT ${process.env.PORT || 4000}`);
}); */