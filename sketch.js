let xRot = 0;
let yRot = 0;
let zRot = 0;

let magNum = 0;
let magnets = [];
let angles = [0, 110, -45, -90, 180, 135, 70];

let electronNum = 0;
let electrons = [];
let states = [1, -1, 0.95, -1.05, -0.95, 1.05];

let clearScreen = false;

function setup() {
  createCanvas(1280, 720, WEBGL);
  frameRate(30);
}

function draw() {
  background(220);
  angleMode(DEGREES);
  rotateX(xRot);
  rotateY(yRot);
  rotateZ(zRot);
  
  drawNorth();
  drawSouth();
  
  if (frameCount > 200 && frameCount < 400) {
    rotateAppY(-0.3);
  }
  
  if (frameCount > 450) {
    drawScreen();
  }
  
  if (frameCount > 500) {
    sendElectrons();
  }
  
  if (frameCount > 1200) {
    clearScreen = true;
  }
  
  if (frameCount > 1300 && frameCount < 1360) {
    rotateAppY(1);
  }
  
  if (frameCount > 1360) {
    if (zRot > -90) {
      rotateAppZ(-1);
    }
  }
  
  if (frameCount > 1500) {
    clearScreen = false;
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}

function drawNorth() {
  strokeWeight(4);
  stroke(192, 57, 43);
  fill(255);
  
  // front
  beginShape();
  vertex(100, -200, 250);
  vertex(-100, -200, 250);
  vertex(-100, -100, 250);
  vertex(0, -50, 250);
  vertex(100, -100, 250);
  endShape(CLOSE);
  
  // top
  beginShape();
  vertex(100, -200, 250);
  vertex(-100, -200, 250);
  vertex(-100, -200, -250);
  vertex(100, -200, -250);
  endShape(CLOSE);
  
  // right
  beginShape();
  vertex(100, -200, 250);
  vertex(100, -100, 250);
  vertex(100, -100, -250);
  vertex(100, -200, -250);
  endShape(CLOSE);
  
  // left
  beginShape();
  vertex(-100, -200, 250);
  vertex(-100, -100, 250);
  vertex(-100, -100, -250);
  vertex(-100, -200, -250);
  endShape(CLOSE);
  
  // bottom-right
  beginShape();
  vertex(0, -50, 250);
  vertex(100, -100, 250);
  vertex(100, -100, -250);
  vertex(0, -50, -250);
  endShape(CLOSE);
  
  // bottom-left
  beginShape();
  vertex(0, -50, 250);
  vertex(-100, -100, 250);
  vertex(-100, -100, -250);
  vertex(0, -50, -250);
  endShape(CLOSE);
}

function drawSouth() {
  strokeWeight(4);
  stroke(41, 128, 185);
  fill(255);
  
  // front
  beginShape();
  vertex(100, 100, 250);
  vertex(-100, 100, 250);
  vertex(-100, 200, 250);
  vertex(100, 200, 250);
  endShape(CLOSE);
  
  // top
  beginShape();
  vertex(100, 100, 250);
  vertex(-100, 100, 250);
  vertex(-100, 100, -250);
  vertex(100, 100, -250);
  endShape(CLOSE);
  
  // right
  beginShape();
  vertex(100, 100, 250);
  vertex(100, 200, 250);
  vertex(100, 200, -250);
  vertex(100, 100, -250);
  endShape(CLOSE);
  
  // left
  beginShape();
  vertex(-100, 100, 250);
  vertex(-100, 200, 250);
  vertex(-100, 200, -250);
  vertex(-100, 100, -250);
  endShape(CLOSE);
}

function drawScreen() {
  strokeWeight(4);
  stroke(178, 186, 187);
  fill(255);
  
  beginShape();
  vertex(-150, -300, -451);
  vertex(150, -300, -451);
  vertex(150, 300, -451);
  vertex(-150, 300, -451);
  endShape(CLOSE);
}

function rotateAppZ(degree) {
  xRot += degree;
}

function rotateAppY(degree) {
  yRot += degree;
}

function rotateAppZ(degree) {
  zRot += degree;
}
  
function sendMagnets() {
  if (magnets.length === 0) {
    magnets[magNum] = new Magnet(angles[magNum]);
  }
  
  if (magNum < angles.length-1 && magnets[magNum].z <= -450) {
    magNum++;
    magnets[magNum] = new Magnet(angles[magNum]);
  }
  
  if (!clearScreen) {
    magnets.forEach(magnet => magnet.move());
  }
}
  
function sendElectrons() {
  if (electrons.length === 0) {
    electrons[electronNum] = new Electron(states[electronNum]);
  }
  
  if (electronNum < states.length-1 && electrons[electronNum].z <= -450) {
    electronNum++;
    electrons[electronNum] = new Electron(states[electronNum]);
  }
  
  if (!clearScreen) {
    electrons.forEach(electron => electron.move());
  }
}

class Magnet {
  constructor(angle) {
    this._angle = angle;
    this._y = 30;
    this._z = 300;
    this._yVel = 0;
  }
  
  get z() {
    return this._z;
  }
  
  move() {
    // change variables
    let onScreen = (this._z <= -450);
    if (!onScreen) {
      this._z -= 10;
      this._y -= cos(this._angle) * this._yVel;
      this._yVel += 0.02;
    }
    
    // redraw
    noStroke();
  
    push(); // north side
    fill(192, 57, 43);
    translate(0, this._y, this._z);
    onScreen ? rotateY(0) : rotateY(-yRot);
    rotateZ(this._angle);
    translate(0, -20, 0);
    plane(30, 40);
    pop();

    rotateY(0);

    push(); // south side
    fill(41, 128, 185);
    translate(0, this._y, this._z);
    onScreen ? rotateY(0) : rotateY(-yRot);
    rotateZ(this._angle);
    translate(0, 20, 0);
    plane(30, 40);
    pop();
  }
}

class Electron {
  constructor(state) {
    this._state = state;
    this._y = 30;
    this._z = 300;
    this._yVel = 0;
  }
  
  get z() {
    return this._z;
  }
  
  move() {
    // change variables
    let onScreen = (this._z <= -450);
    if (!onScreen) {
      this._z -= 10;
      this._y -= this._state * this._yVel;
      this._yVel += 0.02;
    }
    
    // redraw
    push();
    noStroke();
    fill(244, 208, 63);
    translate(0, this._y, this._z);
    sphere(10);
    pop();
  }
}