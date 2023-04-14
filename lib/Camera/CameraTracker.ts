import { Emitter } from "@pawel-kuznik/iventy";
import { Vector3 } from "three";

/**
 *  This is a class that allows tracking a camera movement. It's useful for
 *  telling the client application that camera moved into specific area of
 *  game.
 */
export class CameraTracker extends Emitter {

    private _lastChunkX: number = 0;
    private _lastChunkY: number = 0;
    private _lastChunkZ: number = 0;

    private _stepX: number = 1;
    private _stepY: number = 1;
    private _stepZ: number = 1;

    constructor(stepX: number, stepY: number, stepZ: number) {
        super();
        this._stepX = stepX;
        this._stepY = stepY;
        this._stepZ = stepZ;
    }

    /**
     *  Tell the tracker about a new position of a camera.
     *  This needs to be called from the camera that moves.
     */
    notify(position: Vector3) {

        const currentChunkX = Math.floor(position.x / this._stepX);
        const currentChunkY = Math.floor(position.y / this._stepY);
        const currentChunkZ = Math.floor(position.z / this._stepZ);

        const changeX = this._lastChunkX - currentChunkX;
        const changeY = this._lastChunkY - currentChunkY;
        const changeZ = this._lastChunkZ - currentChunkZ;

        this._lastChunkX = currentChunkX;
        this._lastChunkY = currentChunkY;
        this._lastChunkZ = currentChunkZ;

        if (changeX == 0 || changeY == 0 || changeZ == 0) return;
        
        this.deferredTrigger('chunk-moved', {
            changeX,
            changeY,
            changeZ,
            chunkX: currentChunkX,
            chunkY: currentChunkY,
            chunkZ: currentChunkZ,
            posX: position.x,
            posY: position.y,
            posZ: position.z,    
        });
    }
};