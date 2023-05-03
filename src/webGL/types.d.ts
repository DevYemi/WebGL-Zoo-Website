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