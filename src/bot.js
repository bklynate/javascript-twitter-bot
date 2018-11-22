/*
  Goals:

  1. Connect to Twitter - FINISHED
  2. Run a search for a topic - FINISHED
  3. choose a random tweet from search results - FINISHED
  4. confirm the tweet is a new tweet - IN PROGRESS
  5. post tweet on a twitter accout - FINISHED
    - need to grab more than 15 tweets to choose from - FINISHED
  6. run the code every x amount of mins - FINISHED
  7. figure out how to create a worker with nodejs on heroku - FINISHED
  8. FUTURE WILD GOAL: add in sentiment analysis in some manner
*/

import Twitter from 'twitter';
import {
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret,
} from './config/index';

const client = new Twitter({
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret,
});

const tweetArchive = {};

function getRandomElementIndex(arr) {
  let randomElementIndex = Math.floor(Math.random() * (arr.length - 1));

  // a check for edge cases where randomSearchElement equals 0 then minuses to -1
  if (randomElementIndex < 0) return randomElementIndex++;

  return randomElementIndex;
}

function getSearchPhrase() {
  const topicalTwitterSearchPhrases = [
    'free coding resources',
    'free javascript resources',
    'free coding tutorials',
    'tutorial javascript es6',
    'react tutorials',
    'full stack react tutorials',
    'learn react.js',
    'node js tutorials',
    'you dont know js',
    'learn redux',
    'learn GraphQL',
    'learn coding for free',
    'learn node js',
    'express js node resources',
    'javascript game development',
    'NYC Tech Pipline',
    'Free Code Camp',
    'NYC javascript meetups',
    'react native tutorial',
    'brooklyn.js',
    'nyc hackathon',
    '30 days of javascript',
    '100 days of code',
  ];
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

  if (tweetArchive[foundTweet.id] || foundTweet.screen_name === 'FreeCodeMine')
    return twitterBotEngine();

  try {
    await client.post('statuses/update', { status: foundTweet.text });
  } catch (e) {
    return 'Something went horribly wrong... but no worries!';
  }
};

twitterBotEngine();
setInterval(twitterBotEngine, 30000);
