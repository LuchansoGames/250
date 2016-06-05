var PauseMenu = {
  init: function(game) {
    this.game = game;
  },

  show: function() {
    if (!this.background) {
      var rowBackground = this.game.add.bitmapData(this.game.width, this.game.height);
      rowBackground.fill(0, 0, 0, 0.6);

      this.background = this.game.add.sprite(0, 0, rowBackground);
    } else {
      this.background.visible = true;
      this.background.bringToTop();
    }
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
    this.background.visible = false;
  }
}