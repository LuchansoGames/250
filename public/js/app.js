var game = new Phaser.Game(600, 900, Phaser.AUTO, 'game');
//var game = new Phaser.Game(600, 900, Phaser.CANVAS, 'game');

game.state.add('Game', GameState);
game.state.add('Menu', Menu);

game.state.start('Menu');