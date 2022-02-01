import Camera from "../Camera";

/**
 *  An extended version of camera interface for cameras that are freefloating
 *  and are not bound to anything. These cameras are able to move to or by
 *  specific coordinates.
 */
export default interface FreefloatCamera extends Camera {

    /**
     *  The coordinates of the camera.
     */
    get x() : number;
    get y() : number;

    /**
     *  Move the camera by certain x and y values.
     */
    moveBy(x:number, y:number) : void;

    /** 
     *  Move camera to a certain x and y values.
     */
    moveTo(x:number, y:number) : void;
};