export function isIgnoredColor(arr, num, ignoredColor) {
    return arr[num] === ignoredColor[0] && // red
        arr[num + 1] === ignoredColor[1] && // green
        arr[num + 2] === ignoredColor[2] && // blue
        arr[num + 3] === ignoredColor[3]; // alpha
}
