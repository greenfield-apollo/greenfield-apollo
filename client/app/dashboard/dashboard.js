angular.module('app.dashboard', [])

.controller('DashboardController', ['$rootScope', '$scope', 'Habits',
  function($rootScope, $scope, Habits) {
    $rootScope.showNav = true;
    // Placeholder streak data
    $scope.sampleStreaks = [
      {habitName: 'Submit a Pull Request', streak: 15},
      {habitName: 'Complete a Pomodoro', streak: 10},
      {habitName: 'Workout', streak: 8}
    ];

    $scope.getHabits = function() {
      Habits.getHabits()
        .then(function(habits) {
          $scope.habits = habits;
          $scope.habitStreaks = $scope.habits.filter(function (habit) {
            return habit.streak > 0;
          });
          console.log($scope.habits);
        })
        .catch(function(error) {
          console.error(error);
        });
    }

    $scope.getHabits();
  }
]);
