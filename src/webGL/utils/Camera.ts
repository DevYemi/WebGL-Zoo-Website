import * as THREE from "three";
import WebglExperience from "..";
import Time from "./Time";
import Sizes from "./Sizes";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import DebugUI from "./DebugUI";
export default class Camera {
    perspective: THREE.PerspectiveCamera;
    orbitCamera: THREE.PerspectiveCamera;
    canvas: HTMLCanvasElement;
    scene: THREE.Scene;
    time: Time;
    sizes: Sizes;
    orbitControls!: OrbitControls;
    debugUI: DebugUI;
    constructor(experience: WebglExperience) {
        this.scene = experience.scene;
        this.time = experience.time;
        this.sizes = experience.sizes;
        this.canvas = experience.canvas;
        this.debugUI = experience.debugUI;
        this.perspective = new THREE.PerspectiveCamera(75, this.sizes.aspectRatio, 0.1, 20000);
        this.orbitCamera = new THREE.PerspectiveCamera(75, this.sizes.aspectRatio, 0.1, 20000);


        this.perspective.position.set(0, 0.2, 2);
        this.orbitCamera.position.set(0, 0.2, 2)

        this.scene.add(this.perspective, this.orbitCamera);

        this.setUpOrbitControls();
        // this.addDebugUI();
    }

    setUpOrbitControls() {
        this.orbitControls = new OrbitControls(this.perspective, this.canvas);

        this.orbitControls.enableDamping = true;
    }

    addDebugUI() {
        if (this.debugUI.isActive) {
            const cameraParams = {
                position: { x: this.perspective.position.x, y: this.perspective.position.y, z: this.perspective.position.z }
            }

            const cameraFolder = this.debugUI.ui!.addFolder({ title: "Camera", expanded: true });
        }

    }

    update() {
        if (this.orbitControls) this.orbitControls.update();
    }

    resize() {
        // Update perspective Camera
        this.perspective.aspect = this.sizes.aspectRatio
        this.perspective.updateProjectionMatrix();

        // Update orbit Camera
        this.orbitCamera.aspect = this.sizes.aspectRatio
        this.orbitCamera.updateProjectionMatrix();
    }

    dispose() {
        if (this.orbitControls) this.orbitControls.dispose()
    }
}