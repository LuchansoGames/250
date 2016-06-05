var GameStateNew = {
  init: function(lvl) {
    this.lvl = lvl;
    this.isPause = false;

    Screenshoot.init(this.game);
    PauseMenu.init(this.game);
    ScoreManager.init(this.game);
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
    EnemySpawn.preload(this.game, this.lvl);
  },

  create: function() {
    SoundManager.create();
    UI.create();    
    this.border.create(this.lvl);
    this.square.create();
    this.coin.create();
    EnemySpawn.create(this.border);
    Enemy.create();
    ScoreManager.create();

    this.controll.create({
      up: function() { this.square.move(Square.directionType.UP) },
      down: function() { this.square.move(Square.directionType.DOWN) },
      left: function() { this.square.move(Square.directionType.LEFT) },
      right: function() { this.square.move(Square.directionType.RIGHT) }
    }, this);

    this.addEventsListener();
  },

  update: function() {
    if (this.isPause) {
      return;
    }

    if (this.overlap(this.square.sprite, this.coin.sprite)) {
      this.coin.take();
      var oldScore = ScoreManager.score;
      var newScore = ScoreManager.takeCoin();
      UI.setScore(newScore, oldScore);
      UI.updateRatio(ScoreManager.ratio);
    }

    for (var i = 0; i < Enemy.all.length; i++) {
      enemy = Enemy.all[i];
      if (this.overlap(enemy.sprite, this.square.sprite)) {
        enemy.die();        
        var oldScore = ScoreManager.score;
        var newScore = ScoreManager.loseScore();
        UI.setScore(newScore, oldScore);
        UI.updateRatio(ScoreManager.ratio);
      }
    }
  },

  addEventsListener: function() {
    UI.onPauseButtonClick.add(this.pause, this);
  },

  overlap: function(obj1, obj2) {
    return Phaser.Rectangle.intersects(obj1.getBounds(), obj2.getBounds());
  },

  render: function() {
    Screenshoot.render();
  },

  pause: function() {
    this.game.physics.arcade.isPaused = this.isPause = true;

    EnemySpawn.allPause();
    ScoreManager.pause();
    UI.pause();

    this.square.pause();
    this.coin.pause();

    PauseMenu.show();
  },

  resume: function() {
    this.game.physics.arcade.isPaused = this.isPause = false;

    EnemySpawn.allResume();
    ScoreManager.resume();
    UI.resume();

    this.square.resume();
    this.coin.resume();

    PauseMenu.hide();
  }
}