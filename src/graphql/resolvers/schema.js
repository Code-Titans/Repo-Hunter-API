export const Schema = {
  users: (_, __, { client }) => {
    return client.getAllUsers();
  },
  user: (_, __, { client }) => {
    return client.getUser(1)
  }
};
