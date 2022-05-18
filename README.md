# Advanced Node and Express

This is the boilerplate for the Advanced Node and Express lessons. Instructions for the lessons start at https://www.freecodecamp.org/learn/quality-assurance/advanced-node-and-express/

Live demo: https://fcc-adv-node.herokuapp.com/

running heroku:
1. create githib repo
2. clone locally
3. heroku create <appname>
4. git add .
5. git commit -m "Initial commit"
6. git push heroku
7. change any .env varialbes under heroku dashboard => appname => settings => config vars

running locally:
1. npm install
2. nodemon server.js for live updates (note the URL)
3. visit url: loclhost:<port> 

splitting files:
'''
module.exports = function (app, myDataBase) {
    ...
}

myDB(async client => {
  const myDataBase = await client.db('database').collection('users');
  routes(app, myDataBase)
  auth(app, myDataBase)
  ...
}
'''