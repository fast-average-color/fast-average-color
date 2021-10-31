import type { FastAverageColorIgnoredColor, FastAverageColorRgb, FastAverageColorRgba, FastAverageColorRgbaWithThreshold } from '../index';
export declare function arrayToHex(arr: number[]): string;
export declare function isDark(color: number[]): boolean;
export declare function prepareIgnoredColor(color?: FastAverageColorIgnoredColor): Array<FastAverageColorRgb | FastAverageColorRgba | FastAverageColorRgbaWithThreshold>;
export declare function isIgnoredColor(data: number[] | Uint8ClampedArray | Uint8Array, index: number, ignoredColor: Array<FastAverageColorRgb | FastAverageColorRgba | FastAverageColorRgbaWithThreshold>): boolean;
