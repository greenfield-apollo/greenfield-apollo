angular.module('app', [
  'app.services',
  'app.create',
  'app.dashboard',
  'ngRoute'
])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/dashboard', {
      templateUrl: 'app/dashboard/dashboard.html',
      controller: 'DashboardController',
    })
    .when('/create', {
      templateUrl: 'app/create/create.html',
      controller: 'CreateController',
    })
    .otherwise({
      redirectTo: '/dashboard'
    });
}]);
