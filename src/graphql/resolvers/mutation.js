import {UserInputError} from 'apollo-server';
import bcrypt from "bcrypt";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength"

export const Mutation = {
  register: async (_, { email, password }, { client }) => {
    if(!isEmail(email)){
      throw new UserInputError('Incorrect email format! 😢');
    }
    if(!isLength(password, 8)){
      throw new UserInputError('Password cannot be left blank or less than 8 characters! 😢');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return await client.createUser({ email, password: hashedPassword, salt });
  }
};
