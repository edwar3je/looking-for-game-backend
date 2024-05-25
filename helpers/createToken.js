const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

/** A helper function designed to create JSON web tokens (JWTs) that store a user's account information.
 * 
 *      createToken({username: 'username1', email: 'anexample@gmail.com', ...}, 'a secret key') => 'asdlkfusaweoasidfjsvdlkxcjv'
 * 
 */

const createToken = (userInfo) => {
    const token = jwt.sign(userInfo, SECRET_KEY);
    return token
}

module.exports = createToken;