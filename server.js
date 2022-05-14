'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const session = require('express-session');
const passport = require('passport');
const ObjectID = require('mongodb').ObjectID;
//To make a query search for a Mongo _id, you will have to create const ObjectID = require('mongodb').ObjectID;, 
//and then to use it you call new ObjectID(THE_ID)
const app = express();
app.set('view engine', 'pug') //add app.set after app is initialized

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.route('/').get((req, res) => {
//   res.render(process.cwd() + '/views/pug/index', {
//     title: 'Hello',
//     message: 'Please login'
//   });
// });

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

myDB(async client => {
  const myDataBase = await client.db('database').collection('users');
  //console.log('connected to db')
  // Be sure to change the title
  app.route('/').get((req, res) => {
    //Change the response to render the Pug template
    res.render('pug', {
      title: 'Connected to Database',
      message: 'Please login'
    });
  });

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  //The serializeUser is called with 2 arguments, the full user object and a 
  //callback used by passport. A unique key to identify that user should be 
  //returned in the callback, the easiest one to use being the user's _id in the object. 
  //It should be unique as it is generated by MongoDB. Similarly, deserializeUser 
  //is called with that key and a callback function for passport as well, but, this time, we 
  //have to take that key and return the full user object to the callback. 
  
  passport.deserializeUser((id, done) => {
    myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
    done(null, doc);
    });
  });
}).catch(e => {
  app.route('/').get((req, res) => {
    res.render('pug', { title: e, message: 'Unable to login' });
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
