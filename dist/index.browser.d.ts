import { FastAverageColor } from './main';
declare global {
    interface Window {
        FastAverageColor: typeof FastAverageColor;
    }
}
