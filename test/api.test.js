import FastAverageColor from '../dist/index.common';

describe('API', () => {
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

        it('should return simple average color with ignored color using sqrt algorithm', () => {
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

        it('should return sqrt average color with ignored color using sqrt algorithm', () => {
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

        it('should return dominant average color with ignored color using dominant algorithm', () => {
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

        it('should return average color with step', () => {
            const
                fac = new FastAverageColor(),
                color = fac.getColorFromArray4(
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

    describe('_getOption()', () => {
        it('should return default value', () => {
            const fac = new FastAverageColor();
            expect(fac._getOption({}, 'left', 0)).toEqual(0);
        });

        it('should return the option', () => {
            const fac = new FastAverageColor();
            expect(fac._getOption({left: 10}, 'left', 0)).toEqual(10);
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

    describe('_isDark', () => {
        it('should return dark color', () => {
            const fac = new FastAverageColor();

            [
                {color: [0, 0, 0], expected: true},
                {color: [255, 255, 255], expected: false},
                {color: [255, 0, 0], expected: true},
                {color: [0, 100, 0], expected: true},
                {color: [204, 108, 92], expected: false},
                {color: [238, 144, 134], expected: false},
                {color: [123, 151, 175], expected: false}
            ].forEach(item => {
                expect(fac._isDark(item.color)).toEqual(item.expected);
            });
        });
    });
});
