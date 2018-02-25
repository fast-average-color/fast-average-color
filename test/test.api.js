'use strict';

const
    assert = require('chai').assert,
    FastAverageColor = require('../dist/index');

describe('API', function() {
    const defaultColor = [255, 255, 255, 255];

    describe('getColorFromArray3()', function() {
        it('if incorrect params should return default color', function() {
            const
                fac = new FastAverageColor(),
                color = fac.getColorFromArray3([0]);

            assert.deepEqual(color, defaultColor);
        });
        
        it('if incorrect params should return my default color', function() {
            const
                myDefaultColor = [0, 0, 0, 0],
                fac = new FastAverageColor({defaultColor: myDefaultColor}),
                color = fac.getColorFromArray3([0]);

            assert.deepEqual(color, myDefaultColor);
        });

        it('should return average color', function() {
            const
                fac = new FastAverageColor(),
                color = fac.getColorFromArray3([
                    100, 100, 100,
                    200, 200, 200
                ]);
            assert.deepEqual(color, [150, 150, 150, 255]);
        });
        
        it('should return average color with step', function() {
            const
                fac = new FastAverageColor(),
                color = fac.getColorFromArray3(
                    [
                        100, 100, 100,
                        200, 200, 200,
                        150, 150, 150,
                        50, 50, 50
                    ],
                    2
                );

            assert.deepEqual(color, [125, 125, 125, 255]);
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
                fac = new FastAverageColor({defaultColor: myDefaultColor}),
                color = fac.getColorFromArray4([0]);

            assert.deepEqual(color, myDefaultColor);
        });

        it('should return average color', function() {
            const
                fac = new FastAverageColor(),
                color = fac.getColorFromArray4([
                    100, 100, 100, 100,
                    200, 200, 200, 200
                ]);

            assert.deepEqual(color, [150, 150, 150, 150]);
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
                    2
                );

            assert.deepEqual(color, [125, 125, 125, 125]);
        });
    });
});
