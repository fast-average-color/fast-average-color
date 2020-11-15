export const ERROR_PREFIX = 'FastAverageColor: ';

export function outputError(options, text, details) {
    if (!options.silent) {
        console.error(ERROR_PREFIX + text);

        if (details) {
            console.error(details);
        }
    }
}

export function getError(text) {
    return Error(ERROR_PREFIX + text);
}
