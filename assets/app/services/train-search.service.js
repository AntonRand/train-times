angular
  .module('TrainTimes')
  .service('TrainSearchService', TrainSearchService);

function TrainSearchService($q, $resource) {

	var _priv = {
		Trains: $resource("https://antonrand.com/rail/api/outbound")
	}

  return {
    getTrains: function() {
    	var defer = $q.defer();

    	_priv.Trains.get(
    		{}, 
    		function(response){
    			defer.resolve(response.GetStationBoardResult.trainServices.service);
    		}, 
    		function(){
    			defer.reject();
    		}
    	);

    	return defer.promise;
    }
  }

};