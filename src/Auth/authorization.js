import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server';

const authenticateUser = (req) => {
  const Authorization = req.headers.authorization;

  if (!Authorization) {
    throw new AuthenticationError(
      'You are not authenticated',
    );
  }
  const token = Authorization.replace('Bearer ', '');
  const { payload } = jwt.verify(token, process.env.SECRET_KEY);
  return payload;
};

export default authenticateUser;
