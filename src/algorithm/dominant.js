import { isIgnoredColor } from '../helpers/color';

export default function dominantAlgorithm(arr, len, options) {
    const colorHash = {};
    const divider = 24;
    const ignoredColor = options.ignoredColor;
    const step = options.step;
    let max = [0, 0, 0, 0, 0];
    
    for (let i = 0; i < len; i += step) {
        const red = arr[i];
        const green = arr[i + 1];
        const blue = arr[i + 2];
        const alpha = arr[i + 3];

        if (ignoredColor && isIgnoredColor(arr, i, ignoredColor)) {
            continue;
        }

        const key = Math.round(red / divider) + ',' +
                Math.round(green / divider) + ',' +
                Math.round(blue / divider);

        if (colorHash[key]) {
            colorHash[key] = [
                colorHash[key][0] + red * alpha,
                colorHash[key][1] + green * alpha,
                colorHash[key][2] + blue * alpha,
                colorHash[key][3] + alpha,
                colorHash[key][4] + 1
            ];
        } else {
            colorHash[key] = [red * alpha, green * alpha, blue * alpha, alpha, 1];
        }
        
        if (max[4] < colorHash[key][4]) {
            max = colorHash[key];
        }
    }

    const redTotal = max[0];
    const greenTotal = max[1];
    const blueTotal = max[2];

    const alphaTotal = max[3];
    const count = max[4];

    return alphaTotal ? [
        Math.round(redTotal / alphaTotal),
        Math.round(greenTotal / alphaTotal),
        Math.round(blueTotal / alphaTotal),
        Math.round(alphaTotal / count)
    ] : options.defaultColor;
}
