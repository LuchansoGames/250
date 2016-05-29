var game = new Phaser.Game(1000, 900, Phaser.AUTO, 'game');
//var game = new Phaser.Game(600, 1000, Phaser.CANVAS, 'game');

game.state.add('Game', GameState);
game.state.add('Game.v2', GameStateNew);
game.state.add('Menu', Menu);

game.state.start('Game.v2');