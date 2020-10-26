import FastAverageColor from '../src';

describe('Options: ignoredColor', () => {
    const fac = new FastAverageColor();

    it('should return simple average color with ignored color', () => {
        const color = fac.getColorFromArray4([
            255, 255, 255, 255,
            255, 255, 255, 255,
            255, 0, 0, 255,
            255, 0, 0, 255,
        ], {
            algorithm: 'simple',
            ignoredColor: [255, 255, 255, 255],
            step: 1
        });

        expect(color).toEqual([255, 0, 0, 255]);
    });

    it('should return simple average color with some ignored colors', () => {
        const color = fac.getColorFromArray4([
            255, 255, 255, 255,
            255, 255, 255, 255,
            0, 0, 0, 255,
            255, 0, 0, 255,
            255, 0, 0, 255,
        ], {
            algorithm: 'simple',
            ignoredColor: [
                [255, 255, 255, 255],
                [0, 0, 0, 255]
            ],
            step: 1
        });

        expect(color).toEqual([255, 0, 0, 255]);
    });

    it('should return sqrt average color with ignored color', () => {
        const color = fac.getColorFromArray4([
            255, 255, 255, 255,
            255, 255, 255, 255,
            255, 0, 0, 255,
            255, 0, 0, 255,
        ], {
            ignoredColor: [255, 255, 255, 255],
            step: 1
        });

        expect(color).toEqual([255, 0, 0, 255]);
    });

    it('should return dominant average color with ignored color', () => {
        const color = fac.getColorFromArray4([
            255, 255, 255, 255,
            255, 255, 255, 255,
            255, 0, 0, 255,
            255, 0, 0, 255,
        ], {
            algorithm: 'dominant',
            ignoredColor: [255, 255, 255, 255],
            step: 1
        });

        expect(color).toEqual([255, 0, 0, 255]);
    });

    it('should return correct average color if ignored color is fully transparent', () => {
        const color = fac.getColorFromArray4([
            255, 255, 255, 255,
            0, 0, 0, 0,
            100, 100, 100, 0,
            200, 200, 200, 0,
        ], {
            ignoredColor: [10, 10, 10, 0],
            step: 1
        });

        expect(color).toEqual([255, 255, 255, 255]);
    });
});
