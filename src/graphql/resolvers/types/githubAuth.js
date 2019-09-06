import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import { GraphQLClient } from 'graphql-request';

const getUserDetailsFromGithub = async (accessToken) => {
  const endpoint = 'http://localhost:4200/';
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: { authorization: `Bearer ${accessToken}` },
  });
  const query = `
    {
      viewer {
        name
        login
        bio
        avatarUrl
        company
        email
        isHireable
        location
        websiteUrl
      }
    }
  `;

  try {
    const { viewer } = await graphQLClient.request(query);
    return viewer;
  } catch (e) {
    console.error(JSON.stringify(e, undefined, 2));
  }
};

export default async (_, { code }, { client }) => {
  const body = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
  };
  const { access_token: accessToken } = await
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
  const userProfile = await getUserDetailsFromGithub(accessToken);
  const user = await client.createUser(userProfile);
  const token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + 3600,
    data: { ...user, accessToken },
  }, process.env.SECRET_KEY);
  return {
    token,
  };
};
