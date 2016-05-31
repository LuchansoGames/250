var UI = {
  preload: function(game) {
    this.game = game;

    this.game.load.spritesheet('volume', 'img/volume-spritesheet.png', 96, 96);
  },

  create: function() {
    this.addVolumeButton();

    this.addScoreLable();
    this.addScoreRatioLable();
    this.addBestScoreLable();
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
    this.scoreRatioLable.anchor.set(0.5, 0.5);
    this.scoreRatioLable.alpha = 0.2;
  },

  addBestScoreLable: function() {

  },

  addVolumeButton: function() {
    var frames = 1;

    if (Settings.isMuted) {
      frames = 0;
    }

    soundButton = this.game.add.button(5, 5, 'volume', this.volumeButton_click, this, frames, frames, frames);
    soundButton.width = 48;
    soundButton.height = 48;
  },

  volumeButton_click: function() {
    SoundManager.volumeStateChange();
    if (soundButton.frame === 0) {
      soundButton.setFrames(1, 1, 1);
    } else if (soundButton.frame === 1) {
      soundButton.setFrames(0, 0, 0);
    }
  }
}