const User = {
  id: parent => parent.userId,
  username: parent => parent.username,
  firstName: parent => parent.firstName,
  lastName: async parent => parent.lastName,
};

export default User;
