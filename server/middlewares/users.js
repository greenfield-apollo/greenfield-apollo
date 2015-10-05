// modules =================================================
var userController = require('../controllers/users');

module.exports = function (router) {
  // GET: /api/users/habits
  // returns an array of habit data
  router.get('/habits', userController.showHabits);

  // POST: /api/users/habits
  // adds a new habit entry to the user data
  router.post('/habits', userController.addHabit);

  // POST: /api/users/habits/reminded/<habit id>
  // tells the server that the reminder notification has been shown
  router.put('/habits/reminded/:id', userController.verifyHabit,
    userController.habitReminded);

  // POST: /api/users/habits/failed/<habit id>
  // tells the server that the fail notification has been shown
  router.put('/habits/failed/:id', userController.verifyHabit,
    userController.habitFailed);

  // PUT: /api/users/habits/<habit id>
  // deactivates habit or edit reminder time / due time
  router.put('/habits/:id', userController.verifyHabit,
    userController.editHabit);
};
