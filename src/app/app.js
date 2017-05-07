'use strict';
Parse.initialize("myAppId", "myJavascriptKey", "myMasterKey");
Parse.serverURL = 'https://hrmis-api.herokuapp.com/parse';

angular.module('BlurAdmin', [
  'ngAnimate',
  'ui.bootstrap',
  'ui.sortable',
  'ui.router',
  'ngTouch',
  'toastr',
  'smart-table',
  "xeditable",
  'ui.slimscroll',
  'ngJsTree',
  'angular-progress-button-styles',

  'BlurAdmin.theme',
  'BlurAdmin.pages',
  'BlurAdmin.api'
]);
