import * as THREE from "three";

import { MeshCreator } from "./mesh-creator";

export class DMFactory {
    private textureLoader: THREE.TextureLoader;

    constructor(private meshCreator: MeshCreator) {
        this.textureLoader = new THREE.TextureLoader();
    }

    public newInstance(): Promise<THREE.Mesh> {
        const texture = this.textureLoader.load("./assets/models/baked.png");
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;

        const material = new THREE.MeshLambertMaterial({
            map: texture,
        });

        return this.meshCreator.createMesh("./assets/models/dm.js", material, new THREE.Vector3(0, 0, 0), new THREE.Vector3(50, 50, 50));
    }
}
