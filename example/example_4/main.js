class Carpet extends THEATRE.Actor {

    _path = [];

    _current = 0;

    _currentAnimation = null;


    _initObject(warderobe) {

        const g = new THREE.PlaneGeometry(2, 1);
        const m = new THREE.MeshBasicMaterial({ map: warderobe.fetchTexture('carpet:top') });

        return new THREE.Mesh(g, m);
    }

    renderUpdate(step) {

        if (!this._currentAnimation) return;

        this._currentAnimation.renderUpdate(step);
    }

    cycle(path) {

        this._path = path;

        this._currentAnimation = new THEATRE.ActorTranslation(this, new THREE.Vector3(path[0].x, path[0].y, 0), new THREE.Vector3(path[1].x, path[1].y, 0), 2000);

        this._currentAnimation.start();
    }
};


document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.querySelector('canvas');

    // construct a theatre
    const theatre = new THEATRE.Theatre(canvas);

    const testStage = theatre.createStage('test');
    testStage.setAmbience({
        ambientColor: new THREE.Color( 0xffffff )
    });

    theatre.warderobe.importTexture('carpet:top', './carpet.png', 'pixelart');
    theatre.warderobe.importTexture('tiles:top', './tiles.png', 'pixelart');

    const floor = new THEATRE.TiledFloor('tiles:top', 21 * 21);

    testStage.insert(floor);

    const carpet = new Carpet();

    testStage.insert(carpet);

    carpet.cycle([
        { x: -5, y: 0 },
        { x: 5, y: 0 }
    ]);

    theatre.warderobe.wait().then(() => {

        theatre.transitionTo('test');

        floor.fill(-10, -10, 10, 10);

        console.log(theatre);
    });
});
