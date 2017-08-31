const expect = require('expect');

var {isRealString} = require('./validation');

describe('isRealString', ()=> {
    it('should reject non-string names', () => {
        var res = isRealString(98);
        expect(res).toBe(false);
    });

    it('should reject strings with only spaces', () => {
        var res = isRealString('      ');
        expect(res).toBe(false);
    });

    it('should accept string with non-sapce characters', () => {
        var res = isRealString('Ako');
        expect(res).toBe(true);
    });
});