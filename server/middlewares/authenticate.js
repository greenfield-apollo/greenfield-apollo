// modules =================================================
var authController = require('../controllers/authenticate');

module.exports = function(router) {
  // POST: /authenticate/signin
  // verifies username and password, issues token
  router.post('/signin', authController.signin);

  // POST: /authenticate/signup
  // verifies unique username, add to Users collection, issues token
  router.post('/signup', authController.signup);
};
