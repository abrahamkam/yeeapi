const express = require('express');
const app = express();
const PORT = 8080;
const mysql = require('mysql2');
const path = require('path');
const cors = require("cors")
var client;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname,'build', 'index.html'))
}) 
//Default profiles in case database profile retrieval fails
profiles = [
  {"name":"Firelight","brightness":100,"temperature":1700,
  "image":'https://pbs.twimg.com/media/D8BRDEDWsAInrYe.png'},
   {"name":"Nap","brightness":20,"temperature":1700,"image":'https://img.freepik.com/free-vector/pixel-art-moon-icon_41992-1203.jpg?size=338&ext=jpg'},
   {"name":"Harsh","brightness":100,"temperature":5000,
    "image":'https://images.squarespace-cdn.com/content/v1/551a19f8e4b0e8322a93850a/1529105713123-9Q3OJ9SYBUN78ESS81PR/Intro_Image.png'}]
app.get('/profiles', cors(), function(req, res){
  res.json(profiles)
})

app.listen(
  PORT,
  ()=> console.log(`Primary interface alive on:${PORT}`)

)
//POST route that creates a white light profile. 
app.post('/createwhiteprofile/', (req,res) => {

  console.log(req.body)
  //const {id} = req.body;
  const {brightness} = req.body;
  const {temperature} = req.body;
  //const {fluidity} = req.body;

  console.log("Profile created with values brightness: "+ brightness +" temperature: "+ temperature );

  client.write('WHITEPARAMCOMMAND:'+brightness+":"+temperature+'\r\n');
  client.pipe(client);

  res.status(200).send({
      confirm: 'White light profile created'
  })
})
//POST endpoint to turn the light off  
app.post('/shutdown',cors(), (req,res) => {

  console.log(req.body)

  console.log("Shutdown command received");

  client.write('SHUTDOWNCOMMAND\r\n');
  client.pipe(client);

  res.status(201).send({
      confirm: 'shutdown order received'
  })
})
//POST endpoint to turn the light on
app.post('/turnon', (req,res) => {

  console.log(req.body)

  console.log("Turn on command received");

  client.write('TURNONCOMMAND\r\n');
  client.pipe(client);

  res.status(201).send({
      confirm: 'turn on order received'
  })
})


const net = require('net');
const server = net.createServer((c) => {
  client = c;
  c.on('error', function (exc) {
    console.log("Client disconnected through error: " + exc);
});
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });

});
server.on('error', (err) => {
  throw err;
});

server.listen(8081, () => {
  console.log('server bound');
});
//Create the connection to the mysql server. 
const db = mysql.createConnection({
  host : 'abrahamkam.net',
  user : 'root',
  password : 'password',
  database: 'yeeapi',
  insecureAuth: true
})
//Connection to the database plus actions that are executed upon connection with the SQL database.
//Creates the database and table that will store the light profiles upon connection, thus setting up the SQL server for use. 
db.connect((err) => {
  if(err){
    throw err;
  }
 /* db.query('CREATE DATABASE yeeapi', (err, result) => {
    if(err) throw err;
  });
*/
  db.query('CREATE TABLE profiles(name VARCHAR(50), brightness int, temperature int, image VARCHAR(500), PRIMARY KEY (name))', (err, result) => {
    if(err) console.log("Failure creating base table");
  });
  console.log("in like flynn");
})

//POST endpoint to set up the default database table if it doesn't exist already
app.post('/dbtablesetup',(req,res)=>{
  var sql = 'CREATE TABLE profiles(name VARCHAR(50), brightness int, temperature int, image VARCHAR(500), PRIMARY KEY (name))';
  db.query(sql, (err, result) => {
    if(err) console.log("Failure creating base table");
    res.send('table created')
  });
})
//GET endpoint to retrieve a list of database profiles
app.get('/getdbprofiles', (req,res) =>{
  var sql = 'SELECT * FROM profiles';
  db.query(sql, (err, result) => {
    if(err) throw err;
    res.send(result)
  });
})
//POST endpoint allowing the creation of a white light profile in the database. 
//{name} = the name of the profile
//{brightness} = the % brightness the lamp should be on, ranging from 0% to 100%. 
//{temperature} a Kelvin temperature value ranging from 1700 to 6500, with higher temperatures unintuitively meaning colder light. 
//{image} being the image used in the UI for the created profile.
app.post('/insertprofile', (req,res) =>{
  const {name} = req.body;
  const {brightness} = req.body;
  const {temperature} = req.body;
  const {image} = req.body;
  var profile = {name:name, brightness:brightness,temperature:temperature, image:image}
  var sql = 'INSERT INTO profiles SET ?';

  db.query(sql,profile,(err,result) => {
    if(err) throw err;
    res.send(result)
  })
})

//POST endpoint to create the default database if it doesn't exist yet. 
app.post('/dbsetup', (req,res) =>{
  var sql = 'CREATE DATABASE yeeapi';
  db.query(sql, (err, result) => {
    if(err) console.log("Database creation through endpoint failed");
    res.send('created')
  });
})