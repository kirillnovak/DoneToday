// CONTSTANT
app.constant('Config', {
  // 'ApiUrl': 'http://127.0.0.1:8080',
  // 'SiteUrl': 'http://127.0.0.1'
})

// TODO Settings page
// TODO Locale time in settings
// TODO Backup to email
// TODO Restore from file
// TODO Hours until the end of a day

// CONTROLLER
app.controller('AppController', function (
    $scope,
    $rootScope,
	Config
  ) {

	$rootScope.errors = [];
	
});

app.controller('DoneController', function (
	$scope,
	API
  ) {

	var storage = chrome.storage.local;

	$scope.e = {
	  'records': [],
	  'dates': []
	};

	$scope.calendarToday = new Date();
	var thisDay = $scope.calendarToday.getDay();
	var thisMonth = $scope.calendarToday.getMonth();

	// CLEAN CHROME STORAGE
	// storage.clear();

	// BACKUP FROM CHROME STORAGE
	storage.get(null, function(data) {
	  console.log( data, 'storage on get')
	  $scope.e.records = (data.records || []);
	  $scope.e.records.forEach(function(dataItem){
		delete dataItem['$$hashKey'];
	  });
	  $scope.$digest();
	});


	/*
	 * ADD RECORD
	 */
	$scope.addRecord = function(form) { 
	  var record = API.addRecord({
		'text': form.name.$viewValue,
	  });

	  $scope.e.records.push(record);
	  console.log( $scope.e.records, 'e.records before writing to storage' )

	  storage.set({'records': $scope.e.records}, function() {
		console.log('Data saved');
	  });
	};

	$scope.removeRecord = function(){
	  console.log( this.$index )
	  $scope.e.records.splice(this.$index, 1);
	}

});

app.controller('TaskController', function (
    $scope,
    $rootScope,
	API
  ) {
	var self = this;

	$scope.reportBug = function(){
	  chrome.tabs.create({
		url: 'http://donetoday-ext.idea.informer.com'
	  });
	}
	
});


// API
app.factory('API', function (Config) {
  var API = function(){

	this.addRecord = function (param, handleResp) {
	  // To set yesterday: - 86400000*1
	  var today = new Date().getTime();

	  console.log( today, 'define today in API.addRecord' )

	  return {
		status: true,
		text: param.text,
		date: today,
		list: ['general']
	  };
	}
  }
  return new API;
});

