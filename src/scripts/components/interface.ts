export interface ComponentInterface {
    init(): void;

    reset(): void;
}

export interface OnDraw {
    draw(): void;
}

export interface OnSubmit {
    submit(): void;
}
