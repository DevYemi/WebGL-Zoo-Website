import WebglExperience from "..";
import * as THREE from "three";
import { TimeTypes } from "../types";


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

export default class Controls {
    experience: WebglExperience;
    view!: viewType;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    time: TimeTypes;
    target!: THREE.Object3D<THREE.Event>;
    animateCamera: boolean
    constructor(experience: WebglExperience) {
        this.experience = experience;
        this.camera = experience.camera.perspective;
        this.scene = experience.scene;
        this.time = experience.time;
        this.animateCamera = false;

    }


    update() {
        // if (this.animateCamera) {
        //     this.camera.position.z = 0.5 * Math.sin(this.time.elaspedTime * 0.001);
        // }
    }

    dispose() {

    }
}