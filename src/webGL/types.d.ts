export interface SizesType {
    width: number,
    height: number,
    aspectRatio: number,
    frustum: number;
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

export interface SourceType {
    name: string,
    type: string,
    path: string
}