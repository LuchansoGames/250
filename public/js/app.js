var game = new Phaser.Game(600, 900, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update,
  render: render
});

const distance = 50;
const margin = 15;
const squareSize = 50;
const coinSize = 25;

const backgroundColor = 0x283593,
  playerColor = 0xEEFF41,
  enemyColor = 0xFF5252;

const squareMoveTime = 75,
  instructionFadeTime = 2000,
  instructionShowTime = 3000,
  musicUp = 15000;

var square,
  coin,
  isMoving = false,
  soundButton,
  score = 0,
  bestScore = 0,
  nextEnemy,
  enemies,
  music;

var settings = loadSettings();

var upKey;
var downKey;
var leftKey;
var rightKey;

function preload() {
  game.stage.backgroundColor = backgroundColor;

  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;

  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.load.audio('music', ['sounds/music.mp3', 'sounds/music.ogg']);
  game.load.audio('coin', ['sounds/coin.wav', 'sounds/coin.mp3']);
  game.load.audio('coin', ['sounds/jump.wav', 'sounds/jump.mp3']);
  game.load.image('square', 'img/square.png');
  game.load.image('instruction', 'img/instruction.png');
  game.load.spritesheet('volume', 'img/volume-spritesheet.png', 96, 96);
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

  coin = game.add.sprite(0, 0, 'square');
  coin.tint = playerColor;
  coin.width = coinSize;
  coin.height = coinSize;
  coin.anchor.setTo(0.5, 0.5);

  var tween = game.add.tween(coin).to({
    angle: 360
  }, 1000, 'Linear', true);
  tween.repeat(-1, 0);

  var instruction = game.add.sprite(0, 0, 'instruction');
  instruction.x = game.world.centerX - instruction.width / 2;
  instruction.y = game.world.height - instruction.height - margin;

  nextEnemy = game.time.now;

  setTimeout(function() {
    game.add.tween(instruction).to({
      alpha: 0
    }, instructionFadeTime).start();
  }, instructionShowTime);

  addGameName();
  addMusic();
  addVolumeButton();

  var graphics = game.add.graphics(0, 0);

  drawBorder(graphics);
}

function update() {
  game.physics.arcade.overlap(square, coin, takeCoin, null, this);
  game.physics.arcade.overlap(square, enemies, squareDie, null, this);
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
  if (isMoving)
    return;

  var calc = square.y - (distance + margin)
  var limit = game.world.centerY - squareSize / 2 - (distance + margin);

  var tween;

  if (calc < limit) {
    calc += distance;
    tween = game.add.tween(square).to({
        y: calc
      }, squareMoveTime / 2)
      .to({
        y: square.y
      }, squareMoveTime / 2).start();
  } else {
    tween = game.add.tween(square).to({
      y: calc
    }, squareMoveTime).start();
  }

  isMoving = true;
  tween.onComplete.add(function() {
    isMoving = false;
  })
}

function down() {
  if (isMoving)
    return;

  var calc = square.y + (distance + margin)
  var limit = game.world.centerY - squareSize / 2 + (distance + margin);

  var tween;

  if (calc > limit) {
    calc -= distance;
    tween = game.add.tween(square).to({
        y: calc
      }, squareMoveTime / 2)
      .to({
        y: square.y
      }, squareMoveTime / 2).start();
  } else {
    tween = game.add.tween(square).to({
      y: calc
    }, squareMoveTime).start();
  }

  isMoving = true;
  tween.onComplete.add(function() {
    isMoving = false;
  })
}

function left() {
  if (isMoving)
    return;

  var calc = square.x - (distance + margin)
  var limit = game.world.centerX - squareSize / 2 - (distance + margin);

  var tween;

  if (calc < limit) {
    calc += distance;
    tween = game.add.tween(square).to({
        x: calc
      }, squareMoveTime / 2)
      .to({
        x: square.x
      }, squareMoveTime / 2).start();
  } else {
    tween = game.add.tween(square).to({
      x: calc
    }, squareMoveTime).start();
  }

  isMoving = true;
  tween.onComplete.add(function() {
    isMoving = false;
  })
}

function right() {
  if (isMoving)
    return;

  var calc = square.x + (distance + margin)
  var limit = game.world.centerX - squareSize / 2 + (distance + margin);

  var tween;

  if (calc > limit) {
    calc -= distance;
    tween = game.add.tween(square).to({
        x: calc
      }, squareMoveTime / 2)
      .to({
        x: square.x
      }, squareMoveTime / 2).start();
  } else {
    tween = game.add.tween(square).to({
      x: calc
    }, squareMoveTime).start();
  }

  isMoving = true;
  tween.onComplete.add(function() {
    isMoving = false;
  })
}

function addGameName() {
  var style = {
    font: "32px Arial",
    fill: "#fff",
    boundsAlignH: "center",
    boundsAlignV: "middle"
  };

  text = game.add.text(0, 0, "250+", style);
  text.x = game.world.centerX - text.width / 2;
  text.y = game.world.centerY - 200;
}

function addMusic() {
  music = game.add.audio('music');
  music.loop = true;
  music.volume = 0.0;

  if (!settings.muted)
    music.play();

  game.add.tween(music).to({
    volume: 1
  }, musicUp).start();
}

function squareDie() {

}

function takeCoin() {

}

function spawnEnemies() {
  if (game.time.now < this.nextEnemy)
    return;

  var start = 1300,
    end = 500,
    score = 40;
  var delay = Math.max(start - (start - end) * this.score / score, end);
  this.nextEnemy = game.time.now + delay;

  var patterns = [];
  patterns[0] = [
    [{
      i: -1,
      j: -1,
      ver: true,
      speed: 1
    }],
    [{
      i: -1,
      j: 0,
      ver: true,
      speed: 1
    }],
    [{
      i: -1,
      j: 1,
      ver: true,
      speed: 1
    }],
    [{
      i: 1,
      j: -1,
      ver: true,
      speed: 1
    }],
    [{
      i: 1,
      j: 0,
      ver: true,
      speed: 1
    }],
    [{
      i: 1,
      j: 1,
      ver: true,
      speed: 1
    }],
    [{
      i: -1,
      j: -1,
      ver: false,
      speed: 1
    }],
    [{
      i: 0,
      j: -1,
      ver: false,
      speed: 1
    }],
    [{
      i: 1,
      j: -1,
      ver: false,
      speed: 1
    }],
    [{
      i: -1,
      j: 1,
      ver: false,
      speed: 1
    }],
    [{
      i: 0,
      j: 1,
      ver: false,
      speed: 1
    }],
    [{
      i: 1,
      j: 1,
      ver: false,
      speed: 1
    }],
  ];

  var e = patterns[0][game.rnd.integerInRange(0, patterns[0].length - 1)];

  for (var i = 0; i < e.length; i++) {
    this.addEnemy(e[i].i, e[i].j, e[i].ver, e[i].speed * 2);
  }
}

function addEnemy(i, j, ver, speed) {
  var enemy = this.enemies.getFirstDead();

  if (!enemy)
    return;

  var tmpX, tmpY;
  if (ver) {
    enemy.reset(game.width / 2 + i * 8 * 8 + i * 190, game.height / 2 + j * 8 * 8);
    enemy.body.velocity.x = -100 * i * speed;
  } else {
    enemy.reset(game.width / 2 + i * 8 * 8, game.height / 2 + j * 8 * 8 + j * 190);
    enemy.body.velocity.y = -100 * j * speed;
  }

  enemy.anchor.setTo(0.5);
  enemy.checkWorldBounds = true;
  enemy.outOfBoundsKill = true;
}

function takeCoin() {
  if (this.coinTaking)
    return;

  this.coinTaking = true;

  this.emitter.x = this.coin.x;
  this.emitter.y = this.coin.y;
  //this.emitter.start(true, 800, null, 20);

  this.coinSound.play();
  this.updateScore();

  var t = game.add.tween(this.coin.scale).to({
    x: 0,
    y: 0
  }, 100).start();
  game.time.events.add(500, this.addCoin, this);
}

function addVolumeButton() {
  var frames = 1;

  if (settings.muted) {
    frames = 0;
  }

  soundButton = game.add.button(5, 5, 'volume', volumeStateChange, this, frames, frames, frames);
  soundButton.width = 48;
  soundButton.height = 48;
}

function volumeStateChange() {
  if (soundButton.frame === 0) {
    soundButton.setFrames(1, 1, 1);
    music.resume();

    settings.muted = false;
  } else if (soundButton.frame === 1) {
    soundButton.setFrames(0, 0, 0);
    music.pause();

    settings.muted = true;
  }

  saveSettings(settings);
}

function saveSettings(settings) {
  localStorage.setItem('250-settings', JSON.stringify(settings));
}

function loadSettings() {
  return JSON.parse(localStorage.getItem('250-settings')) || {
    muted: false
  };
}

function addCoin() {
  var tx = game.rnd.integerInRange(0, 2);
  var ty = game.rnd.integerInRange(0, 2);
  
  // TODO HERE
  //tx = game.world.centerX - distance

  var coinPosition = [{
    x: game.width / 2 - 8 * 8,
    y: game.height / 2 - 8 * 8
  }, {
    x: game.width / 2,
    y: game.height / 2 - 8 * 8
  }, {
    x: game.width / 2 + 8 * 8,
    y: game.height / 2 - 8 * 8
  }, {
    x: game.width / 2 - 8 * 8,
    y: game.height / 2
  }, {
    x: game.width / 2,
    y: game.height / 2
  }, {
    x: game.width / 2 + 8 * 8,
    y: game.height / 2
  }, {
    x: game.width / 2 - 8 * 8,
    y: game.height / 2 + 8 * 8
  }, {
    x: game.width / 2,
    y: game.height / 2 + 8 * 8
  }, {
    x: game.width / 2 + 8 * 8,
    y: game.height / 2 + 8 * 8
  }, ];

  for (var i = 0; i < coinPosition.length; i++) {
    if (coinPosition[i].x == this.coin.x && coinPosition[i].y == this.coin.y)
      coinPosition.splice(i, 1);
    else if (coinPosition[i].x < this.square.x + 7 * 8 && coinPosition[i].x > this.square.x - 7 * 8 &&
      coinPosition[i].y < this.square.y + 7 * 8 && coinPosition[i].y > this.square.y - 7 * 8)
      coinPosition.splice(i, 1);
  }

  var newPos = coinPosition[game.rnd.integerInRange(0, coinPosition.length - 1)];

  this.coin.reset(newPos.x, newPos.y);
  game.add.tween(this.coin.scale).to({
    x: 1,
    y: 1
  }, 100).start();

  this.coinTaking = false;
}