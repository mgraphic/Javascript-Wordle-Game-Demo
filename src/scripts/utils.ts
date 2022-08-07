import { Config } from './config';
import { colorStatus } from './model';

export function drawSegment(
    className: string | string[],
    parentElement: HTMLElement,
    elementType: 'div' | 'button' = 'div'
): HTMLElement {
    const newElement: HTMLElement = document.createElement(elementType);

    if (typeof className === 'string') {
        className = [className];
    }

    newElement.classList.add(...className);

    parentElement.appendChild(newElement);

    return newElement;
}

export function getRandomPlayWord(): string {
    return Config.GAME_WORDS_LIST[
        Math.floor(Math.random() * Config.GAME_WORDS_LIST.length)
    ];
}

export function isValidWord(word: string): boolean {
    if (Config.GAME_WORDS_LIST.includes(word)) {
        return true;
    }

    return Config.VALID_WORDS_LIST.includes(word);
}

export function compareColorStatus(
    statusA: colorStatus,
    statusB: colorStatus
): number {
    const scores: { [key: string]: number } = {
        [colorStatus.EMPTY]: 0,
        [colorStatus.GREY]: 1,
        [colorStatus.YELLOW]: 2,
        [colorStatus.GREEN]: 3,
    };

    return indexedDB.cmp(scores[statusA], scores[statusB]);
}
