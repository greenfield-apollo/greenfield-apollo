angular.module('app.create', [])

.controller('CreateController', ['$scope', '$filter', function($scope, $filter) {
  $scope.addHabit = function() {
    console.log('Reminder = ', $scope.reminder, ' || Type = ', typeof($scope.reminder));
    console.log('Due = ', $scope.due, ' || Type = ', typeof($scope.due));
  };

}]);
