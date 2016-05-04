var game = new Phaser.Game(500, 800, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update,
  render: render
});

const distance = 50;
const margin = 15;
const squareSize = 50;

const backgroundColor = 0x283593,
  playerColor = 0xEEFF41,
  enemyColor = 0xFF5252;

const animationTime = 75;

var square;

var upKey;
var downKey;
var leftKey;
var rightKey;

function preload() {
  game.stage.backgroundColor = backgroundColor;

  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;

  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.load.image('square', 'img/square.png');
}

function create() {
  upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
  upKey.onDown.add(up, this);

  downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
  downKey.onDown.add(down, this);

  leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
  leftKey.onDown.add(left, this);

  rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
  rightKey.onDown.add(right, this);

  square = game.add.sprite(0, 0, 'square');
  
  square.tint = playerColor;
  square.width = squareSize;
  square.height = squareSize;
  square.x = game.world.centerX - squareSize / 2;
  square.y = game.world.centerY - squareSize / 2;

  let graphics = game.add.graphics(0, 0);

  drawBorder(graphics);
}

function update() {
  //square.x = game.input.activePointer.x - 50;
  //square.y = game.input.activePointer.y - 50;
}

function render() {
  //game.debug.geom(square);
}

function drawBorder(graphics) {
  graphics.lineStyle(5, 0x1A237E);
  graphics.drawRect(
    game.world.centerX - squareSize / 2 - (distance + margin * 2), 
    game.world.centerY - squareSize / 2 - (distance + margin * 2), 
    (distance + margin) * 3 + margin,
    (distance + margin) * 3 + margin
  );
}

function up() {
  let calc = Math.max(square.y - (distance + margin), game.world.centerY - squareSize / 2 - (distance + margin));
  game.add.tween(square).to({y: calc}, animationTime).start();
}

function down() {
  let calc = Math.min(square.y + (distance + margin), game.world.centerY - squareSize / 2 + (distance + margin));
  game.add.tween(square).to({y: calc}, animationTime).start();
}

function left() {
  let calc = Math.max(square.x - (distance + margin), game.world.centerX - squareSize / 2 - (distance + margin));
  game.add.tween(square).to({x: calc}, animationTime).start();
}

function right() {
  let calc = Math.min(square.x + (distance + margin), game.world.centerX - squareSize / 2 + (distance + margin));
  game.add.tween(square).to({x: calc}, animationTime).start();
}