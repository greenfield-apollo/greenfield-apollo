// DEVELOPMENT ONLY MIDDLEWARE
var userController = require('../controllers/users');
var recordController = require('../controllers/records');

module.exports = function (router) {
  // GET: /public/users/habits
  // updates habit streak counts and responds with an array of habit data
  router.get('/users/habits', userController.showHabits);

  // POST: /public/users/habits
  // adds a new habit entry to the user data
  router.post('/users/habits', userController.addHabit);

  // PUT: /public/users/habits/<habit id>
  // deactivates habit or edit reminder time / due time
  router.put('/users/habits/:id', userController.verifyHabit,
    userController.editHabit);

  // GET: /public/records/<habit id>
  // returns an array of all check-in dates for the specified habit
  router.get('/records/:id', userController.verifyHabit, recordController.getRecords);

  // POST: /public/records/<habit id>
  // adds a new habit entry to the user data
  router.post('/records/:id', userController.verifyHabit, userController.checkinHabit,
    recordController.addRecord);
};
