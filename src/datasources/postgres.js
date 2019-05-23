import { Client } from 'pg';

const connectionString = `postgresql://localhost/dvdrental`;

const client = new Client({ connectionString });

client.connect((err) => {
  if(err) console.error(err.stack);
  console.log('Database connected...');
});

export default client;
