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

app.controller('CalendarController', function (
	$scope,
	API
  ) {

	var storage = chrome.storage.local;

	$scope.calendarView = [];
	$scope.calendarDone = {};
	$scope.calendarDone['records'] = [];

	$scope.calendarToday = new Date();
	var thisDay = $scope.calendarToday.getDay();
	var thisMonth = $scope.calendarToday.getMonth();

	// CLEAN CHROME STORAGE
	// storage.clear();

	// BACKUP FROM CHROME STORAGE
	storage.get(null, function(data) {
	  console.log( data, 'storage on get')
	  $scope.calendarDone['records'] = (data.records || []);
	  $scope.calendarDone['records'].forEach(function(dataItem){
		delete dataItem['$$hashKey'];
	  });
	  setCalendarView({
		init: true
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
	  setCalendarView({
		update: true,
		data: record
	  });

	  delete $scope.newRecord;

	  console.log( $scope.calendarDone.records, '$calendarDone.records before writing to storage' )

	  storage.set({'records': $scope.calendarDone['records']}, function() {
		console.log('Data saved');
	  });
	};

	/**
	 * SET CALENDAR VIEW
	 **/
	function setCalendarView(param){
	  if (param.init) {
		$scope.calendarView = getDaysInMonth(new Date());

		console.log( $scope.calendarDone['records'], 'records before calendar has initiated' );
		$scope.calendarView.forEach(function(calendarNumber){
		  $scope.calendarDone['records'].forEach(function(record){
			var calendarNumberDate = new Date(calendarNumber.date);
			var recordDate = new Date(record.date);
			if ( 
				calendarNumberDate.getDate() === recordDate.getDate() &&
				calendarNumberDate.getMonth() === recordDate.getMonth() &&
				calendarNumberDate.getYear() === recordDate.getYear()
			   ) {
			  if( calendarNumber['records'] === undefined ) {
				calendarNumber['records'] = [];
			  };
			  calendarNumber['records'].push(record);
			};
		  });
		});
	  }
	  if (param.update){
		console.log( param.data, 'data passed to calendar to update' )
		console.log( $scope.calendarDone, '$calendarDone before update' )
		$scope.calendarDone['records'].push(param.data);

		$scope.calendarView.forEach(function(calendarNumber){
		  var calendarNumberDate = new Date(calendarNumber.date);
		  var recordDate = new Date(param.data.date);
		  if ( 
			  calendarNumberDate.getDate() === recordDate.getDate() &&
			  calendarNumberDate.getMonth() === recordDate.getMonth() &&
			  calendarNumberDate.getYear() === recordDate.getYear()
			 ) {
			if (calendarNumber['records'] === undefined){
			  calendarNumber['records'] = [];
			}
			calendarNumber['records'].push(param.data);
		  }
		});
	  }
	}

	/**
	 * CALENDAR CONSTRUCTOR
	 * @param {int} The month number, 0 based
	 * @param {int} The year, not zero based, required to account for leap years
	 * @return {[]} List contains:
	 *	date objects for each day of the month, 
	 *	objects to indent first day (hidden:true) 
	 *	param to indicate today day (today:true) 
	 */
	function getDaysInMonth(date) {
	  date.setDate(1);
	  var thisDate = new Date();
	  var thisMonth = thisDate.getMonth();
	
	  var days = [];

	  // Calculate hidden fields
	  for ( var i=0; i < date.getDay(); i++ ){
		days.push({
		  'date': '',
		  'hidden': true
		});
	  }

	  while (date.getMonth() === thisMonth) {
		var todayParam = false;

		// Calculate today
		if ( 
			date.getDate() === thisDate.getDate() && 
			date.getMonth() === thisDate.getMonth() && 
			date.getYear() === thisDate.getYear()
		   ){
		  todayParam = true; 
		};

		days.push({
		  'date': date,
		  'today': todayParam
		});
		date = new Date(date.getTime()+86400000);
	  }
	  console.log( days, 'calendarDays' )
	  return days;
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
		url: 'http://kirillnovak.com/#/report-a-bug'
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

