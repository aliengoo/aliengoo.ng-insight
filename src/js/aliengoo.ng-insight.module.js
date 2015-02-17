(function () {
  'use strict';



  angular.module('aliengoo.ng-insight', ['ngMessages']);

  try{
    var m = angular.module('ngMessages');
  } catch (ex) {
    console.error('ngMessage module is required');
  }

}());