import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload(): void {
    // Load assets
  }

  create(): void {
    this.add.text(100, 100, 'Hello Phaser + React + TS!', {
      font: '24px Arial',
      color: '#ffffff',
    });
  }

  update(): void {
    // Game logic
  }
}
