import { User } from "./user";
import { Schema } from "./schema";

const resolvers = {
  Query: Schema,
  User: User
};

export default resolvers;
