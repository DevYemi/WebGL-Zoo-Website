import * as THREE from "three";
import WebglExperience from "..";
import Time from "./Time";
import Sizes from "./Sizes";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import DebugUI from "./DebugUI";
export default class Camera {
    perspective: THREE.PerspectiveCamera;
    orbitCamera: THREE.PerspectiveCamera;
    orthographic: THREE.OrthographicCamera;
    frustumSize: number;
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
        this.frustumSize = 5;
        this.orthographic = new THREE.OrthographicCamera(
            this.sizes.aspectRatio * this.frustumSize / -2,
            this.sizes.aspectRatio * this.frustumSize / 2,
            this.sizes.aspectRatio * this.frustumSize / 2,
            this.sizes.aspectRatio * this.frustumSize / -2,
            -100,
            4000
        )




        const cameraHelper = new THREE.CameraHelper(this.perspective);


        this.perspective.position.set(0, 0.2, 2)
        // this.perspective.position.set(-800, -80, 800);
        this.orbitCamera.position.set(0, 0.2, 2)

        this.scene.add(this.perspective, this.orbitCamera);
        // this.scene.add(cameraHelper)

        this.setUpOrbitControls();
        this.addDebugUI();
    }

    setUpOrbitControls() {
        this.orbitControls = new OrbitControls(this.orbitCamera, this.canvas);

        this.orbitControls.enableDamping = true;
    }

    addDebugUI() {
        if (this.debugUI.isActive) {
            const cameraParams = {
                position: { x: this.perspective.position.x, y: this.perspective.position.y, z: this.perspective.position.z }
            }

            const cameraFolder = this.debugUI.ui!.addFolder({ title: "Camera", expanded: true });

            cameraFolder.addInput(cameraParams, "position").on('change', () => {
                this.perspective.position.x = cameraParams.position.x;
                this.perspective.position.y = cameraParams.position.y;
                this.perspective.position.z = cameraParams.position.z;
            })
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

        // update orthographic camera
        this.orthographic.left = this.sizes.aspectRatio * this.frustumSize / -2;
        this.orthographic.right = this.sizes.aspectRatio * this.frustumSize / 2;
        this.orthographic.top = this.sizes.aspectRatio * this.frustumSize / 2;
        this.orthographic.bottom = this.sizes.aspectRatio * this.frustumSize / -2;
        this.orthographic.updateProjectionMatrix()
    }

    dispose() {
        if (this.orbitControls) this.orbitControls.dispose()
    }
}