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
var historicTweets = [];
var possibleSearchs = [
  'free coding resources',
  'free javascript resoures',
  'free coding tutorials',
  'learn coding for free',
  'free ruby resources',
  'learn node js',
  'express js node resources',
  'free python resources',
  'free ruby on rails',
  'Brooklyn javascript',
  'NYC Javascript meetups',
  'NYC Tech Pipline info',
  'NYC Edtech',
  'free coding brooklyn'
];
var randomSearchElement = Math.floor(Math.random() * (possibleSearchs.length - 1));
var selectedSearch = possibleSearchs[randomSearchElement];

console.log("this is selected search: ", selectedSearch);
var twitterBotEngine = function() {
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
    var foundOne = false;
    while(!foundOne){

      // Random selection of tweets
      randomElement = Math.floor(Math.random() * (possibleTweets.length - 1));
      console.log('Random Element: ', randomElement);
      // Choose a random tweet
      selectedTweet = possibleTweets[randomElement];
      console.log(selectedTweet);
      console.log('Hey I ran');

      if (!(selectedTweet.id in historicTweets) && (selectedTweet.screen_name != "freecodemine")){

        // Push the selected_tweet to historic_tweets
        historicTweets.push(selectedTweet.id);
        foundOne = true;

        // Test case for tweeting out
        console.log(selectedTweet.text);
        client.post('statuses/update', {status: selectedTweet.text}, function(error, tweet, response) {
          if (!error) {
            console.log('Oh Shit, I Tweeted!');
          }
        });
      }
      console.log('inside while loop:---->',historicTweets);
    }
    console.log('ouside while loop:---->',historicTweets);
    console.log(selectedSearch);
    console.log(historicTweets);
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
    fs.writeFile('historic_tweets.json', historicTweets, (err) => {
      if(err) throw err;
      // console.log(`Like DJ Khalid says..... Another one!`);
    })
  });
}

twitterBotEngine();
setInterval(twitterBotEngine, 1200000);
// setInterval(twitterBotEngine, 60000);
