import Phaser from 'phaser';
import { COLS, CELL_SIZE, MINES, colors } from '../../constants.js';
import { castColorNumberToHex } from '../../utils.js';

export default class GameScene extends Phaser.Scene {
  private board: { mine: boolean; revealed: boolean; text?: Phaser.GameObjects.Text }[] = [];

  constructor() {
    super('GameScene');
  }

  create(): void {
    this.createBoard();
  }

  private createBoard() {
    const minePositions = new Set<number>();
    while (minePositions.size < MINES) {
      minePositions.add(Phaser.Math.Between(0, COLS - 1));
    }

    for (let cell_number = 0; cell_number < COLS; cell_number++) {
      const position_x = 100 + cell_number * CELL_SIZE;
      const position_y = 200;

      const rectangle = this.add
        .rectangle(position_x, position_y, CELL_SIZE - 4, CELL_SIZE - 4, colors.unrevealed)
        .setOrigin(0)
        .setStrokeStyle(2, colors.text)
        .setInteractive();

      const cellData = {
        mine: minePositions.has(cell_number),
        revealed: false,
      };
      this.board.push(cellData);

      rectangle.on('pointerdown', () => {
        this.revealCell(cell_number, rectangle);
      });
    }
  }

  private revealCell(index: number, rect: Phaser.GameObjects.Rectangle) {
    const cell = this.board[index];
    if (!cell || cell.revealed) return;

    cell.revealed = true;

    if (cell.mine) {
      rect.setFillStyle(colors.mine);
      this.add.text(rect.x + 10, rect.y + 10, '💣', { font: '32px Arial' });
      this.gameOver();
    } else {
      rect.setFillStyle(colors.revealed);
      const count = this.countAdjacentMines(index);
      if (count > 0) {
        cell.text = this.add.text(rect.x + 20, rect.y + 15, count.toString(), {
          font: '20px Arial',
          color: castColorNumberToHex(colors.text),
        });
      }
    }
  }

  private countAdjacentMines(index: number): number {
    let count = 0;
    const neighbors = [index - 1, index + 1];
    for (const n of neighbors) {
      if (n >= 0 && n < COLS && this.board[n] && this.board[n].mine) count++;
    }
    return count;
  }

  private gameOver() {
    this.add.text(300, 100, '💥 Game Over!', {
      font: '32px Arial',
      color: castColorNumberToHex(colors.mine),
    });
    this.input.removeAllListeners();
  }
}
