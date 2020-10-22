import FastAverageColor from '../dist/index.common';

describe('Options: ignoredColor', () => {
    it('should return simple average color with ignored color', () => {
        const
            fac = new FastAverageColor(),
            color = fac.getColorFromArray4([
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
        const
            fac = new FastAverageColor(),
            color = fac.getColorFromArray4([
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
        const
            fac = new FastAverageColor(),
            color = fac.getColorFromArray4([
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
        const
            fac = new FastAverageColor(),
            color = fac.getColorFromArray4([
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
});
