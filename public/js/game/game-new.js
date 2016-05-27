var GameStateNew = function(game) {
  this.game = game;
  this.border = new Border(game);
  this.square = new Square(game, this.border);
  this.controll = new Controll(game);
}

GameStateNew.prototype = {
  preload: function() {
    Settings.load();
    this.square.preload();
  },

  create: function() {
    this.square.create();
    this.controll.create({
      up: this.square.moveUp,
      down: this.square.moveDown,
      left: this.square.moveLeft,
      right: this.square.moveRight
    }, this.square);
  },

  update: function() {}
}