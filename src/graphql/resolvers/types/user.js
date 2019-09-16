import authenticateUser from '../../../auth/authorization';

export default async (_, __, { client, req }) => {
  const { data: { id } } = authenticateUser(req);
  const [userDetails] = await client.getUserById(id);
  return userDetails;
};
