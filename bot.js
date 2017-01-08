//	Access Token	718511003965763592-QHfTebfkPZJMH0u9Xk7Lq1s2wRjyV4n
//	Access Token Secret	Z3DO7RQT5GM8Q9tQ7n6pISDHF9w6FrOeYTSpWzEPYFFYD
// Consumer Key (API Key)	63QhdcWob4PAWH4OeAFVrPmIg
// Consumer Secret (API Secret)	dGLwG1CYag3rt9GPyo6zuI2pyZGXVQ7WV5IQBBwzdlWWsLV3fV


var Twitter = require('twitter');
var fs = require('fs');

var client = new Twitter({
  consumer_key: '63QhdcWob4PAWH4OeAFVrPmIg',
  consumer_secret: 'dGLwG1CYag3rt9GPyo6zuI2pyZGXVQ7WV5IQBBwzdlWWsLV3fV',
  access_token_key: '718511003965763592-QHfTebfkPZJMH0u9Xk7Lq1s2wRjyV4n',
  access_token_secret: 'Z3DO7RQT5GM8Q9tQ7n6pISDHF9w6FrOeYTSpWzEPYFFYD'
});

var params = {screen_name: 'nodejs'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets);

    // this saves twitter files to a text file
    fs.writeFile('tweets.json', JSON.stringify(tweets, null, '\t'), (err) => {
      if(err) throw err;
      console.log(`It's saved!`);
    });
  }
});
