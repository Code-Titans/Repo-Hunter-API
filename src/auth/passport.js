import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:4200/',
  }, (accessToken, refreshToken, profile, done) => {
    // TODO check if user exists in the
    //  database using the googleId
    // TODO create the user if they don't exist
    done(profile);
  }),
);

const authenticateGoogle = (request, response) => new Promise(
  (resolve, reject) => {
    console.log(request);
    passport.authenticate(
      'google',
      { scope: ['profile'] },
      (err, data, info) => {
        if (err) reject(err);
        resolve({ data, info });
      },
    )(request, response);
  },
);

export default authenticateGoogle;
