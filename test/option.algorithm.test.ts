import { FastAverageColor } from '../src/index';

describe('Options: algorithm', () => {
    const fac = new FastAverageColor();

    it('should return sqrt average color', () => {
        const color = fac.getColorFromArray4([
            100, 100, 100, 255,
            200, 200, 200, 255
        ]);

        expect(color).toEqual([158, 158, 158, 255]);
    });

    it('should return sqrt average color with transparent colors', () => {
        const color = fac.getColorFromArray4([
            100, 100, 100, 100,
            200, 200, 200, 200
        ]);

        expect(color).toEqual([173, 173, 173, 150]);
    });

    it('should return average color using simple algorithm', () => {
        const color = fac.getColorFromArray4([
            100, 100, 100, 255,
            200, 200, 200, 255
        ], {
            algorithm: 'simple',
            step: 1
        });

        expect(color).toEqual([150, 150, 150, 255]);
    });

    it('should return average color using simple algorithm with transparent color', () => {
        const color = fac.getColorFromArray4([
            100, 100, 100, 100,
            200, 200, 200, 200
        ], {
            algorithm: 'simple',
            step: 1
        });

        expect(color).toEqual([167, 167, 167, 150]);
    });

    it('should return average color using dominant algorithm', () => {
        const color = fac.getColorFromArray4([
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

    it('should return average color using dominant algorithm with dominantDivider', () => {
        const color = fac.getColorFromArray4([
            100, 100, 100, 100,
            190, 190, 190, 200,
            200, 200, 200, 200,
            200, 200, 200, 200,
            50, 150, 0, 200
        ], {
            algorithm: 'dominant',
            dominantDivider: 128,
        });

        expect(color).toEqual([160, 160, 160, 150]);
    });

    it('should return fully transparent color', () => {
        const algorithms = ['simple', 'sqrt', 'dominant'] as const;

        algorithms.forEach(algorithm => {
            const color = fac.getColorFromArray4([
                100, 100, 100, 0,
                200, 250, 55, 0,
                0, 0, 0, 0
            ], { algorithm });

            expect(color).toEqual([0, 0, 0, 0]);
        });
    });
});
