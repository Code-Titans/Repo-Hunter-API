import context from './context';
import createSchema from './schema';

const createConfig = async () => {
  const schema = await createSchema();
  return {
    schema,
    context,
    introspection: true,
    playground: true,
  };
};

export default createConfig;
