class Carpet extends THEATRE.Actor {

    _initObject(warderobe) {

        const g = new THREE.PlaneGeometry(2, 1);
        const m = new THREE.MeshPhongMaterial({ map: warderobe.fetchTexture('carpet:top'), shadowSide: THREE.DoubleSide });

        const animation = this._animation = new THEATRE.TransitionCycle();
        animation.add(new THEATRE.ActorTranslation(this, 2000, new THREE.Vector3(10, 0, 0)));
        animation.add(new THEATRE.ActorTranslation(this, 2000, new THREE.Vector3(10, 10, 5)));
        animation.add(new THEATRE.ActorTranslation(this, 2000, new THREE.Vector3(-10, 0, 5)));

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

class Pillar extends THEATRE.Actor {

    _initObject(warderobe) {

        const g = new THREE.BoxGeometry(1, 1, 3);
        const sideMaterial = new THREE.MeshPhongMaterial({ map: warderobe.fetchTexture('pillar:side'), shadowSide: THREE.DoubleSide });
        const topMaterial = new THREE.MeshPhongMaterial({ map: warderobe.fetchTexture('pillar:top'), shadowSide: THREE.DoubleSide });

        const object = new THREE.Mesh(g, [
            sideMaterial,
            sideMaterial,
            sideMaterial,
            sideMaterial,
            topMaterial,
            sideMaterial,
        ]);

        object.receiveShadow = true;
        object.castShadow = true;

        return object;
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
    theatre.warderobe.importTexture('pillar:side', './pillar_side.png', 'pixeart');
    theatre.warderobe.importTexture('pillar:top', './pillar_top.png', 'pixelart');

    const floor = new THEATRE.TiledFloor('tiles:top', { size: 51 * 51 });

    testStage.insert(floor);

    const carpet = new Carpet();

    testStage.insert(carpet);

    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {

            const pillar = new Pillar();

            testStage.insert(pillar);

            pillar.moveTo(x * 10 - 25 + 5, y * 10 - 10 + 5);
        }
    }

    theatre.warderobe.wait().then(() => {

        theatre.transitionTo('test');

        floor.fill(-25, -10, 25, 40);

        console.log(theatre);
    });
});
