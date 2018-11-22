// Keys.js
if (process.env.NODE_ENV === 'production') {
  // if the environment is production, load prod keys
  module.exports = require('./prod'); // eslint-disable-line
} else {
  // if the environment is development, load dev keys
  module.exports = require('./dev'); // eslint-disable-line
}
