import bcrypt from "bcrypt";
import { generateToken, validateInput } from '../../helpers'

export const Mutation = {
  register: async (_, { email, password }, { client }) => {
    validateInput(email, password);
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return await client.createUser({ email, password: hashedPassword });
  },
  login: async (_, { email, password }, { client })=>{
    validateInput(email, password);
    const user = await client.getUserByEmail(email);
    if(!user ) throw Error("User not found");
    if(typeof user === "string") throw Error(user);
    const match = await bcrypt.compare(password, user.password);
    if(!match)throw new Error("Incorrect password");
    const token = generateToken(user.email);
    return {
        token: token,
        user:{
          id: user.user_id,
          email: user.email
        }
      }
    }
};
