import wordleList from '../../public/wordle-list.json';

export class Config {
    // Words List:
    public static GAME_WORDS_LIST: string[] = wordleList.slice(0, 2315);
    public static VALID_WORDS_LIST: string[] = wordleList.slice(2315);

    // Game Settings:
    public static NUMBER_OF_GUESSES: number = 6;
    public static BUTTON_TEXT_SUBMIT: string = 'Submit';
    public static BUTTON_TEXT_NOT_A_WORD: string = 'Not a word';
    public static BUTTON_TEXT_NEW_GAME: string = 'Start New Game';

    // Keyboard Layout:
    public static CHARACTER_BACKSPACE: string = '\u232B';
    public static KEYBOARD_LAYOUT: string[] = [
        'qwertyuiop',
        'asdfghjkl',
        `zxcvbnm${this.CHARACTER_BACKSPACE}`,
    ];
}
