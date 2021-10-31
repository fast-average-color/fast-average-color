import { FastAverageColorOptions } from '../index';
import type { FastAverageColorRgba } from '../index';

export function getDefaultColor(options: FastAverageColorOptions): FastAverageColorRgba {
    return getOption(options, 'defaultColor', [0, 0, 0, 0]);
}

export function getOption<T extends keyof FastAverageColorOptions>(options: FastAverageColorOptions, name: T, defaultValue: NonNullable<FastAverageColorOptions[T]>): NonNullable<FastAverageColorOptions[T]>{
    return (options[name] === undefined ? defaultValue : options[name]) as NonNullable<FastAverageColorOptions[T]>;
}
