var GameState = function() {
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
  var firstStart = true;

  this.preload = function() {
    this.game.stage.backgroundColor = backgroundColor;

    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;

    this.game.load.audio('music', ['sounds/music.mp3', 'sounds/music.ogg']);
    this.game.load.audio('coin', ['sounds/coin.wav', 'sounds/coin.mp3']);
    this.game.load.audio('jump', ['sounds/jump.wav', 'sounds/jump.mp3']);
    this.game.load.audio('die', ['sounds/die.wav', 'sounds/die.mp3']);
    this.game.load.image('square', 'img/square.png');
    this.game.load.image('enemy', 'img/enemy.png');
    this.game.load.image('square-particle', 'img/square-particle.png');
    this.game.load.image('enemy-particle', 'img/enemy-particle.png');
    this.game.load.image('instruction', 'img/instruction.png');
    this.game.load.spritesheet('volume', 'img/volume-spritesheet.png', 96, 96);
  }

  this.create = function() {
    upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    upKey.onDown.add(up, this);
    upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
    upKey.onDown.add(up, this);

    downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    downKey.onDown.add(down, this);
    downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    downKey.onDown.add(down, this);

    leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    leftKey.onDown.add(left, this);
    leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    leftKey.onDown.add(left, this);

    rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    rightKey.onDown.add(right, this);
    rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    rightKey.onDown.add(right, this);

    addScoreLable();

    square = this.game.add.sprite(0, 0, 'square');
    square.tint = playerColor;
    square.width = squareSize;
    square.height = squareSize;
    square.x = this.game.world.centerX;
    square.y = this.game.world.centerY;
    square.anchor.setTo(0.5, 0.5);

    coin = this.game.add.sprite(-100, -100, 'square');
    coin.tint = coinColor;
    coin.width = coinSize;
    coin.height = coinSize;
    coin.anchor.setTo(0.5, 0.5);
    var tween = this.game.add.tween(coin).to({
      angle: 360
    }, 1000, 'Linear', true);
    tween.repeat(-1, 0);

    enemies = this.game.add.group();
    enemies.enableBody = true;
    enemies.createMultiple(20, 'enemy');

    var instruction = this.game.add.sprite(0, 0, 'instruction');
    instruction.x = this.game.world.centerX - instruction.width / 2;
    instruction.y = this.game.world.height - instruction.height - margin;

    nextEnemy = this.game.time.now;

    setTimeout(function() {
      this.game.add.tween(instruction).to({
        alpha: 0
      }, instructionFadeTime).start();
    }, instructionShowTime);

    addGameName();
    addSounds();
    addVolumeButton();
    addCoin();
    addBestScore();
    addEmitter();

    var graphics = this.game.add.graphics(0, 0);

    drawBorder(graphics);
  }

  this.update = function() {
    if (overlap(square, coin)) {
      takeCoin();
    }

    enemies.forEach(function(enemy) {
      if (overlap(square, enemy)) {
        squareDie(enemy);
      }
    });

    if (!firstStart)
      spawnEnemies();
  }

  function overlap(obj1, obj2) {
    if (obj1.getBounds().width !== obj1.width) {
      return false;
    }

    return Phaser.Rectangle.intersects(obj1.getBounds(), obj2.getBounds());
  }

  this.render = function() {
    var recA = square.getBounds();
    var recB = coin.getBounds();

    var intersects = Phaser.Rectangle.intersection(recA, recB);
  }

  function drawBorder(graphics) {
    graphics.lineStyle(5, 0x1A237E);
    graphics.drawRect(
      this.game.world.centerX - (distance + squareSize / 2 + margin * 2),
      this.game.world.centerY - (distance + squareSize / 2 + margin * 2),
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
    var limit = this.game.world.centerY - (distance + margin);

    var tween;

    if (calc < limit) {
      calc += distance;
      tween = this.game.add.tween(square).to({
          y: calc
        }, squareMoveTime / 2)
        .to({
          y: square.y
        }, squareMoveTime / 2).start();
    } else {
      tween = this.game.add.tween(square).to({
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
    var limit = this.game.world.centerY + (distance + margin);

    var tween;

    if (calc > limit) {
      calc -= distance;
      tween = this.game.add.tween(square).to({
          y: calc
        }, squareMoveTime / 2)
        .to({
          y: square.y
        }, squareMoveTime / 2).start();
    } else {
      tween = this.game.add.tween(square).to({
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
    var limit = this.game.world.centerX - (distance + margin);

    var tween;

    if (calc < limit) {
      calc += distance;
      tween = this.game.add.tween(square).to({
          x: calc
        }, squareMoveTime / 2)
        .to({
          x: square.x
        }, squareMoveTime / 2).start();
    } else {
      tween = this.game.add.tween(square).to({
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
    var limit = this.game.world.centerX + (distance + margin);

    var tween;

    if (calc > limit) {
      calc -= distance;
      tween = this.game.add.tween(square).to({
          x: calc
        }, squareMoveTime / 2)
        .to({
          x: square.x
        }, squareMoveTime / 2).start();
    } else {
      tween = this.game.add.tween(square).to({
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

    text = this.game.add.text(0, 0, "250+", style);
    text.x = this.game.world.centerX - text.width / 2;
    text.y = 100;
  }

  function addScoreLable() {
    var style = {
      font: "100px Arial",
      fill: "#fff",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    };

    scoreLable = this.game.add.text(0, 0, "0", style);
    scoreLable.anchor.setTo(0.5, 0.5);
    scoreLable.x = this.game.world.centerX;
    scoreLable.y = this.game.world.centerY;
    scoreLable.alpha = 0.25;
  }

  function addSounds() {
    music = this.game.add.audio('music');
    music.loop = true;
    music.volume = 0.0;

    coinSound = this.game.add.audio('coin');
    coinSound.volume = 0.36;

    jumpSound = this.game.add.audio('jump');
    jumpSound.volume = 0.3;

    dieSound = this.game.add.audio('die');
    dieSound.volume = 0.3;

    if (!settings.muted)
      music.play();

    this.game.add.tween(music).to({
      volume: 0.6
    }, musicUp).start();
  }

  function squareDie(enemy) {
    if (!enemy.alive) {
      return;
    }

    isDie = true;

    enemy.kill();

    if (score > bestScore) {
      bestScore = score;
      updateBestScore(bestScore);
    }

    score = 0;
    scoreLable.text = score;


    emitter2.x = enemy.x;
    emitter2.y = enemy.y;
    emitter2.start(true, 200, null, 20);

    if (!settings.muted) {
      dieSound.play();
    }

    this.game.time.events.add(300, function() {
      isDie = false;
    }, this);
  }

  function takeCoin() {
    if (coinTaking)
      return;

    firstStart = false;

    coinTaking = true;

    emitter.x = coin.x;
    emitter.y = coin.y;
    emitter.start(true, 800, null, 20);

    if (!settings.muted)
      coinSound.play();

    updateScore();

    var t = this.game.add.tween(coin).to({
      width: 0,
      height: 0
    }, 100).start();
    this.game.time.events.add(coinInterval, addCoin, this);
  }

  function updateScore() {
    score++;
    scoreLable.text = score;
  }

  function addEmitter() {
    emitter = this.game.add.emitter(0, 0);
    emitter.makeParticles('square-particle');
    emitter.setXSpeed(-150, 150);
    emitter.setYSpeed(-150, 150);
    emitter.setScale(2, 0, 2, 0, 800);

    emitter2 = this.game.add.emitter(0, 0);
    emitter2.makeParticles('enemy-particle');
    emitter2.setXSpeed(-150, 150);
    emitter2.setYSpeed(-150, 150);
    emitter2.setScale(2, 0, 2, 0, 800);
  }

  function spawnEnemies() {
    if (this.game.time.now < nextEnemy)
      return;

    var start = 2000,
      end = 500,
      tScore = 30;
    var delay = Math.max(start - (start - end) * score / tScore, end);
    nextEnemy = this.game.time.now + delay;

    addEnemy()
  }

  function addEnemy() {
    var enemy = enemies.getFirstDead();

    if (!enemy) {
      return;
    }

    var patterns = [{
      x: -squareSize / 2,
      y: this.game.world.centerY - (distance + margin)
    }, {
      x: -squareSize / 2,
      y: this.game.world.centerY
    }, {
      x: -squareSize / 2,
      y: this.game.world.centerY + (distance + margin)
    }, {
      x: this.game.width + squareSize / 2,
      y: this.game.world.centerY - (distance + margin)
    }, {
      x: this.game.width + squareSize / 2,
      y: this.game.world.centerY
    }, {
      x: this.game.width + squareSize / 2,
      y: this.game.world.centerY + (distance + margin)
    }, {
      x: this.game.world.centerX - (distance + margin),
      y: -squareSize / 2
    }, {
      x: this.game.world.centerX,
      y: -squareSize / 2
    }, {
      x: this.game.world.centerX + (distance + margin),
      y: -squareSize / 2
    }, {
      x: this.game.world.centerX - (distance + margin),
      y: this.game.height + squareSize / 2
    }, {
      x: this.game.world.centerX,
      y: this.game.height + squareSize / 2
    }, {
      x: this.game.world.centerX + (distance + margin),
      y: this.game.height + squareSize / 2
    }];

    var speed = 2;
    var speedRatio = 100;

    var position = patterns[this.game.rnd.integerInRange(0, patterns.length - 1)];

    enemy.reset(position.x, position.y);

    if (position.x > this.game.width) {
      enemy.body.velocity.x = -speedRatio * speed;
    } else if (position.x < 0) {
      enemy.body.velocity.x = speedRatio * speed;
    } else if (position.y > this.game.height) {
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

    soundButton = this.game.add.button(5, 5, 'volume', volumeStateChange, this, frames, frames, frames);
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
    var tx = this.game.rnd.integerInRange(0, 2);
    var ty = this.game.rnd.integerInRange(0, 2);

    tx = this.game.world.centerX - (distance + margin) + tx * (distance + margin);
    ty = this.game.world.centerY - (distance + margin) + ty * (distance + margin);

    coin.x = tx;
    coin.y = ty;

    this.game.add.tween(coin).to({
      width: coinSize,
      height: coinSize
    }, 100).start();

    coinTaking = false;
  }

  function addBestScore() {
    var style = {
      font: "21px Arial",
      fill: "#fff",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    };

    bestScoreLable = this.game.add.text(0, 0, 'Лучший счёт 0', style);
    bestScoreLable.anchor.setTo(0.5, 0.5);
    bestScoreLable.x = this.game.world.centerX;
    bestScoreLable.y = this.game.world.centerY + (distance + margin) + distance;
    bestScoreLable.alpha = 0;
  }

  function updateBestScore(score) {
    if (bestScoreLable.alpha === 0) {
      this.game.add.tween(bestScoreLable).to({
        alpha: 1
      }, 1000).start();
    }
    bestScoreLable.text = 'Лучший счёт: ' + score;
  }
};