var Border = function(game, lvl) {
  this.game = game;
  this.lvl =lvl;
}

Border.prototype = {
  /**
   * Функция которая проверяет, может ли объект двигаться дальше
   * @param  {[type]} square   [description]
   * @param  {[type]} position [description]
   * @return {[type]}          [description]
   */
  canMove: function(square, position) {
    var result = false;
    var x = (square.x - this.position.x) / this.squareSize;
    var y = (square.y - this.position.y) / this.squareSize;

    var targetX = (position.x - this.position.x) / this.squareSize;
    var targetY = (position.y - this.position.y) / this.squareSize;

    var direction;

    if (x - targetX > 0) {
      direction = 'left';
    } else if (x - targetX < 0) {
      direction = 'right';
    } else if (y - targetY > 0) {
      direction = 'top';
    } else {
      direction = 'bottom';
    }

    var terrain = this.getTerrainByPosition(x, y);

    return !terrain.borders[direction];
  },

  draw: function(graphics) {
    this.map.forEach(function(terrain) {
      terrain.draw(graphics);
    });
  },

  preload: function() {
    this.game.load.json('3x3', 'maps/3x3.json');
  },

  create: function() {
    this.squareSize = (Store.moveDistance + Store.squareMargin);
    this.map = [];

    this.loadMap(this.lvl);
  },

  loadMap: function(lvl) {
    var rowMap = this.game.cache.getJSON(lvl).terrains;

    this.map = rowMap.map(function(rowTerrain) {
      return new Terrain(rowTerrain.x, rowTerrain.y, rowTerrain.borders);
    });

    this.mapSize = calculateSizeMap(this.map, this.squareSize);
    this.position = new Phaser.Point(this.game.world.centerX - this.mapSize.width / 2, this.game.world.centerY - this.mapSize.height / 2);

    var graphics = game.add.graphics(this.position.x, this.position.y);

    this.draw(graphics);
  },

  /**
   * Получение позиции площади, по координатам системы
   * @param  {[type]} x [description]
   * @param  {[type]} y [description]
   * @return {[type]}   [description]
   */
  getTerrainByPosition: function(x, y) {
    var result;

    this.map.forEach(function(terrain) {
      var terrainRectangle = new Phaser.Rectangle(terrain.x, terrain.y, 1, 1);
      if (terrainRectangle.contains(x, y)) {
        result = terrain;
      }
    });

    return result;
  }
};

function calculateSizeMap(map, squareSize) {
  var minX = 0;
  var minY = 0;
  var maxX = 0;
  var maxY = 0;

  map.forEach(function(terrain) {
    var x = terrain.x;
    var y = terrain.y;

    maxX = Math.max(x, maxX);
    maxY = Math.max(y, maxY);
    minX = Math.min(x, minX);
    minY = Math.min(y, minY);
  });

  return {
    width: (maxX + Math.abs(minX)) * squareSize,
    height: (maxY + Math.abs(minY)) * squareSize
  }
}