var GameStateNew = {
  init: function(lvl) {
    this.lvl = lvl;
  },

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
    UI.preload(this.game);
    this.border.preload();
    this.square.preload();
    this.coin.preload();
    Enemy.preload(this.game);
    EnemySpawn.preload(this.game);
    EnemySpawnManager.preload(this.game);
  },

  create: function() {
    SoundManager.create();
    UI.create();
    this.border.create(this.lvl);
    this.square.create();
    this.coin.create();
    EnemySpawnManager.create(this.lvl, this.border);
    Enemy.create();

    this.controll.create({
      up: function() { this.square.move(Square.directionType.UP) },
      down: function() { this.square.move(Square.directionType.DOWN) },
      left: function() { this.square.move(Square.directionType.LEFT) },
      right: function() { this.square.move(Square.directionType.RIGHT) }
    }, this);

    this.runTimeScoreUpdate();
  },

  update: function() {
    if (this.overlap(this.square.sprite, this.coin.sprite)) {
      this.coin.take();
      var oldScore = ScoreManager.score;
      var newScore = ScoreManager.takeCoin();
      UI.setScore(newScore, oldScore);
    }

    for (var i = 0; i < Enemy.all.length; i++) {
      enemy = Enemy.all[i];
      if (this.overlap(enemy.sprite, this.square.sprite)) {
        // this.square.sprite.tint = this.game.rnd.integer();
        enemy.die();
      }
    }
  },

  runTimeScoreUpdate: function() {
    this.timer = this.game.time.create(false);
    this.timer.loop(1000, this.addScoreByTime, this);
    this.timer.start();
  },

  addScoreByTime: function() {
    var oldScore = ScoreManager.score;
    var newScore = ScoreManager.timerTick();
    UI.setScore(newScore, oldScore);
  },

  overlap: function(obj1, obj2) {
    return Phaser.Rectangle.intersects(obj1.getBounds(), obj2.getBounds());
  }
}