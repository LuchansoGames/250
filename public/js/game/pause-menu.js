var PauseMenu = {
  init: function(game) {
    this.game = game;
  },

  show: function(screen) {
    this.backgroundSet(screen);

    this.graphics = this.game.add.graphics(0, 0);
    this.graphics.beginFill(0, 0.6);
    this.graphics.drawRect(0, 0, this.game.world.width, this.game.world.height);
  },

  backgroundSet: function(screen) {
    var image = new Image();
    image.src = screen;
    this.screen = {
      image: image,
      data: screen
    }
    this.game.cache.addImage('screen', this.screen.data, this.screen.image);
    this.background = this.game.add.sprite(0, 0, 'screen');
  },

  hide: function() {
    this.background.kill();
    this.graphics.clear();
  }
}