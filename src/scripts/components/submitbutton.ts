import { Game } from '../game';
import { ComponentInterface, OnSubmit } from './interface';
import * as Utils from '../utils';
import { Subject } from 'rxjs';
import { TileboardComponent } from './tileboard';
import { Config } from '../config';

export class SubmitButtonComponent implements ComponentInterface, OnSubmit {
    private submitButton: HTMLButtonElement;
    private selectedWordle: string;
    private isGameOver: boolean;
    private currentTile: number;
    private tileboardComponent: TileboardComponent;

    public onSubmit: Subject<undefined> = new Subject();

    // PUBLIC METHODS:
    constructor(private game: Game, private parentElement: HTMLElement) {}

    reset(): void {
        this.submitButton.innerHTML = Config.BUTTON_TEXT_SUBMIT;
    }

    submit(): void {
        if (this.isGameOver) {
            this.game.newGame();
            return;
        }

        if (this.tileboardComponent.isRowValid()) {
            this.onSubmit.next(undefined);
        }
    }

    init(): void {
        this.game.currentWordle.subscribe((wordle: string): void => {
            this.selectedWordle = wordle;
        });

        this.game.gameOver.subscribe((isGameOver: boolean): void => {
            this.isGameOver = isGameOver;
        });

        this.tileboardComponent =
            this.game.getComponent<TileboardComponent>('tileboard');

        this.tileboardComponent.currentTileId.subscribe(
            (tileId: number): void => {
                this.currentTile = tileId;
            }
        );

        this.submitButton = Utils.drawSegment(
            'submit-button',
            this.parentElement,
            'button'
        ) as HTMLButtonElement;

        this.submitButton.innerHTML = Config.BUTTON_TEXT_SUBMIT;

        this.submitButton.addEventListener('click', this.submit.bind(this));

        document.body.addEventListener('keyup', this.keyUpHandler.bind(this));
    }

    public updateSubmitButton(): void {
        if (!this.isGameOver && this.currentTile > this.selectedWordle.length) {
            if (this.tileboardComponent.isRowValid()) {
                this.submitButton.classList.add('valid');
                this.setButtonText('valid');
                return;
            }

            this.submitButton.classList.add('invalid');
            this.setButtonText('invalid');
            return;
        }

        this.submitButton.classList.remove('valid', 'invalid');
        this.setButtonText();
    }

    // PRIVATE METHODS:
    private setButtonText(
        state: 'valid' | 'invalid' | 'default' = 'default'
    ): void {
        let stateText: string = Config.BUTTON_TEXT_NEW_GAME;

        if (!this.isGameOver) {
            switch (state) {
                case 'invalid':
                    stateText = Config.BUTTON_TEXT_NOT_A_WORD;
                    break;
                case 'valid':
                default:
                    stateText = Config.BUTTON_TEXT_SUBMIT;
                    break;
            }
        }

        this.submitButton.innerHTML = stateText;
    }

    private keyUpHandler($event: KeyboardEvent): void {
        const key: string = $event.key.toLocaleLowerCase();

        if (this.currentTile === 6 && key === 'enter') {
            this.submit();
        }
    }
}
