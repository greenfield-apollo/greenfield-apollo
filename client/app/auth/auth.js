angular.module('app.auth', [])

.controller('AuthController', ['$rootScope', '$scope', '$window', '$location', 'Auth', '$auth',
  function ($rootScope, $scope, $window, $location, Auth, $auth) {
    $rootScope.showNav = false;
    $scope.user = {};

    // Satellizer authentication
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function () {
          $location.path('/');
        })
        .catch(function (error) {
          $scope.alert = error.data.message;
        });
    };

    $scope.signin = function () {
      Auth.signin($scope.user)
        .then(function (token) {
          $window.localStorage.setItem('habit_token', token);
          $location.path('/dashboard');
        })
        .catch(function (error) {
          $scope.alert = error.data.message;
        });
    };

    $scope.signup = function () {
      Auth.signup($scope.user)
        .then(function (token) {
          $window.localStorage.setItem('habit_token', token);
          $location.path('/dashboard');
        })
        .catch(function (error) {
          $scope.alert = error.data.message;
        });
    };

    if ($location.path() === '/signout') {
      Auth.signout();
    }
  }
]);