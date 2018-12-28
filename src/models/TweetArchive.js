import mongoose from 'mongoose';

const { Schema } = mongoose;

const TweetArchiveSchema = new Schema({
  id: String,
  text: String,
  name: String,
  screen_name: String,
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

mongoose.model('tweetArchive', TweetArchiveSchema);
