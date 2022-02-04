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

        base.position.z = -.25;

        const bit = 1 / 32;

        const flameGeo = new THREE.PlaneGeometry(1 - 2 * bit, .5);
        const flameMaterial = warderobe.fetchMaterial('brazier:flame');

        const flame = this._flame = new THREE.Mesh(flameGeo, flameMaterial);

        console.log(flame);

        flame.position.z = .25;
        flame.rotateX(Math.PI / 2);
        flame.rotateY(Math.PI / 4);
        
        
        main.add(base);
        main.add(flame);

        return main;
    }

    renderUpdate(step) {

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

    theatre.warderobe.importTexture('crate:side', './crate.png', 'pixelart');
    theatre.warderobe.importTexture('brazier:side', './brazier.png', 'pixelart');
    theatre.warderobe.importTexture('brazier:top', './brazier_top.png', 'pixelart');
    theatre.warderobe.importTexture('brazier:flame', './brazier_flame.png', 'pixelart').then((texture) => {

        const material = theatre.warderobe.registerMaterial('brazier:flame', new THREE.MeshBasicMaterial({
            transparent: true,
            map:texture,
            side: THREE.DoubleSide
        }));

        theatre.warderobe.registerTextureAnimator('brazier:flame');
    });

    theatre.warderobe.wait().then(() => {



        theatre.transitionTo('main');

        console.log(theatre);
    });
});
