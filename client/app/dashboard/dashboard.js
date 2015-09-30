angular.module('app.dashboard', [])

.controller('DashboardController', ['$rootScope', '$scope', '$location', 'Habits',
  function($rootScope, $scope, $location, Habits) {

    $rootScope.showNav = true;

    $scope.testHabits = [
      {habitName: 'Submit a Pull Request', completed: 25, failed: 7},
      {habitName: 'Complete a Pomodoro', completed: 20, failed: 4},
      {habitName: 'Workout', completed: 15, failed: 2}
    ];

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
          console.log($scope.habits);  // REMOVE
        })
        .catch(function(error) {
          console.error(error);
        });
    };

    $scope.getHabits();  // Invoke to render active habits on dashboard

    $scope.formatDonut = function (value) {
        return value;
    };

    $scope.editHabit = function(habit) {
      Habits.setEdit(habit);
      $location.path('/edit');
    };

  }
]);
