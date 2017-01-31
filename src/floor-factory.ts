namespace ThreeDScene {
    export class FloorFactory {
        private meshCreator: MeshCreator;
        private textureLoader: THREE.TextureLoader;

        constructor(meshCreator: MeshCreator) {
            this.meshCreator = meshCreator;
            this.textureLoader = new THREE.TextureLoader();
        }

        public newInstance(meshPosition: THREE.Vector3): Promise<THREE.Mesh> {
            const texture = this.textureLoader.load("assets/models/boxFloor.png");
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.LinearMipMapLinearFilter;

            const material = new THREE.MeshLambertMaterial({
                map: texture,
            });

            return this.meshCreator.createMesh("assets/models/boxfloor.js", material, meshPosition, new THREE.Vector3(50, 50, 50));
        }
    }
}
