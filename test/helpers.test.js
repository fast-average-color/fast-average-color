import { assert } from 'chai';
import { getOption } from '../src/helpers/options';
import { prepareSizeAndPosition } from '../src/helpers/size';
import { isDark } from '../src/helpers/color';

describe('Helpers', function() {
    describe('getOption()', function() {
        it('should return default value', function() {
            assert.strictEqual(getOption({}, 'left', 0), 0);
        });

        it('should return the option', function() {
            assert.strictEqual(getOption({left: 10}, 'left', 0), 10);
        });
    });

    describe('prepareSizeAndPosition()', function() {
        it('should return values', function() {
            assert.deepEqual(
                prepareSizeAndPosition({width: 1000, height: 500}, {left: 10, top: 20, width: 300, height: 200}),
                {srcLeft: 10, srcTop: 20, srcWidth: 300, srcHeight: 200, destWidth: 100, destHeight: 67}
            );
        });

        it('should return default values with small sizes', function() {
            assert.deepEqual(
                prepareSizeAndPosition({width: 50, height: 30}, {}),
                {srcLeft: 0, srcTop: 0, srcWidth: 50, srcHeight: 30, destWidth: 50, destHeight: 30}
            );
        });

        it('should return default values with big sizes', function() {
            assert.deepEqual(
                prepareSizeAndPosition({width: 1000, height: 500}, {}),
                {srcLeft: 0, srcTop: 0, srcWidth: 1000, srcHeight: 500, destWidth: 100, destHeight: 50}
            );

            assert.deepEqual(
                prepareSizeAndPosition({width: 500, height: 1000}, {}),
                {srcLeft: 0, srcTop: 0, srcWidth: 500, srcHeight: 1000, destWidth: 50, destHeight: 100}
            );
        });

        it('should return default values with precision mode', function() {
            assert.deepEqual(
                prepareSizeAndPosition({width: 1000, height: 500}, {mode: 'precision'}),
                {srcLeft: 0, srcTop: 0, srcWidth: 1000, srcHeight: 500, destWidth: 1000, destHeight: 500}
            );
        });
    });

    describe('isDark()', function() {
        it('should return dark color', function() {
            [
                {color: [0, 0, 0], expected: true},
                {color: [255, 255, 255], expected: false},
                {color: [255, 0, 0], expected: true},
                {color: [0, 100, 0], expected: true},
                {color: [204, 108, 92], expected: false},
                {color: [238, 144, 134], expected: false},
                {color: [123, 151, 175], expected: false}
            ].forEach(item => {
                assert.equal(isDark(item.color), item.expected, item.color.join());
            });
        });
    });
});
