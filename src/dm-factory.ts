namespace ThreeDScene {
    export class DMFactory {
        private scene: THREE.Scene;
        private loader: THREE.JSONLoader;
        private textureLoader: THREE.TextureLoader;

        constructor(scene: THREE.Scene, loader: THREE.JSONLoader) {
            this.scene = scene;
            this.loader = loader;
            this.textureLoader = new THREE.TextureLoader();
        }

        public newInstance(): Promise<THREE.Mesh> {
            const texture = this.textureLoader.load("assets/models/baked.png");
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.LinearMipMapLinearFilter;

            const material = new THREE.MeshLambertMaterial({
                map: texture,
            });

            const meshCreator = new MeshCreator(this.loader);

            return meshCreator.createMesh("assets/models/dm.js", material, new THREE.Vector3(0, 0, 0), new THREE.Vector3(50, 50, 50));
        }
    }
}
