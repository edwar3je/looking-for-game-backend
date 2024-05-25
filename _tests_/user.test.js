process.env.NODE_ENV = 'test';

const db = require('../db');
const bcrypt = require('bcrypt');
const { BCRYPT_WORK_FACTOR } = require('../config');

const User = require('../models/User');

beforeEach(async () => {
    let sampleUsers = [
        ['aDefaultUserName', 'anemail@gmail.com', await bcrypt.hash('password1', BCRYPT_WORK_FACTOR)],
        ['anotherUserName', 'another@gmail.com', await bcrypt.hash('password2', BCRYPT_WORK_FACTOR)],
        ['someGuyUser', 'someemail@gmail.com', await bcrypt.hash('password3', BCRYPT_WORK_FACTOR)]
    ];

    for (let user of sampleUsers){
        await db.query(
            `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`,
            [...user]
        );
    }
});

afterEach(async () => {
    await db.query('DELETE from users');
});

afterAll(async () => {
    await db.end();
});

describe('register', () => {
    test('It should create a new account and return the account information if valid information is provided', async() => {
        const result = await User.register('aDifferentUser', 'different@gmail.com', 'password4');
        expect(result.username).toEqual('aDifferentUser');
        expect(result.email).toEqual('different@gmail.com');
        expect(result.password).not.toEqual('password4');
        expect(result.karma).toEqual(100);
        const check = await db.query(`SELECT * FROM users WHERE username = $1`, ['aDifferentUser']);
        expect(check.rows[0].username).toEqual('aDifferentUser');
    });

    test('It should throw an error if there is any missing information', async() => {
        expect(async () => {
            await User.register('', 'different@gmail.com', 'password4');
        }).rejects.toThrow();
        expect(async () => {
            await User.register('aDifferentUser', '', 'password4');
        }).rejects.toThrow();
        expect(async () => {
            await User.register('aDifferentUser', 'different@gmail.com', '');
        }).rejects.toThrow();
        expect(async () => {
            await User.register('', '', '');
        }).rejects.toThrow();
    });

    test('It should throw an error if a non-unique username is provided', async() => {
        expect(async () => {
            await User.register('aDefaultUserName', 'different@gmail.com', 'password4')
        }).rejects.toThrow();
    });

    /** This test appears to not reject, but seems to fail the test directly below it unless the last two lines of code
     *  in the test below are included. My leading theory is that the beforeEach callback is somehow running after the
     *  test, thus causing it to not reject the new account since there isn't any email to compare it to. I say this because
     *  the message logged from the method (when a non-unique email is provided) is logged AFTER the message from the test.
     */

    test('It should throw an error if a non-unique email is provided', async() => {
        expect(async () => {
            await User.register('aDifferentUser', 'another@gmail.com', 'password4')
        }).rejects.toThrow();
        const result = await db.query('SELECT * FROM users');
        console.log(result.rows);
    });
});

describe('authenticate', () => {
    test('It should return account information if a valid username and password are provided', async() => {
        const result = await User.authenticate('aDefaultUserName', 'password1');
        expect(result.username).toEqual('aDefaultUserName');
        expect(result.email).toEqual('anemail@gmail.com');
        expect(result.password).not.toEqual('password1');
        expect(result.karma).toEqual(100);
    });

    test('It should throw an error if the database does not contain an account with the provided username', async() => {
        expect(async () => {
            await User.authenticate('nonExistUser', 'password1');
        }).rejects.toThrow();
    });

    test('It should throw an error if the wrong password is provided', async() => {
        expect(async () => {
            await User.authenticate('aDefaultUserName', 'password2');
        }).rejects.toThrow();
    });
});