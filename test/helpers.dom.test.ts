import 'jest-canvas-mock';
import { isInstanceOfHTMLCanvasElement, isInstanceOfHTMLImageElement, isInstanceOfHTMLVideoElement, isInstanceOfImageBitmap, isInstanceOfOffscreenCanvas, isSvg, prepareSizeAndPosition } from '../src/helpers/dom';

describe('Helpers: dom', () => {
    it('#isSvg', () => {
        expect(isSvg('https://my-site.com/path/my.svg')).toBeTruthy();
        expect(isSvg('/path/my.png')).toBeFalsy();
        expect(isSvg('/path/svg')).toBeFalsy();
        expect(isSvg('/path/my.svgo')).toBeFalsy();
        expect(isSvg('/path/my.SVG')).toBeTruthy();
        expect(isSvg('/path/my.SVG?param1=1&param2=2')).toBeTruthy();
    });

    describe('#prepareSizeAndPosition()', () => {
        it('should return values', () => {
            expect(prepareSizeAndPosition({width: 1000, height: 500}, {left: 10, top: 20, width: 300, height: 200}))
                .toEqual({srcLeft: 10, srcTop: 20, srcWidth: 300, srcHeight: 200, destWidth: 100, destHeight: 67});
        });

        it('should return default values with small sizes', () => {
            expect(prepareSizeAndPosition({width: 50, height: 30}, {}))
                .toEqual({srcLeft: 0, srcTop: 0, srcWidth: 50, srcHeight: 30, destWidth: 50, destHeight: 30});
        });

        it('should return default values with big sizes', () => {
            expect(prepareSizeAndPosition({width: 1000, height: 500}, {}))
                .toEqual({srcLeft: 0, srcTop: 0, srcWidth: 1000, srcHeight: 500, destWidth: 100, destHeight: 50});

            expect(prepareSizeAndPosition({width: 500, height: 1000}, {}))
                .toEqual({srcLeft: 0, srcTop: 0, srcWidth: 500, srcHeight: 1000, destWidth: 50, destHeight: 100});
        });

        it('should return default values with precision mode', () => {
            expect(prepareSizeAndPosition({width: 1000, height: 500}, {mode: 'precision'}))
                .toEqual({srcLeft: 0, srcTop: 0, srcWidth: 1000, srcHeight: 500, destWidth: 1000, destHeight: 500});
        });
    });

    it('#isInstanceOfHTMLImageElement', () => {
        expect(isInstanceOfHTMLImageElement(document.createElement('img'))).toBeTruthy();
        expect(isInstanceOfHTMLImageElement(document.createElement('canvas'))).toBeFalsy();
    });

    it('#isInstanceOfHTMLCanvasElement', () => {
        expect(isInstanceOfHTMLCanvasElement(document.createElement('img'))).toBeFalsy();
        expect(isInstanceOfHTMLCanvasElement(document.createElement('canvas'))).toBeTruthy();
    });

    it('#isInstanceOfHTMLVideoElement', () => {
        expect(isInstanceOfHTMLVideoElement(document.createElement('img'))).toBeFalsy();
        expect(isInstanceOfHTMLVideoElement(document.createElement('video'))).toBeTruthy();
    });

    it('#isInstanceOfImageBitmap', async () => {
        expect(isInstanceOfImageBitmap(document.createElement('img'))).toBeFalsy();

        const imageBitmap = await createImageBitmap(new Image(1, 1));
        expect(isInstanceOfImageBitmap(imageBitmap)).toBeTruthy();
    });

    it('#isInstanceOfOffscreenCanvas', async () => {
        expect(isInstanceOfOffscreenCanvas(document.createElement('img'))).toBeFalsy();
    });
});
