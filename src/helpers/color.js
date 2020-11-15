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
    if (typeof color === 'function') {
        return color;
    }

    return Array.isArray(color) && !Array.isArray(color[0]) ?
        [[].concat(color)] :
        color;
}

export function isIgnoredColor(data, index, ignoredColor) {
    if (typeof ignoredColor === 'function') {
        return ignoredColor(data, index);
    }

    for (let i = 0; i < ignoredColor.length; i++) {
        const color = ignoredColor[i];

        switch (color.length) {
            case 3:
                if (isIgnoredRGBColor(data, index, color)) {
                    return true;
                }

                break;
            case 4:
                if (isIgnoredRGBAColor(data, index, color)) {
                    return true;
                }

                break;
            case 5:
                if (isIgnoredRGBAColorWithThreshold(data, index, color)) {
                    return true;
                }

                break;
        }
    }

    return false;
}

function isIgnoredRGBColor(data, index, ignoredColor) {
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

function isIgnoredRGBAColor(data, index, ignoredColor) {
    if (data[index + 3] && ignoredColor[3]) {
        return data[index] === ignoredColor[0] &&
            data[index + 1] === ignoredColor[1] &&
            data[index + 2] === ignoredColor[2] &&
            data[index + 3] === ignoredColor[3];
    }

    // Ignore rgb components if the pixel are fully transparent.
    return data[index + 3] === ignoredColor[3];
}

function inRange(colorComponent, ignoredColorComponent, value) {
    return colorComponent >= (ignoredColorComponent - value) &&
        colorComponent <= (ignoredColorComponent + value);
}

function isIgnoredRGBAColorWithThreshold(data, index, ignoredColor) {
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
