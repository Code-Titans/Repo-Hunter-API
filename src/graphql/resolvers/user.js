const user = {
  userId: (_, __, { client }) => {
    return (
      client.query(`SELECT actor_id FROM actor WHERE actor_id=1`)
      .then((response) => {
        const data = response.rows[0];
        return data.actor_id;
      })
      .catch((error) => console.error(error.stack))
    );
  },
  username: (_, __, { client }) => {
    return (
      client.query(`SELECT first_name, last_name FROM actor WHERE actor_id=1`)
      .then((response) => {
        const data = response.rows[0];
        const {first_name, last_name} = data;
        return `${first_name} ${last_name}`
      })
      .catch((error) => console.error(error.stack))
    );
  }
};

export default user;
