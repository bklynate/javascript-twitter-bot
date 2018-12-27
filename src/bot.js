import Twitter from 'twitter';
import mongoose from 'mongoose';
import {
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret,
} from './config/index';
import topicalTwitterSearchPhrases from './config/topicalTwitterSearchPhrases';

import TweetArchiveModel from './models/TweetArchive';

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost/twitterBot_db';

mongoose.Promise = global.Promise;
mongoose.connect(mongoUrl);

const client = new Twitter({
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret,
});

const TweetArchive = mongoose.model('tweetArchive');

function getRandomElementIndex(arr) {
  let randomElementIndex = Math.floor(Math.random() * (arr.length - 1));

  // a check for edge cases where randomSearchElement equals 0 then minuses to -1
  if (randomElementIndex < 0) return randomElementIndex++;

  return randomElementIndex;
}

function getSearchPhrase() {
  // this is the random element used to select a possible search query
  const randomTopicalTwitterSearchIndex = getRandomElementIndex(topicalTwitterSearchPhrases);
  const topicalTweetPhrase = topicalTwitterSearchPhrases[randomTopicalTwitterSearchIndex];

  return topicalTweetPhrase;
}

const twitterBotEngine = async function() {
  // make a search for the topic of choice
  const { statuses: tweets } = await client.get('search/tweets', {
    q: getSearchPhrase(),
    count: 299,
  });

  const foundTweets = tweets.map(({ id, text, user: { name, screen_name } }) => ({
    id,
    text,
    name,
    screen_name,
  }));

  if (foundTweets.length === 0) return twitterBotEngine();

  const randomIndexOfFoundTweet = getRandomElementIndex(foundTweets);
  const foundTweet = foundTweets[randomIndexOfFoundTweet];

  TweetArchive.findById(foundTweet.id, async err => {
    if (err) {
      if (foundTweet.screen_name === 'FreeCodeMine') {
        return twitterBotEngine();
      } else {
        await TweetArchive.create(foundTweet);
        return;
      }
    }
    return twitterBotEngine();
  });

  try {
    await client.post('statuses/update', {
      status: foundTweet.text,
    });
  } catch (e) {
    return 'Something went horribly wrong... but no worries!';
  }
};

twitterBotEngine();
setInterval(twitterBotEngine, 16200000);