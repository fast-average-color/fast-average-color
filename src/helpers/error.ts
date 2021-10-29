export const ERROR_PREFIX = 'FastAverageColor: ';

export function outputError(message: string, silent?: boolean, error?: unknown) {
    if (!silent) {
        console.error(ERROR_PREFIX + message);

        if (error) {
            console.error(error);
        }
    }
}

export function getError(text: string): Error {
    return Error(ERROR_PREFIX + text);
}
