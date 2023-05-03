import WebglExperience from "..";
import { EventEmitter } from "./EventEmitter";


export default class Time extends EventEmitter {
    start: number;
    currentTime: number;
    deltaTime: number;
    elaspedTime: number;
    requestAnimationFrameRef!: number
    constructor(experience: WebglExperience) {
        super();
        this.start = Date.now();
        this.currentTime = Date.now();
        this.deltaTime = 16;
        this.elaspedTime = 0;

        this.tick = this.tick.bind(this);

        this.tick();


    }

    tick() {
        const currentTime = Date.now();
        this.deltaTime = currentTime - this.currentTime;
        this.currentTime = currentTime;
        this.elaspedTime = currentTime - this.start;

        this.requestAnimationFrameRef = requestAnimationFrame(this.tick);

        this.trigger("tick");
    }

    dispose() {
        cancelAnimationFrame(this.requestAnimationFrameRef)
    }

}