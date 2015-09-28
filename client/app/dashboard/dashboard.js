angular.module('app.dashboard', [])

.controller('DashboardController', ['$rootScope', '$scope', 'Habits',
  function($rootScope, $scope, Habits) {
    $rootScope.showNav = true;
    $scope.habits = [];

    $scope.getHabits = function() {
      Habits.getHabits()
        .then(function(habits) {
          $scope.habits = habits;
        })
        .catch(function(error) {
          console.error(error);
        });
    };

    $scope.getHabits();
  }
]);
