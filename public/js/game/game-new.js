var GameStateNew = {
  init: function(lvl) {
    this.lvl = lvl;
    this.isPause = false;

    this.screenshoot = new Screenshoot(this.game);
    this.pauseMenu = new PauseMenu(this.game);
    this.border = new Border(this.game);
    this.square = new Square(this.game, this.border);
    this.coin = new Coin(this.game, this.border);
    this.controll = new Controll(this.game);
    this.scoreManager = new ScoreManager(this.game);

    this.pauseMenu.onHide.add(this.resume, this);
  },

  preload: function() {
    this.game.stage.backgroundColor = Store.backgroundColor;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;

    Settings.load();
    
    SoundManager.preload(this.game);
    this.pauseMenu.preload();
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
    this.pauseMenu.create();
    this.border.create(this.lvl);
    this.square.create();
    this.coin.create();
    EnemySpawn.create(this.border);
    Enemy.create();
    this.scoreManager.create();
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
      var oldScore = this.scoreManager.score;
      var newScore = this.scoreManager.takeCoin();
      UI.setScore(newScore, oldScore);
      UI.updateRatio(this.scoreManager.ratio);
    }

    for (var i = 0; i < Enemy.all.length; i++) {
      enemy = Enemy.all[i];
      if (this.overlap(enemy.sprite, this.square.sprite)) {
        SoundManager.dieSoundPlay();
        enemy.die();
        var oldScore = this.scoreManager.score;
        var newScore = this.scoreManager.loseScore();
        UI.setScore(newScore, oldScore);
        UI.updateRatio(this.scoreManager.ratio);
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
    this.screenshoot.render();
  },

  pause: function() {
    this.game.physics.arcade.isPaused = this.isPause = true;

    EnemySpawn.allPause();
    this.scoreManager.pause();
    UI.pause();

    this.square.pause();
    this.coin.pause();

    this.pauseMenu.show(this.scoreManager.score);
  },

  resume: function() {
    this.game.physics.arcade.isPaused = this.isPause = false;

    EnemySpawn.allResume();
    this.scoreManager.resume();
    UI.resume();

    this.square.resume();
    this.coin.resume();

    this.pauseMenu.hide();
  }
}