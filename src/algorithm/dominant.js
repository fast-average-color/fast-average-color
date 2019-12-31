import { isIgnoredColor } from './ignoredColor';

export default function dominantAlgorithm(arr, len, options) {
    const
        colorHash = {},
        divider = 24,
        ignoredColor = options.ignoredColor;

    for (let i = 0; i < len; i += options.step) {
        let
            red = arr[i],
            green = arr[i + 1],
            blue = arr[i + 2],
            alpha = arr[i + 3];

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
    }

    const buffer = Object.keys(colorHash).map(key => {
        return colorHash[key];
    }).sort((a, b) => {
        const
            countA = a[4],
            countB = b[4];

        return countA > countB ?  -1 : countA === countB ? 0 : 1;
    });

    const max = buffer[0];

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
