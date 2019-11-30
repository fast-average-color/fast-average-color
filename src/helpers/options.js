import { defaultColor } from './color';

export function getDefaultColor(options) {
    return getOption(options, 'defaultColor', defaultColor);
}

export function getOption(options, name, defaultValue) {
    return typeof options[name] === 'undefined' ? defaultValue : options[name];
}
