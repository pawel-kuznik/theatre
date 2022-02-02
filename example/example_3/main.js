class Crate extends THEATRE.Actor {

    _initObject(warderobe) {

        const g = new THREE.BoxGeometry(1, 1, 1);
        const texturedMaterial = new THREE.MeshPhongMaterial({ map: warderobe.fetchTexture('crate:side') });

        return new THREE.Mesh(g, texturedMaterial);
    }
};

class Brazier extends THEATRE.Actor {

    _flameMaterial_1;

    constructor() {

        super();

        this.moveTo(1,-1);
    }

    _initObject(warderobe) {

        const main = new THREE.Object3D();

        const baseGeo = new THREE.BoxGeometry(1, 1, .5);
        const baseMaterial = new THREE.MeshPhongMaterial({ map: warderobe.fetchTexture('brazier:side') });
        const topMaterial = new THREE.MeshPhongMaterial({ map: warderobe.fetchTexture('brazier:top') });

        const base = new THREE.Mesh(baseGeo, [
            baseMaterial,
            baseMaterial,
            baseMaterial,
            baseMaterial,
            topMaterial,
            baseMaterial
        ]);

        const bit = 1 / 32;

        const flameGeo = new THREE.BoxGeometry(1 - 2 * bit, 1 - 2 * bit, .5);
        const flameMaterial = this._flameMaterial_1 = new THREE.MeshPhongMaterial({ map: warderobe.fetchTexture('brazier:flame_1'), transparent: true });
        this._flameMaterial_2 = new THREE.MeshPhongMaterial({ map: warderobe.fetchTexture('brazier:flame_2'), transparent: true });

        const flame = this._flame = new THREE.Mesh(flameGeo, [
            flameMaterial,
            flameMaterial,
            flameMaterial,
            flameMaterial,
            null,
            null
        ]);

        flame.position.z = .5;
        
        main.add(base);
        main.add(flame);

        return main;
    }

    renderUpdate(step) {

        const sek = Number.parseInt(step.now / 1000 % 2) + 1;

        if (sek === 1 && this._flame.material === this._flameMaterial_2) {

            this._flame.material = this._flameMaterial_1;
            this._flame.material.needsUpdate = true;
        } 

        if (sek === 2 && this._flame.material === this._flameMaterial_1) {

            this._flame.material = this._flameMaterial_2;
            this._flame.material.needsUpdate = true;
        }

    }
};

document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.querySelector('canvas');

    // construct a theatre
    const theatre = new THEATRE.Theatre(canvas);

    const mainStage = theatre.createStage('main');
    mainStage.setAmbience({
        ambientColor: new THREE.Color( 0xffffff )
    });

    mainStage.insert(new Crate());
    mainStage.insert(new Brazier());

    theatre.warderobe.importTexture('crate:side', './crate.png');
    theatre.warderobe.importTexture('brazier:side', './brazier.png');
    theatre.warderobe.importTexture('brazier:top', './brazier_top.png');
    theatre.warderobe.importTexture('brazier:flame_1', './brazier_flame_1.png');

    theatre.warderobe.wait().then(() => {



        theatre.transitionTo('main');

        console.log(theatre);
    });
});
