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
}

interface IFastAverageColor {
    getColor(resource: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement, options: IFastAverageColorOptions): IFastAverageColorResult;
    getColorAsync(resource: HTMLImageElement, options?: IFastAverageColorOptions): Promise<IFastAverageColorResult>;
    getColorFromArray4(arr: number[] | Uint8Array, options: IFastAverageColorOptions): IFastAverageColorRgba;
}

declare module 'fast-average-color' {
	const FastAverageColor: IFastAverageColor;

	export = FastAverageColor;
}
