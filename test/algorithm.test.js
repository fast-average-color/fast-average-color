import { assert } from 'chai';
import { getColorFromArray4 } from '../src/index';
import { defaultColor } from '../src/helpers/color';

describe('Algorithms', function() {
    it('if incorrect params should return default color', function() {
        const color = getColorFromArray4([0]);

        assert.deepEqual(color, defaultColor);
    });

    it('if incorrect params should return my default color', function() {
        const
            myDefaultColor = [0, 0, 0, 0],
            color = getColorFromArray4([0], {defaultColor: myDefaultColor});

        assert.deepEqual(color, myDefaultColor);
    });

    it('should return transparent color', function() {
        const algorithms = ['simple', 'sqrt', 'dominant'];
        algorithms.forEach(algorithm => {
            const color = getColorFromArray4([
                100, 100, 100, 0,
                0, 0, 0, 0
            ], {algorithm});

            assert.deepEqual(color, [0, 0, 0, 0]);
        });
    });

    it('should return sqrt average color', function() {
        let color = getColorFromArray4([
            100, 100, 100, 100,
            200, 200, 200, 200
        ]);

        assert.deepEqual(color, [173, 173, 173, 150]);

        color = getColorFromArray4([
            100, 100, 100, 255,
            200, 200, 200, 255
        ]);

        assert.deepEqual(color, [158, 158, 158, 255]);
    });

    it('should return average color using simple algorithm', function() {
        let color = getColorFromArray4([
            100, 100, 100, 100,
            200, 200, 200, 200
        ], {
            algorithm: 'simple',
            step: 1
        });

        assert.deepEqual(color, [167, 167, 167, 150]);

        color = getColorFromArray4([
            100, 100, 100, 255,
            200, 200, 200, 255
        ], {
            algorithm: 'simple',
            step: 1
        });

        assert.deepEqual(color, [150, 150, 150, 255]);
    });

    it('should return average color using dominant algorithm', function() {
        const color = getColorFromArray4([
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

    it('should return average color with step', function() {
        const color = getColorFromArray4(
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
