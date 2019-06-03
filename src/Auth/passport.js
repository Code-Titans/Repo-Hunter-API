import GitHubStrategy from 'passport-github';
import  passport from "passport";

const CALL_BACK_URL = 'http://127.0.0.1:4000/repoHunter';

passport.use( new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callBackURL: CALL_BACK_URL
  },( accessToken, refreshToken, profile, done ) => {
  console.log("reached here");
   done(profile);
}));

