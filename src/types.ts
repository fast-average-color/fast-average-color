export type FastAverageColorRgb = [number, number, number];
export type FastAverageColorRgba = [number, number, number, number];
export type FastAverageColorRgbaWithThreshold = [number, number, number, number, number];

export type FastAverageColorIgnoredColor = FastAverageColorRgb | FastAverageColorRgba | FastAverageColorRgbaWithThreshold | Array<FastAverageColorRgb | FastAverageColorRgba | FastAverageColorRgbaWithThreshold>;

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
    crossOrigin?: string;
    dominantDivider?: number;
}

export interface FastAverageColorAlgorithmOptions {
    defaultColor: FastAverageColorRgba;
    ignoredColor: Array<FastAverageColorRgb | FastAverageColorRgba | FastAverageColorRgbaWithThreshold>;
    step: number;
    dominantDivider?: number;
}

export type FastAverageColorResource = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | ImageBitmap | VideoFrame | null;

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

