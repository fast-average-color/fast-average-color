import { FastAverageColor, FastAverageColorRgba } from '../src/index';

describe('Public API', () => {
    const defaultColor = [0, 0, 0, 0];
    const fac = new FastAverageColor();

    describe('getColor()', () => {
        it('if resource is null return error', () => {
            const result = fac.getColor(null);
            expect(result.error).toEqual(Error('FastAverageColor: call .getColor() without resource'));
            expect(result.value).toEqual(defaultColor);
        });
    });

    describe('getColorAsync()', () => {
        it('if resource is null return error', async() => {
            await expect(fac.getColorAsync(null)).rejects.toThrow(Error('FastAverageColor: call .getColorAsync() without resource'));
        });
    });

    describe('getColorFromArray4()', () => {
        it('if incorrect params should return default color', () => {
            const color = fac.getColorFromArray4([0]);

            expect(color).toEqual(defaultColor);
        });

        it('if incorrect params should return my default color', () => {
            const myDefaultColor: FastAverageColorRgba = [255, 0, 255, 255];
            const color = fac.getColorFromArray4([0], {
                defaultColor: myDefaultColor
            });

            expect(color).toEqual(myDefaultColor);
        });
    });

    it('destroy()', () => {
        const ac = new FastAverageColor();

        ac.destroy();
    });

    it('prepareResult()', () => {
        expect(fac.prepareResult([0, 0, 0, 255])).toEqual(
            {
                value: [0, 0, 0, 255],
                isDark: true,
                isLight: false,
                hex: '#000000',
                hexa: '#000000ff',
                rgb: 'rgb(0,0,0)',
                rgba: 'rgba(0,0,0,1)',
            }
        );
    });
});
