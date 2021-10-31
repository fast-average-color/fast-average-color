import type { FastAverageColorIgnoredColor, FastAverageColorRgb, FastAverageColorRgba, FastAverageColorRgbaWithThreshold } from '../index';

function toHex(num: number): string {
    const str = num.toString(16);

    return str.length === 1 ? '0' + str : str;
}

export function arrayToHex(arr: number[]): string {
    return '#' + arr.map(toHex).join('');
}

export function isDark(color: number[]): boolean {
    // http://www.w3.org/TR/AERT#color-contrast
    const result = (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000;

    return result < 128;
}

export function prepareIgnoredColor(color?: FastAverageColorIgnoredColor): Array<FastAverageColorRgb | FastAverageColorRgba | FastAverageColorRgbaWithThreshold> {
    if (!color) { return []; }

    return isRGBArray(color) ? color : [color];
}

function isRGBArray(value: FastAverageColorRgb | FastAverageColorRgba | FastAverageColorRgbaWithThreshold | Array<FastAverageColorRgb | FastAverageColorRgba | FastAverageColorRgbaWithThreshold>): value is Array<FastAverageColorRgb | FastAverageColorRgba | FastAverageColorRgbaWithThreshold> {
    return Array.isArray(value[0]);
}

export function isIgnoredColor(data: number[] | Uint8ClampedArray | Uint8Array, index: number, ignoredColor: Array<FastAverageColorRgb | FastAverageColorRgba | FastAverageColorRgbaWithThreshold>) {
    for (let i = 0; i < ignoredColor.length; i++) {
        if (isIgnoredColorAsNumbers(data, index, ignoredColor[i])) {
            return true;
        }
    }

    return false;
}

function isIgnoredColorAsNumbers(data: number[] | Uint8ClampedArray | Uint8Array, index: number, ignoredColor: FastAverageColorRgb | FastAverageColorRgba | FastAverageColorRgbaWithThreshold) {
    switch (ignoredColor.length) {
        case 3:
            // [red, green, blue]
            if (isIgnoredRGBColor(data, index, ignoredColor)) {
                return true;
            }

            break;
        case 4:
            // [red, green, blue, alpha]
            if (isIgnoredRGBAColor(data, index, ignoredColor)) {
                return true;
            }

            break;
        case 5:
            // [red, green, blue, alpha, threshold]
            if (isIgnoredRGBAColorWithThreshold(data, index, ignoredColor)) {
                return true;
            }

            break;
        default:
            return false;
    }
}

function isIgnoredRGBColor(data: number[] | Uint8ClampedArray | Uint8Array, index: number, ignoredColor: FastAverageColorRgb) {
    // Ignore if the pixel are transparent.
    if (data[index + 3] !== 255) {
        return true;
    }

    if (data[index] === ignoredColor[0] &&
        data[index + 1] === ignoredColor[1] &&
        data[index + 2] === ignoredColor[2]
    ) {
        return true;
    }

    return false;
}

function isIgnoredRGBAColor(data: number[] | Uint8ClampedArray | Uint8Array, index: number, ignoredColor: FastAverageColorRgba) {
    if (data[index + 3] && ignoredColor[3]) {
        return data[index] === ignoredColor[0] &&
            data[index + 1] === ignoredColor[1] &&
            data[index + 2] === ignoredColor[2] &&
            data[index + 3] === ignoredColor[3];
    }

    // Ignore rgb components if the pixel are fully transparent.
    return data[index + 3] === ignoredColor[3];
}

function inRange(colorComponent: number, ignoredColorComponent: number, value: number): boolean {
    return colorComponent >= (ignoredColorComponent - value) &&
        colorComponent <= (ignoredColorComponent + value);
}

function isIgnoredRGBAColorWithThreshold(data: number[] | Uint8ClampedArray | Uint8Array, index: number, ignoredColor: FastAverageColorRgbaWithThreshold) {
    const redIgnored = ignoredColor[0];
    const greenIgnored = ignoredColor[1];
    const blueIgnored = ignoredColor[2];
    const alphaIgnored = ignoredColor[3];
    const threshold = ignoredColor[4];
    const alphaData = data[index + 3];

    const alphaInRange = inRange(alphaData, alphaIgnored, threshold);
    if (!alphaIgnored) {
        return alphaInRange;
    }

    if (!alphaData && alphaInRange) {
        return true;
    }

    if (inRange(data[index], redIgnored, threshold) &&
        inRange(data[index + 1], greenIgnored, threshold) &&
        inRange(data[index + 2], blueIgnored, threshold) &&
        alphaInRange
    ) {
        return true;
    }

    return false;
}
