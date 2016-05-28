var Coin = function(game, border) {
  this.game = game;
  this.border = border;
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

    SoundManager.coinSoundPlay();

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