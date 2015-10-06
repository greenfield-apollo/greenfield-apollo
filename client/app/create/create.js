angular.module('app.create', [])

.controller('CreateController', ['$rootScope', '$scope', '$location', 'Habits',
  function($rootScope, $scope, $location, Habits) {
    $rootScope.showNav = true;
    $scope.habit = {};
    Habits.getHabits()
      .then(function(habits) {
        var count = 0;
        habits.forEach(function(habit) {
          count += habit.active ? 1 : 0;
        });
        if (count < 3) {  // Currently hard coded. Limit must be retrieved from backend.
          $scope.showCreate = true;
          $scope.showLimitExceed = false;
        } else {
          $scope.showCreate = false;
          $scope.showLimitExceed = true;
        }
      })
      .catch(function(error) {
        console.error(error);
      });

    $scope.addHabit = function() {
      Habits.addHabit($scope.habit)
        .then(function() {
          $rootScope.$broadcast('habitChange');
          $location.path('/dashboard');
        })
        .catch(function(err) {
          console.error(err);
        });
    };
  }
]);
