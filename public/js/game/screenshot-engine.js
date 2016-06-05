Screenshoot = {
  init: function(game) {
    this.game = game;
  },

  takeScreen: function(callback) {
    this.callback = callback;
    this.makeScreenShoot = true;
  },

  render: function() {
    if (this.makeScreenShoot) {
      this.makeScreenShoot = false;
      var data = this.game.canvas.toDataURL();
      this.callback(data);
    }
  }
}