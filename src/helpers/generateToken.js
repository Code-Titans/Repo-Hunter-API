const  jwt = require('jsonwebtoken');

const secrete_key  =  process.env.SECRETE_KEY;

export const generateToken = (payload) => {
  return jwt.sign({ payload } ,secrete_key, {algorithm: 'HS256', expiresIn: '1h' });
};
