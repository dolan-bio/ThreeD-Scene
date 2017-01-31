namespace ThreeDScene {
    export class Main {

        public static scene: THREE.Scene;
        public static camera: THREE.PerspectiveCamera;
        public static renderer: THREE.WebGLRenderer;

        public static setSize(width: number, height: number): void {
            this.renderer.setSize(width, height);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }

        public static run(target: Element): void {
            this.main();
            target.appendChild(this.renderer.domElement);
            const zero = new THREE.Vector3(0, 0, 0);
            const clock = new THREE.Clock();
            const gameLoop = () => {
                this.renderer.render(this.scene, this.camera);
                this.camera.position.x = 248 * Math.cos(0.1 * clock.getElapsedTime());
                this.camera.position.z = 248 * Math.sin(0.1 * clock.getElapsedTime());
                this.camera.lookAt(zero);
                this.renderer.render(this.scene, this.camera);
                window.requestAnimationFrame(gameLoop);
            };
            gameLoop();
        }

        public static tilt(amount: number): void {
            this.camera.position.y = amount;
        }

        public static main(): void {
            const loader = new THREE.JSONLoader();

            this.scene = new THREE.Scene();

            this.renderer = new THREE.WebGLRenderer({
                antialias: true,
            });

            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.setClearColor(0xFFFFFF, 1);

            this.setupCamera();

            const meshCreator = new MeshCreator(loader);
            this.createFloor(this.scene, meshCreator);
            this.createDMObject(this.scene, meshCreator);
            this.createLights(this.scene);
        }

        private static createFloor(scene: THREE.Scene, meshCreator: MeshCreator): void {
            const floorFactory = new FloorFactory(meshCreator);
            floorFactory.newInstance(new THREE.Vector3(0, -375, 0)).then((mesh) => {
                scene.add(mesh);
            });
        }

        private static createDMObject(scene: THREE.Scene, meshCreator: MeshCreator): void {
            const dmFactory = new DMFactory(meshCreator);
            dmFactory.newInstance().then((mesh) => {
                scene.add(mesh);
            });
        }

        private static createLights(scene: THREE.Scene): void {
            const alight = new THREE.AmbientLight(0xffffff, 0.3); // soft white light
            // scene.add(alight);

            const light = new THREE.DirectionalLight(0x7A7A7A);
            light.position.set(-100, 200, 100);
            light.castShadow = true;
            light.shadow.bias = 0.0001;
            // light.shadow.mapSize.width = 4096; // default is 512
            // light.shadow.mapSize.height = 4096; // default is 512
            scene.add(light);
        }

        private static loadMisc(meshCreator: MeshCreator): void {
            this.addListeners(this.renderer, this.camera);
        }

        private static setupCamera(): void {
            this.camera = new THREE.PerspectiveCamera(100);
            this.camera.near = 0.1;
            this.camera.far = 20000;
            this.camera.position.set(0, 66, 248);
            this.scene.add(this.camera);
        }

        private static addListeners(renderer: THREE.Renderer, camera: THREE.PerspectiveCamera): void {
            window.addEventListener("resize", () => {
                const WIDTH = window.innerWidth;
                const HEIGHT = window.innerHeight;

                renderer.setSize(WIDTH, HEIGHT);
                camera.aspect = WIDTH / HEIGHT;
                camera.updateProjectionMatrix();
            });
        }
    }
}
