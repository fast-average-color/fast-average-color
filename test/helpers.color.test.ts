import { arrayToHex, isDark } from '../src/helpers/color';

describe('Helpers: color', () => {
    describe('#isDark', () => {
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

    describe('#arrayToHex', () => {
        it('should return hex rgb color', () => {
            expect(arrayToHex([10, 20, 30])).toEqual('#0a141e');
        });

        it('should return hex rgba color', () => {
            expect(arrayToHex([10, 20, 30, 40])).toEqual('#0a141e28');
        });
    });
});
