'use strict';

// Declare app level module which depends on views, and components
angular.module('nutrionixApp', [
  'ngRoute',
  'nutrionixApp.view1',
  'nutrionixApp.view2',
  'nutrionixApp.index',
  'nutrionixApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/'});
}]).
constant('appId', '26e76f20').
constant('appKey', '505f8e94160bc883261fad5af130b657')

;
