import fetch from 'node-fetch';
import { GraphQLClient } from 'graphql-request';
import { jwtSign } from '../../../auth/authorization';

export const getUserDetailsFromGithub = async (accessToken) => {
  const graphQLClient = new GraphQLClient('https://api.github.com/graphql', {
    headers: {
      Authorization: `token ${accessToken}`,
    },
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

export const getAccessTokenFromGithub = async (body) => {
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
  return accessToken;
};

export default async (_, { code }, { client }) => {
  const body = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
  };
  const accessToken = await getAccessTokenFromGithub(body);
  const userProfile = await getUserDetailsFromGithub(accessToken);
  const user = await client.createUser(userProfile);
  const payload = { ...user, accessToken };
  const token = jwtSign(payload);
  return {
    token,
  };
};
