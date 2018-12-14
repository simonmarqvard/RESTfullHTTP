let socket = io();
let gData;
let angle = 0;
let shoe;
let hiphop
let boot
let dancetypes = [1, 2, 3, 4]
let mshoe
let fshoe
let nike1
let nike2
let nike3

function preload() {
  shoe = loadImage("/converse_top.png")
  hiphop = loadImage("/hiphip.png")
  boot = loadImage("/boot.png")
  mshoe = loadImage("/mshoe.png")
  fshoe = loadImage("fshoe.png")
  nike1 = loadImage('nike1.png')
  nike2 = loadImage('nike2.png')
  nike3 = loadImage('nike3.png')
}

function initialize() {
  socket.on('connect', () => {
    console.log("you connected to socket")
  })

  socket.on('state', (data) => {
    console.log(data)
    gData = data
  })
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  colorMode(HSB, 360, 100, 100)
}

let lastScreenNumber;
let screenChange = false;
let screenNumber;

function draw() {

  screenChange = screenNumber != lastScreenNumber;
  lastScreenNumber = screenNumber;


  if (!gData.connection) {
    screenSaver()
    screenNumber = 1;
  } else {
    mainScreen()
    screenNumber = 2;
  }
}


//when connect is off
function screenSaver() {
  background(0, 0, 100)
  rectMode(CENTER);
  translate(width / 2, height / 2);
  rotate(angle)
  for (var i = 0; i < 8; i++) {
    push();
    rotate(TWO_PI * i / 8);
    image(shoe, 75, 75);
    pop();
  }
  angle += 0.01;
}

let lastDanceNumber;
let different = false
//when connect is on
function mainScreen() {
  let danceNumber = gData.danceNum
  // var hue = gData.floorHue
  // background(hue, 70, 70)
  // if the dance number changed from the last time
  // different = danceNumber != lastDanceNumber;
  // lastDanceNumber = danceNumber;

  if (danceNumber == 1) {
    salsa()
  }
  if (danceNumber == 2) {
    breakDance()
  }
  if (danceNumber == 3) {
    randomDance()
  }
  if (danceNumber == 4) {
    lineDance()
  }
}

let x = 0

function salsa() {
  var hue = gData.floorHue
  background(hue, 70, 70)
  console.log("salsa")
  var tempo = gData.tempoVal
  image(fshoe, 150 + x, 150)
  image(mshoe, 600 + x, 150)
  if (x > 20) {
    x = x * -1
  } else {
    x = x + 0.5
  }
}

let k = 0;

function breakDance() {
  var hue = gData.floorHue
  background(hue, 70, 70)
  console.log("breakdane")
  var tempo = gData.tempoVal
  translate(width / 2, height / 2);
  for (var i = 0; i < 8; i++) {
    push();
    rotate(i);
    image(hiphop, 100, 100);
    pop();
  }
  k = k + 0.01;
}

function randomDance() {
  var tempo = gData.tempoVal / 2;
  frameRate(tempo)
  var hue = gData.floorHue
  background(hue, 70, 70)
  console.log(hue)
  console.log("rnadom")
  translate(width / 2, height / 2);
  for (var i = 0; i < 8; i++) {
    push();
    rotate(TWO_PI * i / 8);
    var tx = 200 * noise(0.01 * frameCount);
    translate(tx, 0);
    image(nike1, 20, 20);
    translate()
    pop();
  }
  // for (var i = 0; i < 8; i++) {
  //   push();
  //   rotate(TWO_PI * i / 8);
  //   var tx = 200 * noise(0.01 * frameCount);
  //   translate(tx, 0);
  //   image(nike2, i, 20);
  //   translate()
  //   pop();
  // }
  // image(nike1, 100, 300)
  // image(nike2, 200, 600)
  // image(nike3, 600, 200)
  // image(nike2, 900, 350)
  // image(nike3, 600, 200)
  // image(nike1, 150, 390)
}

function lineDance() {
  var hue = gData.floorHue
  var amount = gData.numPeople
  background(hue, 70, 70)
  console.log("linedance")
  var tempo = gData
  for (var i = 0; i < amount; i++) {
    image(boot, 250 * i, 200)
  }
  for (var i = 0; i < amount; i++) {
    image(boot, 250 * i, 400)
  }
}
