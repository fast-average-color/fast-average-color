function toHex(num) {
    const str = num.toString(16);

    return str.length === 1 ? '0' + str : str;
}

export function arrayToHex(arr) {
    return '#' + arr.map(toHex).join('');
}

export function isDark(color) {
    // http://www.w3.org/TR/AERT#color-contrast
    const result = (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000;

    return result < 128;
}

export function prepareIgnoredColor(color) {
    return Array.isArray(color) && !Array.isArray(color[0]) ?
        [[].concat(color)] :
        color;
}

