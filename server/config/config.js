try {
  var secret = require('../config/secret');
}
catch (err) {}

module.exports = {
  port: 8080,
  localdb: 'mongodb://127.0.0.1:27017/habitdb',
  tokenSecret: process.env.tokenSecret || secret.tokenSecret,
  googleSecret: process.env.googleSecret || secret.googleSecret
};
