const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  checkAuth: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token
        .split(' ')
        .pop()
        .trim();
    }

    console.log("token", token);

    if (!token) {
      throw new AuthenticationError('You must be logged in!');
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (error) {
      throw new AuthenticationError(`Token verification failed: ${error.message}`);

    }

    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign(
      { data: payload },
      secret,
      { expiresIn: expiration }
    );
  }
};
