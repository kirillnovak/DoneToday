'use strict';

// MODULE
var app = angular.module('DoneTodayChrome', [
  'ngMaterial',
	'ngMdIcons'
]);

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
	.primaryPalette('blue-grey')
	.accentPalette('blue');
});
