import type { FastAverageColorIgnoredColor, RGBColor, RGBAColor, RGBAColorWithThreshold } from '../index';
export declare function arrayToHex(arr: number[]): string;
export declare function isDark(color: number[]): boolean;
export declare function prepareIgnoredColor(color?: FastAverageColorIgnoredColor): Array<RGBColor | RGBAColor | RGBAColorWithThreshold>;
export declare function isIgnoredColor(data: number[] | Uint8ClampedArray | Uint8Array, index: number, ignoredColor: Array<RGBColor | RGBAColor | RGBAColorWithThreshold>): boolean;
