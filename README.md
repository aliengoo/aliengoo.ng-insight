# ng-insight

# Sorry, this has some pretty serious issues, best avoided at the moment.

## ng-model-insight

```ng-model-insight``` can be applied to a ```<form>``` element.  Any ```ng-model``` bound elements inside of the form are then given
a set of indicators about the current state of the ```ng-model```.

![](https://raw.githubusercontent.com/aliengoo/aliengoo.ng-insight/master/images/aliengoo-ng-insight-sample.gif)

See the [ng-model-insight demo](http://plnkr.co/edit/bhCXJdfOMSphN7RK0iae?p=preview) on Plunker.

## ng-auto-message-insight

```ng-auto-message-insight```, like ```ng-model-insight```, can be applied to a container element, and again, like ```ng-model-insight```, monitors the
current ```ng-model``` state.  But unlike ```ng-model-insight``` displays friendly messages for each built-in error provided by angular, e.g. _date_, _email_, _required_,
etc.

Sometimes, you don't want to show the message immediately, i.e, when ```$pristine```.  To prevent messages appearing, add the ```ng-auto-message-insight-when-dirty``` attribute
to the same container as ```ng-auto-message-insight```.

## Installation

	bower install aliengoo.ng-insight --save
	
Add a reference in your Angular module.

	angular.module('myApp', ['aliengoo.ng-insight', 'ngMessages']);

*Note* ```angular-messages``` is required for ```ng-auto-message-insight```.

Add ```aliengoo.ng-insight.js``` and ```aliengoo.ng-insight.css``` to your preferred build solution.
