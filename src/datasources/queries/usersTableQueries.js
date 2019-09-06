import knex from '../../../knex';

export const createUser = async (userDetails) => {
  const {
    name,
    login: username,
    bio,
    avatarUrl: picture,
    company,
    email,
    location,
    websiteUrl: website,
    // eslint-disable-next-line camelcase
    isHireable: is_hireable,
  } = userDetails;
  const user = await knex.raw(`
    INSERT INTO users(
    name,
    username,
    bio,
    picture,
    company,
    email,
    location,
    website,
    is_hireable
    )
    VALUES(
    :name,
    :username,
    :bio,
    :picture,
    :company,
    :email,
    :location,
    :website,
    :is_hireable
    )
    ON CONFLICT ON CONSTRAINT users_username_unique DO UPDATE
    SET 
      name = EXCLUDED.name, 
      username = EXCLUDED.username,
      bio = EXCLUDED.bio,
      picture = EXCLUDED.picture,
      company = EXCLUDED.company, 
      email = EXCLUDED.email,
      location = EXCLUDED.location, 
      website = EXCLUDED.website,
      is_hireable = EXCLUDED.is_hireable
    RETURNING id, username, picture;
  `, {
    name,
    username,
    bio,
    picture,
    company,
    email,
    location,
    website,
    is_hireable,
  });
  return user.rows[0];
};

export const getUserDetails = async (ids) => {
  const user = await knex
    .select('*')
    .from('users')
    .whereIn('id', [ids]);
  return user;
};

export const getUserById = async (ids) => {
  const user = await knex
    .select('*')
    .from('users')
    .whereIn('id', [ids]);
  return user;
};
