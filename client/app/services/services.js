angular.module('app.services', [])

.factory('Habits', ['$http',
  function($http) {

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

    return service;

  }
])

.factory('Auth', ['$http', '$location', '$window',
  function ($http, $location, $window) {
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
      return !!$window.localStorage.getItem('com.habit');
    };

    var signout = function () {
      $window.localStorage.removeItem('com.habit');
      $location.path('/signin');
    };

    return {
      signin: signin,
      signup: signup,
      isAuth: isAuth,
      signout: signout
    };
  }
]);
