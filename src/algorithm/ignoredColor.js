export function isIgnoredColor(arr, num, ignoredColor) {
    for (let i = 0; i < ignoredColor.length; i++) {
        const item = ignoredColor[i];
        // Ignore rgb components if the pixel are fully transparent.
        if (!arr[num + 3] && !item[3]) {
            return true;
        }

        if (arr[num] === item[0] && // red
            arr[num + 1] === item[1] && // green
            arr[num + 2] === item[2] && // blue
            arr[num + 3] === item[3] // alpha
        ) {
            return true;
        }
    }

    return false;
}
