var GameStateNew = {
  init: function(lvl) {
    this.lvl = lvl;
    this.isPause = false;

    this.soundManager = new SoundManager(this.game);
    this.scoreManager = new ScoreManager(this.game);
    this.screenshoot = new Screenshoot(this.game);
    this.pauseMenu = new PauseMenu(this.game);
    this.border = new Border(this.game, this.lvl);
    this.square = new Square(this.game, this.border, this.soundManager);
    this.coin = new Coin(this.game, this.border, this.soundManager);
    this.ui = new UI(this.game, this.soundManager, this.scoreManager);
    this.controll = new Controll(this.game);

    this.pauseMenu.onHide.add(this.resume, this);
    this.pauseMenu.onShowMainMenu.add(this.onShowMainMenu, this);
  },

  preload: function() {
    this.game.stage.backgroundColor = Store.backgroundColor;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;

    Settings.load();
    
    this.soundManager.preload();
    this.pauseMenu.preload();
    this.ui.preload();
    this.border.preload();
    this.square.preload();
    this.coin.preload();

    Enemy.preload(this.game);
    EnemySpawn.preload(this.game, this.lvl);
  },

  create: function() {
    this.soundManager.create();
    this.ui.create();
    this.pauseMenu.create();
    this.border.create();
    this.square.create();
    this.coin.create();

    Enemy.create();
    EnemySpawn.create(this.border);

    this.controll.create({
      up: function() { this.square.move(Square.directionType.UP) },
      down: function() { this.square.move(Square.directionType.DOWN) },
      left: function() { this.square.move(Square.directionType.LEFT) },
      right: function() { this.square.move(Square.directionType.RIGHT) }
    }, this);

    this.addEventsListener();
    this.addOneSecondTimer();
  },

  update: function() {
    if (this.isPause) {
      return;
    }

    if (this.overlap(this.square.sprite, this.coin.sprite)) {
      this.coin.take();

      this.ui.setScore(this.scoreManager.takeCoin());
      this.ui.updateRatio(this.scoreManager.ratio);
    }

    for (var i = 0; i < Enemy.all.length; i++) {
      enemy = Enemy.all[i];
      if (this.overlap(enemy.sprite, this.square.sprite)) {
        this.soundManager.dieSoundPlay();
        enemy.die();

        this.ui.setScore(this.scoreManager.loseScore());
        this.ui.updateRatio(this.scoreManager.ratio);
      }
    }
  },

  addEventsListener: function() {
    this.ui.onPauseButtonClick.add(this.pause, this);
  },

  overlap: function(obj1, obj2) {
    return Phaser.Rectangle.intersects(obj1.getBounds(), obj2.getBounds());
  },

  render: function() {
    this.screenshoot.render();
  },

  pause: function() {
    this.game.physics.arcade.isPaused = this.isPause = true;

    this.timer.pause();
    EnemySpawn.allPause();
    this.ui.pause();

    this.square.pause();
    this.coin.pause();

    this.pauseMenu.show(this.scoreManager.score);
  },

  resume: function() {
    this.game.physics.arcade.isPaused = this.isPause = false;

    this.timer.resume();
    EnemySpawn.allResume();
    this.ui.resume();

    this.square.resume();
    this.coin.resume();

    this.pauseMenu.hide();
  },

  addOneSecondTimer: function() {
    this.timer = this.game.time.create(false);
    this.timer.loop(1000, this.addScoreByTime, this);
    this.timer.start();
  },

  addScoreByTime: function() {
    this.ui.setScore(this.scoreManager.timerTick());
  },

  onShowMainMenu: function() {
    this.resume();
    this.game.state.start('Menu');
  }
}