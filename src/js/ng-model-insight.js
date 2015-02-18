(function () {
  'use strict';

  angular.module('aliengoo.ng-insight').directive('ngModelInsight', ngModelInsight);

  var mutationObserverConfig = {
    childList: true
    , subtree: true
    , attributes: false
    , characterData: false
  };

  function ngModelInsight($compile, $timeout) {
    var exports = {
      restrict: 'A',
      require: 'form',
      link: link
    };

    return exports;

    function link(scope, element) {

      if (angular.isUndefined($)) {
        console.error('aliengoo.ng-insight requires jQuery!');
        return;
      }

      var rootNode = element[0];

      function walk() {
        var treeWalker = document.createTreeWalker(rootNode, NodeFilter.SHOW_ELEMENT, {
          acceptNode: (n) => {
            if (n.tagName === 'INPUT' || n.tagName === 'SELECT' || n.tagName === 'TEXTAREA') {
              return NodeFilter.FILTER_ACCEPT;
            } else {
              return NodeFilter.FILTER_SKIP;
            }
          }
        });

        while (treeWalker.nextNode()) {
          attach(rootNode, observer, treeWalker.currentNode);
        }
      }

      var observer = new MutationObserver(function () {
        walk();
      });

      $timeout(() => {
        walk();
        observer.observe(rootNode, mutationObserverConfig);
      }, 1);
    }

    function attach(node, observer, el) {
      var ngEl = angular.element(el);
      var ngModel = ngEl.controller('ngModel');

      if (!ngModel) {
        return;
      }

      var elementName = ngEl.attr("name");

      if (angular.isUndefined(elementName)) {
        throw "ng-model-insight requires " + ngEl.attr('ng-model') + " has a name";
      }

      var name = "ngModelInsight_" + elementName.replace(/\./g, "_");

      var selector = `[name="${name}"]`;
      var childScope = angular.element(ngEl).scope();

      childScope[name] = ngModel;

      var modelStateElement = $(selector);
      if (modelStateElement.length === 0) {
        let html = `
          <samp class='indicator' ng-class='{"dirty" : ${name}.$dirty}' ng-show='${name}.$dirty'>Dirty</samp>
          <samp class='indicator' ng-class='{"pristine" : ${name}.$pristine}' ng-show='${name}.$pristine'>Pristine</samp>
          <samp class='indicator' ng-class='{"valid" : ${name}.$valid}' ng-show='${name}.$valid'>Valid</samp>
          <samp class='indicator' ng-class='{"invalid" : ${name}.$invalid}' ng-show='${name}.$invalid'>Invalid</samp>
          <samp name='errors' class='indicator errors'></samp>
          <samp class='indicator view-value' ng-show='${name}.$viewValue'>View: <em>{{${name}.$viewValue}}</em></samp>
          <samp class='indicator model-value' ng-show='${name}.$modelValue'>Model: <em>{{${name}.$modelValue}}</em></samp>`;

        modelStateElement = angular.element(`<div name='${name}' class='ng-model-insight'>`);
        modelStateElement.append(angular.element(html));

        $compile(modelStateElement)(childScope);

        observer.disconnect();
        ngEl.after(modelStateElement);
        observer.observe(node, mutationObserverConfig);

        childScope.$watch(() => ngModel.$viewValue, build);
      }

      function build() {
        observer.disconnect();
        var errorsHtml = '';

        angular.forEach(Object.keys(childScope[name].$error || {}), function (e) {
          errorsHtml += `<samp class='indicator error'><em>${e}</em></samp>`;
        });

        $(modelStateElement).find('[name="errors"]').html(errorsHtml);
        observer.observe(node, mutationObserverConfig);
      }

      build();
    }
  }
}());
