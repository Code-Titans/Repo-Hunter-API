/* eslint-disable no-undef */
import { assert } from 'chai';
import { AuthenticationError } from 'apollo-server';
import jwt from 'jsonwebtoken';
import authenticateUser, { jwtSign } from './authorization';

describe('Authorization util', () => {
  const payload = { name: 'John Doe' };

  describe('authenticateUser function', () => {
    let req;

    beforeEach(() => {
      process.env = { SECRET_KEY: 'testing' };
      const token = jwt.sign(payload, process.env.SECRET_KEY);

      req = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
    });

    it('should return the signed payload', () => {
      assert(authenticateUser(req), payload);
    });

    it('should throw an error when the authorization '
      + 'header is not present in the request object', () => {
      req.headers.authorization = '';
      assert.throws(() => authenticateUser(req),
        AuthenticationError,
        'You are not authenticated');
    });
  });

  describe('jwtSign function', () => {
    it('should return a jwt token of type string', () => {
      assert.typeOf(jwtSign(payload), 'string');
    });
  });
});
