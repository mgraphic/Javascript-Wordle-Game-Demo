import { BehaviorSubject, Observable } from 'rxjs';
import { Config } from '../config';
import { Game } from '../game';
import { colorStatus, WordleTile, WordleTileRow } from '../model';
import * as Utils from '../utils';
import { ComponentInterface, OnDraw, OnSubmit } from './interface';
import { KeyboardComponent } from './keyboard';
import { SubmitButtonComponent } from './submitbutton';

export class TileboardComponent
    implements ComponentInterface, OnSubmit, OnDraw
{
    private selectedWordle: string;
    private tileBoardContainer: HTMLElement;
    private tileRows: WordleTileRow[];
    private currentRow: number;
    private currentTile: number;
    private isGameOver: boolean;
    private submitButtonComponent: SubmitButtonComponent;
    private keyboardComponent: KeyboardComponent;

    // BehaviorSubjects
    private _currentRowId: BehaviorSubject<number> =
        new BehaviorSubject<number>(1);
    public readonly currentRowId: Observable<number> =
        this._currentRowId.asObservable();

    private _currentTileId: BehaviorSubject<number> =
        new BehaviorSubject<number>(1);
    public readonly currentTileId: Observable<number> =
        this._currentTileId.asObservable();

    // PUBLIC METHODS:
    constructor(private game: Game, private parentElement: HTMLElement) {}

    submit(): void {
        this.submitRow();
    }

    reset(): void {
        this.tileBoardContainer.innerHTML = '';
        this.tileRows = [];
        this.setRowId('reset');
        this.setTileId('reset');
    }

    draw(): void {
        this.drawRows();
    }

    init(): void {
        this.game.currentWordle.subscribe((wordle: string): void => {
            this.selectedWordle = wordle;
        });

        this.game.gameOver.subscribe((isGameOver: boolean): void => {
            this.isGameOver = isGameOver;
        });

        this.submitButtonComponent =
            this.game.getComponent<SubmitButtonComponent>('submitbutton');

        this.submitButtonComponent.onSubmit.subscribe((): void => {
            this.submit();
        });

        this.keyboardComponent = this.game.getComponent('keyboard');

        this.tileBoardContainer = Utils.drawSegment(
            'wordle-container',
            this.parentElement
        );

        document.body.addEventListener('keyup', this.keyUpHandler.bind(this));
    }

    public isRowValid(): boolean {
        let wordString: string = '';
        const row: WordleTileRow = this.getCurrentRow();

        if (row === undefined) {
            return false;
        }

        for (let idx: number = 0; idx < row.tiles.length; idx++) {
            wordString = `${wordString}${row.tiles[idx].value}`;
        }

        return Utils.isValidWord(wordString);
    }

    public backspace(): void {
        this.setTileId(-1);
        const tile: WordleTile = this.getCurrentTile();

        if (tile) {
            this.setTileValue(tile, '');
            this.submitButtonComponent.updateSubmitButton();
        }

        if (this.currentTile < 1) {
            this.setTileId('reset');
        }
    }

    public type(char: string): void {
        const tile: WordleTile = this.getCurrentTile();

        if (tile) {
            this.setTileId(+1);
            this.setTileValue(tile, char);
            this.submitButtonComponent.updateSubmitButton();
        }
    }

    // PRIVATE METHODS:
    private drawRows(): void {
        for (let id: number = 1; id <= Config.NUMBER_OF_GUESSES; id++) {
            const rowElement: HTMLElement = Utils.drawSegment(
                'tile-row',
                this.tileBoardContainer
            );
            const tiles: WordleTile[] = this.drawTiles(rowElement);
            const row: WordleTileRow = {
                id,
                element: rowElement,
                tiles,
            };

            this.tileRows.push(row);
        }
    }

    private drawTiles(parentElement: HTMLElement): WordleTile[] {
        const tiles: WordleTile[] = [];

        for (let id: number = 1; id <= this.selectedWordle.length; id++) {
            const tileElement: HTMLElement = Utils.drawSegment(
                ['tile', colorStatus.EMPTY],
                parentElement
            );
            const tile: WordleTile = {
                id,
                element: tileElement,
                status: colorStatus.EMPTY,
                value: '',
            };

            tiles.push(tile);
        }

        return tiles;
    }

    private getCurrentRow(): WordleTileRow | undefined {
        return this.tileRows.find(
            (row: WordleTileRow): boolean => row.id === this.currentRow
        );
    }

    private getCurrentTile(): WordleTile | undefined {
        const currentRow: WordleTileRow = this.getCurrentRow();

        return currentRow?.tiles.find(
            (tile: WordleTile): boolean => tile.id === this.currentTile
        );
    }

    private setTileValue(tile: WordleTile, value: string): void {
        tile.value = value;
        tile.element.innerHTML = value;
    }

    private setcolorStatus(tile: WordleTile, colorStatus: colorStatus): void {
        this.unsetcolorStatus(tile);
        tile.element.classList.add(colorStatus);
        this.keyboardComponent.setcolorStatus(tile.value, colorStatus);
    }

    private unsetcolorStatus(tile: WordleTile): void {
        tile.element.classList.remove(...Object.values(colorStatus));
    }

    private checkTiles(row: WordleTileRow) {
        const tiles: WordleTile[] = row.tiles;
        const selectedArray: string[] = Array.from(this.selectedWordle);
        const guessedArray: string[] = tiles.map(
            (tile: WordleTile): string => tile.value
        );
        const matched: string[] = selectedArray.filter(
            (value: string): boolean => guessedArray.includes(value)
        );

        // set green status
        selectedArray.forEach((value: string, key: number): void => {
            if (guessedArray[key] === value) {
                matched.splice(matched.indexOf(value), 1);
                this.setcolorStatus(tiles[key], colorStatus.GREEN);
            }
        });

        // set yellow status
        while (matched.length > 0) {
            const value: string = matched.shift();
            const tile: WordleTile = tiles.find(
                (matchedTile: WordleTile): boolean =>
                    matchedTile.value === value &&
                    matchedTile.element.classList.contains(colorStatus.EMPTY)
            );

            if (tile) {
                this.setcolorStatus(tile, colorStatus.YELLOW);
            }
        }

        // set gray status
        tiles.forEach((tile: WordleTile, key: number): void => {
            if (tile.element.classList.contains(colorStatus.EMPTY)) {
                this.setcolorStatus(tiles[key], colorStatus.GREY);
            }
        });

        // check if game over
        if (
            tiles.every((tile: WordleTile): boolean =>
                tile.element.classList.contains(colorStatus.GREEN)
            )
        ) {
            this.game.endGame(true);
        }
    }

    private submitRow(): void {
        const row: WordleTileRow = this.getCurrentRow();

        if (row) {
            this.checkTiles(row);
            this.setRowId(+1);
            this.setTileId('reset');
            this.submitButtonComponent.updateSubmitButton();
        }

        if (!this.isGameOver && this.currentRow > Config.NUMBER_OF_GUESSES) {
            this.game.endGame(false);
        }
    }

    private setRowId(value: number | 'reset'): void {
        if (value === 'reset') {
            this.currentRow = 1;
            this._currentRowId.next(1);
            return;
        }

        this.currentRow += value;
        this._currentRowId.next(this.currentRow);
    }

    private setTileId(value: number | 'reset'): void {
        if (value === 'reset') {
            this.currentTile = 1;
            this._currentTileId.next(1);
            return;
        }

        this.currentTile += value;
        this._currentTileId.next(this.currentTile);
    }

    private keyUpHandler($event: KeyboardEvent): void {
        if (this.isGameOver) {
            return;
        }

        const key: string = $event.key.toLocaleLowerCase();

        if (key.match(/^[a-z]$/)) {
            this.type(key);
        }

        if (key === 'backspace') {
            this.backspace();
        }
    }
}
