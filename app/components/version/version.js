'use strict';

angular.module('nutrionixApp.version', [
  'nutrionixApp.version.interpolate-filter',
  'nutrionixApp.version.version-directive'
])

.value('version', '0.1');
