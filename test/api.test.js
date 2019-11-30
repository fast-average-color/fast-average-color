import { assert } from 'chai';
import { getColor, getColorSync } from '../src/index';
import { defaultColor } from '../src/helpers/color';

describe('API', function() {
    describe('getColor()', function() {
        it('if resource is null return error', function(done) {
            getColor(null)
                .then(function() {
                    assert.fail();
                })
                .catch(function() {
                    done();
                });
        });
    });

    describe('getColorSync()', function() {
        it('if resource is null return default color', function() {
            const result = getColorSync(null);
            assert.deepEqual(result.value, defaultColor);
        });
    });
});
