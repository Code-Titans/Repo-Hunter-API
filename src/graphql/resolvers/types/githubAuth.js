import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

export default async (_, { code }) => {
  const body = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
  };
  // TODO:
  //  Build the users profile from this section
  //  Encrypt the access_token using jwt
  const { access_token: accessToken, token_type: tokenType } = await
  fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then(result => result.json())
    .then(json => json)
    .catch(err => console.error(err.message));
  const token = jwt.sign({ accessToken, tokenType }, process.env.SECRET_KEY);
  return {
    token,
  };
};
