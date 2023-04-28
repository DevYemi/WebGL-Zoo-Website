import * as THREE from "three"
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createDebounceFunc } from "../utils/chunks";
import { Pane } from 'tweakpane';
import Animals from "./Animals";
import Navigation from "./Navigation";


interface SizesType {
    width: number,
    height: number,
    aspectRatio: number
}

export interface TimeTypes {
    start: number;
    currentTime: number;
    deltaTime: number;
    elaspedTime: number;
}

export interface DebugUiTypes {
    ui: Pane | null,
    isActive: boolean,
}

export default class WebglExperience {
    static _instance: WebglExperience | null = null;
    canvas!: HTMLCanvasElement;
    scene!: THREE.Scene;
    camera!: THREE.PerspectiveCamera;
    renderer!: THREE.WebGLRenderer;
    sizes!: SizesType;
    time!: TimeTypes;
    stats!: Stats;
    light!: THREE.DirectionalLight
    debugUI!: DebugUiTypes;
    requestAnimationFrameRef!: number
    isMobileScreen: boolean = false;
    orbitControls!: OrbitControls
    animals!: Animals;
    navigation!: Navigation;


    constructor() {
        if (WebglExperience._instance instanceof WebglExperience) {
            return WebglExperience._instance;
        }
        this.scene = new THREE.Scene();
        this.stats = new Stats();
        this.time = {
            start: Date.now(),
            currentTime: Date.now(),
            deltaTime: 16,
            elaspedTime: 0
        }

        if (window.innerWidth < 768) this.isMobileScreen = true;


        if (window.location.hash === '#stats') {
            document.body.appendChild(this.stats.dom)
        }


        this.init();

        WebglExperience._instance = this;


    }

    init() {
        // Order Matters
        this.setUpSizes();
        this.setUpCamera();
        this.setUpRenderer();
        this.setUpLights();
        // this.setUpDefault();
        // this.setUpOrbitControls();
        this.setUpDebugUI();

        this.navigation = new Navigation(this);
        this.animals = new Animals(this);
        this.animals.init();
        // this.navigation.init();

        this.tick = this.tick.bind(this);
        this.tick();
        this.onResizeCallback = createDebounceFunc(this.onResizeCallback.bind(this), 300);
        window.addEventListener("resize", this.onResizeCallback);
    }

    setUpDefault() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: "red" })

        const box = new THREE.Mesh(geometry, material)

        this.scene.add(box)
    }

    setUpDebugUI() {
        if (window.location.hash === "#debug") {
            this.debugUI = {
                isActive: true,
                ui: new Pane({ title: 'Tweak Values' })
            }

            const lightParams = {
                position: { x: this.light.position.x, y: this.light.position.y, z: this.light.position.z }
            }

            const ui = this.debugUI.ui as any
            ui.containerElem_.style.zIndex = "10"

            const lightFolder = this.debugUI.ui!.addFolder({ title: "Lights", expanded: true });

            lightFolder.addInput(lightParams, "position").on("change", () => {
                this.light.position.x = lightParams.position.x
                this.light.position.y = lightParams.position.y
                this.light.position.z = lightParams.position.z
            })




        } else {
            this.debugUI = {
                isActive: false,
                ui: null
            }
        }
    }

    setUpOrbitControls() {
        this.orbitControls = new OrbitControls(this.camera, this.canvas);

        this.orbitControls.enableDamping = true;
    }




    setUpLights() {
        // ambient Light
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.0)

        // Sun light
        this.light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        this.light.position.set(1, 20, -8);

        this.scene.add(this.light, ambientLight)



    }

    setUpSizes() {
        this.canvas = document.querySelector("[data-webgl_canvas]") as HTMLCanvasElement;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;


        this.sizes = {
            width: this.canvas.width,
            height: this.canvas.height,
            aspectRatio: this.canvas.width / this.canvas.height
        }


    }

    setUpCamera() {
        this.camera = new THREE.PerspectiveCamera(75, this.sizes.aspectRatio, 0.1, 2000)
        this.camera.position.set(0, 0.2, 2);

        this.scene.add(this.camera)
    }

    setUpRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputEncoding = THREE.sRGBEncoding
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setClearColor(new THREE.Color("black"))
        // this.renderer.setClearColor(new THREE.Color("#561f49"))
    }

    upDateTime() {
        const currentTime = Date.now();
        this.time.deltaTime = currentTime - this.time.currentTime;
        this.time.currentTime = currentTime;
        this.time.elaspedTime = currentTime - this.time.start;
    }

    setUpStats() {

    }

    onResizeCallback() {
        // Update sizes
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.sizes.width = this.canvas.width;
        this.sizes.height = this.canvas.height;
        this.sizes.aspectRatio = this.canvas.width / this.canvas.height;

        this.isMobileScreen = window.innerWidth < 768 ? true : false;

        // Update Camera
        this.camera.aspect = this.sizes.aspectRatio
        this.camera.updateProjectionMatrix();

        // Update renderer
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        // Update renderer
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    }

    tick() {
        this.stats.begin();
        this.upDateTime();

        if (this.orbitControls) this.orbitControls.update();
        this.animals.update();
        // this.navigation.update()

        this.renderer.render(this.scene, this.camera);
        this.stats.end();

        this.requestAnimationFrameRef = requestAnimationFrame(this.tick)
    }

    dispose() {

        window.removeEventListener("resize", this.onResizeCallback);
        this.renderer.dispose();
        window.cancelAnimationFrame(this.requestAnimationFrameRef);

        if (this.debugUI.isActive) {
            this.debugUI.ui!.dispose()
        }

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