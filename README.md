# Advanced Node and Express

This is the boilerplate for the Advanced Node and Express lessons. Instructions for the lessons start at https://www.freecodecamp.org/learn/quality-assurance/advanced-node-and-express/

Live demo: https://fcc-adv-node.herokuapp.com/

Things learned...

running heroku:
1. create githib repo
2. clone locally
3. heroku create {appname}
4. git add .
5. git commit -m "Initial commit"
6. git push heroku
7. change any .env varialbes under heroku dashboard => appname => settings => config vars


running locally:
1. npm install
2. nodemon server.js for live updates (note the port)
3. visit url: localhost:{port}

allow consistent URLs in both local and production server:
* process.cwd() + '/whatever'  [doesn't work with github callback??]

redirect vs render
* redirect -- tell client what URL to go to
* render -- what to actually render to the page for the client

socket.io
```javascript
//send
socket.emit(messageVar, messageContent)
//listen
socket.on(messageVar, (arg)=> {actions} )
```


splitting files (modules):
```javascript
//in new files:
module.exports = function (app, myDataBase) {
    ...
}

//in server file:
const routes = require('./routes.js');
const auth = require('./auth.js');

myDB(async client => {
  const myDataBase = await client.db('database').collection('users');
  routes(app, myDataBase)
  auth(app, myDataBase)
  ...
}
```