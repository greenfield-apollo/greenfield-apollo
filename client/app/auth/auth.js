angular.module('app.auth', [])

.controller('AuthController', ['$rootScope', '$scope', '$window', '$location', 'Auth',
  function ($rootScope, $scope, $window, $location, Auth) {
    $scope.user = {};

    $scope.signin = function () {
      Auth.signin($scope.user)
        .then(function (token) {
          $rootScope.showNav = true;
          $window.localStorage.setItem('com.habit', token);
          $location.path('/dashboard');
        })
        .catch(function (error) {
          console.error(error);
        });
    };

    $scope.signup = function () {
      Auth.signup($scope.user)
        .then(function (token) {
          $rootScope.showNav = true;
          $window.localStorage.setItem('com.habit', token);
          $location.path('/dashboard');
        })
        .catch(function (error) {
          console.error(error);
        });
    };

    if ($location.path() === '/signout') {
      $rootScope.showNav = false;
      Auth.signout();
    }
  }
]);