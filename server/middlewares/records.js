// modules =================================================
var userController = require('../controllers/users');
var recordController = require('../controllers/records');

module.exports = function (router) {
  // POST: /api/records/<habit id>
  // adds a new habit entry to the user data
  router.post('/:id', userController.checkinHabit, recordController.addRecord);
};
