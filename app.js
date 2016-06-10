var Menu = {
  init: function() {
    this.score = new ScoreBuilder(this.game);
  },

  preload: function() {
    if (!isVkEnv()) {
      game.scale.pageAlignHorizontally = true;
      game.scale.pageAlignVertically = true;
    }
    this.game.load.crossOrigin = true;
    this.game.load.image('logo', 'img/logo.png');
    this.game.load.image('play', 'img/ic-play.png');
    this.game.load.image('help', 'img/ic-help.png');
    this.game.load.image('list', 'img/ic-list.png');
    // this.game.load.image('score-background', 'img/score-background.png');
    this.game.load.image('template-photo', 'img/template-photo.jpg');
    // this.game.load.image('score-background', 'http://www.html5gamedevs.com/uploads/profile/photo-thumb-7510.png');
    
    this.score.preload();
  },

  create: function() {
    this.game.stage.backgroundColor = Store.backgroundColor;

    this.addLogotype();
    this.addControls();
    this.addScoreTable();
  },

  update: function() {

  },

  addLogotype: function() {
    var logoX = game.world.centerX;
    var logoY = 75;

    this.logotype = game.add.sprite(logoX, logoY, 'logo');
    this.logotype.scale.setTo(0.5);
    this.logotype.anchor.setTo(0.5);
    this.logotype.alpha = 0;

    this.game.add.tween(this.logotype).to({
      alpha: 1
    }, 250).start();
  },

  addControls: function() {
    this.buttonDistance = 175;
    this.buttonSize = 125;
    this.buttonLableStyle = {
      font: "24px Jura",
      fill: "#fff",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    };
    this.btnLablepadding = 85;

    this.buttonsGroup = this.game.add.group();

    this.buttonsGroup.add(this.createNewBtn(this.game.world.centerX - this.buttonDistance, 0, 'play', 'Играть', this.btnPlay_click));
    this.buttonsGroup.add(this.createNewBtn(this.game.world.centerX, 0, 'help', 'Как играть?', this.btnHelp_click));
    this.buttonsGroup.add(this.createNewBtn(this.game.world.centerX + this.buttonDistance, 0, 'list', 'Достижения', this.btnRating_click));
    this.buttonsGroup.y = this.logotype.y + 125;

    this.buttonsGroup.alpha = 0;
    this.game.add.tween(this.buttonsGroup).to({
      alpha: 1
    }, 250).delay(150).start();
  },

  createNewBtn: function(x, y, name, text, callback) {
    var btnBox = this.game.add.group();

    var btnX = x;
    var btnY = y;

    var btn = this.game.add.button(btnX, btnY, name, callback, this);
    btn.anchor.set(0.5, 0.5);
    btn.width = this.buttonSize;
    btn.height = this.buttonSize;

    var btnLable = this.game.add.text(btnX, btnY + this.btnLablepadding, text, this.buttonLableStyle);
    btnLable.anchor.set(0.5, 0.5);

    btn.onInputOver.add(this.btnOver, btnLable);
    btn.onInputOut.add(this.btnOut, btnLable);

    btnLable.alpha = 0;

    btnBox.addMultiple([btn, btnLable]);

    return btnBox;
  },

  btnPlay_click: function() {
    this.game.state.start('Game.v2', true, false, '3x3');
  },

  btnHelp_click: function() {

  },

  btnOver: function() {
    game.add.tween(this).to({
      alpha: 1
    }, 100).start();
  },

  btnOut: function() {
    game.add.tween(this).to({
      alpha: 0
    }, 100).start();
  },

  addScoreTable: function(data) {
    const topPadding = 20;
    var x = game.world.centerX / 2;
    var y = game.world.centerY;
    var userimage = 'template-photo';

    this.score.add(x, y, userimage, 'Тестовое Имя', 'https://vk.com/id161236502', Math.round(Math.random() * 999999), 12);
  }
}
var ScoreBuilder = function(game) {
  this.game = game;
}

ScoreBuilder.prototype = {
  preload: function() {
    this.game.load.image('score-row',  'img/menu/score-row.png');
    this.game.load.image('score-filter',  'img/menu/score-filter.png');
  },

  add: function(x, y, userimage, username, url, score, position) {
    return new ScoreRow(this.game, x, y, userimage, username, url, score, position);
  }
}
var ScoreRow = function(game, x, y, userimage, username, url, score, position) {
  this.game = game;
  this.url = url;
  this.score = score;
  this.username = username;
  this.userimage = userimage;
  this.x = x;
  this.y = y;
  this.position = position.toString();

  this.addBorder();
  this.addLabels();
}

ScoreRow.prototype = {
  click: function() {
    window.open(this.url, '_blank');
  },

  addBorder: function() {
    var borders = this.game.make.sprite(0, 0, 'score-row');
    var filter = this.game.make.sprite(0, 0, 'score-filter');
    this.avatar = this.game.make.sprite(0, 0, this.userimage);

    var bitmap = new Phaser.BitmapData(this.game, null, borders.width, borders.height);

    bitmap.draw(this.avatar);
    bitmap.draw(filter);
    bitmap.draw(borders);

    this.sprite = this.game.add.image(this.x, this.y, bitmap);
    this.sprite.inputEnabled = true;
    this.sprite.input.useHandCursor = true;
    this.sprite.events.onInputUp.add(this.click, this);
  },

  addLabels: function() {
    var usernameStyle = {
      font: "17px Jura",
      fill: "#fff",
      fontWeight: "bold",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    }

    var scoreStyle = {
      font: "17px Jura",
      fill: "#FFEB3B",
      fontWeight: "bold",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    }

    var positionStyle = {
      font: "30px Jura",
      fill: "#2196F3",
      fontWeight: "bold",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    }

    this.lableUsername = this.game.make.text(this.avatar.width + 5, 3, this.username, usernameStyle);

    this.lableScore = this.game.make.text(this.avatar.width + 5, 0, this.score, scoreStyle);
    this.lableScore.y = this.lableUsername.y + this.lableUsername.height;
    
    this.lablePosition = this.game.make.text(this.sprite.width - 15, 10, this.position, positionStyle)
    this.lablePosition.anchor.setTo(1, 0);

    this.sprite.addChild(this.lableUsername);
    this.sprite.addChild(this.lableScore);
    this.sprite.addChild(this.lablePosition);
  }
}

/*var Score = function() {
  const margin = 15;
  // const padding = 23;
  // const textMarginTop = 19;

  this.sprite = game.add.sprite(0, 0, 'score-background');
  
  this.userImage = game.make.sprite(0, 0, userimage);
  this.userImage.anchor.set(0.5, 0.5);
  this.userImage.x = -this.sprite.width / 2 + this.userImage.width / 2 + margin;

  

  var positionStyle = {
    
  }

  this.username = game.make.text(0, 0, 'Jonh Strive', usernameStyle);
  this.username.anchor.set(0, 1);
  this.username.x = this.userImage.x + this.userImage.width / 2 + margin - 5;
  this.username.y = 5;

  this.score = game.make.text(0, 0, Math.round(Math.random() * 12000), scoreStyle);
  this.score.x = this.userImage.x + this.userImage.width / 2 + margin - 5;
  this.score.anchor.set(0, 0);
  this.score.y = 0;

  this.sprite.addChild(this.userImage);
  this.sprite.addChild(this.username);
  this.sprite.addChild(this.score);

  return this.sprite;
}*/
var ScoreTable = function(count) {
  var score = new Score();
  score.anchor.set(0.5, 0.5);
  score.x = game.world.centerX;
  score.y = game.world.centerY;
}

var Achivment = function(game) {
  this.game = game;
}

Achivment.prototype = {
  preload: function() {
    this.game.load.image('ach+1', 'img/achivments/ach+1.png');
    this.game.load.image('achivments-background', 'img/achivments-background.png');
  },

  show: function(msg, name) {
    this.group = game.add.group();
    this.background = game.add.image(0, 0, 'achivments-background');
    this.icon = game.add.image(0, 0, 'ach' + name);

    var textLeftPadding = 10;

    var styleHeader = {
      font: "16px Jura",
      fill: "#fff",
      fontWeight: "bold",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    }

    var styleBody = {
      font: "14px Jura",
      fill: "#fff",
      boundsAlignH: "center",
      wordWrap: true,
      wordWrapWidth: this.background.width - this.icon.height - textLeftPadding * 2,
      boundsAlignV: "middle"
    }

    this.headerText = game.add.text(this.icon.height + textLeftPadding, 5, 'Новое достижение', styleHeader);
    this.bodyText = game.add.text(this.icon.height + textLeftPadding, this.headerText.y + 20, msg, styleBody);
    this.bodyText.lineSpacing = -5;

    this.group.addMultiple([this.background, this.icon, this.headerText, this.bodyText]);
    this.group.x = game.world.width;
    this.group.y = 150;
    this.group.alpha = 1;

    game.add.tween(this.group).to({alpha: 1, x: game.world.width - this.background.width}, 100).start();
    game.add.tween(this.group).to({alpha: 0, y: this.group.y + 150}, 400).delay(7000).start();
  }
}
var Border = function(game, lvl) {
  this.game = game;
  this.lvl =lvl;
}

Border.prototype = {
  /**
   * Функция которая проверяет, может ли объект двигаться дальше
   * @param  {[type]} square   [description]
   * @param  {[type]} position [description]
   * @return {[type]}          [description]
   */
  canMove: function(square, position) {
    var result = false;
    var x = (square.x - this.position.x) / this.squareSize;
    var y = (square.y - this.position.y) / this.squareSize;

    var targetX = (position.x - this.position.x) / this.squareSize;
    var targetY = (position.y - this.position.y) / this.squareSize;

    var direction;

    if (x - targetX > 0) {
      direction = 'left';
    } else if (x - targetX < 0) {
      direction = 'right';
    } else if (y - targetY > 0) {
      direction = 'top';
    } else {
      direction = 'bottom';
    }

    var terrain = this.getTerrainByPosition(x, y);

    return !terrain.borders[direction];
  },

  draw: function(graphics) {
    this.map.forEach(function(terrain) {
      terrain.draw(graphics);
    });
  },

  preload: function() {
    this.game.load.json('3x3', 'maps/3x3.json');
  },

  create: function() {
    this.squareSize = (Store.moveDistance + Store.squareMargin);
    this.map = [];

    this.loadMap(this.lvl);
  },

  loadMap: function(lvl) {
    var rowMap = this.game.cache.getJSON(lvl).terrains;

    this.map = rowMap.map(function(rowTerrain) {
      return new Terrain(rowTerrain.x, rowTerrain.y, rowTerrain.borders);
    });

    this.mapSize = calculateSizeMap(this.map, this.squareSize);
    this.position = new Phaser.Point(this.game.world.centerX - this.mapSize.width / 2, this.game.world.centerY - this.mapSize.height / 2);

    var graphics = game.add.graphics(this.position.x, this.position.y);

    this.draw(graphics);
  },

  /**
   * Получение позиции площади, по координатам системы
   * @param  {[type]} x [description]
   * @param  {[type]} y [description]
   * @return {[type]}   [description]
   */
  getTerrainByPosition: function(x, y) {
    var result;

    this.map.forEach(function(terrain) {
      var terrainRectangle = new Phaser.Rectangle(terrain.x, terrain.y, 1, 1);
      if (terrainRectangle.contains(x, y)) {
        result = terrain;
      }
    });

    return result;
  }
};

function calculateSizeMap(map, squareSize) {
  var minX = 0;
  var minY = 0;
  var maxX = 0;
  var maxY = 0;

  map.forEach(function(terrain) {
    var x = terrain.x;
    var y = terrain.y;

    maxX = Math.max(x, maxX);
    maxY = Math.max(y, maxY);
    minX = Math.min(x, minX);
    minY = Math.min(y, minY);
  });

  return {
    width: (maxX + Math.abs(minX)) * squareSize,
    height: (maxY + Math.abs(minY)) * squareSize
  }
}
var Coin = function(game, border, soundManager) {
  this.game = game;
  this.border = border;
  this.soundManager = soundManager;
}

Coin.prototype = {
  preload: function() {
    this.game.load.image('square', 'img/square.png');
    this.game.load.image('square-particle', 'img/square-particle.png');
  },

  create: function() {
    this.createSprite();
    this.createParticlesEmitter();

    this.addCoin();
  },

  pause: function() {
    this.tweenRotation.pause();
  },

  resume: function() {
    this.tweenRotation.resume();
  },

  createParticlesEmitter: function() {
    this.particlesEmitter = this.game.add.emitter(0, 0);
    this.particlesEmitter.makeParticles('square-particle');
    this.particlesEmitter.setXSpeed(-150, 150);
    this.particlesEmitter.setYSpeed(-150, 150);
    this.particlesEmitter.setScale(2, 0, 2, 0, 800);
  },

  createSprite: function() {
    this.sprite = this.game.add.sprite(-Store.coinSize, -Store.coinSize, 'square');
    this.sprite.tint = Store.coinColor;
    this.sprite.width = Store.coinSize;
    this.sprite.height = Store.coinSize;
    this.sprite.anchor.setTo(0.5, 0.5);

    this.startRotate(this.sprite);
  },

  take: function() {
    this.particlesEmitter.x = this.sprite.x;
    this.particlesEmitter.y = this.sprite.y;
    this.particlesEmitter.start(true, 800, null, 20);

    this.soundManager.coinSoundPlay();

    this.game.add.tween(this.sprite).to({
      width: 0,
      height: 0
    }, 100).start();

    this.sprite.x = -Store.coinSize;
    this.sprite.y = -Store.coinSize;
    
    this.game.time.events.add(Store.coinInterval, this.addCoin, this);
  },

  addCoin: function() {
    var terrain = game.rnd.pick(this.border.map);
    var x = this.border.position.x + terrain.x * terrain.size + terrain.size / 2;
    var y = this.border.position.y + terrain.y * terrain.size + terrain.size / 2;

    this.sprite.x = x;
    this.sprite.y = y;

    this.game.add.tween(this.sprite).to({
      width: Store.coinSize,
      height: Store.coinSize
    }, 100).start();
  },

  startRotate: function(sprite) {
    if (this.tweenRotation) {
      this.tweenRotation.stop();
    }

    this.tweenRotation = this.game.add.tween(sprite).to({
      angle: 360 * game.rnd.pick([-1, 1])
    }, 1000, 'Linear', true);
    this.tweenRotation.repeat(-1, 0);
  }
};
var Controll = function(game) {
  this.game = game;
}

Controll.prototype = {
  create: function(flows, context) {
    context = context || {};

    var keys = this.game.input.keyboard.addKeys({
      'up': Phaser.KeyCode.W,
      'down': Phaser.KeyCode.S,
      'left': Phaser.KeyCode.A,
      'right': Phaser.KeyCode.D
    });

    keys.up.onDown.add(flows.up, context);
    keys.down.onDown.add(flows.down, context);
    keys.left.onDown.add(flows.left, context);
    keys.right.onDown.add(flows.right, context);

    keys = this.game.input.keyboard.addKeys({
      'up': Phaser.KeyCode.UP,
      'down': Phaser.KeyCode.DOWN,
      'left': Phaser.KeyCode.LEFT,
      'right': Phaser.KeyCode.RIGHT
    });

    keys.up.onDown.add(flows.up, context);
    keys.down.onDown.add(flows.down, context);
    keys.left.onDown.add(flows.left, context);
    keys.right.onDown.add(flows.right, context);
  }
};
/**
 * Создаёт спаун врагов
 * @param {[type]} game             [description]
 * @param {[type]} x                [description]
 * @param {[type]} y                [description]
 * @param {[type]} speed            [description]
 * @param {[type]} angle            [description]
 * @param {[type]} intervalSpawn    Время, в мс., через которое спаунятся враги. Если установлен флаг randomSpawn = true, то это время в течении которого заспаунтся враг
 * @param {[type]} randomSpawn      Если правда, то враги спаунятся в случайный момент времени, если ложь, то враги спаунтся переодично
 * @param {[type]} minIntervalSpawn Минимальное время через, которое заспаунится враг, работает только при установке флага randomSpawn = true
 */
var EnemySpawn = function(game, spawn, border) {
  this.game = game;

  this.border = border;
  this.intervalSpawn = spawn.intervalSpawn || 0;
  this.randomSpawn = spawn.randomSpawn || false;
  this.minIntervalSpawn = spawn.minIntervalSpawn || 0;
  this.speed = spawn.speed || 0;

  this.sprite = game.add.sprite(0, 0, 'enemySpawn');

  this.game.physics.arcade.enable([this.sprite]);
  this.sprite.body.velocity.x = spawn.spawnVelocity.x;
  this.sprite.body.velocity.y = spawn.spawnVelocity.y;
  this.sprite.angle = spawn.angle || 0;
  this.sprite.anchor.set(0.5, 0.5);

  this.sprite.x = (spawn.x || 0) * Store.terrainSize + Store.terrainSize / 2 + this.border.position.x;
  this.sprite.y = (spawn.y || 0) * Store.terrainSize + Store.terrainSize / 2 + this.border.position.y;

  // this.game.add.tween(this.sprite).to({
  //   angle: 360
  // }, 3000).start().repeat(-1, 0);

  this.start();
}

EnemySpawn.preload = function(game, lvl) {
  this.game = game;
  this.lvl = lvl;
  this.spawns = [];
  
  this.game.load.image('enemySpawn', 'img/enemy-spawn.png');
  this.game.load.json(this.lvl, 'maps/' + this.lvl + '.json');
}

EnemySpawn.create = function(border) {
  var rowSpawns = this.game.cache.getJSON(this.lvl).enemySpawns;
  this.border = border;

  this.spawns = rowSpawns.map(function(spawn) {
    return new EnemySpawn(
      this.game,
      spawn,
      this.border
    );
  }, this);
}

EnemySpawn.allPause = function() {
  this.spawns.forEach(function(spawn) {
    spawn.pause();
  });
}

EnemySpawn.allResume = function() {
  this.spawns.forEach(function(spawn) {
    spawn.resume();
  });
}

EnemySpawn.prototype = {
  pause: function() {
    this.timer.pause();
  },

  resume: function() {
    this.timer.resume();
  },

  spawn: function() {
    var velocity = new Phaser.Point(0, 0);
    velocity.rotate(0, 0, this.sprite.angle, true, this.speed);

    var enemy = new Enemy(this.game, this.sprite.x, this.sprite.y, velocity);
    enemy.sprite.alpha = 0;
    enemy.sprite.scale.setTo(0.01, 0.01);
    // enemy.sprite.body.angle = enemy.sprite.angle = this.sprite.angle;

    this.game.add.tween(enemy.sprite).to({
      alpha: 1,
    }, 100).start();

    this.game.add.tween(enemy.sprite.scale).to({
      x: 1,
      y: 1
    }, 100).start();

    return enemy;
  },

  startRandomSpawn: function() {
    var nextTick = this.minIntervalSpawn + this.game.rnd.between(0, this.intervalSpawn);
    this.timer.add(nextTick, function() {
      this.spawn();
      this.startRandomSpawn();
    }, this);
    this.timer.start();
  },

  start: function() {
    this.timer = this.game.time.create(false) || this.timer;

    if (this.randomSpawn) {
      this.startRandomSpawn();
    } else {
      this.timer.loop(this.intervalSpawn, this.spawn, this);
      this.timer.start();
    }
  },

  stop: function() {
    this.timer.stop(true);
  },

  changeSpawTime: function(time) {
    this.intervalSpawn = time;
    this.stop();
    this.start();
  }
}
var Enemy = function(game, x, y, velocity) {
  this.game = game;

  this.sprite = this.game.add.sprite(x, y, 'enemy');
  this.game.physics.arcade.enable([this.sprite]);
  this.sprite.body.velocity = velocity;
  this.sprite.outOfBoundsKill = true;
  this.sprite.checkWorldBounds = true;

  this.sprite.anchor.setTo(0.5, 0.5);

  Enemy.all.push(this);

  this.sprite.events.onOutOfBounds.add(this.destroy, this);
}

Enemy.prototype = {
  destroy: function() {
    var position = Enemy.all.indexOf(this);
    Enemy.all.splice(position, 1);
  },

  die: function() {
    this.sprite.destroy();
    this.destroy();

    Enemy.emitter.x = this.sprite.x;
    Enemy.emitter.y = this.sprite.y;
    Enemy.emitter.start(true, 800, null, 20);
  }
};

Enemy.preload = function(game) {
  this.game = game;

  Enemy.all = [];

  game.load.image('enemy', 'img/enemy.png');
  game.load.image('enemy-particle', 'img/enemy-particle.png');
}

Enemy.create = function() {
  this.emitter = this.game.add.emitter(0, 0);

  this.emitter.makeParticles('enemy-particle');
  this.emitter.setXSpeed(-150, 150);
  this.emitter.setYSpeed(-150, 150);
  this.emitter.setScale(2, 0, 2, 0, 800);
}
var GameStateNew = {
  init: function(lvl) {
    this.game.stage.backgroundColor = Store.backgroundColor;    

    this.lvl = lvl;
    this.isPause = false;

    this.soundManager = new SoundManager(this.game);
    this.scoreManager = new ScoreManager(this.game);
    this.screenshoot = new Screenshoot(this.game);
    this.pauseMenu = new PauseMenu(this.game);
    this.border = new Border(this.game, this.lvl);
    this.square = new Square(this.game, this.border, this.soundManager);
    this.coin = new Coin(this.game, this.border, this.soundManager);
    this.ui = new UI(this.game, this.soundManager, this.scoreManager);
    ach = this.achivment = new Achivment(this.game);
    this.controll = new Controll(this.game);

    this.pauseMenu.onHide.add(this.resume, this);
    this.pauseMenu.onShowMainMenu.add(this.onShowMainMenu, this);
    this.pauseMenu.onRestart.add(this.restartGame, this);
  },

  preload: function() {
    Settings.load();
    
    this.soundManager.preload();
    this.pauseMenu.preload();
    this.ui.preload();
    this.border.preload();
    this.square.preload();
    this.coin.preload();
    this.achivment.preload();

    Enemy.preload(this.game);
    EnemySpawn.preload(this.game, this.lvl);
  },

  create: function() {
    this.soundManager.create();
    this.ui.create();
    this.pauseMenu.create();
    this.border.create();
    this.square.create();
    this.coin.create();

    Enemy.create();
    EnemySpawn.create(this.border);

    this.controll.create({
      up: function() { this.square.move(Square.directionType.UP) },
      down: function() { this.square.move(Square.directionType.DOWN) },
      left: function() { this.square.move(Square.directionType.LEFT) },
      right: function() { this.square.move(Square.directionType.RIGHT) }
    }, this);

    this.addEventsListener();
    this.addOneSecondTimer();
  },

  update: function() {
    if (this.isPause) {
      return;
    }

    if (this.overlap(this.square.sprite, this.coin.sprite)) {
      this.coin.take();

      this.ui.setScore(this.scoreManager.takeCoin());
      this.ui.updateRatio(this.scoreManager.ratio);
    }

    for (var i = 0; i < Enemy.all.length; i++) {
      enemy = Enemy.all[i];
      if (this.overlap(enemy.sprite, this.square.sprite)) {
        this.soundManager.dieSoundPlay();
        enemy.die();

        this.ui.setScore(this.scoreManager.loseScore());
        this.ui.updateRatio(this.scoreManager.ratio);
      }
    }
  },

  addEventsListener: function() {
    this.ui.onPauseButtonClick.add(this.pause, this);
  },

  overlap: function(obj1, obj2) {
    return Phaser.Rectangle.intersects(obj1.getBounds(), obj2.getBounds());
  },

  render: function() {
    this.screenshoot.render();
  },

  pause: function() {
    this.game.physics.arcade.isPaused = this.isPause = true;

    this.timer.pause();
    EnemySpawn.allPause();
    this.ui.pause();

    this.square.pause();
    this.coin.pause();

    this.pauseMenu.show(this.scoreManager.score);
  },

  resume: function() {
    this.game.physics.arcade.isPaused = this.isPause = false;

    this.timer.resume();
    EnemySpawn.allResume();
    this.ui.resume();

    this.square.resume();
    this.coin.resume();

    this.pauseMenu.hide();
  },

  addOneSecondTimer: function() {
    this.timer = this.game.time.create(false);
    this.timer.loop(1000, this.addScoreByTime, this);
    this.timer.start();
  },

  addScoreByTime: function() {
    this.ui.setScore(this.scoreManager.timerTick());
  },

  onShowMainMenu: function() {
    this.resume();
    this.game.state.start('Menu');
  },

  restartGame: function() {
    this.resume();
    this.game.state.restart(true, false, this.lvl);    
  }
}
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

  var sizeX = 0;
  var sizeY = 0;

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
    
    this.game.load.image('achivments-background', 'img/achivments-background.png');
    this.game.load.image('+1', 'img/+1.png');
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
    coinSound.volume = 0.12;

    jumpSound = this.game.add.audio('jump');
    jumpSound.volume = 0.25;

    dieSound = this.game.add.audio('die');
    dieSound.volume = 0.3;

    if (!settings.muted)
      music.play();

    this.game.add.tween(music).to({
      volume: 0.5
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

  achivments1 = false;
  achivments2 = false;
  achivments3 = false;
  achivments4 = false;
  achivments5 = false;
  achivments6 = false;
  achivments7 = false;
  achivments8 = false;
  achivments9 = false;
  function updateScore() {
    score++;
    scoreLable.text = "x" + score;
    if (score > 1 && score < 5 && !achivments1) {
      achivments1 = true;
      Achivment.show('Ехуу, первые шаги!', '+1');
    } else if (score > 5 && score < 10 && !achivments2) {
      achivments2 = true;
      Achivment.show('Реакция младенца', '+1');
    } else if (score > 10 && score < 20 && !achivments3) {
      achivments3 = true;
      Achivment.show('Реакция велосепедиста', '+1');
    } else if (score > 20 && score < 30 && !achivments4) {
      achivments4 = true;
      Achivment.show('Реакция автомобилиста', '+1');
    } else if (score > 30 && score < 40 && !achivments5) {
      achivments5 = true;
      Achivment.show('Реакция пилота', '+1');
    } else if (score > 40 && score < 45 && !achivments6) {
      achivments6 = true;
      Achivment.show('Реакция космонавта', '+1');
    } else if (score > 45 && score < 50 && !achivments7) {
      achivments7 = true;
      Achivment.show('Реакция каратиста с чёрным поясом', '+1');
    } else if (score > 50 && score < 75 && !achivments8) {
      achivments8 = true;
      Achivment.show('Задрот', '+1');
    } else if (score > 75 && !achivments9) {
      achivments9 = true;
      Achivment.show('Читер', '+1');
    }
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

    var start = 1500,
      end = 600,
      tScore = 60;
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
var PauseMenu = function(game) {
  this.game = game;
  this.btns = [];
  this.onHide = new Phaser.Signal();
  this.onShowMainMenu = new Phaser.Signal();
  this.onRestart = new Phaser.Signal();
}

PauseMenu.prototype = {
  preload: function() {
    game.load.image('play', 'img/ic-play.png');
    game.load.image('replay', 'img/ic-autorenew.png');
    game.load.image('menu', 'img/ic-reply.png');
  },

  create: function() {
    this.addBackground();
    this.addBtns();
    this.addScoreLable();
  },

  addBtns: function() {
    var btnMargin = 100;
    var menu = this.addBtn(
      this.game.world.centerX - Store.pauseMenuBtnsSize - btnMargin,
      this.game.world.centerY,
      'menu',
      'В главное меню',
      this.menuBtn_click
    );

    var play = this.addBtn(
      this.game.world.centerX,
      this.game.world.centerY,
      'play',
      'Продолжить',
      this.playBtn_click
    );

    var replay = this.addBtn(
      this.game.world.centerX + Store.pauseMenuBtnsSize + btnMargin,
      this.game.world.centerY,
      'replay',
      'Начать сначала',
      this.replayBtn_click
    );

    this.background.addChild(menu);
    this.background.addChild(play);
    this.background.addChild(replay);
  },

  show: function(score) {
    this.scoreLable.text = "Счёт " + Math.round(score);
    this.background.visible = true;
    this.background.bringToTop();
  },

  hide: function() {
    this.background.visible = false;
  },

  menuBtn_click: function() {
    this.onShowMainMenu.dispatch();
  },

  playBtn_click: function() {
    this.onHide.dispatch();
  },

  replayBtn_click: function() {
    this.onRestart.dispatch();
  },

  addBackground: function() {
    var rowBackground = this.game.add.bitmapData(this.game.width, this.game.height);
    rowBackground.fill(0, 0, 0, 0.95);

    this.background = this.game.add.sprite(0, 0, rowBackground);
    this.background.visible = false;
  },

  addBtn: function(x, y, name, text, callback) {
    var button = this.game.add.button(x, y, name, callback, this);
    const animationLableTime = 100;
    const btnTextStyle = {
      font: "31px Jura",
      fill: "#FFFFFF"
    };

    button.width = Store.pauseMenuBtnsSize;
    button.height = Store.pauseMenuBtnsSize;
    button.anchor.setTo(0.5, 0.5);

    button.lable = this.game.add.text(0, Store.pauseMenuBtnsSize, text, btnTextStyle);
    button.lable.anchor.setTo(0.5);
    button.lable.alpha = 0;
    button.addChild(button.lable);

    button.onInputOver.add(function(btn) {
      this.game.add.tween(btn.lable).to({
        alpha: 1
      }, animationLableTime).start();
    }, this);

    button.onInputOut.add(function(btn) {
      this.game.add.tween(btn.lable).to({
        alpha: 0
      }, animationLableTime).start();
    }, this);

    this.btns.push(button);

    return button;
  },

  addScoreLable: function() {
    const scoreLableStyle = {
      font: "46px Jura",
      fill: "#FFFFFF"
    }

    this.scoreLable = this.game.add.text(this.game.world.centerX, this.game.world.centerY / 2, 'Счёт: 0', scoreLableStyle);
    this.scoreLable.anchor.set(0.5);
    this.background.addChild(this.scoreLable);
  }
}
var ScoreManager = function(game) {
  this.game = game;
  this.score = 0;
  this.ratio = 1.0;

  this.timeTickScoreAdd = 2;
  this.coinScoreAdd = 15;
  this.coinRatioAdd = 0.05;

  this.coinsTaked = 0;
}

ScoreManager.prototype = {
  takeCoin: function() {
    this.score += this.coinScoreAdd * this.ratio;
    this.ratio += this.coinRatioAdd;

    this.coinsTaked++;

    return this.score;
  },

  loseScore: function() {
    this.score /= 2;
    this.ratio = 1;
    
    return this.score;
  },

  timerTick: function() {
    this.score += this.timeTickScoreAdd * this.ratio;

    return this.score;
  }
}
var Screenshoot = function(game) {
    this.game = game;
}

Screenshoot.prototype = {
  takeScreen: function(callback) {
    this.callback = callback;
    this.makeScreenShoot = true;
  },

  render: function() {
    if (this.makeScreenShoot) {
      this.makeScreenShoot = false;
      var data = this.game.canvas.toDataURL();
      this.callback(data);
    }
  }
}
var Settings = {
  isMuted: false,
  storeName: '250-settings',

  load: function() {
    var settings = JSON.parse(localStorage.getItem(this.storeName)) || {};

    this.isMuted = settings.isMuted || this.isMuted;
  },

  save: function() {
    localStorage.setItem(this.storeName, JSON.stringify(this));
  },

  set: function(key, value) {
    this[key] = value;
    this.save();
  }
}
var SoundManager = function(game) {
  this.game = game;

  this.musicFadeInTime = 7500;

  this.coinSound = null;
  this.jumpSound = null;
  this.dieSound = null;
  this.music = null;
}

SoundManager.prototype = {
  preload: function() {
    this.game.load.audio('music', ['sounds/music.mp3', 'sounds/music.ogg']);
    this.game.load.audio('coin', ['sounds/coin.wav', 'sounds/coin.mp3']);
    this.game.load.audio('jump', ['sounds/jump.wav', 'sounds/jump.mp3']);
    this.game.load.audio('die', ['sounds/die.wav', 'sounds/die.mp3']);
  },

  create: function() {
    this.music = this.game.add.audio('music');
    this.music.loop = true;
    this.music.volume = 0.0;

    this.coinSound = this.game.add.audio('coin');
    this.coinSound.volume = 0.12;

    this.jumpSound = this.game.add.audio('jump');
    this.jumpSound.volume = 0.25;

    this.dieSound = this.game.add.audio('die');
    this.dieSound.volume = 0.3;

    if (!Settings.isMuted)
      this.music.play();

    this.game.add.tween(this.music).to({
      volume: 0.5
    }, this.musicFadeInTime).start();
  },

  moveSoundPlay: function() {
    if (!Settings.isMuted) {
      this.jumpSound.play();
    }
  },

  dieSoundPlay: function() {
    if (!Settings.isMuted) {
      this.dieSound.play();
    }
  },

  coinSoundPlay: function() {
    if (!Settings.isMuted) {
      this.coinSound.play();
    }
  },

  volumeStateChange: function() {
    if (Settings.isMuted) {
      Settings.set('isMuted', false);

      if (this.music.paused)
        this.music.resume();
      else
        this.music.play();
    } else {
      Settings.set('isMuted', true);

      this.music.pause();
    }
  }
}
var Square = function(game, border, soundManager) {
  this.game = game;
  this.playerColor = Store.playerColor;
  this.squareMoveTime = Store.squareMoveTime;
  this.squareSize = Store.squareSize;
  this.sprite = {};
  this.isMoving = false;
  this.border = border;
  this.soundManager = soundManager;
}

Square.directionType = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
}

Square.prototype = {
  preload: function() {
    this.game.load.image('square', 'img/square.png');
  },

  create: function() {
    this.sprite = this.game.add.sprite(0, 0, 'square');
    this.sprite.tint = this.playerColor;
    this.sprite.width = this.squareSize;
    this.sprite.height = this.squareSize;
    this.sprite.x = this.game.world.centerX;
    this.sprite.y = this.game.world.centerY;
    this.sprite.anchor.setTo(0.5, 0.5);

    this.game.physics.arcade.enable([this.sprite]);
  },

  pause: function() {
    this.isPause = true;
  },

  resume: function() {
    this.isPause = false;
  },

  move: function(direction) {
    if (this.isMoving || this.isPause)
      return;

    this.soundManager.moveSoundPlay();

    var XYDirection = this.calcDirection(direction, this.sprite);

    var calcX = XYDirection.calcX;
    var calcY = XYDirection.calcY;
    var isCanMove;
    var tween;
    var backPositionX = XYDirection.backPositionX;
    var backPositionY = XYDirection.backPositionY;

    isCanMove = this.border.canMove(this.sprite, new Phaser.Point(calcX, calcY));

    if (isCanMove) {
      tween = this.game.add.tween(this.sprite).to({
        x: calcX,
        y: calcY
      }, this.squareMoveTime).start();
    } else {
      calcX += backPositionX;
      calcY += backPositionY;

      tween = this.game.add.tween(this.sprite).to({
          x: calcX,
          y: calcY
        }, this.squareMoveTime / 2)
        .to({
          x: this.sprite.x,
          y: this.sprite.y
        }, this.squareMoveTime / 2).start();
    }

    this.isMoving = true;
    tween.onComplete.add(function() {
      this.isMoving = false;
    }, this);
  },

  calcDirection: function(direction, sprite) {
    var calcX = sprite.x;
    var calcY = sprite.y;
    var backPositionX = 0;
    var backPositionY = 0;

    switch (direction) {
      case Square.directionType.UP:
        calcY = sprite.y - Store.terrainSize;
        backPositionY = +Store.moveDistance;

        break;

      case Square.directionType.DOWN:
        calcY = sprite.y + Store.terrainSize;
        backPositionY = -Store.moveDistance;

        break;

      case Square.directionType.LEFT:
        calcX = sprite.x - Store.terrainSize;
        backPositionX = +Store.moveDistance;

        break;

      case Square.directionType.RIGHT:
        calcX = sprite.x + Store.terrainSize;
        backPositionX = -Store.moveDistance;

        break;
    }

    return {
      calcX: calcX,
      calcY: calcY,
      backPositionX: backPositionX,
      backPositionY: backPositionY
    }
  }
};
var Store = { };

Store.squareMargin = 20;
Store.playerColor = 0xEEFF41;
Store.squareMoveTime = 75;
Store.squareSize = 50;
Store.moveDistance = Store.squareSize + Store.squareMargin;

Store.borderColor = 0x1A237E;
Store.borderLineWidth = 5;

Store.coinColor = 0x2196F3;
Store.coinInterval = 500;
Store.coinSize = 24;
Store.coinInterval = 500;

Store.backgroundColor = 0x283593;

Store.terrainSize = (Store.moveDistance + Store.squareMargin);

Store.pauseMenuBtnsSize = 150;
var Terrain = function(x, y, borders) {
  this.x = x;
  this.y = y;

  this.borders = borders || {
    top: false,
    bottom: false,
    left: false,
    right: false
  };

  this.borders.top = this.borders.top || false;
  this.borders.bottom = this.borders.bottom || false;
  this.borders.left = this.borders.left || false;
  this.borders.right = this.borders.right || false;

  this.color = Store.borderColor;
  this.lineWidth = Store.borderLineWidth;

  this.size = Store.terrainSize;
  this.width = this.size;
  this.height = this.size;
}

Terrain.prototype = {
  draw: function(graphics) {
    graphics.lineStyle(this.lineWidth, this.color);

    if (this.borders.top) {
      this.drawTopBorder(graphics);
    }
    if (this.borders.bottom) {
      this.drawBottomBorder(graphics);
    }
    if (this.borders.left) {
      this.drawLeftBorder(graphics);
    }
    if (this.borders.right) {
      this.drawRightBorder(graphics);
    }
  },

  drawTopBorder: function(graphics) {
    graphics.moveTo(this.x * this.size, this.y * this.size);
    graphics.lineTo(this.x * this.size + this.size, this.y * this.size);
  },

  drawBottomBorder: function(graphics) {
    graphics.moveTo(this.x * this.size, this.y * this.size + this.size);
    graphics.lineTo(this.x * this.size + this.size, this.y * this.size + this.size);
  },

  drawLeftBorder: function(graphics) {
    graphics.moveTo(this.x * this.size, this.y * this.size);
    graphics.lineTo(this.x * this.size, this.y * this.size + this.size);
  },

  drawRightBorder: function(graphics) {
    graphics.moveTo(this.x * this.size + this.size, this.y * this.size);
    graphics.lineTo(this.x * this.size + this.size, this.y * this.size + this.size);
  }
};

var UI = function(game, soundManager) {
  this.game = game;
  this.soundManager = soundManager;
  this.score = 0;
}

UI.prototype = {
  preload: function() {
    this.game.load.spritesheet('volume', 'img/volume-spritesheet.png', 96, 96);
    this.game.load.image('pause', 'img/ic-pause.png');
  },

  create: function() {
    this.addPauseButton();
    this.addVolumeButton();

    this.addScoreLable();
    this.addScoreRatioLable();

    this.addEvents();
  },

  pause: function() {
    this.pauseButton.inputEnabled = false;
    this.soundButton.inputEnabled = false;
  },

  resume: function() {
    this.pauseButton.inputEnabled = true;
    this.soundButton.inputEnabled = true;
  },

  addEvents: function() {
    this.onPauseButtonClick = new Phaser.Signal();
  },

  addScoreLable: function() {
    var style = {
      font: "30px Jura",
      fill: "#fff"
    }

    this.scoreLable = game.add.text(this.game.world.width - 4, 0, 'Очки 0', style);
    this.scoreLable.anchor.set(1, 0);
  },

  setScore: function(newScore) {
    var scoreObj = {
      score: this.score
    }

    this.score = newScore;

    var newAnimation = this.game.add.tween(scoreObj).to({
      score: newScore
    }, 100).onUpdateCallback(function() {
      this.scoreLable.text = "Очки " + Math.round(scoreObj.score);
    }, this);

    newAnimation.onComplete.add(function() {
      this.scoreLable.text = "Очки " + Math.round(scoreObj.score);
    }, this);

    if (this.animationScore && this.animationScore.isRunning) {
      this.animationScore.chain(newAnimation);
    } else {
      this.animationScore = newAnimation;
      this.animationScore.start();
    }
  },

  addScoreRatioLable: function() {
    var style = {
      font: "56px Jura",
      fill: "#FFFFFF"
    }

    this.scoreRatioLable = game.add.text(this.game.world.centerX, this.game.world.centerY, 'x1', style);
    this.scoreRatioLable.anchor.set(0.44, 0.5);
    this.scoreRatioLable.alpha = 0.2;
  },

  updateRatio: function(ratio) {
    this.scoreRatioLable.text = 'x' + Math.round(ratio * 100) / 100;
  },

  addVolumeButton: function() {
    var frames = 1;

    if (Settings.isMuted) {
      frames = 0;
    }

    this.soundButton = this.game.add.button(5 + this.pauseButton.width, 5, 'volume', this.volumeButton_click, this, frames, frames, frames);
    this.soundButton.width = 48;
    this.soundButton.height = 48;    
  },

  addPauseButton: function() {
    this.pauseButton = this.game.add.button(5, 5, 'pause', this.pauseButton_click, this);
    this.pauseButton.width = 48;
    this.pauseButton.height = 48;
  },

  volumeButton_click: function() {
    if (this.isPause)
      return

    this.soundManager.volumeStateChange();
    if (this.soundButton.frame === 0) {
      this.soundButton.setFrames(1, 1, 1);
    } else if (this.soundButton.frame === 1) {
      this.soundButton.setFrames(0, 0, 0);
    }
  },

  pauseButton_click: function() {
    this.onPauseButtonClick.dispatch();
  }
}
var game = new Phaser.Game(1000, 900, Phaser.AUTO, 'game');

game.state.add('Game', GameState);
game.state.add('Game.v2', GameStateNew);
game.state.add('Menu', Menu);

function RunGame() {
  // game.state.start('Game.v2', true, false, '3x3');
  game.state.start('Menu', Menu);  
}

RunGame();

function isVkEnv() {
  return location.ancestorOrigins.length !== 0 && location.ancestorOrigins[0] === "https://vk.com";
}