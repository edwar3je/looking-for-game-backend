const bcrypt = require('bcrypt');
const db = require('../db');
const ExpressError = require('../helpers/expressError');
const { BCRYPT_WORK_FACTOR } = require('../config');

/** A class that contains account/profile specific methods. */

class User {

    /** A static method that checks if the user-provided information is valid. If the information is valid, the method creates
     *  a new account within the database and returns the user's account information. If the user does not provide enough 
     *  information, or provides a username or email that is already registered to an account, the method will throw an error.
     */
    
    static async register(username, email, password) {
        if(!username || !email || !password){
            throw new ExpressError('Missing information', 400)
        }

        const duplicateCheck = await db.query(
            `SELECT username
            FROM users
            WHERE username = $1`,
            [username]
        );

        if (duplicateCheck.rows[0]) {
            throw new ExpressError(
                `Please use a different username. ${username} is already taken.`, 400
            )
        }

        const emailCheck = await db.query(
            `SELECT email
            FROM users
            WHERE email = $1`,
            [email]
        );

        if (emailCheck.rows[0]) {
            //console.log('Not a unique email');
            throw new ExpressError(
                `Please use another email. ${email} is already registered to an account.`, 400
            )
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
            (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [username, email, hashedPassword]
        );
        
        return result.rows[0];
    }

    /** A static method that returns a user's account information if the information provided matches a given account.
     *  Throws an error if the account is either not in the database, or the user provides an incorrect password.
     */

    static async authenticate(username, password) {
        const result = await db.query(
            `SELECT *
            FROM users
            WHERE username = $1`,
            [username]
        );

        const user = result.rows[0];

        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        } else {
            throw new ExpressError('Cannot authenticate', 401);
        }
    }
}

module.exports = User;