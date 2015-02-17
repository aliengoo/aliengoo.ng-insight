# ng-insight


Visualise the current state of each ```ng-model``` bound element.

![](https://raw.githubusercontent.com/aliengoo/aliengoo.ng-insight/master/images/aliengoo-ng-insight-sample.gif)

## Getting started

	bower install aliengoo.ng-insight --save
	
Add a reference in your Angular module.

	angular.module('myApp', ['aliengoo.ng-insight']);

Add ```aliengoo.ng-insight.js``` and ```aliengoo.ng-insight.css``` to your preferred build solution.
	
Finally, add an attribute to the ```<form>``` element.
	
	<form name='myForm' novalidate ng-model-insight='true'>inputs are here...</form>
	
![](https://raw.githubusercontent.com/aliengoo/aliengoo.ng-insight/master/images/aliengoo-ng-insight-sample.png)	
