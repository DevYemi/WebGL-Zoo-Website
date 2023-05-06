import { SourceType } from "../types";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { EventEmitter } from "./EventEmitter";

interface LoadersType {
    gltf: GLTFLoader
}



export default class Resources extends EventEmitter {
    sources: SourceType[];
    items: { [key: string]: any };
    loadedItems: number;
    itemsToLoad: number;
    loaders!: LoadersType;
    constructor(sources: SourceType[]) {
        super();
        this.sources = sources;
        this.itemsToLoad = this.sources.length;
        this.loadedItems = 0;
        this.items = {}

        this.setUpLoaders();
        this.loadResouces();
    }


    setUpLoaders() {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("draco/");

        this.loaders = {
            gltf: new GLTFLoader()
        }

        this.loaders.gltf.setDRACOLoader(dracoLoader);


    }

    loadResouces() {
        this.sources.forEach(item => {
            if (item.type === "gltf") {
                this.loaders.gltf.load(item.path, (gltf) => {
                    this.loadedResouce(item, gltf);
                })
            }
        })
    }

    loadedResouce(item: SourceType, file: any) {
        this.loadedItems++
        this.items[item.name] = file;

        if (this.itemsToLoad === this.loadedItems) {
            this.trigger("resourceReady")
        }
    }
}