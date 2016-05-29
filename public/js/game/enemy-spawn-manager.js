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
        spawn.x * this.squareSize  + this.border.position.x,
        spawn.y * this.squareSize  + this.border.position.y,
        spawn.speed,
        spawn.angle,
        spawn.intervalCreate
      );
    }, this);
  }
}

EnemySpawnManager.prototype = {

}