import FastAverageColor from '../src';
import { getOption } from '../src/helpers/option';
import { isDark } from '../src/helpers/color';

describe('Internal API', () => {
    describe('getOption()', () => {
        it('should return default value', () => {
            expect(getOption({}, 'left', 0)).toEqual(0);
        });

        it('should return the option', () => {
            expect(getOption({left: 10}, 'left', 0)).toEqual(10);
        });
    });

    describe('_prepareSizeAndPosition()', () => {
        const fac = new FastAverageColor();

        it('should return values', () => {
            expect(fac._prepareSizeAndPosition({width: 1000, height: 500}, {left: 10, top: 20, width: 300, height: 200}))
                .toEqual({srcLeft: 10, srcTop: 20, srcWidth: 300, srcHeight: 200, destWidth: 100, destHeight: 67});
        });

        it('should return default values with small sizes', () => {
            expect(fac._prepareSizeAndPosition({width: 50, height: 30}, {}))
                .toEqual({srcLeft: 0, srcTop: 0, srcWidth: 50, srcHeight: 30, destWidth: 50, destHeight: 30});
        });

        it('should return default values with big sizes', () => {
            expect(fac._prepareSizeAndPosition({width: 1000, height: 500}, {}))
                .toEqual({srcLeft: 0, srcTop: 0, srcWidth: 1000, srcHeight: 500, destWidth: 100, destHeight: 50});

            expect(fac._prepareSizeAndPosition({width: 500, height: 1000}, {}))
                .toEqual({srcLeft: 0, srcTop: 0, srcWidth: 500, srcHeight: 1000, destWidth: 50, destHeight: 100});
        });

        it('should return default values with precision mode', () => {
            expect(fac._prepareSizeAndPosition({width: 1000, height: 500}, {mode: 'precision'}))
                .toEqual({srcLeft: 0, srcTop: 0, srcWidth: 1000, srcHeight: 500, destWidth: 1000, destHeight: 500});
        });
    });

    describe('isDark', () => {
        it('should return dark color', () => {
            [
                {color: [0, 0, 0], expected: true},
                {color: [255, 255, 255], expected: false},
                {color: [255, 0, 0], expected: true},
                {color: [0, 100, 0], expected: true},
                {color: [204, 108, 92], expected: false},
                {color: [238, 144, 134], expected: false},
                {color: [123, 151, 175], expected: false}
            ].forEach(item => {
                expect(isDark(item.color)).toEqual(item.expected);
            });
        });
    });
});
