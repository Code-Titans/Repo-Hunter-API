import { MongoClient } from 'mongodb';

class MongoDbAPI extends MongoClient {
  constructor(url) {
    super(url, { useNewUrlParser: true });
    this.connect((err) => {
      if (err) throw Error(err.message);
      console.log('🚀 Connected successfully to MongoDB server. Enjoy! 🤾 ‍');
      this.db = this.db(process.env.MONGO_DB_NAME);
    });
  }

  getAllComments = async () => {
    const comment = await this.db.collection('comments').find().toArray();

    return comment;
  }
}

export default MongoDbAPI;
