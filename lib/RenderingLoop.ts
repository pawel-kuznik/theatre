import { RenderStep } from "./RenderStep";

/**
 *  This is a class describing a rendering loop.
 * 
 *  @todo It would be great if this function would be also able to provide FPS counter
 *  and have capabilities to cap rendering at certain speed.
 */
export default class RenderingLoop {

    private _running:boolean = false;

    constructor(private _renderFunction:(step:RenderStep) => void) {

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
};