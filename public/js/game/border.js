var Border = function(game, map) {
  this.game = game;
  this.map = map;
}

Border.prototype = {
  /**
   * Функция которая проверяет, может ли объект двигаться дальше
   * @param  {[type]} square   [description]
   * @param  {[type]} position [description]
   * @return {[type]}          [description]
   */
  canMove: function(square, position) {
    return true;
  },

  draw: function(graphics) {
    var self = this;
    
    this.map.forEach(function(terrain) {
      graphics.lineStyle(terrain.lineStyle, terrain.color);
      graphics.drawRect(terrain.x, terrain.y, terrain.width, terrain.height);
    });
  }
};

/**
 * Создаёт карту 3x3
 * @return {[type]} [description]
 */
Border.generate3x3Map = function() {
  var terrains = [];

  for (var x = 0; x < 3; x++) {
    for (var y = 0; y < 3; y++) {
      var border = {};

      if (x === 0)
        border.left = true;

      if (y === 0)
        border.top = true;

      if (x === 2)
        border.right = true;

      if (y === 2)
        border.bottom = true;
      
      var terrain = new Terrain(x, y);
    }
  }
}