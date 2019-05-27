import dataSources from '../../datasources';

const { config, PostgresAPI } = dataSources;
const context = {
  client: new PostgresAPI(config),
};

export default context;
