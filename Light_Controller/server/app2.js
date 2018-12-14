//the diff between app2 and app2 is the JSON file system

var fs = require('fs');
var values = './values.json';
var file = require(values);

const express = require('express');
const morgan = require('morgan');

const SerialPort = require('serialport');
const myPort = new SerialPort('/dev/cu.usbmodem1411', 9600);

var Readline = SerialPort.parsers.Readline; // make instance of Readline parser
var parser = new Readline(); // make a new parser to read ASCII lines
myPort.pipe(parser); // pipe the serial stream to the parser


myPort.on('open', showPortOpen);
parser.on('data', readSerialData);
myPort.on('close', showPortClose);
myPort.on('error', showError);


var currentPattern;
var currentColor;

//serialport stuff ends here

//express stuff starts here
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('./public'));
app.use(morgan('hello simon and keerthana'));
//this declares that morgan will be the environment we will use
//so every time a client sends a request to this server it will need to be through app.dev(morgan) first

//POST requests

app.post('/api', (req, res) => {

  var input = req.body;

  console.log("hello world:" + req.body);
  JSON.stringify(input);

  file.pattern = input.pattern;
  file.speed = input.speed;
  file.color = input.hue;

  fs.writeFile(values, JSON.stringify(file), function(err) {
    if (err) return console.log(err);
    console.log(file);
    console.log('writing to ' + values);
  });

  console.log("pattern is :" + req.body.pattern);
  console.log("speed is :" + req.body.speed);
  console.log("color is :" + req.body.hue);


  myPort.write(input.pattern + ',' + input.speed + '&' + input.hue + ';');
  //all serial functions in context of myPort object

  // console.log(req.body);
  res.send(req.body);

})

//GET REQUESTS

app.get("/color", (req, res) => {
  res.send("current color is :" + values['color']);
})

app.get("/pattern", (req, res) => {
  res.send("current pattern is :" + values['pattern']);
})

app.get("/speed", (req, res) => {
  res.send("current speed is :" + values['speed']);
})

app.get("/status", (req, res) => {
  // res.send("current speed is :"+values['pattern']);
  // res.send("current speed is :"+values['speed']);
  // res.send("current speed is :"+values['color']);
  res.send(file);

})

app.listen(3003, () => {
  console.log("Server is up and listening on 3003...")
})


function showPortOpen() {
  console.log('port open. Data rate: ' + myPort.baudRate);
}

function readSerialData(data) {
  // console.log(data);
  currentPattern = data;
}

function showPortClose() {
  console.log('port closed.');
}

function showError(error) {
  console.log('Serial port error: ' + error);
}
