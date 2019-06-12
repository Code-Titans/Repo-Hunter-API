import { MongoClient } from 'mongodb';

class MongoDbAPI extends MongoClient {
  constructor(url) {
    super(url, { useNewUrlParser: true });
    this.connect((err) => {
      if (err) throw Error(err.message);

      console.log('🚀 Connected successfully to MongoDB server. Enjoy! 🤾 ‍');
      this.db = this.db(process.env.MONGO_DB_NAME);
      // MongoDB collections
      this.Comment = this.db.collection('comments');
    });
  }

  getAllComments = async (repoId) => {
    const comments = await this.Comment
      .find({ repoId })
      .toArray();
    return comments;
  };

  postComment = async (repoId, userId, text) => {
    const comment = await this.Comment.insertOne({
      repoId,
      userId,
      text,
    });
    return comment.ops[0];
  }
}

export default MongoDbAPI;
