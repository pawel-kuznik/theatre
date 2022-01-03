/**
 *  This is a class describing a rendering loop.
 * 
 *  @todo It would be great if this function would be also able to provide FPS counter
 *  and have capabilities to cap rendering at certain speed.
 */
export default class RenderingLoop {

    private _running:boolean = false;

    constructor(private _renderFunction:() => void) {

    }

    /**
     *  Start the rendering loop.
     */
    public start() {

        this._running = true;

        const step = () => {

            if (!this._running) return;

            this._renderFunction();

            window.requestAnimationFrame(step);
        };

        step();
    }

    /**
     *  Stop the rendering loop.
     */
    public stop() {

        this._running = false;
    }
};