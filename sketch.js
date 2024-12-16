var player;
var GUI;
var leftPressed = false;
var rightPressed = false;
var eWH;
var canvas;
var pg;

var colliders;

function setup(){
  colliders = new Group();

  eWH = windowHeight - 30;
  canvas = createCanvas(windowWidth, eWH);
  canvas.parent('canvasDIV');
  pg = createGraphics(100, 100);

  player = new Player(50,50);
  tempWorldMake(10,10);
  GUI = new Gui();

  camera.on();
  camera.position.x = player.sprite.position.x;
  camera.position.y = player.sprite.position.y;

  angleMode(DEGREES);
  frameRate(60);
}

function draw(){
  camera.on();
  //background(3, 182, 252);
  background(51);
  drawSprites();
  camera.zoom = 1.25;
  player.tool.updateRotation();
  moveCamera();
  player.move();
  if(leftPressed == true) player.tool.mine();
  camera.off();
  GUI.drawGUI();

  tempMakePixels(100,100);

  player.sprite.collide(colliders);

}

function tempMakePixels(x,y){
  let pink = color(255, 102, 204);
  loadPixels();
  let d = pixelDensity();
  let halfImage = 4 * (width * d) * (height / 2 * d);
    for(var i = 0; i < x; i++){
      for(var j = 0; j < y; j++){
        pixels[i] = red(pink);
        pixels[i + 1] = green(pink);
        pixels[i + 2] = blue(pink);
        pixels[i + 3] = alpha(pink);
      }
    }
  updatePixels();
}

function tempWorldMake(x,y){

  // var floor1 = createSprite(player.sprite.position.x-150, player.sprite.position.y + 32, 300, 10);
  // var floor2 = createSprite(player.sprite.position.x+200, player.sprite.position.y + 32, 300, 10);

  // colliders.add(floor1);
  // colliders.add(floor2);

  var blocksize = 16;

  for(var i = 0; i < x; i++){
    for(var j = 0; j < y; j++){
      var c = createSprite(i*blocksize, j*blocksize, blocksize, blocksize)
      //c.life = 300;
    }
  }
}

function connectBlocks(){
  for(var i = 0; i < 0;){

  }
}

function moveCamera(){

  // this is along the right lines, just needs to be a smooth camera time

  if((camera.position.x - player.sprite.position.x) > 20){
    camera.position.x = camera.position.x - (player.speed);
  } else if((camera.position.x - player.sprite.position.x) < -20){
    camera.position.x = camera.position.x + (player.speed);
  }

  if((camera.position.y - player.sprite.position.y) > 20){
    camera.position.y = camera.position.y - (player.speed);
  } else if((camera.position.y - player.sprite.position.y) < -20){
    camera.position.y = camera.position.y + (player.speed);
  }
}

class Particle{
  
}

class Dirt extends Particle{
  
}

class Player{
  constructor(x,y){

    //upgrades
    this.speed = 2;

    this.Batteries = 1;
    this.health = 100 + (this.Batteries-1);
    this.maxHealth = this.Batteries*100;

    //sprite
    this.sprite = createSprite(x,y, 16, 32);
    this.sprite.collide(colliders);
    this.sprite.shapeColor = color(255);

    //tool i guess
    this.tool = new Tool("dirt", this.sprite.position.x, this.sprite.position.y);
  }

  move(){
    if(keyIsDown(87)){
      player.sprite.position.y = player.sprite.position.y - player.speed;
    }
    // if(keyIsDown(83) && player.bottomCollide.collide(floor) == false){
    if(keyIsDown(83)){
      player.sprite.position.y = player.sprite.position.y + player.speed;
    }
    if(keyIsDown(65)){
      player.sprite.position.x = player.sprite.position.x - player.speed;
    }
    if(keyIsDown(68)){
      player.sprite.position.x = player.sprite.position.x + player.speed;
    }
    if(keyIsDown(32)){
      //jump, something with collision.bottom or whatever
    }
  }

  updateTool(type){
    this.tool.sprite.remove();
    this.tool = new Tool(type, this.sprite.position.x, this.sprite.position.y);
  }
}


function mousePressed(){
  if(mouseButton === LEFT){
    leftPressed = true;
  } else {
    rightPressed = true;
  }
}

function mouseReleased(){
  if(mouseButton === LEFT){
    leftPressed = false;
    //player.tool.miningLaser.sprite.remove();
  } else {
    rightPressed = false;
  }
}

class Tool{
  constructor(type, x, y){
    this.sprite = createSprite(x, y, 16, 8);
    this.sprite.rotateToDirection = true;

    this.miningLaser = {};
    this.miningRange = 100;
    this.miningWidth = 1;

    switch(type){
      case "dirt":
        this.sprite.shapeColor = color("red");
        break;
      case "stone":
        this.sprite.shapeColor = color("lightblue");
        break;
        case "rock":
        this.sprite.shapeColor = color("lightgreen");
      default:
        //
    }
  }

  updateRotation(){
    player.tool.sprite.position.x = player.sprite.position.x;
    player.tool.sprite.position.y = player.sprite.position.y;
    this.sprite.attractionPoint(1, camera.mouseX, camera.mouseY);
    this.sprite.limitSpeed(0.1);
    this.sprite.position.x = this.sprite.position.x + map(camera.mouseX-this.sprite.position.x, -90, 90, -12, 12, true);
    this.sprite.position.y = this.sprite.position.y + map(camera.mouseY-this.sprite.position.y, -90 , 90, -16, 16, true);
  }

  mine(){
    this.miningLaser.sprite = this.createLaser();
    this.miningLaser.sprite.rotation = atan2(camera.mouseY - this.sprite.position.y, camera.mouseX - this.sprite.position.x) + 90;
    //console.log(this.miningLaser.sprite.rotation)


    this.miningLaser.sprite.life = 2;
    this.miningLaser.sprite.shapeColor = color(255)

    player.tool.checkCollision();
  }

  checkCollision(){
    // determine pixels that the mining laser is taking up (gonna be really hard sheesh! or maybe not)
    // get miningLaser.position
    //console.log("peen")
    rotate(this.miningLaser.sprite.rotation);
    rect(this.miningLaser.sprite.position.x, this.miningLaser.sprite.position.y, this.miningWidth, this.miningRange);
    print(atan2(camera.mouseY - this.sprite.position.y, camera.mouseX - this.sprite.position.x) + 90)
  }

  createLaser(){
    var distX = camera.mouseX-this.sprite.position.x;
    var distY = camera.mouseY-this.sprite.position.y;

    var vector = p5.Vector.fromAngle(radians(atan2(distY, distX)), this.miningRange/2);
    return createSprite(
      this.sprite.position.x + vector.x,
      this.sprite.position.y + vector.y,
      this.miningWidth,
      this.miningRange
    );

  }
}

class Gui{
  constructor(){
    this.health = {};
    this.elements = {};
    this.tools = {};
    this.vacpac = {};
    this.jetpack = {};
  }

  drawGUI(){
    this.Health();
    this.Elements();
    this.Tools();
    this.VacPac();
    this.JetPack();
  }

  Elements(){
    stroke(0);
    fill(43)
    textFont('Helvetica')
    // have discovered elements and make this grow
    this.elements.GUI = rect(10, 65, 75, 153);
    for(var i = 0; i < 9; i++){

      // have a switch case, i < allElements.length, make a new text for each
      // or just i < discoveredElements and add each on loop through - better

    }
    fill(255);
    textAlign(LEFT);
    text("£  99999999", 15, 78);
  }

  Tools(){
    stroke(0);
    fill(43);
    this.tools.rig = rect(10, eWH-290, 50, 77);
    this.tools.dig = rect(10, eWH-370, 50, 77);
    this.tools.build = rect(10, eWH-450, 50, 77);
    this.tools.items = rect(10, eWH-530, 50, 77);

    textAlign(CENTER);
    noStroke();
    fill(255);
    text("RIG TOOLS", 10, eWH-527, 53);
    text("DIG TOOLS", 10, eWH-447, 53);
    text("BUILD TOOLS", 10, eWH-367, 53);
    text("ITEMS TOOLS", 10, eWH-287, 53);
  }

  VacPac(){
    stroke(0);
    fill(43);
    rect(10, eWH - 210, 50, 200)
  }

  JetPack(){
    stroke(0);
    fill(43);
    rect(65, eWH - 160, 65, 150);
  }

  Lab(){

  }

  Options(){

  }

  IncomingMessage(){

  }

  Health(){
    stroke(color("blue"));
    // use a for loop for more
    fill(43)
    this.health.GUI = rect(10,10,75 * player.Batteries, 40);

    textAlign(LEFT);
    noStroke();
    fill(255);
    var toPrint = (player.health + " / " + player.maxHealth);
    text(str(toPrint), (70*player.Batteries) - 35, 53, 100);
  }
}

// the nodes of ore can just hop around on a grid
