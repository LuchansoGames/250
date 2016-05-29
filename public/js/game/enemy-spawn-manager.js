var EnemySpawnManager = {
  spawns: [],

  preload: function(game) {
    this.game = game;

    game.load.json('3x3', 'maps/3x3.json');
  },

  create: function(lvl) {
    var rowSpawns = this.game.cache.getJSON(lvl).enemySpawns;

    this.spawns = rowSpawns.map(function(spawn) {
      return new EnemySpawn(
        this.game,
        spawn.x,
        spawn.y,
        spawn.speed,
        spawn.angle,
        spawn.intervalCreate
      );
    });
  }
}

EnemySpawnManager.prototype = {

}