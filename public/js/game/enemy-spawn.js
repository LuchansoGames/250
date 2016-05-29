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
var EnemySpawn = function(game, x, y, speed, angle, intervalSpawn, randomSpawn, minIntervalSpawn) {
  this.game = game;
  this.x = x || 0;
  this.y = y || 0;

  this.speed = speed || 0;
  this.angle = angle || 0;

  this.intervalSpawn = intervalSpawn || 0;
  this.randomSpawn = randomSpawn || false;
  this.minIntervalSpawn = minIntervalSpawn || 0;

  this.addSprite();
  this.start();
}

EnemySpawn.preload = function(game) {
  game.load.image('enemySpawn', 'img/enemy-spawn.png');
}

EnemySpawn.prototype = {
  spawn: function() {
    // var enemy = new Enemy(this.x, this.y);

    // return enemy;
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
  },

  addSprite: function() {
    this.sprite = game.add.sprite(0, 0, 'enemySpawn');

    this.game.physics.arcade.enable([this.sprite]);
    this.sprite.body.velocity.y = 50;
    this.sprite.body.velocity.x = 50;
    this.sprite.anchor.set(0.5, 0.5);

    this.game.add.tween(this.sprite).to({
      angle: 360
    }, 800).start().repeat(-1, 0);
  }
}