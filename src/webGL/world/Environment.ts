import * as THREE from "three";
import WebglExperience from "..";
import DebugUI from "../utils/DebugUI";

export default class Environment {
    scene: THREE.Scene;
    sunLight!: THREE.DirectionalLight;
    pointLight!: THREE.PointLight;
    debugUI: DebugUI;
    constructor(experience: WebglExperience) {
        this.scene = experience.scene;
        this.debugUI = experience.debugUI;

        this.init();

    }

    init() {
        this.addLights();
        this.addDebugUi();
    }

    addLights() {
        // ambient Light
        const ambientLight = new THREE.AmbientLight(0xfdfbd3, 1)

        // Sun light
        this.sunLight = new THREE.DirectionalLight(0xfdfbd3, 2.0);
        this.sunLight.position.set(184.914, 254.953, -75.373);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.set(1024, 1024);
        this.sunLight.shadow.camera.left = -100;
        this.sunLight.shadow.camera.right = 100;
        this.sunLight.shadow.camera.top = 100;
        this.sunLight.shadow.camera.bottom = -100;


        this.pointLight = new THREE.PointLight(0xfdfbd3, 2);
        this.pointLight.castShadow = true;
        this.pointLight.position.set(48.66, 16, -139.16);

        this.pointLight.shadow.camera.near = 0.5;
        this.pointLight.shadow.camera.far = 200;
        this.pointLight.shadow.camera.fov = 45;



        // helper- sunlight
        const sunLightHelper = new THREE.DirectionalLightHelper(this.sunLight, 20);
        const sunLightShadowHelper = new THREE.CameraHelper(this.sunLight.shadow.camera);

        // helper pointLight
        const pointLightHelper = new THREE.PointLightHelper(this.pointLight);
        const pointLightShadowHelper = new THREE.CameraHelper(this.pointLight.shadow.camera);


        this.scene.add(ambientLight, this.sunLight);
        // this.scene.add(sunLightHelper, sunLightShadowHelper);
    }

    updateSunLightTarget(child: THREE.Object3D) {
        this.sunLight.target = child;
    }

    addDebugUi() {
        if (this.debugUI.isActive) {
            const lightParams = {
                sunLightPosition: { x: this.sunLight.position.x, y: this.sunLight.position.y, z: this.sunLight.position.z },
                pointLightPosition: { x: this.pointLight.position.x, y: this.pointLight.position.y, z: this.pointLight.position.z },
            }

            const lightFolder = this.debugUI.ui!.addFolder({ title: "Lights", expanded: true });

            lightFolder.addInput(lightParams, "sunLightPosition").on("change", () => {
                this.sunLight.position.x = lightParams.sunLightPosition.x
                this.sunLight.position.y = lightParams.sunLightPosition.y
                this.sunLight.position.z = lightParams.sunLightPosition.z
            })
            lightFolder.addInput(lightParams, "pointLightPosition").on("change", () => {
                this.pointLight.position.x = lightParams.pointLightPosition.x
                this.pointLight.position.y = lightParams.pointLightPosition.y
                this.pointLight.position.z = lightParams.pointLightPosition.z
            })
        }

    }

    update() {

    }

    dispose() {

    }
}