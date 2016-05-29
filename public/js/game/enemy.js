var Enemy = function(game, x, y, velocity, speed) {
  this.game = game;
  this.x = x;
  this.y = y;
  this.speed = speed;

  this.sprite = this.game.create.sprite(x, y, 'enemy');
  this.game.physics.arcade.enable([this.sprite]);
  this.sprite.body.velocity = velocity;
  this.sprite.outOfBoundsKill = true;
}

Enemy.prototype = {
  
};

Enemy.preload = function(game) {
  game.load.image('enemy', 'img/enemy.png');
}