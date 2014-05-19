(function(){
	var app = angular.module('forecast', []);

	app.controller('ForecastController', ['$http', '$log', '$scope', function($http, $log, $scope){
		var allWeather = this; //this variable used to store json data for all the cities entered
		var cityName = ''; 
		$scope.myPred = {};
		$scope.submit = function(){
			cityNames = String(this.myPred.text1); //explicitly casted to String just to be sure
			names = cityNames.split(','); //splitting the string based on the comma separator mentioned in the UI
			
			allWeather.predictions = [];
			
			for(var i = 0; i < names.length; i++)
			{
				$http({method: 'GET', url : 'http://api.openweathermap.org/data/2.5/forecast/daily?q='+names[i]+'&units=metric&cnt=14&APPID=47927eacc191d5f08968bc67e5546ee6'})
				.success(function(data){
					if(data['cod'] != 404) //if data is not received then error code will not be 404
						allWeather.predictions.push(data);
					else
						alert("Not a valid City Name");
				}).error(function(){
					alert("Error Occured");
				});
			}
			
		};
		

	}]);
	//this function is used to for GeoNavigation Services
	app.controller('GeoController', ['$http', '$log', '$scope', function($http, $log, $scope){
		var weather = this;
		var pos  = this;
		
		$scope.getLocation = function(){
			pos.value = [];
			window.navigator.geolocation.getCurrentPosition(function(position) {
			$scope.$apply(function() {
                pos.value = position;
				weather.predictions = [];
			
				var lat = pos.value['coords']['latitude'];
				var lng = pos.value['coords']['longitude'];
				console.log(lat + " " + lng);
				$http.get('http://api.openweathermap.org/data/2.5/forecast/daily?lat='+lat+'&lon='+lng+'&units=metric&cnt=14&APPID=47927eacc191d5f08968bc67e5546ee6').success(function(data){
				weather.predictions = data;
            });
        	}, function(error) {
				alert(error);
        	});
			
			});	
			
		};
	}]);
	//this is a filter used for converting time to Dates
	app.filter('dateConverter', function(){
		return function(input){
			var a = new Date((input)*1000);//convert time into milliseconds
			var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			var year = a.getFullYear();
			var month = months[a.getMonth()];
			var date = a.getDate();
			var hour = a.getHours();
			var min = a.getMinutes();
			var sec = a.getSeconds();
			var time = date+','+month+' '+year+' '+hour+':'+min+':'+sec ;
			return time;
			};
	});
})();
