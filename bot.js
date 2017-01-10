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
  8. FUTURE WILD GOAL: add in sentiment analysis
*/

var Twitter = require('twitter');
var fs = require('fs');

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

var possibleTweets = [];
var historic_tweets = [];
var possibleSearchs = [
  'free coding resources',
  'free javascript resoures',
  'free coding tutorials',
  'learn coding for free',
  'free ruby resources',
  'learn node js',
  'express js node resources'
];
var random_search_element = Math.floor(Math.random() * possibleSearchs.length-1);
var selectedSearch = possibleSearchs[random_search_element];
console.log(selectedSearch);
var twitter_bot_engine = function() {
  // make a search for the topic of choice
  client.get('search/tweets', {q: selectedSearch, count: 299}, function(error, tweets, response) {
    // console.log(tweets);

    for(var tweet in tweets.statuses){
      possibleTweets.push({
        'text' : tweets.statuses[tweet].text,
        'id' : tweets.statuses[tweet].id,
        'name' : tweets.statuses[tweet].user.name,
        'screen_name' : tweets.statuses[tweet].user.screen_name,
        'location' : tweets.statuses[tweet].user.location
        // 'url' : tweets.statuses[tweet].url
      });
      // console.log(possibleTweets);
    }

    // if the random tweet isnt in historic tweets
    var found_one = false
    while(!found_one){

      // Random selection of tweets
      random_element = Math.floor(Math.random() * possibleTweets.length) + 1;

      // Choose a random tweet
      selected_tweet = possibleTweets[random_element];
      console.log(selected_tweet);
      console.log('Hey I ran')

      if (!(selected_tweet.id in historic_tweets) && (selected_tweet.screen_name != "freecodemine")){

        // Push the selected_tweet to historic_tweets
        historic_tweets.push(selected_tweet.id);
        found_one = true;

        // Test case for tweeting out
        console.log(selected_tweet.text)
        client.post('statuses/update', {status: selected_tweet.text}, function(error, tweet, response) {
          if (!error) {
            console.log('Oh Shit, I Tweeted!');
          }
        });
      }
      console.log('inside while loop:---->',historic_tweets);
    }
    console.log('ouside while loop:---->',historic_tweets);
    console.log(selectedSearch);
    console.log(historic_tweets);
    // this saves the tweet objects in a json file
    fs.writeFile('tweet_contents.json', possibleTweets, (err) => {
      if(err) throw err;
      // console.log(`this was a success!!`)
    })

    // this saves twitter files to a text file
    fs.writeFile('tweets.json', JSON.stringify(tweets, null, '\t'), (err) => {
     if(err) throw err;
    //  console.log(`...and It's saved!`);
    });

    // this creates a record of historic tweets in json
    fs.writeFile('historic_tweets.json', historic_tweets, (err) => {
      if(err) throw err;
      // console.log(`Like DJ Khalid says..... Another one!`);
    })
  });
}

twitter_bot_engine();
// setInterval(twitter_bot_engine, 1200000);
setInterval(twitter_bot_engine, 60000);
