var expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage', () => {
    it('should return a valid object', () => {
        var res = generateMessage('AKO', 'Yo sup dawg');
        expect(res.from).toBe('AKO');
        expect(res.text).toBe('Yo sup dawg');
        expect(res.createdAt).toBeA('number');
    });
});