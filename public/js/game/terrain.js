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

  this.color = defaultParams.borderColor;
  this.lineStyle = defaultParams.borderLineStyle;

  this.width = (defaultParams.moveDistance + defaultParams.squareSize / 2 + Store.squareMargin * 2) * 2;
  this.height = (defaultParams.moveDistance + defaultParams.squareSize / 2 + Store.squareMargin * 2) * 2;
}

Terrain.prototype = {
};