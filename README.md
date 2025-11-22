# theatre.js

theatre.js is a rendering library built on top of three.js. It creates an opinionated
scaffolding for scenes, actors, lights, camera, and input. The library is meant for
my own games.

## How to get started?

main.js
```
import { Theatre, Actor, Camera } from "theatre";
import { CompanionActor } from "./CompanionActor";

// the library renders inside a <canvas> element
const canvasElement = document.querySelector('canvas');

// create a theatre inside the canvas
const theatre = new Theatre(canvasElement);

// the theatre supports multiple rendering scenes (called stages).
const mainStage = theatre.createStage('main');

// set the lights on the stage
mainStage.setAmbience({
    ambientColor: 0xffffff
});

// create a companion, so it's not so lonely in the scene
const companion = new CompanionActor();

// insert the companion into the stage
mainStage.insert(companion);
```

CompanionActor.js
```
import { BoxGeometry, MeshBasicMaterial } from "three";
import { Actor } from "theatre";

export class CompanionActor extends Actor {

    _initObject() {

        const geometry = new BoxGeometry(1, 1, 1);
        const material = new MeshBasicMaterial({ color: 0xff00ff });

        return new Mesh(geometry, material);
    }
};
```

The above code will setup a simple scene with a companion box. It's not much, but it illustrates
how to setup the theatre and stage for more action. More examples can be found in the example
directory.

## Running development environment

The development of this library is somewhat unusual. This library mostly manipulates objects
inside a WebGL context, and cause of this, it doesn't lend itself to unit testing very well.
In fact, most of the development is to write some code and then visually inspect the results
based on the ready examples. Not the best practice, but for now it's the way.

To run the examples server run

```
npm run example-server
```

To rebuilt the examples (and run them initially) run. This command needs to be ran with
every change to inspect.

```
npm run example
```