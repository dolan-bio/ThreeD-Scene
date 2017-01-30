namespace ThreeDScene {
    export class MeshCreator {

        constructor(private loader: THREE.JSONLoader) {
        }

        public createMesh(modelPath: string, material: THREE.Material, position: THREE.Vector3, scale: THREE.Vector3, callback: (mesh: THREE.Mesh) => void): void {
            this.loader.load(modelPath, (geometry: THREE.Geometry) => {
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(position.x, position.y, position.z);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.scale.set(scale.x, scale.y, scale.z);
                callback(mesh);
            });
        }
    }
}
