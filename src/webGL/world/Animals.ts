import WebglExperience from "..";
import * as THREE from "three"
import gsap from "gsap"
import { TimeTypes } from "../types";
import Environment from "./Environment";
import Resources from "../utils/Resources";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

interface ValuesManagerType {
    setUp0ModelBoxDefaultPosition: THREE.Vector3
    tailOffset: number,
    animalsYoyoOffset: {
        "crocs": number,
        "kong": number,
        "elephant": number
    }
}


export default class Animals {
    experience: WebglExperience;
    scene: THREE.Scene;
    time: TimeTypes;
    environment: Environment;
    resources: Resources;

    coinGroup: THREE.Group;
    headGroup: THREE.Group;
    tailGroup: THREE.Group;
    activeIndex: { prev: number, latest: number };
    currentDisplayedSide: "head" | "tail";
    activeSetUpAnimalModel!: THREE.Object3D;
    activeSetUpAnimalModelBox!: THREE.Object3D;
    mouseCursor: THREE.Vector2;
    valueManager: ValuesManagerType;
    constructor(experience: WebglExperience, environment: Environment) {
        this.experience = experience;
        this.scene = experience.scene;
        this.time = experience.time;
        this.environment = environment;
        this.resources = experience.resources;

        this.coinGroup = new THREE.Group();
        this.headGroup = new THREE.Group();
        this.tailGroup = new THREE.Group();
        this.currentDisplayedSide = "head";
        this.mouseCursor = new THREE.Vector2(0);
        this.activeIndex = { prev: 0, latest: 0 };
        this.valueManager = {
            setUp0ModelBoxDefaultPosition: new THREE.Vector3(),
            tailOffset: -47.5,
            animalsYoyoOffset: {
                "crocs": 0.5,
                "kong": 0.3,
                "elephant": 0.5
            }
        }

        this.init = this.init.bind(this);

        this.resources.on("resourceReady", this.init);




        this.handleMouseMove = this.handleMouseMove.bind(this);

        window.addEventListener("mousemove", this.handleMouseMove)
    }

    init() {
        const screenSetUps: THREE.Object3D[] = []


        const gltf = this.resources.items.animalSetUpModels as GLTF


        gltf.scene.traverse((child) => {

            if (child.name.includes("set-up")) {
                screenSetUps.push(child);
            }




            if (child.name.toLowerCase().includes("background")) {
                child.receiveShadow = true;
            } else {
                // animals models
                child.castShadow = true;
            }

        })

        screenSetUps.forEach(child => {
            if (child.name === "set-up-0") {
                this.headGroup.add(child);
                this.setActiveAnimalModelBox(child);
                this.valueManager.setUp0ModelBoxDefaultPosition.copy(this.activeSetUpAnimalModelBox.position);
                this.activeSetUpAnimalModelBox.position.y = 20;
                this.activeSetUpAnimalModel = this.getSetUpAnimalModel(this.activeSetUpAnimalModelBox);
            } else {
                child.visible = false;
                const animalModelBox = this.getSetUpAnimalModelBox(child);
                animalModelBox.rotateY(Math.PI);

                this.tailGroup.add(child);
            }
        })
        // Default tails group matrix
        this.tailGroup.rotateZ(Math.PI);
        this.tailGroup.position.setY(this.valueManager.tailOffset);

        // Default coinGroup matrix
        this.coinGroup.position.y = this.valueManager.tailOffset;

        this.coinGroup.add(this.headGroup, this.tailGroup);
        this.scene.add(this.coinGroup);


        // set up default animal bouce in animation
        gsap.to(
            this.activeSetUpAnimalModelBox.position,
            {
                y: this.valueManager.setUp0ModelBoxDefaultPosition.y,
                ease: "Bounce.easeOut",
                duration: 3
            }
        )


    }

    handleMouseMove(e: MouseEvent) {
        // get mouse coordinate relative to window size (0-1);
        let x = e.clientX / window.innerWidth;
        let y = e.clientY / window.innerHeight;

        // make values go from -0.25 to + 0.25
        x = (x - 0.5) * 0.5;
        y = (y - 0.5) * 0.5;

        this.mouseCursor.x = x
        this.mouseCursor.y = y

        this.animateActiveAnimalOnMouseMove()
    }

    setActiveAnimalModelBox(mesh: THREE.Object3D) {
        const boxMesh = this.getSetUpAnimalModelBox(mesh);
        this.activeSetUpAnimalModelBox = boxMesh;
    }

    getSetUpAnimalModel(mesh: THREE.Object3D) {
        return mesh.children[0];
    }

    getSetUpAnimalModelBox(mesh: THREE.Object3D) {
        return mesh.children.find(child => child.name.includes("empty"))!
    }


    animateActiveAnimalOnMouseMove() {
        if (this.activeSetUpAnimalModelBox) {

            gsap.to(this.activeSetUpAnimalModel.rotation, {
                y: this.mouseCursor.x,
                x: this.mouseCursor.y,
                duration: 4,
                onComplete: () => { this.activeSetUpAnimalModel.rotation.reorder("XYZ") }
            })
        }

    }

    update() {

        if (this.activeSetUpAnimalModel) {
            this.activeSetUpAnimalModel.position.y = 0.3 * Math.sin(this.time.elaspedTime * 0.0005) + this.valueManager.animalsYoyoOffset[this.activeSetUpAnimalModel.name as keyof ValuesManagerType["animalsYoyoOffset"]];
        }

    }

    resize() {

    }

    dispose() {
        window.removeEventListener("mousemove", this.handleMouseMove)
    }
}