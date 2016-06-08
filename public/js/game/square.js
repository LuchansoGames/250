var Square = function(game, border, soundManager) {
  this.game = game;
  this.playerColor = Store.playerColor;
  this.squareMoveTime = Store.squareMoveTime;
  this.squareSize = Store.squareSize;
  this.sprite = {};
  this.isMoving = false;
  this.border = border;
  this.soundManager = soundManager;
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

    this.game.physics.arcade.enable([this.sprite]);
  },

  pause: function() {
    this.isPause = true;
  },

  resume: function() {
    this.isPause = false;
  },

  move: function(direction) {
    if (this.isMoving || this.isPause)
      return;

    this.soundManager.moveSoundPlay();

    var XYDirection = this.calcDirection(direction, this.sprite);

    var calcX = XYDirection.calcX;
    var calcY = XYDirection.calcY;
    var isCanMove;
    var tween;
    var backPositionX = XYDirection.backPositionX;
    var backPositionY = XYDirection.backPositionY;

    isCanMove = this.border.canMove(this.sprite, new Phaser.Point(calcX, calcY));

    if (isCanMove) {
      tween = this.game.add.tween(this.sprite).to({
        x: calcX,
        y: calcY
      }, this.squareMoveTime).start();
    } else {
      calcX += backPositionX;
      calcY += backPositionY;

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
  },

  calcDirection: function(direction, sprite) {
    var calcX = sprite.x;
    var calcY = sprite.y;
    var backPositionX = 0;
    var backPositionY = 0;

    switch (direction) {
      case Square.directionType.UP:
        calcY = sprite.y - Store.terrainSize;
        backPositionY = +Store.moveDistance;

        break;

      case Square.directionType.DOWN:
        calcY = sprite.y + Store.terrainSize;
        backPositionY = -Store.moveDistance;

        break;

      case Square.directionType.LEFT:
        calcX = sprite.x - Store.terrainSize;
        backPositionX = +Store.moveDistance;

        break;

      case Square.directionType.RIGHT:
        calcX = sprite.x + Store.terrainSize;
        backPositionX = -Store.moveDistance;

        break;
    }

    return {
      calcX: calcX,
      calcY: calcY,
      backPositionX: backPositionX,
      backPositionY: backPositionY
    }
  }
};