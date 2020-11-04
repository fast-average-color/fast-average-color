export function getDefaultColor(options) {
    return getOption(options, 'defaultColor', [0, 0, 0, 0]);
}

export function getOption(options, name, defaultValue) {
    return typeof options[name] === 'undefined' ? defaultValue : options[name];
}
