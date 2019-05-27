export const Schema = {
  users: (_, __, { client }) => {
    return client.getAllUsers();
  },
  user: (_, { id }, { client }) => {
    return client.getUser(id)
  }
};
