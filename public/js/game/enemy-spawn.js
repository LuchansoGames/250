var EnemySpawn = function(game, x, y, speed, angle, intervalCreate, randomSpawn) {
  this.game = game;
  this.x = x || 0;
  this.y = y || 0;

  this.speed = speed || 0;
  this.angle = angle || 0;

  this.lastSpawnTime = 0;
  this.intervalCreate = intervalCreate || 0;
  this.randomSpawn = randomSpawn || false;

  this.isStarted = false;

  this.addSprite();
}

EnemySpawn.preload = function(game) {
  game.load.image('enemySpawn', 'img/enemy-spawn.png');
}

EnemySpawn.prototype = {
  spawn: function() {
    this.lastSpawnTime = Date.now();

    var enemy = new Enemy(this.x, this.y);

    return enemy;
  },

  start: function() {
    this.isStarted = true;
  },

  stop: function() {
    this.isStarted = false;
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
    // this.sprite.enableBody = true;
    this.sprite.body.velocity.y = 50;
    this.sprite.body.velocity.x = 50;
    this.sprite.anchor.set(0.5, 0.5);

    this.game.add.tween(this.sprite).to({
      angle: 360
    }, 800).start().repeat(-1, 0);

  }
}