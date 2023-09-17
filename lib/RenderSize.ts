export class RenderSize {

    private _width: number;
    private _height: number;

    get width() : number { return this._width; }
    get height() : number { return this._height; }
    get aspectRatio() : number { return this._width / this._height; }

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
    }

    /**
     *  @internal
     */
    adjust(width: number, height: number) {

        this._width = width;
        this._height = height;
    }
};
