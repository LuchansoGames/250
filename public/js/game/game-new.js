var GameStateNew = {
  preload: function() {
    this.game.stage.backgroundColor = Store.backgroundColor;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;

    this.border = new Border(this.game);
    this.square = new Square(this.game, this.border);
    this.controll = new Controll(this.game);

    Settings.load();
    this.border.preload();
    this.square.preload();
  },

  create: function() {
    this.border.create();
    this.square.create();

    this.controll.create({
      up: function() { this.square.move(Square.directionType.UP) },
      down: function() { this.square.move(Square.directionType.DOWN) },
      left: function() { this.square.move(Square.directionType.LEFT) },
      right: function() { this.square.move(Square.directionType.RIGHT) }
    }, this);
  },

  update: function() {}
}