import { RenderStep } from "./RenderStep";

/**
 *  This is a class describing a rendering loop.
 */
export default class RenderingLoop {

    private _running:boolean = false;
    private _fps: number = 0;

    private _fpsInterval: number;

    get fps() : number { return this._fps; }

    get runnig() : boolean { return this._running; }

    constructor(private _renderFunction:(step:RenderStep) => void) {

        this._fpsInterval = setInterval(() => {
            this._fps = 0;
        });
    }

    /**
     *  Start the rendering loop.
     */
    public start() {

        this._running = true;

        let last:DOMHighResTimeStamp = performance.now();

        const step = (time:DOMHighResTimeStamp) => {

            if (!this._running) return;

            const renderStep = new RenderStep(last, time);

            last = time;

            this._renderFunction(renderStep);

            this._fps++;

            window.requestAnimationFrame(step);
        };

        step(last);
    }

    /**
     *  Stop the rendering loop.
     */
    public stop() {

        this._running = false;
    }

    /**
     *  Dispose the object and prepare it for garbage collection.
     */
    public dispose() {

        this.stop();

        clearInterval(this._fpsInterval);
    }
};
