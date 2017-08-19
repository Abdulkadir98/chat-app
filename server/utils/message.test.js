var expect = require('expect');

var {generateMessage,generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should return a valid object', () => {
        var res = generateMessage('AKO', 'Yo sup dawg');
        expect(res.from).toBe('AKO');
        expect(res.text).toBe('Yo sup dawg');
        expect(res.createdAt).toBeA('number');
    });
});

describe('generateLocationMessage', () => {
    it('should generate a vaild location object', () => {
        var from = 'Admin';
        var latitude = 1;
        var longitude = 1;
        var url = 'https://www.google.com/maps?q=1,1';
        var res = generateLocationMessage(from, latitude, longitude);
        expect(res).toInclude({from,url});
    });
});