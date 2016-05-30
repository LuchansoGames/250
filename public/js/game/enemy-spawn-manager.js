var EnemySpawnManager = {
  spawns: [],

  preload: function(game) {
    this.game = game;

    game.load.json('3x3', 'maps/3x3.json');
  },

  create: function(lvl, border) {
    var rowSpawns = this.game.cache.getJSON(lvl).enemySpawns;

    this.squareSize = (Store.moveDistance + Store.squareMargin);
    this.border = border;

    this.spawns = rowSpawns.map(function(spawn) {
      return new EnemySpawn(
        this.game,
        spawn,
        this.border
      );
    }, this);
  }
}

EnemySpawnManager.prototype = {

}