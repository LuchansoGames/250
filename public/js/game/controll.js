var Controll = function(game) {
  this.game = game;
}

Controll.prototype = {
  create: function(flows, context) {
    context = context || {};

    var keys = this.game.input.keyboard.addKeys({
      'up': Phaser.KeyCode.W,
      'down': Phaser.KeyCode.S,
      'left': Phaser.KeyCode.A,
      'right': Phaser.KeyCode.D
    });

    keys.up.onDown.add(flows.up, context);
    keys.down.onDown.add(flows.down, context);
    keys.left.onDown.add(flows.left, context);
    keys.right.onDown.add(flows.right, context);

    keys = this.game.input.keyboard.addKeys({
      'up': Phaser.KeyCode.UP,
      'down': Phaser.KeyCode.DOWN,
      'left': Phaser.KeyCode.LEFT,
      'right': Phaser.KeyCode.RIGHT
    });

    keys.up.onDown.add(flows.up, context);
    keys.down.onDown.add(flows.down, context);
    keys.left.onDown.add(flows.left, context);
    keys.right.onDown.add(flows.right, context);
  }
};