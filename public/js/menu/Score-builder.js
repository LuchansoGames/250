var ScoreBuilder = function(game) {
  this.game = game;
}

ScoreBuilder.prototype = {
  preload: function() {
    this.game.load.image('score-row',  'img/menu/score-row.png');
    this.game.load.image('score-filter',  'img/menu/score-filter.png');
  },

  add: function(x, y, userimage, username, url, score, position) {
    return new ScoreRow(this.game, x, y, userimage, username, url, score, position);
  }
}