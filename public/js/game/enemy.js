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