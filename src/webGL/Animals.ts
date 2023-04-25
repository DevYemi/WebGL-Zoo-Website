import WebglExperience from ".";
import * as THREE from "three"
import elephantModel from "@/assets/elephantModelDemo.glb";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from "gsap"


export default class Animals {
    experience: WebglExperience;
    scene: THREE.Scene;
    models: THREE.Object3D<THREE.Event>[];
    anchorGroup: THREE.Group;
    headGroup: THREE.Group;
    tailGroup: THREE.Group;
    currentDisplayedGroup: "head" | "tail";
    activeIndex: { prev: number, new: number }
    constructor(experience: WebglExperience) {
        this.experience = experience;
        this.scene = experience.scene;
        this.models = []
        this.anchorGroup = new THREE.Group();
        this.headGroup = new THREE.Group();
        this.tailGroup = new THREE.Group();
        this.currentDisplayedGroup = "head";
        this.activeIndex = { prev: 0, new: 0 }
    }

    init() {
        this.loadModels()
    }

    loadModels() {
        const modelsUrl = [elephantModel];
        const gltfLoader = new GLTFLoader();

        modelsUrl.forEach(async (url) => {
            const gltf = await gltfLoader.loadAsync(url);
            // console.log(gltf.scene.children);
            const sceneChildren = [...gltf.scene.children];
            sceneChildren.forEach(child => {
                if (child.name === "set-up-0") {
                    this.headGroup.add(child)
                } else {
                    child.visible = false;
                    this.tailGroup.add(child)
                }
            })
            // Default tails group matrix
            this.tailGroup.rotateZ(Math.PI);
            this.tailGroup.position.setY(-47.5);

            // Default anchorGroup matrix
            this.anchorGroup.position.y = -47.5;

            this.anchorGroup.add(this.headGroup, this.tailGroup);
            this.models.push(gltf.scene);
        })
        this.scene.add(this.anchorGroup)

    }

    animate(newIndex: number) {
        this.activeIndex.prev = this.activeIndex.new;
        this.activeIndex.new = newIndex;

        const currentDisplayedGroup: THREE.Group = this.currentDisplayedGroup === "head" ? this.headGroup : this.tailGroup;
        const currentHiddenGroup: THREE.Group = this.currentDisplayedGroup !== "head" ? this.headGroup : this.tailGroup;

        let nextActiveModel = currentHiddenGroup.children.find(child => child.name === `set-up-${newIndex}`);
        const inActiveModels = currentHiddenGroup.children.filter(child => child.name !== `set-up-${newIndex}`);

        inActiveModels.forEach(model => {
            currentHiddenGroup.remove(model);
            currentDisplayedGroup.add(model);
        })

        if (nextActiveModel) nextActiveModel.visible = true;

        gsap.to(this.anchorGroup.rotation, {
            z: `+=${Math.PI}`,
            ease: "linear",
            duration: 0.7,
            onComplete: () => {
                this.currentDisplayedGroup = this.currentDisplayedGroup === "head" ? "tail" : "head";
                currentDisplayedGroup.children.forEach(child => {
                    child.visible = false;
                })

            }
        })
    }

    update() {

    }

    resize() {

    }

    dispose() {

    }
}