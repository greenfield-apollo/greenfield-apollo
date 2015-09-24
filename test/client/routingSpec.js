describe('Routing', function () {
  var $route;
  beforeEach(module('app'));

  beforeEach(inject(function($injector){
    $route = $injector.get('$route');
  }));

  it('Should have /dashboard route, template, and controller', function () {
    expect($route.routes['/dashboard']).to.be.ok();
    expect($route.routes['/dashboard'].controller).to.be('DashboardController');
    expect($route.routes['/dashboard'].templateUrl).to.be('app/dashboard/dashboard.html');
  });

  it('Should have /shorten route, template, and controller', function () {
    expect($route.routes['/create']).to.be.ok();
    expect($route.routes['/create'].controller).to.be('CreateController');
    expect($route.routes['/create'].templateUrl).to.be('app/create/create.html');
  });
});