function toHex(num) {
    let str = num.toString(16);
    return str.length === 1 ? '0' + str : str;
}

function arrayToHex(arr) {
    return '#' + arr.map(toHex).join('');
}

function isDarkColor(color) {
    // http://www.w3.org/TR/AERT#color-contrast
    const result = (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000;

    return result < 128;
}

export function prepareColorData(value) {
    const
        rgb = value.slice(0, 3),
        rgba = [].concat(rgb, value[3] / 255),
        isDark = isDarkColor(value);

    return {
        value,
        rgb: 'rgb(' + rgb.join(',') + ')',
        rgba: 'rgba(' + rgba.join(',') + ')',
        hex: arrayToHex(rgb),
        hexa: arrayToHex(value),
        isDark,
        isLight: !isDark
    };
}

export const defaultColor = [255, 255, 255, 255];
