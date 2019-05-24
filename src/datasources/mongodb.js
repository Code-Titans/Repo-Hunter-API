import { MongoClient } from 'mongodb';

class mongoDbAPI {
  constructor(url) {
    this.db = '';
    MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {
      if (err) console.log(err);
      this.getDbConnections(client.db(process.env.MONGO_DB_NAME))
    })
  }

  getDbConnections = (client) => {
    this.db = client;
  };

  getAllComments = async () => {
    if (this.db === '') console.log("waiting for database client");
    return await this.db.collection('comments').find().toArray();
  }
}

export default mongoDbAPI
