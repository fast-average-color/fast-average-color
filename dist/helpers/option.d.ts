import { FastAverageColorOptions } from '../index';
import type { FastAverageColorRgba } from '../index';
export declare function getDefaultColor(options: FastAverageColorOptions): FastAverageColorRgba;
export declare function getOption<T extends keyof FastAverageColorOptions>(options: FastAverageColorOptions, name: T, defaultValue: NonNullable<FastAverageColorOptions[T]>): NonNullable<FastAverageColorOptions[T]>;
