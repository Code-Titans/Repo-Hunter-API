import jwt from  'jsonwebtoken';
import {UserInputError} from 'apollo-server';
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";


const secrete_key  =  process.env.SECRETE_KEY;

 export const generateToken = (payload) => {
  return jwt.sign({ payload } ,secrete_key, {algorithm: 'HS256', expiresIn: '1h' });
};



export const validateInput = (email, password) => {
  if(!isEmail(email)){
    throw new UserInputError('Incorrect email format! 😢');
  }
  if(!isLength(password, 8)){
    throw new UserInputError('Password cannot be left blank or less than 8 characters! 😢');
  }
};
