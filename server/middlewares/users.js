// modules =================================================
var userController = require('../controllers/users');

module.exports = function (router) {
  // GET: /api/users/habits
  // updates habit streak counts and responds with an array of habit data
  router.get('/habits', userController.update, userController.showHabits);

  // POST: /api/users/habits
  // adds a new habit entry to the user data
  router.post('/habits', userController.addHabit);

  // PUT: /api/users/habits/<habit id>
  // deactivates habit or edit reminder time / due time
  router.put('/habits/:id', userController.verifyHabit,
    userController.editHabit);
};
