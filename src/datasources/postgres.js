import { Pool } from 'pg';
import { ForbiddenError } from 'apollo-server';

class PostgresAPI extends Pool {
  constructor(config) {
    super(config);
    this.on('connect', () => {
      console.log('connected to the database');
    });
  }

  socialAuthCreateUser = async ({ picture, email, name }) => {
    const user = await this.query(
      `
      INSERT INTO user_details(email, name, profile_pic)
      VALUES($1, $2, $3)
      RETURNING user_id, email
      `,
      [email, name, picture],
    )
      .then(res => res.rows[0])
      .catch(err => err.message);
    return this.userReducer(user);
  };

  createUser = async ({ email, password } = {}) => {
    const user = await this.query(
      `
        INSERT INTO user_details(email, password) 
        VALUES($1, $2)
        RETURNING user_id, email
        `,
      [email, password],
    )
      .then(res => res.rows[0])
      .catch(err => err.message);
    return this.userReducer(user);
  };

  postRepo = async ({ link, description, userId }) => {
    const repo = await this.query(
      `
      INSERT INTO repositories(repo_link, description, user_id)
      VALUES($1, $2, $3)
      RETURNING repo_id, repo_link, description
      `,
      [link, description, userId]
    )
    .then(res => res.rows[0])
    .catch(err => err.message);

    return this.repoReducer(repo)
  };

  getUserByEmail = async (email) => {
    const user = await this.query(
      `
        SELECT user_id, email, password 
        FROM user_details
        WHERE email=$1
        `,
      [email],
    )
      .then(res => res.rows[0])
      .catch(err => err.message);
    return user;
  };

  getAllUsers = async () => {
    const users = await this.query('SELECT * FROM user_details')
      .then(res => res.rows)
      .catch(err => console.error(err.message, err.stack));
    return users.map(user => this.userReducer(user));
  };

  getUserById = async (id) => {
    const user = await this.query(
      `
        SELECT * 
        FROM user_details
        WHERE user_id=$1
        `,
      [id],
    )
      .then(res => res.rows[0])
      .catch(err => err.message);
    return this.userReducer(user);
  };

  getRepository = async (repoId) => {
    const repository = await this.query(
      `
      SELECT *
      FROM repositories
      WHERE repo_id=$1
      `,
      [repoId],
    )
      .then(res => res.rows[0])
      .catch(err => err.message);

    if (!repository) throw Error('Repo not found');

    return this.repoReducer(repository);
  };

  repoReducer = (repository) => {
    if (typeof repository === 'string') throw new ForbiddenError(repository);
    const { repo_id: id, description, repo_link: repoLink } = repository;
    return { id, description, repoLink };
  };

  userReducer = (user) => {
    if (!user) throw Error('User not found');
    if (typeof user === 'string') throw new ForbiddenError(user);
    const {
      user_id: id, email, username, profilePic,
    } = user;
    return {
      id, email, username, profilePic,
    };
  };

  getUserAndRepo = async (userId, repoId) => {
    const details = await Promise.all([
      this.getUserById(userId),
      this.getRepository(repoId),
    ])
      .then(async res => res)
      .catch((err) => {
        throw new Error(err.message);
      });
    return { author: details[0], repo: details[1] };
  }
}

export default PostgresAPI;
