process.env.NODE_ENV = 'test';

const db = require('../db');
const bcrypt = require('bcrypt');
const { BCRYPT_WORK_FACTOR } = require('../config');
const jwt = require('jsonwebtoken');

const createToken = require('../helpers/createToken');

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
        )
    }
});

afterEach(async () => {
    await db.query('DELETE FROM users');
});

afterAll(async () => {
    await db.end();
});

describe('createToken', () => {
    test('it should create a string representing a token that contains information', async () => {
        const info = {username: 'aDefaultUserName', password: 'aHashedPass', email: 'someemail@gmail.com'}
        const result = createToken(info);
        expect(result).not.toEqual(info);
        const decode = jwt.decode(result);
        console.log(decode);
        expect(decode.username).toEqual('aDefaultUserName');
        expect(decode.password).toEqual('aHashedPass');
        expect(decode.email).toEqual('someemail@gmail.com');
    })
});