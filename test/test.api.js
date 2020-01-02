'use strict';

const
    assert = require('chai').assert,
    FastAverageColor = require('../dist/index.common');

describe('API', function() {
    const defaultColor = [0, 0, 0, 0];

    describe('getColor()', function() {
        it('if resource is null return default color', function() {
            const fac = new FastAverageColor();
            const result = fac.getColor(null);
            assert.deepEqual(result.value, defaultColor);
        });
    });

    describe('getColorAsync()', function() {
        it('if resource is null return error', function(done) {
            const fac = new FastAverageColor();
            fac.getColorAsync(null)
                .then(function() {
                    assert.fail();
                })
                .catch(function() {
                    done();
                });
        });
    });

    describe('getColorFromArray4()', function() {
        it('if incorrect params should return default color', function() {
            const
                fac = new FastAverageColor(),
                color = fac.getColorFromArray4([0]);

            assert.deepEqual(color, defaultColor);
        });

        it('if incorrect params should return my default color', function() {
            const
                myDefaultColor = [0, 0, 0, 0],
                fac = new FastAverageColor(),
                color = fac.getColorFromArray4([0], {defaultColor: myDefaultColor});

            assert.deepEqual(color, myDefaultColor);
        });

        it('should return transparent color', function() {
            const algorithms = ['simple', 'sqrt', 'dominant'];
            const fac = new FastAverageColor();

            algorithms.forEach(algorithm => {
                const color = fac.getColorFromArray4([
                    100, 100, 100, 0,
                    0, 0, 0, 0
                ], {algorithm});

                assert.deepEqual(color, [0, 0, 0, 0]);
            });
        });

        it('should return sqrt average color', function() {
            const fac = new FastAverageColor();

            let color = fac.getColorFromArray4([
                100, 100, 100, 100,
                200, 200, 200, 200
            ]);

            assert.deepEqual(color, [173, 173, 173, 150]);

            color = fac.getColorFromArray4([
                100, 100, 100, 255,
                200, 200, 200, 255
            ]);

            assert.deepEqual(color, [158, 158, 158, 255]);
        });

        it('should return average color using simple algorithm', function() {
            const fac = new FastAverageColor();

            let color = fac.getColorFromArray4([
                100, 100, 100, 100,
                200, 200, 200, 200
            ], {
                algorithm: 'simple',
                step: 1
            });

            assert.deepEqual(color, [167, 167, 167, 150]);

            color = fac.getColorFromArray4([
                100, 100, 100, 255,
                200, 200, 200, 255
            ], {
                algorithm: 'simple',
                step: 1
            });

            assert.deepEqual(color, [150, 150, 150, 255]);
        });

        it('should return average color using dominant algorithm', function() {
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

            assert.deepEqual(color, [197, 197, 197, 200]);
        });

        it('should return simple average color with ignored color using sqrt algorithm', function() {
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

            assert.deepEqual(color, [255, 0, 0, 255]);
        });

        it('should return sqrt average color with ignored color using sqrt algorithm', function() {
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

            assert.deepEqual(color, [255, 0, 0, 255]);
        });

        it('should return dominant average color with ignored color using dominant algorithm', function() {
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

            assert.deepEqual(color, [255, 0, 0, 255]);
        });

        it('should return average color with step', function() {
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

            assert.deepEqual(color, [132, 132, 132, 125]);
        });
    });

    describe('_getOption()', function() {
        it('should return default value', function() {
            const fac = new FastAverageColor();
            assert.strictEqual(fac._getOption({}, 'left', 0), 0);
        });

        it('should return the option', function() {
            const fac = new FastAverageColor();
            assert.strictEqual(fac._getOption({left: 10}, 'left', 0), 10);
        });
    });

    describe('_prepareSizeAndPosition()', function() {
        const fac = new FastAverageColor();

        it('should return values', function() {
            assert.deepEqual(
                fac._prepareSizeAndPosition({width: 1000, height: 500}, {left: 10, top: 20, width: 300, height: 200}),
                {srcLeft: 10, srcTop: 20, srcWidth: 300, srcHeight: 200, destWidth: 100, destHeight: 67}
            );
        });

        it('should return default values with small sizes', function() {
            assert.deepEqual(
                fac._prepareSizeAndPosition({width: 50, height: 30}, {}),
                {srcLeft: 0, srcTop: 0, srcWidth: 50, srcHeight: 30, destWidth: 50, destHeight: 30}
            );
        });

        it('should return default values with big sizes', function() {
            assert.deepEqual(
                fac._prepareSizeAndPosition({width: 1000, height: 500}, {}),
                {srcLeft: 0, srcTop: 0, srcWidth: 1000, srcHeight: 500, destWidth: 100, destHeight: 50}
            );

            assert.deepEqual(
                fac._prepareSizeAndPosition({width: 500, height: 1000}, {}),
                {srcLeft: 0, srcTop: 0, srcWidth: 500, srcHeight: 1000, destWidth: 50, destHeight: 100}
            );
        });

        it('should return default values with precision mode', function() {
            assert.deepEqual(
                fac._prepareSizeAndPosition({width: 1000, height: 500}, {mode: 'precision'}),
                {srcLeft: 0, srcTop: 0, srcWidth: 1000, srcHeight: 500, destWidth: 1000, destHeight: 500}
            );
        });
    });

    describe('_isDark', function() {
        it('should return dark color', function() {
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
                assert.equal(fac._isDark(item.color), item.expected, item.color.join());
            });
        });
    });
});
