import { SourceType } from "./types"
import zooModel from "@/assets/zooModel.glb"

const sources: SourceType[] = [
    {
        name: "animalSetUpModels",
        type: "gltf",
        path: zooModel
    }
]


export default sources