import { FastAverageColor } from './index';

declare global {
    interface Window {
        FastAverageColor: typeof FastAverageColor;
    }
}

const global = typeof window !== 'undefined' ? window : self;
global.FastAverageColor = FastAverageColor;
