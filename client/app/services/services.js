angular.module('app.services', [])

.factory('Habits', ['$http',
  function($http) {

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

    return service;

  }
])

.factory('Auth', ['$http', '$location', '$window', '$auth',
  function ($http, $location, $window, $auth) {
    var signin = function (user) {
      return $http.post('/authenticate/signin', user)
        .then(function (resp) {
          return resp.data.token;
        });
    };

    var signup = function (user) {
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
]);
