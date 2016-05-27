var Square = function(game, border) {
  const defaultPlayerColor = 0xEEFF41,
    defaultSquareMoveTime = 75,
    defaultSquareSize = 50,
    defaultMoveDistance = defaultSquareSize + Store.squareMargin;

  this.game = game;
  this.playerColor = defaultPlayerColor;
  this.squareMoveTime = defaultSquareMoveTime;
  this.squareSize = defaultSquareSize;
  this.moveDistance = defaultMoveDistance;
  this.square = {};
  this.isMoving = false;
  this.border = border;

}

Square.prototype = {
  preload: function() {
    this.game.load.image('square', 'img/square.png');
  },

  create: function() {
    this.square = this.game.add.sprite(0, 0, 'square');
    this.square.tint = this.playerColor;
    this.square.width = this.squareSize;
    this.square.height = this.squareSize;
    this.square.x = this.game.world.centerX;
    this.square.y = this.game.world.centerY;
    this.square.anchor.setTo(0.5, 0.5);
  },

  moveUp: function() {
    if (this.isMoving)
      return;

    SoundManager.moveSoundPlay();

    var calc = this.square.y - (this.moveDistance + Store.squareMargin);
    var isCanMove = border.canMove(this.square, new Phaser.Point(this.square.x, calc));
    var tween;

    if (!isCanMove) {
      calc += this.moveDistance;
      tween = this.game.add.tween(this.square).to({
          y: calc
        }, this.squareMoveTime / 2)
        .to({
          y: this.square.y
        }, this.squareMoveTime / 2).start();
    } else {
      tween = this.game.add.tween(this.square).to({
        y: calc
      }, this.squareMoveTime).start();
    }

    var isMoving = this.isMoving = true;
    tween.onComplate.add(function() {
      isMoving = false;
    });
  },

  moveDown: function() {
    if (this.isMoving)
      return;

    SoundManager.moveSoundPlay();

    var calc = this.square.y + (this.moveDistance + Store.squareMargin);
    var isCanMove = border.canMove(this.square, new Phaser.Point(this.square.x, calc));
    var tween;

    if (!isCanMove) {
      calc -= this.moveDistance;
      tween = this.game.add.tween(this.square).to({
          y: calc
        }, this.squareMoveTime / 2)
        .to({
          y: this.square.y
        }, this.squareMoveTime / 2).start();
    } else {
      tween = this.game.add.tween(this.square).to({
        y: calc
      }, this.squareMoveTime).start();
    }

    var isMoving = this.isMoving = true;
    tween.onComplate.add(function() {
      isMoving = false;
    });
  },

  moveLeft: function() {
    if (this.isMoving)
      return;

    SoundManager.moveSoundPlay();

    var calc = this.square.x - (this.moveDistance + Store.squareMargin);
    var isCanMove = border.canMove(this.square, new Phaser.Point(this.square.x, calc));
    var tween;

    if (!isCanMove) {
      calc += this.moveDistance;
      tween = this.game.add.tween(this.square).to({
          x: calc
        }, this.squareMoveTime / 2)
        .to({
          x: this.square.y
        }, this.squareMoveTime / 2).start();
    } else {
      tween = this.game.add.tween(this.square).to({
        x: calc
      }, this.squareMoveTime).start();
    }

    var isMoving = this.isMoving = true;
    tween.onComplate.add(function() {
      isMoving = false;
    });
  },

  moveRight: function() {
    if (this.isMoving)
      return;

    SoundManager.moveSoundPlay();

    var calc = this.square.x + (this.moveDistance + Store.squareMargin);
    var isCanMove = border.canMove(this.square, new Phaser.Point(this.square.x, calc));
    var tween;

    if (!isCanMove) {
      calc -= this.moveDistance;
      tween = this.game.add.tween(this.square).to({
          x: calc
        }, this.squareMoveTime / 2)
        .to({
          x: this.square.y
        }, this.squareMoveTime / 2).start();
    } else {
      tween = this.game.add.tween(this.square).to({
        x: calc
      }, this.squareMoveTime).start();
    }

    var isMoving = this.isMoving = true;
    tween.onComplate.add(function() {
      isMoving = false;
    });
  }
};