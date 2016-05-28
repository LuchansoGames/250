var Square = function(game, border) {
  this.game = game;
  this.playerColor = Store.playerColor;
  this.squareMoveTime = Store.squareMoveTime;
  this.squareSize = Store.squareSize;
  this.moveDistance = Store.moveDistance;
  this.sprite = {};
  this.isMoving = false;
  this.border = border;
}

Square.directionType = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
}

Square.prototype = {
  preload: function() {
    this.game.load.image('square', 'img/square.png');
  },

  create: function() {
    this.sprite = this.game.add.sprite(0, 0, 'square');
    this.sprite.tint = this.playerColor;
    this.sprite.width = this.squareSize;
    this.sprite.height = this.squareSize;
    this.sprite.x = this.game.world.centerX;
    this.sprite.y = this.game.world.centerY;
    this.sprite.anchor.setTo(0.5, 0.5);
  },

  move: function(direction) {
    if (this.isMoving)
      return;

    SoundManager.moveSoundPlay();

    var calcX = this.sprite.x;
    var calcY = this.sprite.y;
    var isCanMove;
    var tween;
    var backPosition;

    switch (direction) {
      case Square.directionType.UP:
        calcY = this.sprite.y - (this.moveDistance + Store.squareMargin);
        backPosition = +this.moveDistance;

        break;

      case Square.directionType.DOWN:
        calcY = this.sprite.y + (this.moveDistance + Store.squareMargin);
        backPosition = -this.moveDistance;

        break;

      case Square.directionType.LEFT:
        calcX = this.sprite.x - (this.moveDistance + Store.squareMargin);
        backPosition = +this.moveDistance;

        break;

      case Square.directionType.RIGHT:
        calcX = this.sprite.x + (this.moveDistance + Store.squareMargin);
        backPosition = -this.moveDistance;

        break;
    }

    isCanMove = this.border.canMove(this.sprite, new Phaser.Point(calcX, calcY));

    if (isCanMove) {
      tween = this.game.add.tween(this.sprite).to({
        x: calcX,
        y: calcY
      }, this.squareMoveTime).start();
    } else {
      calc += backPosition;

      tween = this.game.add.tween(this.sprite).to({
          x: calcX,
          y: calcY
        }, this.squareMoveTime / 2)
        .to({
          x: this.sprite.x,
          y: this.sprite.y
        }, this.squareMoveTime / 2).start();
    }

    this.isMoving = true;
    tween.onComplete.add(function() {
      this.isMoving = false;
    }, this);
  }
};