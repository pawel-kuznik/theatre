class Carpet extends THEATRE.Actor {

    _initObject(warderobe) {

        const g = new THREE.PlaneGeometry(2, 1);
        const m = new THREE.MeshPhongMaterial({ map: warderobe.fetchTexture('carpet:top'), shadowSide: THREE.DoubleSide });

        const animation = this._animation = new THEATRE.TransitionCycle();
        animation.add(new THEATRE.ActorTranslation(this, 1000, new THREE.Vector3(5, 0, 0)));
        animation.add(new THEATRE.ActorTranslation(this, 1000, new THREE.Vector3(5, 5, 1)));
        animation.add(new THEATRE.ActorTranslation(this, 1000, new THREE.Vector3(-5, 0, 1)));

        animation.start();

        const object = new THREE.Mesh(g, m);

        object.castShadow = true;

        return object;
    }

    renderUpdate(step) {

        if (!this._animation) return;

        this._animation.renderUpdate(step);
    }
};

document.addEventListener('DOMContentLoaded', () => {

    // construct a theatre
    const theatre = new THEATRE.Theatre(document.body);

    const testStage = theatre.createStage('test');
    testStage.setAmbience({
        ambientColor: new THREE.Color( 0xffffff )
    });

    theatre.warderobe.importTexture('carpet:top', './carpet.png', 'pixelart');
    theatre.warderobe.importTexture('tiles:top', './tiles.png', 'pixelart');

    const floor = new THEATRE.TiledFloor('tiles:top', { size: 21 * 21 });

    testStage.insert(floor);

    const carpet = new Carpet();

    testStage.insert(carpet);

    theatre.warderobe.wait().then(() => {

        theatre.transitionTo('test');

        floor.fill(-10, -10, 10, 10);
    });
});
