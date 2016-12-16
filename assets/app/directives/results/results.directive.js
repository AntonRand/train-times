angular
  .module('TrainTimes')
  .directive('results', function() {
    return {
      restrict: 'E',
      templateUrl: 'assets/app/directives/results/results.template.html',
      controller: function($scope, TrainSearchService) {

        var ON_TIME = "On time";
        var DELAYED = "Delayed";
        var CANCELLED = "Cancelled";

        $scope.lastUpdatedTime = moment().format('HH:mm:ss');

        function getMinutesString(time) {
          var minutesRemaining = moment(time, 'HH:mm').diff(moment(), 'minutes')
          var minutesString = "in " + minutesRemaining;
          return (minutesRemaining == 1) ? minutesString + " minute" : minutesString + " minutes";
        }

        function getStdMinutesString(result) {
          return getMinutesString(result.std);
        }

        function getEtdMinutesString(result) {
          return getMinutesString(result.etd);
        }

        TrainSearchService.getTrains().then(
          function(results){

            results.forEach(function(result) {
              
              if (result.isCancelled) {
                result.status = CANCELLED;
              } else if (result.etd === "On time") {
                result.timeUntilDeparture = getStdMinutesString(result);
                result.status = ON_TIME;
              } else if (result.etd != result.std) {
                result.timeUntilDeparture = getEtdMinutesString(result);
                result.status = DELAYED;
              }
              
            });

            $scope.results=results;
            $scope.error = false;
          },
          function(){$scope.error = true;}
        )

      }
    }
  })