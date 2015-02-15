# ng-insight

Visualise the current state of each ```ng-model``` bound element.

!image!

## Getting started

	bower install aliengoo.ng-insight --save
	
Add a reference in your Angular module.

	angular.module('myApp', ['aliengoo.ng-insight']);
	
Finally, add an attribute to the ```<form>``` element.
	
	<form name='myForm' novalidate ng-model-insight='true'>inputs are here...</form>