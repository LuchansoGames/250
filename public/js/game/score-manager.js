var ScoreManager = {
  score: 0,
  ratio: 1.0,

  timeTickScoreAdd: 2,
  coinScoreAdd: 15,
  coinRatioAdd: 0.05,

  coinsTaked: 0,

  takeCoin: function() {
    this.score += this.coinScoreAdd * this.ratio;
    this.ratio += this.coinRatioAdd;

    this.coinsTaked++;

    return this.score;
  },

  timerTick: function() {
    this.score += this.timeTickScoreAdd * this.ratio;

    return this.score;
  }
}