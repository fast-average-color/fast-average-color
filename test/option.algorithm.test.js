import FastAverageColor from '../dist/index.common';

describe('Options: algorithm', () => {
    it('should return sqrt average color', () => {
        const fac = new FastAverageColor();

        let color = fac.getColorFromArray4([
            100, 100, 100, 100,
            200, 200, 200, 200
        ]);

        expect(color).toEqual([173, 173, 173, 150]);

        color = fac.getColorFromArray4([
            100, 100, 100, 255,
            200, 200, 200, 255
        ]);

        expect(color).toEqual([158, 158, 158, 255]);
    });

    it('should return average color using simple algorithm', () => {
        const fac = new FastAverageColor();

        let color = fac.getColorFromArray4([
            100, 100, 100, 100,
            200, 200, 200, 200
        ], {
            algorithm: 'simple',
            step: 1
        });

        expect(color).toEqual([167, 167, 167, 150]);

        color = fac.getColorFromArray4([
            100, 100, 100, 255,
            200, 200, 200, 255
        ], {
            algorithm: 'simple',
            step: 1
        });

        expect(color).toEqual([150, 150, 150, 255]);
    });

    it('should return average color using dominant algorithm', () => {
        const
            fac = new FastAverageColor(),
            color = fac.getColorFromArray4([
                100, 100, 100, 100,
                190, 190, 190, 200,
                200, 200, 200, 200,
                200, 200, 200, 200,
                50, 150, 0, 200
            ], {
                algorithm: 'dominant',
                step: 1
            });

        expect(color).toEqual([197, 197, 197, 200]);
    });
});
