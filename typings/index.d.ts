type IFastAverageColorRgba = [number, number, number, number]; // [red, green, blue, opacity]

interface IFastAverageColorOptions {
    algorithm?: 'simple' | 'sqrt' | 'dominant';
    mode?: 'precision' | 'speed';
    step?: number;
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    defaultColor?: IFastAverageColorRgba;
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
    getColorSync(resource: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | null, options?: IFastAverageColorOptions): IFastAverageColorResult;
    getColor(resource: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | null, options?: IFastAverageColorOptions): Promise<IFastAverageColorResult>;
    getColorFromArray4(arr: number[] | Uint8Array, options?: IFastAverageColorOptions): IFastAverageColorRgba;
    destroy(): void;
}

interface IFastAverageColorStatic {
    new (): IFastAverageColor;
}

declare module 'fast-average-color' {
    const FastAverageColor: IFastAverageColorStatic;

    export = FastAverageColor;
}
