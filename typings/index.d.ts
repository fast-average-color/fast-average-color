import 'lib.dom';

type IFastAverageColorRgba = [number, number, number, number]; // [red, green, blue, opacity]

interface Callback {
    (resource: HTMLImageElement, result: IFastAverageColorResult, data?: any) : void;
}

interface IFastAverageColorOptions {
    algorithm: 'simple' | 'sqrt';
    mode: 'precision' | 'speed';
    step: number;
    left: number;
    top: number;
    width?: number;
    height?: number;
    defaultColor: IFastAverageColorRgba;
    data?: any;
}

interface IFastAverageColorResult {
    error: Error;
    value: IFastAverageColorRgba;
    rgb: string;
    rgba: string;
    hex: string;
    hexa: string;
    isDark: boolean;
    isLight: boolean;
}

interface IFastAverageColor {
    getColorAsync(resource: HTMLImageElement, callback: Callback, options?: IFastAverageColorOptions) : void;
    getColor(resource: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement, options: IFastAverageColorOptions) : IFastAverageColorResult;
    getColorFromArray4(arr: number[] | Uint8Array, options: IFastAverageColorOptions) : IFastAverageColorRgba;
}


declare module 'fast-average-color' {
	const FastAverageColor: IFastAverageColor;

	export = FastAverageColor;
}
