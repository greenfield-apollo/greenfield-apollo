// modules =================================================
var userController = require('../controllers/users');

module.exports = function (router) {
  // POST: /api/users/habits
  router.post('/habits', userController.addHabit);

  // FOR TESTING ONLY
  // GET: /api/users/
  router.get('/', function(req, res) {
    res.json({message: 'Authentication successful.'});
  });
};
