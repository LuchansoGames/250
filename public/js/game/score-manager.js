var ScoreManager = {
  score: 0,
  ratio: 1.0,

  timeTickScoreAdd: 2,
  coinScoreAdd: 15,
  coinRatioAdd: 0.05,

  coinsTaked: 0,

  init: function(game) {
    this.game = game;
  },

  pause: function() {
    this.timer.pause();
  },

  resume: function() {
    this.timer.resume();
  },

  create: function() {
    this.timer = this.game.time.create(false);
    this.timer.loop(1000, this.addScoreByTime, this);
    this.timer.start();
  },

  takeCoin: function() {
    this.score += this.coinScoreAdd * this.ratio;
    this.ratio += this.coinRatioAdd;

    this.coinsTaked++;

    return this.score;
  },

  addScoreByTime: function() {
    var oldScore = this.score;
    var newScore = this.timerTick();

    UI.setScore(newScore, oldScore);
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