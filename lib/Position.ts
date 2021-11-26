import { Vector3 } from "three";

/**
 *  This is our special class to wrap around a vector that describes a position of 
 *  a specific actor on the stage. We use this to conceptualize some of our ideas
 *  and have a quick access to our domain logic over the native vector data.
 */
export default class Position {

    /**
     *  The actual vector.
     */
    private readonly _vector:Vector3;

    constructor(vector:Vector3) {

        this._vector = vector;
    }

    /**
     *  Get the vector of the position.
     */
    get vector() : Vector3 { return this._vector; }

    /**
     *  The coordinates for easy access.
     */
    get x() : number { return this._vector.x; }
    get y() : number { return this._vector.y; }
    get z() : number { return this._vector.z; }

    /**
     *  And for the convinience, the height at wich the position is.
     */
    get height() : number { return this.z; }
};