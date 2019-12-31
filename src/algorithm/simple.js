import { isIgnoredColor } from './ignoredColor';

export default function simpleAlgorithm(arr, len, options) {
    let
        redTotal = 0,
        greenTotal = 0,
        blueTotal = 0,
        alphaTotal = 0,
        count = 0;

    const ignoredColor = options.ignoredColor;

    for (let i = 0; i < len; i += options.step) {
        const
            alpha = arr[i + 3],
            red = arr[i] * alpha,
            green = arr[i + 1] * alpha,
            blue = arr[i + 2] * alpha;

        if (ignoredColor && isIgnoredColor(arr, i, ignoredColor)) {
            continue;
        }

        redTotal += red;
        greenTotal += green;
        blueTotal += blue;
        alphaTotal += alpha;
        count++;
    }

    return alphaTotal ? [
        Math.round(redTotal / alphaTotal),
        Math.round(greenTotal / alphaTotal),
        Math.round(blueTotal / alphaTotal),
        Math.round(alphaTotal / count)
    ] : options.defaultColor;
}
