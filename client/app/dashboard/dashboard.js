angular.module('app.dashboard', [])

.controller('DashboardController', ['$rootScope', '$scope', '$location', 'Habits',
  function($rootScope, $scope, $location, Habits) {
    $rootScope.showNav = true;

    $scope.testHabits = [
      {habitName: 'Submit a Pull Request', streak: 5, completed: 25, failed: 3, reminderTime: '2:30 PM', dueTime: '4:30 PM', streakRecord: 15, active:true},
      {habitName: 'Complete a Pomodoro', streak: 10, completed: 20, failed: 4, reminderTime: '2:30 PM', dueTime: '4:30 PM', streakRecord: 20, active:true},
      {habitName: 'Workout', streak: 8, completed: 15, failed: 2, reminderTime: '2:30 PM', dueTime: '4:30 PM', streakRecord: 8, active:true}
    ];

    $scope.colors = ["#1f77b4", "#ff7f0e", "#2ca02c"];


    $scope.getHabits = function () {
      Habits.getHabits()
        .then(function(habits) {
          // original
          // $scope.habits = habits

          // code for testing
          $scope.habits = $rootScope.sample ? $scope.testHabits : habits;
          // Stuff for Habit Streaks chart
          $scope.habitStreaks = $scope.habits.filter(function (habit) {
            return habit.streak > 0;
          });
          // Stuff for Habit Score chart
          $scope.totalFailed = $scope.habits.reduce(function (res, habit) {
            return res + habit.failed;
          }, 0);
          $scope.totalCompleted = 0;
          $scope.habitsCompleted = $scope.habits.map(function (habit) {
            $scope.totalCompleted += habit.completed;
            return habit.completed;
          });
          $scope.score = Math.round($scope.totalCompleted / ($scope.totalCompleted + $scope.totalFailed) * 100);
          console.log('completed:', $scope.totalCompleted);
          console.log('failed:', $scope.totalFailed);
          console.log('score:', $scope.score);
        })
        .catch(function (error) {
          console.error(error);
        });
    };

    $scope.toggleSampleData = function () {
      $rootScope.sample = !$rootScope.sample;
      $location.path('/');
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
