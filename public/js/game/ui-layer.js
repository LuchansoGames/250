var UI = {
  preload: function(game) {
    this.game = game;

    this.game.load.spritesheet('volume', 'img/volume-spritesheet.png', 96, 96);
    this.game.load.image('pause', 'img/ic-pause.png');
  },

  create: function() {
    this.addPauseButton();
    this.addVolumeButton();

    this.addScoreLable();
    this.addScoreRatioLable();
  },

  addScoreLable: function() {
    var style = {
      font: "30px Jura",
      fill: "#fff"
    }

    this.scoreLable = game.add.text(this.game.world.width, 0, 'Очки 0', style);
    this.scoreLable.anchor.set(1, 0);
  },

  setScore: function(newScore, oldScore) {
    var scoreObj = {
      score: oldScore
    }

    var newAnimation = this.game.add.tween(scoreObj).to({score: newScore}, 100).onUpdateCallback(function() {
      this.scoreLable.text = "Очки " + Math.round(scoreObj.score);
    }, this);

    newAnimation.onComplete.add(function() {
      this.scoreLable.text = "Очки " + Math.round(scoreObj.score);
    }, this);

    if (this.animationScore && this.animationScore.isRunning) {      
      this.animationScore.chain(newAnimation);
    } else {
      this.animationScore = newAnimation;
      this.animationScore.start();
    }
  },

  addScoreRatioLable: function() {
    var style = {
      font: "56px Jura",
      fill: "#FFFFFF"
    }

    this.scoreRatioLable = game.add.text(this.game.world.centerX, this.game.world.centerY, 'x1', style);
    this.scoreRatioLable.anchor.set(0.44, 0.5);
    this.scoreRatioLable.alpha = 0.2;
  },

  updateRatio: function(ratio) {
    this.scoreRatioLable.text = 'x' + Math.round(ratio * 100) / 100;
  },

  addVolumeButton: function() {
    var frames = 1;

    if (Settings.isMuted) {
      frames = 0;
    }

    this.soundButton = this.game.add.button(5 + this.pauseButton.width, 5, 'volume', this.volumeButton_click, this, frames, frames, frames);
    this.soundButton.width = 48;
    this.soundButton.height = 48;
  },

  addPauseButton: function() {
    this.pauseButton = this.game.add.button(5, 5, 'pause', this.pauseButton_click, this);
    this.pauseButton.width = 48;
    this.pauseButton.height = 48;
  },

  volumeButton_click: function() {
    SoundManager.volumeStateChange();
    if (this.soundButton.frame === 0) {
      this.soundButton.setFrames(1, 1, 1);
    } else if (this.soundButton.frame === 1) {
      this.soundButton.setFrames(0, 0, 0);
    }
  },

  pauseButton_click: function() {
    // console.log(this.game.paused);
    this.game.paused = !this.game.paused;
  }
}