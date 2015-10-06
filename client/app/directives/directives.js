angular.module('app.directives', [])

.directive('d3Bars', ['$window', '$timeout',
  function ($window, $timeout) {
    return {
      restrict: 'EA',
      scope: {
        data: '=', // bi-directional data-binding
        label: '@',
        onClick: '&'
      },
      link: function(scope, ele, attrs) {
        var renderTimeout;
        var margin = parseInt(attrs.margin) || 0,
            barHeight = parseInt(attrs.barHeight) || 40,
            barPadding = parseInt(attrs.barPadding) || 10;

        var svg = d3.select(ele[0])
          .append('svg')
          .style('width', '100%');

        $window.onresize = function() {
          scope.$apply();
        };

        scope.$watch(function() {
          return angular.element($window)[0].innerWidth;
        }, function() {
          scope.render(scope.data);
        });

        scope.$watch('data', function(newData) {
          scope.render(newData);
        }, true);

        scope.render = function(data) {
          svg.selectAll('*').remove();

          if (!data) return;
          if (renderTimeout) clearTimeout(renderTimeout);

          renderTimeout = $timeout(function() {
            var width = d3.select(ele[0])[0][0].offsetWidth - margin,
                height = scope.data.length * (barHeight + barPadding),
                color = d3.scale.category10(),
                xScale = d3.scale.linear()
                  .domain([0, d3.max(data, function(d) {
                    return d.streak;
                  })])
                  .range([0, width]);

            svg.attr('height', height);

            svg.selectAll('rect')
              .data(data)
              .enter()
                .append('rect')
                .on('click', function(d,i) {
                  return scope.onClick({item: d});
                })
                .attr('height', barHeight)
                .attr('width', 140)
                .attr('x', Math.round(margin/2))
                .attr('y', function(d,i) {
                  return i * (barHeight + barPadding);
                })
                .attr('fill', function(d) {
                  return color('#1f77b4');
                  // return color(d.streak);
                })
                .transition()
                  .duration(1000)
                  .attr('width', function(d) {
                    return xScale(d.streak);
                  });
            svg.selectAll('text')
              .data(data)
              .enter()
                .append('text')
                .attr('fill', '#fff')
                .attr('y', function(d,i) {
                  return i * (barHeight + barPadding) + 25;
                })
                .attr('x', 15)
                .text(function(d) {
                  return d.habitName + " (streak: " + d.streak + ")";
                });
          }, 200);
        };
      }
    }
  }
]);
