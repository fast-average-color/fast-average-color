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

    it('should return correct average color if ignored color is RGB color', () => {
        const color = fac.getColorFromArray4([
            100, 100, 100, 255,
            210, 220, 230, 255,
            30, 30, 30, 255,
            0, 0, 0, 0,
            100, 100, 100, 30,
            200, 200, 200, 60,
        ], {
            algorithm: 'simple',
            ignoredColor: [30, 30, 30],
            step: 1
        });

        expect(color).toEqual([155, 160, 165, 255]);
    });

    it('should return correct average color if ignored color is own function', () => {
        const color = fac.getColorFromArray4([
            250, 0, 0, 255,
            100, 100, 100, 255,
            200, 0, 0, 255,
            0, 0, 0, 255,
        ], {
            algorithm: 'simple',
            ignoredColor: (data, index) => {
                return data[index] < 128;
            },
            step: 1
        });

        expect(color).toEqual([225, 0, 0, 255]);
    });

    it('should return correct average color with threshold', () => {
        const color = fac.getColorFromArray4([
            100, 0, 0, 255,
            99, 1, 1, 251,
            95, 5, 5, 0,
            100, 0, 0, 0,
            200, 0, 0, 255,
        ], {
            algorithm: 'simple',
            ignoredColor: [
                [100, 0, 0, 255, 5],
            ],
            step: 1
        });

        expect(color).toEqual([255, 0, 0, 255]);
    });
});
