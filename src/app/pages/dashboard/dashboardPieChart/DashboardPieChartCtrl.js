/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
      .controller('DashboardPieChartCtrl', DashboardPieChartCtrl);

  /** @ngInject */
  function DashboardPieChartCtrl($scope, $timeout, baConfig, baUtil, employeeService) {
    var pieColor = baUtil.hexToRGB(baConfig.colors.defaultText, 0.2);
    var activeUsers = [];
    var inactiveUsers = [];

    getAllEmployees(null, null, null);

    function getAllEmployees(search, limit, skip, isSearch){
      $scope.isLoading = true;
      employeeService.getAll(search || '', limit, skip)
      .then(function(results) {
        angular.forEach(results, function(value, key) {
          if(value.get('isActive')){
            activeUsers.push(value);
          }else{
            inactiveUsers.push(value);
          }
        });

        $scope.charts = [{
          color: pieColor,
          description: 'Active Users',
          stats: activeUsers.length,
          percent : calcPercent(results.length, activeUsers.length),
          icon: 'face',
        }, {
          color: pieColor,
          description: 'Inactive Users',
          percent : calcPercent(results.length, inactiveUsers.length),
          stats: inactiveUsers.length,
          icon: 'refresh',
        }
        ];

        $timeout(function () {
          loadPieCharts();
          // updatePieCharts();
        }, 1000);

        $scope.isLoading = false;
      }, function(err) {
        console.log(err);
      });
    }

    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    function calcPercent(total, value){
      var tmp = ( value / total ) * 100;
      tmp = Math.round(tmp);

      return tmp;
    }

    function loadPieCharts() {
      $('.chart').each(function () {
        var chart = $(this);
        chart.easyPieChart({
          easing: 'easeOutBounce',
          onStep: function (from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
          },
          barColor: chart.attr('rel'),
          trackColor: 'rgba(0,0,0,0)',
          size: 84,
          scaleLength: 0,
          animation: 2000,
          lineWidth: 9,
          lineCap: 'round',
        });
      });

      $('.refresh-data').on('click', function () {
        updatePieCharts();
      });
    }

    function updatePieCharts() {
      $('.pie-charts .chart').each(function(index, chart) {
        console.log(index);
        console.log(chart);
        $(chart).data('easyPieChart').update(20);
      });
    }


  }
})();
