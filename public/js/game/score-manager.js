var ScoreManager = function(game) {
  this.game = game;
  this.score = 0;
  this.ratio = 1.0;

  this.timeTickScoreAdd = 2;
  this.coinScoreAdd = 15;
  this.coinRatioAdd = 0.05;

  this.coinsTaked = 0;
}

ScoreManager.prototype = {
  takeCoin: function() {
    this.score += this.coinScoreAdd * this.ratio;
    this.ratio += this.coinRatioAdd;

    this.coinsTaked++;

    return this.score;
  },

  loseScore: function() {
    this.score /= 2;
    this.ratio = 1;
    
    return this.score;
  },

  timerTick: function() {
    this.score += this.timeTickScoreAdd * this.ratio;

    return this.score;
  }
}