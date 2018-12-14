let express = require('express');
let bodyParser = require('body-parser');
let server = express();
var socket = require('socket.io');
var http = require('http')

server.use('/', express.static('public'));
server.use(bodyParser.json());


let httpServer = http.createServer(server)

httpServer.listen(8080, () => {
  console.log("listening on 8080");
})

let state = {
  connection: false,
  numPeople: 5,
  danceNum: 2,
  tempoVal: 120,
  floorHue: 125
}

var io = socket(httpServer);


io.sockets.on('connection', (socket) => {
  console.log("we have a connection" + socket.id)

  io.sockets.emit('state', {
    connection: state.connection,
    numPeople: state.numPeople,
    danceNum: state.danceNum,
    tempoVal: state.tempoVal,
    floorHue: state.floorHue
  })
})


server.get("/state", (req, res) => {
  res.json(state)
});


server.get("/connect", (req, res) => {
  res.json(state.connection)
});

server.get("/people", (req, res) => {
  res.json({
    "people": state.numPeople
  })
});

server.get("/tempo", (req, res) => {
  res.json(state.tempoVal)
});

server.get("/dance", (req, res) => {
  res.json(state.danceNum)
});

server.get("/color", (req, res) => {
  res.json(state.floorHue)
});

//change something here = true / false instead
server.post("/connect", (req, res) => {
  //True

  // state.connection = !state.connection
  state.connection = true
  if (state.connection) {
    res.json({
      message: "You are now connected to the server"
    })
    io.sockets.emit('state', {
      connection: state.connection,
      numPeople: state.numPeople,
      danceNum: state.danceNum,
      tempoVal: state.tempoVal,
      floorHue: state.floorHue
    })
  } else {
    res.json({
      message: "You disconnected from the server"
    })
    io.sockets.emit('state', {
      connection: state.connection,
      numPeople: state.numPeople,
      danceNum: state.danceNum,
      tempoVal: state.tempoVal,
      floorHue: state.floorHue
    })
  }
});

server.post('/people', (req, res) => {
  if (!state.connection) {
    res.json({
      message: "You need to be connected"
    })
  } else {
    state.numPeople = req.body.numPeople;
    io.sockets.emit('state', {
      connection: state.connection,
      numPeople: state.numPeople,
      danceNum: state.danceNum,
      tempoVal: state.tempoVal,
      floorHue: state.floorHue
    })
  }
});

server.post('/tempo', (req, res) => {
  if (!state.connection) {
    res.json({
      message: "You need to be connected"
    })
  } else {
    console.log(req.body);
    state.tempoVal = req.body.tempoVal;
    io.sockets.emit('state', {
      connection: state.connection,
      numPeople: state.numPeople,
      danceNum: state.danceNum,
      tempoVal: state.tempoVal,
      floorHue: state.floorHue
    })
  }
});

server.post('/dance', (req, res) => {
  if (!state.connection) {
    res.json({
      message: "You need to be connected"
    })
  } else {
    console.log(req.body);
    state.danceNum = req.body.danceNum;
    io.sockets.emit('state', {
      connection: state.connection,
      numPeople: state.numPeople,
      danceNum: state.danceNum,
      tempoVal: state.tempoVal,
      floorHue: state.floorHue
    })
  }
});

server.post('/color', (req, res) => {
  if (!state.connection) {
    res.json({
      message: "You need to be connected"
    })
  } else {
    console.log(req.body);
    state.floorHue = req.body.floorHue;
    io.sockets.emit('state', {
      connection: state.connection,
      numPeople: state.numPeople,
      danceNum: state.danceNum,
      tempoVal: state.tempoVal,
      floorHue: state.floorHue
    })
  }
});
