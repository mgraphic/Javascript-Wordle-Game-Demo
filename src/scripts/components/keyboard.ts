import { Config } from '../config';
import { Game } from '../game';
import {
    colorStatus,
    KeyboardKey,
    KeyboardLayout,
    KeyboardLayoutRow,
} from '../model';
import * as Utils from '../utils';
import { ComponentInterface, OnDraw } from './interface';
import { TileboardComponent } from './tileboard';

export class KeyboardComponent implements ComponentInterface, OnDraw {
    private tileboardComponent: TileboardComponent;
    private keyboard: KeyboardLayout;
    private isGameOver: boolean;

    // PUBLIC METHODS:
    constructor(private game: Game, private parentElement: HTMLElement) {}

    draw(): void {
        const container: HTMLElement = Utils.drawSegment(
            'keyboard-container',
            this.parentElement
        );
        const rows: KeyboardLayoutRow[] = [];

        Config.KEYBOARD_LAYOUT.forEach((rowLayout: string): void => {
            const rowContainer: HTMLElement = Utils.drawSegment(
                'keyboard-row',
                container
            );
            const keyChars: string[] = Array.from(rowLayout);
            const keys: KeyboardKey[] = [];

            keyChars.forEach((char: string): void => {
                const classNames: string[] = ['keyboard-key'];

                if (char === Config.CHARACTER_BACKSPACE) {
                    classNames.push('backspace');
                }

                const keyContainer: HTMLButtonElement = Utils.drawSegment(
                    classNames,
                    rowContainer
                ) as HTMLButtonElement;
                keyContainer.innerHTML = char;

                const key: KeyboardKey = {
                    element: keyContainer,
                    value: char,
                    status: colorStatus.EMPTY,
                };

                keyContainer.addEventListener('click', () =>
                    this.typewriter(key)
                );

                keys.push(key);
            });

            rows.push({
                element: rowContainer,
                keys,
            });
        });

        this.keyboard = {
            element: container,
            rows,
        };
    }

    reset(): void {
        this.parentElement
            .querySelectorAll('.keyboard-container')
            .forEach((element: Element): void => {
                this.parentElement.removeChild(element);
            });
    }

    init(): void {
        this.game.gameOver.subscribe((isGameOver: boolean): void => {
            this.isGameOver = isGameOver;
        });

        this.tileboardComponent = this.game.getComponent('tileboard');

        document.body.addEventListener('keyup', this.keyUpHandler.bind(this));
    }

    public setcolorStatus(char: string, status: colorStatus): void {
        const key = this.getKeyFromChar(char);

        if (Utils.compareColorStatus(status, key.status) > 0) {
            key.element.classList.add(status);
        }
    }

    // PRIVATE METHODS:
    private getKeyFromChar(char: string): KeyboardKey {
        const keys: KeyboardKey[] = this.keyboard.rows.flatMap(
            (row: KeyboardLayoutRow): KeyboardKey[] => row.keys
        );

        return keys.find((key: KeyboardKey): boolean => key.value === char);
    }

    private typewriter(key: KeyboardKey): void {
        const char: string = key.value.toLocaleLowerCase();

        if (char === Config.CHARACTER_BACKSPACE) {
            this.tileboardComponent.backspace();
            this.activeKeyPress('backspace');
            return;
        }

        this.tileboardComponent.type(char);
        this.activeKeyPress(char);
    }

    private activeKeyPress(char: string): void {
        const activeKey: KeyboardKey = this.getKeyFromChar(
            char === 'backspace' ? Config.CHARACTER_BACKSPACE : char
        );
        activeKey.element.classList.add('active');

        setTimeout((): void => {
            activeKey.element.classList.remove('active');
        }, 200);
    }

    private keyUpHandler($event: KeyboardEvent): void {
        if (this.isGameOver) {
            return;
        }

        const key: string = $event.key.toLocaleLowerCase();

        if (key === 'backspace' || key.match(/^[a-z]$/)) {
            this.activeKeyPress(key);
        }
    }
}
