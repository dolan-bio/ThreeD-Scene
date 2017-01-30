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
            (function gameloop() {
                ThreeDScene.Main.renderer.render(ThreeDScene.Main.scene, ThreeDScene.Main.camera);
                // this.renderer.render(ThreeDScene.Main.scene, ThreeDScene.Main.camera);

                ThreeDScene.Main.camera.position.x = 248 * Math.cos(0.1 * clock.getElapsedTime());
                ThreeDScene.Main.camera.position.z = 248 * Math.sin(0.1 * clock.getElapsedTime());
                ThreeDScene.Main.camera.lookAt(zero);
                ThreeDScene.Main.renderer.render(ThreeDScene.Main.scene, ThreeDScene.Main.camera);

                window.requestAnimationFrame(gameloop);
            })();
        }

        public static setTiltLimits(lower: number, upper: number) {

        }

        public static tilt(amount: number) {
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
            Main.createFloor(this.scene, meshCreator);
            Main.createDMObject(this.scene, loader);
            Main.createLights(this.scene);
        }

        private static objects: THREE.Object3D[];

        private static createFloor(scene: THREE.Scene, meshCreator: MeshCreator): void {
            const floorFactory = new FloorFactory(meshCreator);
            floorFactory.newInstance(new THREE.Vector3(0, -375, 0), mesh => {
                scene.add(mesh);
                this.objects = new Array<THREE.Object3D>();
                Main.objects.push(mesh);
            });
        }

        private static createDMObject(scene: THREE.Scene, loader: THREE.JSONLoader): void {
            const dmFactory = new DMFactory(scene, loader);
            dmFactory.newInstance();
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

        private static initSky(): void {
            const sphereGeometry = new THREE.SphereGeometry(3000, 60, 40);
            const uniforms = {
                texture: {
                    type: 't',
                    value: THREE.ImageUtils.loadTexture('images/highres.jpg')
                },
            };

            const material = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: document.getElementById('sky-vertex').textContent,
                fragmentShader: document.getElementById('sky-fragment').textContent,
            });

            const skyBox = new THREE.Mesh(sphereGeometry, material);
            skyBox.scale.set(-1, 1, 1);
            skyBox.rotation.order = "XYZ";
            this.scene.add(skyBox);
        }

        private static loadMisc(meshCreator: MeshCreator): void {
            Main.addListeners(this.renderer, this.camera);
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