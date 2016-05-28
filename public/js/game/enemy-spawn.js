var EnemySpawn = function(game, x, y, speed, angle) {
  this.EnemySpawn = game;
  this.x = x || 0;
  this.y = y || 0;

  this.speed = speed || 0;
  this.angle = angle || 0;

  this.lastSpawnTime = 0;

  this.sprite = game.add.sprite('enemy');
}

EnemySpawn.preload = function(game) {
  // game.load.image('enemy', 'img/enemy.png');
}

EnemySpawn.prototype = {
  spawn: function() {
    this.lastSpawnTime = Date.now();

    var enemy = new Enemy(this.x, this.y);

    return enemy;
  },

  /**
   * Возращает время прошедшее с последнего спауна
   * @return {[type]} [description]
   */
  getDiffSpawTime: function() {
    return Date.now() - this.lastSpawnTime;
  }
}