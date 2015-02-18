# ng-insight


## ng-model-insight

```ng-model-insight``` can be applied to a ```<form>``` element.  Any ```ng-model``` bound elements inside of the form are then given
a set of indicators about the current state of the ```ng-model```.


![](https://raw.githubusercontent.com/aliengoo/aliengoo.ng-insight/master/images/aliengoo-ng-insight-sample.gif)

See the [ng-model-insight demo](http://plnkr.co/edit/bhCXJdfOMSphN7RK0iae?p=preview) on Plunker.

## How it works

Initially, the DOM is walked, looking for ```input```, ```select``` and ```textarea``` elements with an ```ng-model``` binding.

A new element is added after the ```ng-model``` bound element.

### DOM Mutations

```ng-model-insight``` watches for DOM mutations using a MutationObserver where the node is the element ```ng-model-insight``` is set.

If any DOM mutation occurs, MutationRecords are checked to see if any elements are a type of input, and if so, ```ng-model-insight``` elements are added or removed.

## Installation

	bower install aliengoo.ng-insight --save
	
Add a reference in your Angular module.

	angular.module('myApp', ['aliengoo.ng-insight', 'ngMessages']);

Add ```aliengoo.ng-insight.js``` and ```aliengoo.ng-insight.css``` to your preferred build solution.
