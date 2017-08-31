const expect = require('expect');

var {User} = require('./users');

describe('Users', () => {

    var users;
    beforeEach(() => {
        console.log('beforeEach block');
        users = new User();
        users.users = [{
            id:'1',
            name:'Ali',
            room:'fag'
        },{
            id:'2',
            name:'Allu',
            room:'queen'
        },{
            id:'3',
            name:'hatim',
            room:'fag'
        }];
    });
    it('should add new user', () => {
        var users = new User();
        var user ={
            id:'123',
            name: 'Abdul',
            room:'ISIS'
        };
        var resUser = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([user]);
    });

    it('should return users list for fag', () => {
        var userList = users.getUsersList('fag');
        expect(userList).toEqual(['Ali','hatim']);
    });
    it('should return users list for queen', () => {
        var userList = users.getUsersList('queen');
        expect(userList).toEqual(['Allu']);
    });
    it('should find a user', () => {
        var user = users.getUser('1');
        expect(user).toEqual({id:'1',name:'Ali',room:'fag'});
    })
});