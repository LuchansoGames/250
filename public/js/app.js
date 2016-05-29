var game = new Phaser.Game(900, 1400, Phaser.AUTO, 'game');
//var game = new Phaser.Game(600, 900, Phaser.CANVAS, 'game');

game.state.add('Game', GameState);
game.state.add('Game.v2', GameStateNew);
game.state.add('Menu', Menu);

game.state.start('Game');

// var test = new Phaser.Timer(game);