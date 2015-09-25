angular.module('app.dashboard', [])

.controller('DashboardController', function($scope, Habits) {

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
});