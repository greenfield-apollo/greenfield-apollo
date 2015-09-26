// modules =================================================
var userController = require('../controllers/users');

module.exports = function (router) {
  // POST: /api/users/add
  router.post('/add', userController.addHabit);

  // FOR TESTING ONLY
  // GET: /api/users/
  router.get('/', function(req, res) {
    res.json({message: 'Authentication successful.'});
  });
};
