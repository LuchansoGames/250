var Border = function(game) {
  this.game = game;
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
    var x = square.x / this.squareSize; 
    var y = square.y / this.squareSize;

    var targetX = position.x / this.squareSize;
    var targetY = position.y / this.squareSize;

    var direction;

    if (x - targetX > 0) {
      direction = 'left';
    } else if (x - targetX < 0) {
      direction = 'right';
    } else if (y - targetY > 0) {
      direction = 'bottom';
    } else {
      direction = 'top';
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

    this.loadDefaultMap();
  },

  loadDefaultMap: function() {
    var rowMap = this.game.cache.getJSON('3x3');

    rowMap.forEach(function(rowTerrain) {
      var terrain = new Terrain(rowTerrain.x, rowTerrain.y, rowTerrain.borders);

      this.map[terrain.x + ':' + terrain.y] = terrain;
    }, this);

    this.mapSize = calculateSizeMap(this.map, this.squareSize);

    var graphics = game.add.graphics(
      this.game.world.centerX - this.mapSize.width / 2,
      this.game.world.centerY - this.mapSize.height / 2
    );

    this.draw(graphics);
  },

  getTerrainByPosition: function(x, y) {
    return this.map[terrain.x + ':' + terrain.y];
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