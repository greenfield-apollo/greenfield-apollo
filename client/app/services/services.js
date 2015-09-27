angular.module('app.services', [])

.factory('Habits', ['$http', function($http) {

  var getAll = function(username) {
    return $http({
      method: 'GET',
      url: '/api/users/' + username
    })
    .then(function(resp) {
      return resp.data;
    });
  };

  return {
    getAll: getAll
  };

}])

.factory('Auth', ['$http', '$location', '$window', function ($http, $location, $window) {
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
}]);
