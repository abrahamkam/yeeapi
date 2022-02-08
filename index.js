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
/*
app.post('/createwhiteprofile', (req,res) => {

  console.log(req.body)
  const {id} = req.body;
  const {brightness} = req.body;
  const {temperature} = req.body;
  const {fluidity} = req.body;

  console.log("Profile created with values ID:"+id+" Brightness:"+brightness+" temp: "+temperature+" Fluidity:"+fluidity);

  client.write('WHITEPARAMCOMMAND:'+brightness+":"+temperature+":"+fluidity+'\r\n');
  client.pipe(client);

  res.status(201).send({
      confirm: 'White light parameters set'

  })
})
*/
app.post('/shutdown',cors(), (req,res) => {

  console.log(req.body)

  console.log("Shutdown command received");

  client.write('SHUTDOWNCOMMAND\r\n');
  client.pipe(client);

  res.status(201).send({
      confirm: 'shutdown order received'
  })
})

app.post('/turnon', (req,res) => {

  console.log(req.body)

  console.log("Turn on command received");

  client.write('TURNONCOMMAND\r\n');
  client.pipe(client);

  res.status(201).send({
      confirm: 'turn on order received'
  })
})

app.get('/profiles', (req,res) => {

  console.log(req.body)

  console.log("Frontend requested profiles");

  res.status(200).send({
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


/*
const db = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'password',
  insecureAuth: true
})

db.connect((err) => {
  if(err){
    throw err;
  }
  console.log("in like flynn");
})
*/