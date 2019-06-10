import jwt from 'jsonwebtoken';
import { UserInputError } from 'apollo-server';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';

const secretKey = process.env.SECRET_KEY;

export const generateToken = payload => (
  jwt.sign(payload, secretKey, { algorithm: 'HS256', expiresIn: '120h' })
);

export const validateInput = (email, password) => {
  if (!isEmail(email)) {
    throw new UserInputError('Incorrect email format! 😢');
  }
  if (password) {
    if (!isLength(password, 8)) {
      throw new UserInputError('Password cannot be less than 8 characters! 😢');
    }
  }
};
