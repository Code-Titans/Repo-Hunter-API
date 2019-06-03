import bcrypt from 'bcrypt';
import  passport from "passport";
import { generateToken, validateInput } from '../../helpers';
import PassportSetup from '../../Auth/passport';

import GitHubStrategy from 'passport-github';
const CALL_BACK_URL = 'http://127.0.0.1:4000/repoHunter';

passport.use( new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callBackURL: CALL_BACK_URL
},( accessToken, refreshToken, profile, done ) => {
  console.log("reached here");
  done(profile);
}));

const Mutation = {
  register: async (_, { email, password }, { client }) => {
    validateInput(email, password);
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await client.createUser({ email, password: hashedPassword });

    return user;
  },
  login: async (_, { email, password }, { client,  request, response }) => {

    try {
      const {data, info } =  passport.authenticate('github', { scope: [ 'user:email' ] })( request, response);
      console.log(data, info);
    }
    catch (e) {
      return e;
    }


    // validateInput(email, password);
    // const user = await client.getUserByEmail(email);
    //
    // if (!user) throw Error('User not found');
    // if (typeof user === 'string') throw Error(user);
    // const match = await bcrypt.compare(password, user.password);
    //
    // if (!match) throw new Error('Incorrect password');
    // const token = generateToken(user.email);
    //
    // return {
    //   token,
    //   user: {
    //     id: user.user_id,
    //     email: user.email,
    //   },
    // };
  },
};

export default Mutation;
