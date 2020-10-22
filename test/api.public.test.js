import FastAverageColor from '../dist/index.common';

describe('Public API', () => {
    const defaultColor = [0, 0, 0, 0];

    describe('getColor()', () => {
        it('if resource is null return default color', () => {
            const fac = new FastAverageColor();
            const result = fac.getColor(null);

            expect(result.value).toEqual(defaultColor);
        });
    });

    describe('getColorAsync()', () => {
        it('if resource is null return error', () => {
            const fac = new FastAverageColor();

            return fac.getColorAsync(null).then(() => {}).catch((e) => {
                expect(e).toEqual(Error('FastAverageColor: call .getColorAsync() without resource.'));
            });
        });
    });

    describe('getColorFromArray4()', () => {
        it('if incorrect params should return default color', () => {
            const
                fac = new FastAverageColor(),
                color = fac.getColorFromArray4([0]);

            expect(color).toEqual(defaultColor);
        });

        it('if incorrect params should return my default color', () => {
            const
                myDefaultColor = [0, 0, 0, 0],
                fac = new FastAverageColor(),
                color = fac.getColorFromArray4([0], {defaultColor: myDefaultColor});

            expect(color).toEqual(myDefaultColor);
        });

        it('should return transparent color', () => {
            const algorithms = ['simple', 'sqrt', 'dominant'];
            const fac = new FastAverageColor();

            algorithms.forEach(algorithm => {
                const color = fac.getColorFromArray4([
                    100, 100, 100, 0,
                    0, 0, 0, 0
                ], {algorithm});

                expect(color).toEqual([0, 0, 0, 0]);
            });
        });
    });

    it('destroy()', () => {
        const fac = new FastAverageColor();
        fac.destroy();
    });

    it('prepareResult()', () => {
        const fac = new FastAverageColor();
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
