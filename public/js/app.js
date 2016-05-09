var game = new Phaser.Game(600, 900, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update,
  render: render
});

const margin = 20;
const squareSize = 50;
const coinSize = 24;
const distance = squareSize + margin;

const backgroundColor = 0x283593,
  playerColor = 0xEEFF41,
  coinColor = 0x2196F3,
  enemyColor = 0xFF5252;

const squareMoveTime = 75,
  instructionFadeTime = 2000,
  instructionShowTime = 3000,
  musicUp = 7500,
  coinInterval = 500;

var square,
  coin,
  isMoving = false,
  isDie = false,
  soundButton,
  score = 0,
  bestScore = 0,
  nextEnemy,
  enemies,
  coinSound,
  jumpSound,
  dieSound,
  music;

var settings = loadSettings();

var upKey;
var downKey;
var leftKey;
var rightKey;
var takingCoin = false;

function preload() {
  game.stage.backgroundColor = backgroundColor;

  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;

  game.load.audio('music', ['sounds/music.mp3', 'sounds/music.ogg']);
  game.load.audio('coin', ['sounds/coin.wav', 'sounds/coin.mp3']);
  game.load.audio('jump', ['sounds/jump.wav', 'sounds/jump.mp3']);
  game.load.audio('die', ['sounds/die.wav', 'sounds/die.mp3']);
  game.load.image('square', 'img/square.png');
  game.load.image('enemy', 'img/enemy.png');
  game.load.image('square-particle', 'img/square-particle.png');
  game.load.image('enemy-particle', 'img/enemy-particle.png');
  game.load.image('instruction', 'img/instruction.png');
  game.load.spritesheet('volume', 'img/volume-spritesheet.png', 96, 96);
}

function create() {
  upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
  upKey.onDown.add(up, this);
  upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
  upKey.onDown.add(up, this);

  downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
  downKey.onDown.add(down, this);
  downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  downKey.onDown.add(down, this);

  leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
  leftKey.onDown.add(left, this);
  leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  leftKey.onDown.add(left, this);

  rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
  rightKey.onDown.add(right, this);
  rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  rightKey.onDown.add(right, this);

  addScoreLable();

  square = game.add.sprite(0, 0, 'square');
  square.tint = playerColor;
  square.width = squareSize;
  square.height = squareSize;
  square.x = game.world.centerX;
  square.y = game.world.centerY;
  square.anchor.setTo(0.5, 0.5);

  coin = game.add.sprite(-100, -100, 'square');
  coin.tint = coinColor;
  coin.width = coinSize;
  coin.height = coinSize;
  coin.anchor.setTo(0.5, 0.5);
  var tween = game.add.tween(coin).to({
    angle: 360
  }, 1000, 'Linear', true);
  tween.repeat(-1, 0);

  enemies = game.add.group();
  enemies.enableBody = true;
  enemies.createMultiple(20, 'enemy');

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
  addSounds();
  addVolumeButton();
  addCoin();
  addEmitter();

  var graphics = game.add.graphics(0, 0);

  drawBorder(graphics);
}

function update() {
  if (overlap(square, coin)) {
    takeCoin();
  }

  enemies.forEach(function(enemy) {
    if (overlap(square, enemy)) {
      squareDie(enemy);
    }
  });

  console.log(enemies.hash[0].inWorld);

  spawnEnemies();
}

function overlap(obj1, obj2) {
  if (obj1.getBounds().width !== obj1.width) {
    return false;
  }

  return Phaser.Rectangle.intersects(obj1.getBounds(), obj2.getBounds());
}

function render() {
  var recA = square.getBounds();
  var recB = coin.getBounds();

  var intersects = Phaser.Rectangle.intersection(recA, recB);
}

function drawBorder(graphics) {
  graphics.lineStyle(5, 0x1A237E);
  graphics.drawRect(
    game.world.centerX - (distance + squareSize / 2 + margin * 2),
    game.world.centerY - (distance + squareSize / 2 + margin * 2),
    (distance + squareSize / 2 + margin * 2) * 2,
    (distance + squareSize / 2 + margin * 2) * 2
  );
}

function up() {
  if (isMoving)
    return;

  if (!settings.muted)
    jumpSound.play();

  var calc = square.y - (distance + margin)
  var limit = game.world.centerY - (distance + margin);

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

  if (!settings.muted) {
    jumpSound.play();
  }

  var calc = square.y + (distance + margin)
  var limit = game.world.centerY + (distance + margin);

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

  if (!settings.muted) {
    jumpSound.play();
  }

  var calc = square.x - (distance + margin)
  var limit = game.world.centerX - (distance + margin);

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

  if (!settings.muted) {
    jumpSound.play();
  }

  var calc = square.x + (distance + margin)
  var limit = game.world.centerX + (distance + margin);

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
    font: "48px Arial",
    fill: "#fff",
    boundsAlignH: "center",
    boundsAlignV: "middle"
  };

  text = game.add.text(0, 0, "250+", style);
  text.x = game.world.centerX - text.width / 2;
  text.y = 100;
}

function addScoreLable() {
  var style = {
    font: "100px Arial",
    fill: "#fff",
    boundsAlignH: "center",
    boundsAlignV: "middle"
  };

  scoreLable = game.add.text(0, 0, "0", style);
  scoreLable.anchor.setTo(0.5, 0.5);
  scoreLable.x = game.world.centerX;
  scoreLable.y = game.world.centerY;
  scoreLable.alpha = 0.25;
}

function addSounds() {
  music = game.add.audio('music');
  music.loop = true;
  music.volume = 0.0;

  coinSound = game.add.audio('coin');
  coinSound.volume = 0.36;

  jumpSound = game.add.audio('jump');
  jumpSound.volume = 0.3;

  dieSound = game.add.audio('die');
  dieSound.volume = 0.3;

  if (!settings.muted)
    music.play();

  game.add.tween(music).to({
    volume: 0.6
  }, musicUp).start();
}

function squareDie(enemy) {
  if (!enemy.alive) {
    return;
  }

  isDie = true;

  enemy.kill();

  this.score = 0;
  this.scoreLable.text = this.score;
  
  emitter2.x = enemy.x;
  emitter2.y = enemy.y;
  emitter2.start(true, 200, null, 20);

  if (!settings.muted) {
    dieSound.play();
  }

  game.time.events.add(300, function() {
    isDie = false;
  }, this);
}

function takeCoin() {
  if (coinTaking)
    return;

  coinTaking = true;

  emitter.x = coin.x;
  emitter.y = coin.y;
  emitter.start(true, 800, null, 20);

  if (!settings.muted)
    coinSound.play();

  updateScore();

  var t = game.add.tween(coin).to({
    width: 0,
    height: 0
  }, 100).start();
  game.time.events.add(coinInterval, addCoin, this);
}

function updateScore() {
  score++;
  scoreLable.text = score;
}

function addEmitter() {
  emitter = game.add.emitter(0, 0);
  emitter.makeParticles('square-particle');
  emitter.setXSpeed(-150, 150);
  emitter.setYSpeed(-150, 150);
  emitter.setScale(2, 0, 2, 0, 800);
  
  emitter2 = game.add.emitter(0, 0);
  emitter2.makeParticles('enemy-particle');
  emitter2.setXSpeed(-150, 150);
  emitter2.setYSpeed(-150, 150);
  emitter2.setScale(2, 0, 2, 0, 800);
}

function spawnEnemies() {
  if (game.time.now < nextEnemy)
    return;

  var start = 2000,
    end = 500,
    tScore = 30;
  var delay = Math.max(start - (start - end) * score / tScore, end);
  nextEnemy = game.time.now + delay;

  addEnemy()
}

function addEnemy() {
  var enemy = enemies.getFirstDead();

  if (!enemy) {
    return;
  }

  var patterns = [{
    x: -squareSize / 2,
    y: game.world.centerY - (distance + margin)
  }, {
    x: -squareSize / 2,
    y: game.world.centerY
  }, {
    x: -squareSize / 2,
    y: game.world.centerY + (distance + margin)
  }, {
    x: game.width + squareSize / 2,
    y: game.world.centerY - (distance + margin)
  }, {
    x: game.width + squareSize / 2,
    y: game.world.centerY
  }, {
    x: game.width + squareSize / 2,
    y: game.world.centerY + (distance + margin)
  }, {
    x: game.world.centerX - (distance + margin),
    y: -squareSize / 2
  }, {
    x: game.world.centerX,
    y: -squareSize / 2
  }, {
    x: game.world.centerX + (distance + margin),
    y: -squareSize / 2
  }, {
    x: game.world.centerX - (distance + margin),
    y: game.height + squareSize / 2
  }, {
    x: game.world.centerX,
    y: game.height + squareSize / 2
  }, {
    x: game.world.centerX + (distance + margin),
    y: game.height + squareSize / 2
  }];

  var speed = 2;
  var speedRatio = 100;

  var position = patterns[game.rnd.integerInRange(0, patterns.length - 1)];

  enemy.reset(position.x, position.y);
  
  if (position.x > game.width) {
    enemy.body.velocity.x = -speedRatio * speed;
  } else if (position.x < 0) {
    enemy.body.velocity.x = speedRatio * speed;
  } else if (position.y > game.height) {
    enemy.body.velocity.y = -speedRatio * speed;
  } else if (position.y < 0) {
    enemy.body.velocity.y = speedRatio * speed;
  }

  enemy.anchor.setTo(0.5);  
  enemy.outOfBoundsKill = true;  
  enemy.checkWorldBounds = true;
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

    if (music.paused)
      music.resume();
    else
      music.play();

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

  tx = game.world.centerX - (distance + margin) + tx * (distance + margin);
  ty = game.world.centerY - (distance + margin) + ty * (distance + margin);

  coin.x = tx;
  coin.y = ty;

  game.add.tween(coin).to({
    width: coinSize,
    height: coinSize
  }, 100).start();

  coinTaking = false;
}