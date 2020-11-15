import { getOption } from '../src/helpers/option';

describe('Helpers: options', () => {
    describe('getOption()', () => {
        it('should return default value', () => {
            expect(getOption({}, 'left', 0)).toEqual(0);
        });

        it('should return the option', () => {
            expect(getOption({ left: 10 }, 'left', 0)).toEqual(10);
        });
    });
});
