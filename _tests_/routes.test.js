process.env.NODE_ENV = 'test';

const app = require('../app');
const request = require('supertest');
const db = require('../db');
const bcrypt = require('bcrypt');
const createToken = require('../helpers/createToken');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, BCRYPT_WORK_FACTOR } = require('../config');
const User = require('../models/User');

const tokens = {};

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
    await db.query('DELETE FROM users');
});

afterAll(async () => {
    await db.end();
});

describe('POST /account/sign-up', () => {
    test('It should return a valid json web token', async () => {
        const response = await request(app)
            .post('/account/sign-up')
            .send({ username: 'aDifferentUser', password: 'password4', email: 'different@gmail.com' });
        expect(response.statusCode).toEqual(201);
        const decode = jwt.decode(response.body.token);
        expect(decode.username).toEqual('aDifferentUser');
        expect(decode.email).toEqual('different@gmail.com');
        expect(decode.password).not.toEqual('password4');
    });

    test('It should throw an error if any information is missing', async () => {
        const response1 = await request(app)
            .post('/account/sign-up')
            .send({ password: 'password4', email: 'different@gmail.com' });
        const response2 = await request(app)
            .post('/account/sign-up')
            .send({ username: 'aDifferentUser', email: 'different@gmail.com' });
        const response3 = await request(app)
            .post('/account/sign-up')
            .send({ username: 'aDifferentUser', password: 'password4' });
        const response4 = await request(app)
            .post('/account/sign-up')
            .send({});
        expect(response1.statusCode).toEqual(400);
        expect(response2.statusCode).toEqual(400);
        expect(response3.statusCode).toEqual(400);
        expect(response4.statusCode).toEqual(400);
    });

    test('It should throw an error if a non-unique username is provided', async () => {
        const response = await request(app)
            .post('/account/sign-up')
            .send({ username: 'aDefaultUserName', email: 'different@gmail.com', password: 'password4' });
        expect(response.statusCode).toEqual(400);
    });

    test('It should throw an error if a non-unique email is provided', async () => {
        const response = await request(app)
            .post('/account/sign-up')
            .send({ username: 'aDifferentUser', email: 'anemail@gmail.com', password: 'password4' });
        expect(response.statusCode).toEqual(400);
    });
});

describe('POST /account/log-in', () => {
    test('It should return a valid json web token', async () => {
        const response = await request(app)
            .post('/account/log-in')
            .send({ username: 'aDefaultUserName', password: 'password1' });
        expect(response.statusCode).toEqual(201);
        const decode = jwt.decode(response.body.token);
        expect(decode.username).toEqual('aDefaultUserName');
        expect(decode.email).toEqual('anemail@gmail.com');
        expect(decode.password).not.toEqual('password1');
    });

    test('It should throw an error if a username is provided for a non-existant account', async () => {
        const response = await request(app)
            .post('/account/log-in')
            .send({ username: 'notAnAccount', password: 'password1' });
        expect(response.statusCode).toEqual(401);
    });

    test('It should throw an error if the wrong password is provided for the account', async () => {
        const response = await request(app)
            .post('/account/log-in')
            .send({ username: 'aDefaultUserName', password: 'password2' });
        expect(response.statusCode).toEqual(401);
    });
});