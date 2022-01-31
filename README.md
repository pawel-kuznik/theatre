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

## Running development environment

The development of this library is somewhat unusual. This library mostly manipulates objects
inside a WebGL context, and cause of this, it doesn't lend itself to unit testing very well.
In fact, most of the development is to write some code and then visually inspect the results
based on the ready examples. Not the best practice, but for now it's the way.

To run the examples server run

```
npm run example-server
```

To rebuilt the examoples (and run them initially) run. This command needs to be ran with
every change to inspect.

```
npm run example
```