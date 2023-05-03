import * as THREE from "three";
import WebglExperience from "..";
import { createDebounceFunc } from "@/utils/chunks";
import { EventEmitter } from "./EventEmitter";


export default class Sizes extends EventEmitter {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    aspectRatio: number;
    frustum: number;
    isMobileScreen: boolean;
    constructor(experience: WebglExperience) {
        super()
        this.canvas = experience.canvas
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.aspectRatio = this.canvas.width / this.canvas.height;
        this.frustum = 120;
        if (window.innerWidth < 768) {
            this.isMobileScreen = true
        } else {
            this.isMobileScreen = false;
        }

        this.onResizeCallback = createDebounceFunc(this.onResizeCallback.bind(this), 300);
        window.addEventListener("resize", this.onResizeCallback);
    }

    onResizeCallback() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.aspectRatio = this.canvas.width / this.canvas.height;

        this.isMobileScreen = window.innerWidth < 768 ? true : false;

        this.trigger("resize");
    }

    dispose() {
        window.removeEventListener("resize", this.onResizeCallback);
    }
}