import { Pool } from 'pg';

class PostgresAPI extends Pool {
  constructor(config) {
    super(config);

    this.on('connect', () => {
      console.log('connected to the database');
    });
  }

  getAllUsers = async () => {
    const user = await this.query(`SELECT * FROM actor`)
    .then((res) => res.rows)
    .catch(err => console.error(err.message, err.stack));
    return user.map((user) => this.userReducer(user));
  };

  getUser = async () => {
    const user = await this.query(`SELECT * FROM actor WHERE actor_id=$1`, [1])
    .then((res) => res.rows[0])
    .catch(err => console.error(err.stack));
    return this.userReducer(user)
  };

  userReducer = (user) => {
    const { actor_id, first_name, last_name } = user;
    const username = `${last_name} ${first_name}`;
    return {
      userId: actor_id,
      firstName: first_name,
      lastName: last_name,
      username,
    }
  };


}

export default PostgresAPI;
