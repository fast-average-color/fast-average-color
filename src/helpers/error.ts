export const ERROR_PREFIX = 'FastAverageColor: ';

export function getError(message: string): Error {
    return Error(ERROR_PREFIX + message);
}

export function outputError(error: Error, silent?: boolean) {
    if (!silent) {
        console.error(error);
    }
}
