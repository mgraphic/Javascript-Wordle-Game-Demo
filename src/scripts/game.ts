import '../styles/index.scss';

import { BehaviorSubject, Observable } from 'rxjs';
import { KeyboardComponent } from './components/keyboard';
import { ScoreboardComponent } from './components/scoreboard';
import { SubmitButtonComponent } from './components/submitbutton';
import { TileboardComponent } from './components/tileboard';
import * as Utils from './utils';

export class Game {
    private tileBoardComponent: TileboardComponent;
    private keyBoardComponent: KeyboardComponent;
    private scoreBoardComponent: ScoreboardComponent;
    private submitButtonComponent: SubmitButtonComponent;
    private selectedWordle: string;
    private isGameOver: boolean;

    // BehaviorSubjects
    private _gameOver: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        true
    );
    public readonly gameOver: Observable<boolean> =
        this._gameOver.asObservable();

    private _currentWordle: BehaviorSubject<string> =
        new BehaviorSubject<string>('');
    public readonly currentWordle: Observable<string> =
        this._currentWordle.asObservable();

    // PUBLIC METHODS:
    constructor(private gameBoardElement: HTMLElement) {}

    public run(): void {
        // set components:
        this.tileBoardComponent = new TileboardComponent(
            this,
            this.gameBoardElement
        );
        this.keyBoardComponent = new KeyboardComponent(
            this,
            this.gameBoardElement
        );
        this.scoreBoardComponent = new ScoreboardComponent(
            this,
            this.gameBoardElement
        );
        this.submitButtonComponent = new SubmitButtonComponent(
            this,
            this.gameBoardElement
        );

        this.scoreBoardComponent.init();
        this.tileBoardComponent.init();
        this.submitButtonComponent.init();
        this.keyBoardComponent.init();

        // start first game:
        this.newGame();
    }

    public getComponent<T>(
        component: 'keyboard' | 'scoreboard' | 'submitbutton' | 'tileboard'
    ): T {
        switch (component) {
            case 'keyboard':
                return this.keyBoardComponent as unknown as T;
            case 'scoreboard':
                return this.scoreBoardComponent as unknown as T;
            case 'submitbutton':
                return this.submitButtonComponent as unknown as T;
            case 'tileboard':
                return this.tileBoardComponent as unknown as T;
        }
    }

    public endGame(hasWon: boolean): void {
        this.isGameOver = true;
        this._gameOver.next(this.isGameOver);
        this.scoreBoardComponent.displayResult(hasWon);
        this.submitButtonComponent.updateSubmitButton();
    }

    public newGame(): void {
        this.reset();
        this.setWordle();
        this.tileBoardComponent.draw();
        this.keyBoardComponent.draw();

        // console.log(this.selectedWordle);
    }

    // PRIVATE METHODS:
    private setWordle(): void {
        this.selectedWordle = Utils.getRandomPlayWord();
        this._currentWordle.next(this.selectedWordle);
    }

    private reset(): void {
        this.isGameOver = false;
        this._gameOver.next(false);

        this.scoreBoardComponent.reset();
        this.tileBoardComponent.reset();
        this.submitButtonComponent.reset();
        this.keyBoardComponent.reset();
    }
}
