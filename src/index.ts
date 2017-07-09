import * as THREE from "three";

import { DMFactory } from "./dm-factory";
import { FloorFactory } from "./floor-factory";
import { MeshCreator } from "./mesh-creator";

export class Stage {

    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;

    constructor() {
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
        });

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0xFFFFFF, 1);

        const loader = new THREE.JSONLoader();
        this.addObjectsToScene(loader);
    }

    public setSize(width: number, height: number): void {
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    public run(target: Element): void {
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
        this.addListeners(this.renderer, this.camera);
    }

    public tilt(amount: number): void {
        this.camera.position.y = amount;
    }

    private addObjectsToScene(loader: THREE.JSONLoader): void {
        this.createCamera(this.scene);

        const meshCreator = new MeshCreator(loader);
        this.createFloor(this.scene, meshCreator);
        this.createDMObject(this.scene, meshCreator);
        this.createLights(this.scene);
    }

    private createFloor(scene: THREE.Scene, meshCreator: MeshCreator): void {
        const floorFactory = new FloorFactory(meshCreator);
        floorFactory.newInstance(new THREE.Vector3(0, -375, 0)).then((mesh) => {
            scene.add(mesh);
        });
    }

    private createDMObject(scene: THREE.Scene, meshCreator: MeshCreator): void {
        const dmFactory = new DMFactory(meshCreator);
        dmFactory.newInstance().then((mesh) => {
            scene.add(mesh);
        });
    }

    private createLights(scene: THREE.Scene): void {
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

    private createCamera(scene: THREE.Scene): void {
        this.camera = new THREE.PerspectiveCamera(100);
        this.camera.near = 0.1;
        this.camera.far = 20000;
        this.camera.position.set(0, 66, 248);
        scene.add(this.camera);
    }

    private addListeners(renderer: THREE.Renderer, camera: THREE.PerspectiveCamera): void {
        window.addEventListener("resize", () => {
            const WIDTH = window.innerWidth;
            const HEIGHT = window.innerHeight;

            renderer.setSize(WIDTH, HEIGHT);
            camera.aspect = WIDTH / HEIGHT;
            camera.updateProjectionMatrix();
        });
    }
}
