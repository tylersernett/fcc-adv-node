'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');

//To make a query search for a Mongo _id, you will have to create const ObjectID = require('mongodb').ObjectID;, 
//and then to use it you call new ObjectID(THE_ID)
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const session = require('express-session');
const passport = require('passport');

const routes = require('./routes.js');
const auth = require('./auth.js');

const app = express();
app.set('view engine', 'pug') //add app.set after app is initialized

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  routes(app, myDataBase)
  auth(app, myDataBase)

}).catch(e => {
  app.route('/').get((req, res) => {
    res.render('pug', { title: e, message: 'Unable to login' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});