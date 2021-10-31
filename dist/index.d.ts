/// <reference types="offscreencanvas" />
export declare type FastAverageColorRgb = [number, number, number];
export declare type FastAverageColorRgba = [number, number, number, number];
export declare type FastAverageColorRgbaWithThreshold = [number, number, number, number, number];
export declare type FastAverageColorIgnoredColor = FastAverageColorRgb | FastAverageColorRgba | FastAverageColorRgbaWithThreshold | Array<FastAverageColorRgb | FastAverageColorRgba | FastAverageColorRgbaWithThreshold>;
export interface FastAverageColorOptions {
    defaultColor?: FastAverageColorRgba;
    ignoredColor?: FastAverageColorIgnoredColor;
    mode?: 'precision' | 'speed';
    algorithm?: 'simple' | 'sqrt' | 'dominant';
    step?: number;
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    silent?: boolean;
}
export interface FastAverageColorAlgorithmOptions {
    defaultColor: FastAverageColorRgba;
    ignoredColor: Array<FastAverageColorRgb | FastAverageColorRgba | FastAverageColorRgbaWithThreshold>;
    step: number;
}
declare type FastAverageColorResource = string | HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | null;
export interface FastAverageColorResult {
    rgb: string;
    rgba: string;
    hex: string;
    hexa: string;
    value: FastAverageColorRgba;
    isDark: boolean;
    isLight: boolean;
    error?: Error;
}
export default class FastAverageColor {
    canvas: HTMLCanvasElement | OffscreenCanvas | null;
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;
    /**
     * Get asynchronously the average color from not loaded image.
     */
    getColorAsync(resource: FastAverageColorResource, options?: FastAverageColorOptions): Promise<FastAverageColorResult>;
    /**
     * Get the average color from images, videos and canvas.
     */
    getColor(resource: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | null, options?: FastAverageColorOptions): FastAverageColorResult;
    /**
     * Get the average color from a array when 1 pixel is 4 bytes.
     */
    getColorFromArray4(arr: number[] | Uint8Array | Uint8ClampedArray, options?: FastAverageColorOptions): FastAverageColorRgba;
    /**
     * Get color data from value ([r, g, b, a]).
     */
    prepareResult(value: number[]): FastAverageColorResult;
    /**
     * Destroy the instance.
     */
    destroy(): void;
    private bindImageEvents;
}
export {};
