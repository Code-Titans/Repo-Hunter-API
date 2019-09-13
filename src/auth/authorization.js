import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server';

const authenticateUser = (req) => {
  const Authorization = req.headers.authorization;

  if (!Authorization) {
    throw new AuthenticationError('You are not authenticated');
  }
  const token = Authorization.replace('Bearer ', '');
  const payload = jwt.verify(token, process.env.SECRET_KEY);
  return payload;
};

export const jwtSign = payload => jwt.sign({
  exp: Math.floor(Date.now() / 1000) + 3600,
  data: payload,
}, process.env.SECRET_KEY);

export default authenticateUser;
