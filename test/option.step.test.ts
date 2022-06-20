import { FastAverageColor } from '../src/index';

describe('Options: step', () => {
    const fac = new FastAverageColor();

    it('should return average color with step', () => {
        const color = fac.getColorFromArray4(
            [
                100, 100, 100, 100,
                200, 200, 200, 200,
                150, 150, 150, 150,
                50, 50, 50, 50
            ],
            { step: 2 }
        );

        expect(color).toEqual([132, 132, 132, 125]);
    });
});
