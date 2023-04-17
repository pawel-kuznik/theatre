class Crate extends THEATRE.Actor {

    _toggled = false;

    _initObject(warderobe) {

        const g = new THREE.BoxGeometry(1, 1, 1);
        const texturedMaterial = new THREE.MeshPhongMaterial({ map: warderobe.fetchTexture('crate:side') });

        return new THREE.Mesh(g, texturedMaterial);
    }

    toggle() {

        this._toggled = !this._toggled;

        if (this._toggled) this._object.material.color = new THREE.Color(0xff0000);
        else this._object.material.color = new THREE.Color(0xffffff);
    }
};

class Pile extends THEATRE.Actor {

    _toggled = false;

    _initObject(warderobe) {

        const object = new THREE.Object3D();

        const g = new THREE.BoxGeometry(1, 1, 1);
        const texturedMaterial = new THREE.MeshPhongMaterial({ map: warderobe.fetchTexture('crate:side') });

        const box1 = new THREE.Mesh(g, texturedMaterial);
        const box2 = new THREE.Mesh(g, texturedMaterial);
        const box3 = new THREE.Mesh(g, texturedMaterial);

        object.add(box1);
        box1.position.x = 1;
        object.add(box2);
        box2.position.x = -.25;
        box2.position.y = 1;
        object.add(box3);

        return object;
    }

    toggle() {

        this._toggled = !this._toggled;

        if (this._toggled) {

            for(let object of this._object.children) object.material.color = new THREE.Color(0xff0000);
        }

        else {

            for(let object of this._object.children) object.material.color = new THREE.Color(0xffffff);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.querySelector('canvas');

    // construct a theatre
    const theatre = new THEATRE.Theatre(canvas, {
        canvas
    });

    const testStage = theatre.createStage('test');
    testStage.setAmbience({
        ambientColor: new THREE.Color( 0xffffff )
    });

    theatre.warderobe.importTexture('crate:side', './crate.png', 'pixelart');
    theatre.warderobe.importTexture('floor:top', './floor.png', 'pixelart');

    const floor = new THEATRE.TiledFloor('floor:top', { size: 21 * 21 });
    floor.fill(-10, -10, 10, 10);

    testStage.insert(floor);

    const crate_1 = new Crate();
    const crate_2 = new Crate();
    const crate_3 = new Crate();
    const crate_4 = new Crate();

    crate_1.moveTo(1,0);
    crate_2.moveTo(4,4);
    crate_3.moveTo(-2,1);
    crate_4.moveTo(-3,-4);

    const pile = new Pile();
    pile.moveTo(-2, -3);

    testStage.insert(pile);
    testStage.insert(crate_1);
    testStage.insert(crate_2);
    testStage.insert(crate_3);
    testStage.insert(crate_4);

    theatre.warderobe.wait().then(() => {

        theatre.transitionTo('test');
    });

    theatre.on('pick', event => {

        const intersections = event.data.intersections;

        for (let int of intersections) {

            if ('toggle' in int.actor) int.actor.toggle();
        }
    });

    theatre.on('hover', event => {

        const f = event.data.first;

        if (!f) return;

        floor.setHighlight([ f.child ]);
    });
});
