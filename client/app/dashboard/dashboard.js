angular.module('app.dashboard', [])

.controller('DashboardController', ['$scope', 'Habits', function($scope, Habits) {

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
}]);
