// modules =================================================
var userController = require('../controllers/users');
var recordController = require('../controllers/records');

module.exports = function (router) {
  // GET: /api/records/<habit id>
  // returns an array of all check-in dates for the specified habit
  router.get('/:id', userController.verifyHabit, recordController.getRecords);

  // POST: /api/records/<habit id>
  // adds a new habit entry to the user data
  router.post('/:id', userController.verifyHabit, userController.checkinHabit,
    recordController.addRecord);
};
