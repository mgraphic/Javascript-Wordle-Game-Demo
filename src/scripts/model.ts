export enum colorStatus {
    EMPTY = 'empty',
    GREY = 'gray',
    YELLOW = 'yellow',
    GREEN = 'green',
}

export type WordleTile = {
    id: number;
    element: HTMLElement;
    status: colorStatus;
    value: string;
};

export type WordleTileRow = {
    id: number;
    element: HTMLElement;
    tiles: WordleTile[];
};

export type KeyboardKey = {
    element: HTMLButtonElement;
    value: string;
    status: colorStatus;
};

export type KeyboardLayoutRow = {
    element: HTMLElement;
    keys: KeyboardKey[];
};

export type KeyboardLayout = {
    element: HTMLElement;
    rows: KeyboardLayoutRow[];
};
