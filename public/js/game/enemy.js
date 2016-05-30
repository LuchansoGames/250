var Enemy = function(game, x, y, velocity) {
  this.game = game;

  this.sprite = this.game.add.sprite(x, y, 'enemy');
  this.game.physics.arcade.enable([this.sprite]);
  this.sprite.body.velocity = velocity;
  this.sprite.outOfBoundsKill = true;
  this.sprite.checkWorldBounds = true;

  this.sprite.anchor.setTo(0.5, 0.5);

  Enemy.allSprites.push(this.sprite);

  this.sprite.events.onOutOfBounds.add(this.destroy, this);
}

Enemy.prototype = {
  destroy: function() {
    var position = Enemy.allSprites.indexOf(this.sprite);
    Enemy.allSprites.splice(position, 1);
  }
};

Enemy.allSprites = [];

Enemy.preload = function(game) {
  game.load.image('enemy', 'img/enemy.png');
}