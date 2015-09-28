angular.module('app.dashboard', [])

.controller('DashboardController', ['$rootScope', '$scope', 'Habits',
  function($rootScope, $scope, Habits) {
    $rootScope.showNav = true;
    $scope.data = {};

    $scope.getHabits = function(username) {
      Habits.getAll(username)
        .then(function(data) {
          $scope.data = data;
        })
        .catch(function(error) {
          console.error(error);
        });
    };
  }
]);
