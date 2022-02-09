class Crate extends THEATRE.Actor {

    _toggled = false;

    _initObject(warderobe) {

        const g = new THREE.BoxGeometry(1, 1, 1);
        const texturedMaterial = new THREE.MeshPhongMaterial({ map: warderobe.fetchTexture('crate:side') });

        return new THREE.Mesh(g, texturedMaterial);
    }

    toggle() {

        console.log('toggle');

        this._toggled = !this._toggled;

        if (this._toggled) this._object.material.color = new THREE.Color(0xff0000);
        else this._object.material.color = new THREE.Color(0xffffff);
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

    const floor = new THEATRE.TiledFloor('floor:top', 21 * 21);

    testStage.insert(floor);

    const crate_1 = new Crate();
    const crate_2 = new Crate();
    const crate_3 = new Crate();
    const crate_4 = new Crate();

    crate_1.moveTo(1,0);
    crate_2.moveTo(4,4);
    crate_3.moveTo(-2,1);
    crate_4.moveTo(-3,-4);

    testStage.insert(crate_1);
    testStage.insert(crate_2);
    testStage.insert(crate_3);
    testStage.insert(crate_4);

    theatre.warderobe.wait().then(() => {

        theatre.transitionTo('test');

        floor.fill(-10, -10, 10, 10);

        console.log(theatre);
    });

    theatre.on('pick', event => {

        const intersections = event.data.intersections;

        for (let int of intersections) {

            if ('toggle' in int.actor) int.actor.toggle();
        }
    });
});
