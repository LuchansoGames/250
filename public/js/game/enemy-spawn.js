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

EnemySpawn.preload = function(game) {
  game.load.image('enemySpawn', 'img/enemy-spawn.png');
}

EnemySpawn.prototype = {
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
  },

  start: function() {
    this.timer = this.game.time.create(false) || this.timer;

    if (this.randomSpawn) {
      startRandomSpawn();
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
  },

  /**
   * Возращает время прошедшее с последнего спауна
   * @return {[type]} [description]
   */
  getDiffSpawTime: function() {
    return Date.now() - this.lastSpawnTime;
  }
}