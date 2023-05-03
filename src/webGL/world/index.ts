import * as THREE from "three";
import WebglExperience from "..";
import Animals from "./Animals";
import Controls from "./Controls";
import Environment from "./Environment";

export default class World {

    animals!: Animals;
    controls!: Controls;
    environment: Environment;
    constructor(experience: WebglExperience) {
        this.environment = new Environment(experience);
        this.animals = new Animals(experience, this.environment);
        this.controls = new Controls(experience);
    }


    update() {
        this.animals.update();
        this.controls.update();
        this.environment.update()
    }

    dispose() {
        this.animals.dispose();
        this.controls.dispose();
        this.environment.dispose();
    }
}