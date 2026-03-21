import ActorIntersection from "../ActorIntersection";

/**
 *  A payload that is emitted when a pick event occurs. This usually is emitted
 *  from a camera picker when use points at a specific point in the scene. It could
 *  be triggered by a mouse click, hover, or touch event.
 */
export interface PickEventPayload {
    /**
     * All intersections that were found during the pick operation.
     */
    intersections: ActorIntersection[];

    /**
     * The first intersection that was found during the pick operation.
     */
    first: ActorIntersection;

    /**
     * The screen X coordinate of the pick event.
     */
    screenX: number;

    /**
     * The screen Y coordinate of the pick event.
     */
    screenY: number;

    /**
     * The offset X coordinate of the pick event.
     */
    offsetX: number;

    /**
     * The offset Y coordinate of the pick event.
     */
    offsetY: number;
}