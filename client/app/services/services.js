angular.module('app.services', [])

.factory('Habits', ['$http', '$sanitize', '$interpolate', 'notify',
  function($http, $sanitize, $interpolate, notify) {

    var _habit = {};
    var service = {};

    service.getHabits = function() {
      return $http({
        method: 'GET',
        url: '/api/users/habits'
      })
      .then(function(resp) {
        return resp.data.habits;
      });
    };

    service.addHabit = function(habit) {
      habit.habitName = $sanitize(habit.habitName);
      return $http({
        method: 'POST',
        url: '/api/users/habits',
        data: habit
      });
    };

    service.setEdit = function(habit) {
      _habit = habit;
      _habit.reminderTime = new Date(_habit.reminderTime);
      _habit.dueTime = new Date(_habit.dueTime);
    };

    service.getEdit = function(habit) {
      return _habit;
    };

    service.updateHabit = function(habit) {
      return $http({
        method: 'PUT',
        url: '/api/users/habits/' + habit._id,
        data: habit
      });
    };

    service.statusChange = function(event) {
      var exp = $interpolate(event.message)
      var message = exp({habitName: event.habitName, eventTime: event.eventTime});
      notify(message);
      status = event.eventName;
      if (status === 'dueTime') {
        status = 'failed';
      }
      if (status === 'reminderTime') {
        status = 'pending'
      }
      return $http({
        method: 'PUT',
        url: '/api/users/habits/' + status + '/' + event.id, // adjust to db changes
        data: event.habit
      });
    };

    service.checkinHabit = function(habit) {
      return $http({
        method: 'POST',
        url: '/api/records/' + habit._id,
        data: habit
      });
    };

    return service;

  }
])

.factory('Auth', ['$http', '$location', '$window', '$auth', '$sanitize',
  function ($http, $location, $window, $auth, $sanitize) {
    var signin = function (user) {
      user.username = $sanitize(user.username);
      user.password = $sanitize(user.password);
      return $http.post('/authenticate/signin', user)
        .then(function (resp) {
          return resp.data.token;
        });
    };

    var signup = function (user) {
      user.username = $sanitize(user.username);
      user.password = $sanitize(user.password);
      return $http.post('/authenticate/signup', user)
        .then(function (resp) {
          return resp.data.token;
        });
    };

    var isAuth = function () {
      return !!$window.localStorage.getItem('habit_token')
    };

    var signout = function () {
      $auth.logout()
        .then(function() {
          $location.path('/signin');
        });
    };

    return {
      signin: signin,
      signup: signup,
      isAuth: isAuth,
      signout: signout
    };
  }
])

.factory('Events', ['Habits',
  function (Habits) {
    var event = {
      habitName: "test",
      eventTime: "test2"
    };
    // Notification messages
    var eventMessages = {
      reminderTime: 'Reminder: {{habitName}} is due at {{eventTime | date: "shortTime"}}!',
      dueTime: 'Habit failed!  You did not complete {{habitName}} by the due time of {{eventTime | date: "shortTime"}}!',
    };

    // Returns ordered list of scheduled events
    var getEventQueue = function (habits) {
      // Temp code for testing/demo purposes
      habits = [
        {habitName: 'Submit a Pull Request', id: 123, streak: 5, completed: 25, failed: 3, reminderTime: (Date.now() + 1000), dueTime: (Date.now() + 5000), streakRecord: 15, active:true, status: 'pending'},
        {habitName: 'Complete a Pomodoro', id: 124, streak: 10, completed: 20, failed: 4, reminderTime: (Date.now() + 10000), dueTime: (Date.now() + 15000), streakRecord: 20, active:true, status: 'pending'},
        {habitName: 'Workout', id: 125, streak: 8, completed: 15, failed: 2, reminderTime: (Date.now() + 20000), dueTime: (Date.now() + 25000), streakRecord: 8, active:true, status: 'pending'}
      ];
      return Object.keys(eventMessages)
        .reduce(function (events, event) {
          return habits
            // Filter out non-pending habits
            .filter(function (habit, i, eventsTest) {
              return habit.status === 'pending';
            })
            // Convert pending habits to event objects
            .map(function (habit, i, events) {
              return {
                id: habit._id,
                habit: habit,
                habitName: habit.habitName,
                eventName: event,
                eventTime: habit[event],
                message: eventMessages[event],
                action: Habits.statusChange
              };
            })
            .concat(events);
        }, [])
        // Sort events chronologically by eventTime
        .sort(function (eventA, eventB) {
          return eventA.eventTime - eventB.eventTime;
        });
    };

    // Trigger notifications for all events past their eventTime
    // and remove triggered events from event queue
    var triggerEvents = function (events) {
      if (Date.now() >= events[0].eventTime) {
        var event = events.shift()
        Habits.statusChange(event)
          .then(function () {
            triggerEvents(events);
          });
      }
    };

    return {
      getEventQueue: getEventQueue,
      triggerEvents: triggerEvents
    };
  }
]);
