import { config } from 'dotenv';
import Twitter from 'twitter';

import topicalTwitterSearchPhrases from './config/topicalTwitterSearchPhrases';
import models from './models';

// provide access to env variables
config();

// I want to write a tweet every 12 hours.
const EVERY_12_HOURS = 43200000

const { Tweet = {} } = models;

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

function getRandomIndex(arr) {
  let randomElementIndex = Math.floor(Math.random() * (arr.length));
  return randomElementIndex;
}

function getTweet() {
  // this is the random element used to select a possible search query
  const randomIndex = getRandomIndex(topicalTwitterSearchPhrases);
  const tweet = topicalTwitterSearchPhrases[randomIndex];
  return tweet;
}

const twitterBotEngine = async function() {
  // make a search for the topic of choice
  const { statuses: tweets } = await client.get('search/tweets', {
    q: getTweet(),
    count: 200,
  });

  const fetchedTweets = tweets.map(({ id: tweet_id, text, user: { name, screen_name } }) => ({
    tweet_id,
    text,
    name,
    screen_name,
  }));

  if (fetchedTweets.length === 0) return twitterBotEngine();

  const randomIndexOfFetchedTweets = getRandomIndex(fetchedTweets);
  const fetchedTweet = fetchedTweets[randomIndexOfFetchedTweets];
  const { text, screen_name, tweet_id } = fetchedTweet

  if (text.includes('…')) return twitterBotEngine();

  const resolvedTweet = await Tweet.findByPk(tweet_id);

  if (resolvedTweet || screen_name === 'FreeCodeMine') return twitterBotEngine();

  Tweet.create(fetchedTweet)

  try {
    await client.post('statuses/update', {
      status: fetchedTweet.text,
    });
  } catch (e) {
    return 'Something went horribly wrong... but no worries!';
  }
};

models.sequelize.sync().then(() => {
  twitterBotEngine();
  setInterval(twitterBotEngine, EVERY_12_HOURS);
})

