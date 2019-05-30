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

  getUserByEmail = async (email) => {
    const user = await this.query(
      `
        SELECT user_id, email, password FROM user_details
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

  getUser = async (id) => {
    const user = await this.query(
      `
        SELECT * FROM user_details
        WHERE user_id=$1
        `,
      [id],
    )
      .then(res => res.rows[0])
      .catch(err => console.error(err.message, err.stack));

    return this.userReducer(user);
  };

  userReducer = (user) => {
    if (typeof user === 'string') {
      throw new ForbiddenError(user);
    }
    const { user_id: id, email } = user;

    return { id, email };
  };
}

export default PostgresAPI;
