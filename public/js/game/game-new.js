var GameStateNew = {
  preload: function() {
    this.game.stage.backgroundColor = Store.backgroundColor;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;

    this.border = new Border(this.game);
    this.square = new Square(this.game, this.border);
    this.coin = new Coin(this.game, this.border);
    this.controll = new Controll(this.game);

    Settings.load();
    SoundManager.preload(this.game);
    this.border.preload();
    this.square.preload();
    this.coin.preload();
    EnemySpawn.preload(this.game);
    EnemySpawnManager.preload(this.game);

    this.testPreload();
  },

  create: function() {
    SoundManager.create();
    this.border.create();
    this.square.create();
    this.coin.create();


    this.controll.create({
      up: function() { this.square.move(Square.directionType.UP) },
      down: function() { this.square.move(Square.directionType.DOWN) },
      left: function() { this.square.move(Square.directionType.LEFT) },
      right: function() { this.square.move(Square.directionType.RIGHT) }
    }, this);
    
    this.testCreate();
  },

  update: function() {
    if (this.overlap(this.square.sprite, this.coin.sprite)) {
      this.coin.take();
    }
  },

  overlap: function(obj1, obj2) {
    return Phaser.Rectangle.intersects(obj1.getBounds(), obj2.getBounds());
  },
  
  testPreload: function() {
    EnemySpawnManager.preload(this.game);
  },

  testCreate: function() {
    EnemySpawnManager.create('3x3');
  }
}