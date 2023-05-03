import * as THREE from "three";
import WebglExperience from "..";
import Sizes from "./Sizes";
export default class Camera {
    renderer!: THREE.WebGLRenderer;
    canvas: HTMLCanvasElement;
    scene: THREE.Scene;
    sizes: Sizes;
    camera: THREE.PerspectiveCamera;
    constructor(experience: WebglExperience) {
        this.canvas = experience.canvas;
        this.scene = experience.scene;
        this.sizes = experience.sizes;
        this.camera = experience.camera.perspective;

        this.init();

    }

    init() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.renderer.shadowMap.enabled = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setClearColor(new THREE.Color("black"))
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }


    update() {
        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        // Update renderer
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    dispose() {
        this.renderer.dispose();
    }
}