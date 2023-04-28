import WebglExperience, { TimeTypes } from ".";
import * as THREE from "three";


interface viewType {
    spherical: {
        value: THREE.Spherical,
        smoothed: THREE.Spherical,
        smoothing: number,
    },
    mouseCursor: {
        delta: THREE.Vector2,
        previous: THREE.Vector2,
        sensitivity: number
    },
    onMouseMove: (e: MouseEvent) => void,

}

export default class Navigation {
    experience: WebglExperience;
    view!: viewType;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    time: TimeTypes;
    target!: THREE.Object3D<THREE.Event>;
    constructor(experience: WebglExperience) {
        this.experience = experience;
        this.camera = experience.camera;
        this.scene = experience.scene;
        this.time = experience.time;

        // console.log(experience.animals.models)
    }

    init() {
        const spherical = new THREE.Spherical(2.8, Math.PI * 0.5, 0);
        this.view = {
            spherical: {
                value: spherical.clone(),
                smoothed: spherical.clone(),
                smoothing: 0.001
            },
            mouseCursor: {
                delta: new THREE.Vector2(0),
                previous: new THREE.Vector2(0),
                sensitivity: 1
            },
            onMouseMove(e) {
                // get mouse coordinate relative to window size (0-1);
                let x = e.clientX / window.innerWidth;
                let y = e.clientY / window.innerHeight;

                // make values go from -5 to +5
                x = (x - 0.5) * 10;
                y = (y - 0.5) * 10;

                this.mouseCursor.delta.x += x - this.mouseCursor.previous.x;
                this.mouseCursor.delta.y += y - this.mouseCursor.previous.y;

                this.mouseCursor.previous.x = x;
                this.mouseCursor.previous.y = y;
            },
        }

        this.view.onMouseMove = this.view.onMouseMove.bind(this.view)
        window.addEventListener("mousemove", this.view.onMouseMove)
    }

    update() {
        this.view.spherical.value.theta -= this.view.mouseCursor.delta.x;
        this.view.spherical.value.phi -= this.view.mouseCursor.delta.y;

        // reset mouse delta values
        this.view.mouseCursor.delta.x = 0;
        this.view.mouseCursor.delta.y = 0;


        // Smoothed
        this.view.spherical.smoothed.theta += (this.view.spherical.value.theta - this.view.spherical.smoothed.theta) * this.view.spherical.smoothing * this.time.deltaTime;
        this.view.spherical.smoothed.phi += (this.view.spherical.value.phi - this.view.spherical.smoothed.phi) * this.view.spherical.smoothing * this.time.deltaTime;

        // Create new view position ( for camera) from spherical coods
        const viewPosition = new THREE.Vector3();
        viewPosition.setFromSpherical(this.view.spherical.smoothed);

        // offset viewposition with current target value
        const target = new THREE.Vector3(0, 0.2, 0)
        viewPosition.add(target);

        this.camera.position.copy(viewPosition);
        // const target = new THREE.Vector3(0, 0.2, 0)
        if (this.target) this.camera.lookAt(target);
    }

    dispose() {
        window.removeEventListener("mousemove", this.view.onMouseMove)
    }
}