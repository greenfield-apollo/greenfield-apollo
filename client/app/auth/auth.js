angular.module('app.auth', [])

.controller('AuthController', ['$rootScope', '$scope', '$window', '$location', 'Auth',
  function ($rootScope, $scope, $window, $location, Auth) {
    $rootScope.showNav = false;
    $scope.user = {};

    $scope.signin = function () {
      Auth.signin($scope.user)
        .then(function (token) {
          $window.localStorage.setItem('com.habit', token);
          $location.path('/dashboard');
        })
        .catch(function (error) {
          $scope.alert = error.data.message;
        });
    };

    $scope.signup = function () {
      Auth.signup($scope.user)
        .then(function (token) {
          $window.localStorage.setItem('com.habit', token);
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