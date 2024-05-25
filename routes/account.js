const express = require('express');
const router = express.Router();

const User = require('../models/User');
const createToken = require('../helpers/createToken');

/** POST
 * 
 * Allows a user to create an account. Returns a valid json web token (JWT) that contains the user's account information.
 * Throws an error if any invalid data is provided (e.g. non-unique handle, non-unique email, missing data, etc.).
 * 
 * TD: Once initial sign-up is implemented, change the functionality so that it sends the user a link to their email which
 *     will allow them to verify their account (doing so should then give the user a JWT).
 * 
 */

router.post('/sign-up', async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        let user = await User.register(username, email, password);
        const token = createToken(user);
        return res.status(201).json({ token });
    } catch (err) {
        return next(err)
    }
});

/** POST
 * 
 * Finalizes/verifies the user's new account and provides a JSON web token if the right link is used (based on link).
 * Throws an error if a non-valid link is provided.
 * 
 */

/*router.post('/sign-up/:emailLink', async (req, res, next) => {
    try {
        const { emailLink } = req.params;
        fffff
    } catch (err) {
        return next(err)
    }
});*/

/** POST
 * 
 * Allows a user to sign into an existing account. Returns a valid json web token (JWT) that contains the user's account information.
 * Throws an error if authentication fails.
 *
 */

router.post('/log-in', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        let user = await User.authenticate(username, password);
        const token = createToken(user);
        return res.status(201).json({ token });
    } catch (err) {
        return next(err);
    }
});

/** POST
 * 
 * Allows a user to reset the password on their account by providing their email and sending a link via email (for the frontend) that will allow them
 * to change their password. Throws an error if a non-valid email is provided (email does not match reg exp, or email doesn't exist in database).
 * 
 */

/*router.post('/forgot-password', async (req, res, next) => {
    try {
        ffff
    } catch (err) {
        return next(err)
    }
});*/

/** POST
 * 
 * Resets a user's password if the proper link is provided (based on the email) and a valid password is provided. Throws an error a non-valid password (or no
 * password) is provided.
 * 
 */

module.exports = router;