import context from './context';
import createSchema from './schema';

export const createConfig = async () => {
  const schema = await createSchema();
  return {
    schema,
    context
  }
};
export default createConfig;
