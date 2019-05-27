import { Pool } from 'pg';

class PostgresAPI extends Pool {
  constructor(config) {
    super(config);
    this.on('connect', () => {
      console.log('connected to the database');
    });
  }

  getAllUsers = async () => {
    const user = await this.query(`SELECT * FROM user_details`)
    .then((res) => res.rows)
    .catch(err => console.error(err.message, err.stack));
    return user.map((user) => this.userReducer(user));
  };

  getUser = async (id) => {
    const user = await this.query(`SELECT * FROM user_details WHERE user_id=$1`, [id] )
    .then((res) => res.rows[0])
    .catch(err => console.error(err.message, err.stack));
    return this.userReducer(user)
  };

  userReducer = (user) => {
    if(!user){
      return;
    }
    const { user_id, first_name, last_name } = user;
    const username = `${last_name} ${first_name}`;
    return {
      userId: user_id,
      firstName: first_name,
      lastName: last_name,
      username,
    }
  };
}

export default PostgresAPI;
