import { Game } from '../game';
import { ComponentInterface } from './interface';
import * as Utils from '../utils';

export class ScoreboardComponent implements ComponentInterface {
    private scoreElement: HTMLElement;

    // PUBLIC METHODS:
    constructor(private game: Game, private parentElement: HTMLElement) {}

    reset(): void {
        this.scoreElement.innerHTML = 'Wordle';
    }

    init(): void {
        this.scoreElement = Utils.drawSegment('score', this.parentElement);

        this.scoreElement.innerHTML = 'Wordle';
    }

    public displayResult(hasWon: boolean): void {
        this.scoreElement.innerHTML = hasWon ? 'You Won' : 'You Lost';
    }
}
