import WebglExperience from "..";
import * as THREE from "three";
import { TimeTypes } from "../types";
import gsap from "gsap"


interface ViewType {
    target: THREE.Vector3;
    progress: number;
    dummyVector: THREE.Vector3;
    direction: "Backward" | "Forward",
    lerp: {
        current: number,
        target: number,
        easing: number
    }
}

export default class Controls {
    experience: WebglExperience;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    time: TimeTypes;

    view!: ViewType;
    curve!: THREE.CatmullRomCurve3;
    animateCamera: boolean;
    constructor(experience: WebglExperience) {
        this.experience = experience;
        this.camera = experience.camera.perspective;
        this.scene = experience.scene;
        this.time = experience.time;
        this.animateCamera = false;

        // this.init()

    }

    init() {
        // set up view defaults
        this.view = {
            target: new THREE.Vector3(1.68, 0.46, -4.43),
            progress: 1,
            dummyVector: new THREE.Vector3(0),
            direction: "Forward",
            lerp: {
                current: 0,
                target: 1,
                easing: 0.001
            }
        }

        this.camera.lookAt(this.view.target)


        //Create Curve
        this.curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-20, 20, 10),
            new THREE.Vector3(-5, -10, 50),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(5, 10, 5),
            new THREE.Vector3(20, 20, -10)
        ], true)

        const points = this.curve.getPoints(100);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const material = new THREE.LineBasicMaterial({ color: "yellow" });

        // Create the final object to add to the scene
        const curveObject = new THREE.Line(geometry, material);

        this.scene.add(curveObject);

        this.curve.getPointAt(0, this.view.dummyVector);

        // this.camera.position.copy(this.view.dummyVector);


    }


    update() {
        if (this.curve) {
            // if (this.view.progress < 0.01) this.view.direction = "Forward";
            // if (this.view.progress > 0.99) this.view.direction = "Backward";

            // if (this.view.direction === "Forward") this.view.progress += 0.001;
            // if (this.view.direction === "Backward") this.view.progress -= 0.001;

            // this.view.progress = Math.abs(Math.sin(this.time.elaspedTime * 0.0001 + 0.5))

            // if (this.view.progress < 0) {
            //     this.view.progress = 1;
            // }

            // this.view.progress -= 0.0001



            // // console.log(this.view.progress)


            // this.curve.getPointAt(this.view.progress, this.view.dummyVector);


            // this.camera.position.copy(this.view.dummyVector)
        }

    }

    dispose() {

    }
}