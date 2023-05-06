import * as THREE from "three"
import Sizes from "./utils/Sizes";
import Time from "./utils/Time";
import Camera from "./utils/Camera";
import DebugUI from "./utils/DebugUI";
import Renderer from "./utils/Renderer";
import World from "./world";
import UIAnimations from "./UIAnimation";
import Resources from "./utils/Resources";
import sources from "./sources";




export default class WebglExperience {
    static _instance: WebglExperience | null = null;
    canvas!: HTMLCanvasElement;
    scene!: THREE.Scene;
    camera!: Camera;
    renderer!: Renderer;
    sizes!: Sizes;
    time!: Time;
    debugUI!: DebugUI;
    world!: World;
    uiAnimation!: UIAnimations;
    resources!: Resources;



    constructor(styles: CSSModuleClasses) {
        if (WebglExperience._instance instanceof WebglExperience) {
            return WebglExperience._instance;
        }
        this.canvas = document.querySelector("[data-webgl_canvas]") as HTMLCanvasElement;
        this.debugUI = new DebugUI();
        this.scene = new THREE.Scene();
        this.sizes = new Sizes(this);
        this.time = new Time(this);
        this.camera = new Camera(this);
        this.renderer = new Renderer(this);
        this.resources = new Resources(sources);
        this.world = new World(this);
        this.uiAnimation = new UIAnimations(this, styles);

        this.triggerResize = this.triggerResize.bind(this);
        this.triggerUpdate = this.triggerUpdate.bind(this);

        this.sizes.on("resize", this.triggerResize);
        this.time.on("tick", this.triggerUpdate);


        WebglExperience._instance = this;


    }

    triggerResize() {
        this.camera.resize();
        this.renderer.resize();
    }

    triggerUpdate() {
        this.world.update();
        this.camera.update();
        this.renderer.update();
    }

    dispose() {
        this.world.dispose();
        this.time.dispose();
        this.sizes.dispose();
        this.camera.dispose();
        this.renderer.dispose();
        this.debugUI.dispose();
        this.uiAnimation.dispose()


        this.scene.traverse((child: any) => {
            if (typeof child.dispose === 'function') child.dispose();
            if (child instanceof THREE.Mesh) {
                if (typeof child.geometry.dispose === 'function') child.geometry.dispose();
                for (const key in child.material) {
                    if (Object.hasOwn(child.material, key)) {
                        const item = child.material[key];
                        if (item && typeof item.dispose === 'function') item.dispose();
                    }
                }
            }
        })

        WebglExperience._instance = null;

    }
}