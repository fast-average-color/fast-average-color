type IFastAverageColorRgb = [number, number, number, number]; // [red 0-255, green 0-255, blue 0-255]
type IFastAverageColorRgba = [number, number, number, number]; // [red 0-255, green 0-255, blue 0-255, opacity 0-255]
type IFastAverageColorRgbaWithThreshold = [number, number, number, number, number]; // [red 0-255, green 0-255, blue 0-255, alpha 0-255, threshold 0-255]

type IFastAverageIgnoredColor =  IFastAverageColorRgb | IFastAverageColorRgb[] | IFastAverageColorRgba | IFastAverageColorRgba[] | IFastAverageColorRgbaWithThreshold | IFastAverageColorRgbaWithThreshold[];

type IFastAverageColorData = number[] | Uint8Array | Uint8ClampedArray;

interface IFastAverageColorOptions {
    algorithm?: 'simple' | 'sqrt' | 'dominant';

    mode?: 'precision' | 'speed';

    step?: number;

    left?: number;
    top?: number;

    width?: number;
    height?: number;

    defaultColor?: IFastAverageColorRgba;
    ignoredColor?: IFastAverageIgnoredColor;

    silent?: boolean;
}

interface IFastAverageColorResult {
    value: IFastAverageColorRgba;
    rgb: string;
    rgba: string;
    hex: string;
    hexa: string;
    isDark: boolean;
    isLight: boolean;
    error?: Error;
}

interface IFastAverageColor {
    getColor(resource: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | null, options?: IFastAverageColorOptions): IFastAverageColorResult;
    getColorAsync(resource: string | HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | null, options?: IFastAverageColorOptions): Promise<IFastAverageColorResult>;
    getColorFromArray4(arr: IFastAverageColorData, options?: IFastAverageColorOptions): IFastAverageColorRgba;
    prepareResult(value: IFastAverageColorRgba): IFastAverageColorResult;
    destroy(): void;
}

interface IFastAverageColorStatic {
    new (): IFastAverageColor;
}

declare module 'fast-average-color' {
    const FastAverageColor: IFastAverageColorStatic;

    export = FastAverageColor;
}
