# theater.js

theathre.js is a rendering library built on top of three.js. It creates an opinionated
framework for creating scenes, manages actors, lights, camera, and input. This is mostly
useful for my own games and rendering needs.

## How to get started?

```
import { Theatre, Actor, Camera } from "theatre";

const theatre = new Theatre({ 

    camera: TableTopCamera
});

theatre.stage.enterActor(new Actor);
```