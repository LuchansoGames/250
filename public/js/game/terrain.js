var Terrain = function(x, y, borders) {
  this.x = x;
  this.y = y;

  this.borders = borders || {
    top: false,
    bottom: false,
    left: false,
    right: false
  };

  this.borders.top = this.borders.top || false;
  this.borders.bottom = this.borders.bottom || false;
  this.borders.left = this.borders.left || false;
  this.borders.right = this.borders.right || false;

  this.color = Store.borderColor;
  this.lineWidth = Store.borderLineWidth;

  this.size = Store.terrainSize;
  this.width = this.size;
  this.height = this.size;
}

Terrain.prototype = {
  draw: function(graphics) {
    graphics.lineStyle(this.lineWidth, this.color);

    if (this.borders.top) {
      this.drawTopBorder(graphics);
    }
    if (this.borders.bottom) {
      this.drawBottomBorder(graphics);
    }
    if (this.borders.left) {
      this.drawLeftBorder(graphics);
    }
    if (this.borders.right) {
      this.drawRightBorder(graphics);
    }
  },

  drawTopBorder: function(graphics) {
    graphics.moveTo(this.x * this.size, this.y * this.size);
    graphics.lineTo(this.x * this.size + this.size, this.y * this.size);
  },

  drawBottomBorder: function(graphics) {
    graphics.moveTo(this.x * this.size, this.y * this.size + this.size);
    graphics.lineTo(this.x * this.size + this.size, this.y * this.size + this.size);
  },

  drawLeftBorder: function(graphics) {
    graphics.moveTo(this.x * this.size, this.y * this.size);
    graphics.lineTo(this.x * this.size, this.y * this.size + this.size);
  },

  drawRightBorder: function(graphics) {
    graphics.moveTo(this.x * this.size + this.size, this.y * this.size);
    graphics.lineTo(this.x * this.size + this.size, this.y * this.size + this.size);
  }
};