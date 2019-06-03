import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20/lib';
import GitHubStrategy  from 'passport-github/lib';

passport.use(
    new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    }, (accessToken, refreshToken, profile, done) => {
      // TODO check if user exists in the
      //  database using the googleId
      // TODO create the user if they don't exist
      done(profile);
    }),
);

passport.use(
    new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    }, (accessToken, refreshToken, profile, done) => {
      done(profile);
    }),
);

const GoogleAuthenticate = (request, response) => new Promise(
    (resolve, reject) => {
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

const GitHubAuthenticate = (request, response) => new Promise(
    (resolve, reject) => {
      passport.authenticate(
          'github',
          { scope: ['user:email'] }
      )(request, response);
    },
);

export { GoogleAuthenticate , GitHubAuthenticate };
