import mongoose from 'mongoose';

const { Schema } = mongoose;

const TweetArchiveSchema = new Schema({
  id: String,    
  text: String,
  name: String,
  screen_name: String,
});

mongoose.model('tweetArchive', TweetArchiveSchema);
