(function () {
  'use strict';

  angular.module('aliengoo.ng-insight').directive('ngModelInsight', ngModelInsight);

  var mutationObserverConfig = {
    childList: true
    , subtree: true
    , attributeFilter: ["ng-model"]
    , attributes: true
    , characterData: false
  };

  function ngModelInsight($compile, $timeout, $log, helperService) {
    var exports = {
      restrict: 'A',
      require: 'form',
      link: link
    };

    return exports;

    function link(scope, element, attributes) {

      if (angular.isUndefined($)) {
        console.error('aliengoo.ng-insight requires jQuery!');
        return;
      }

      var rootNode = element[0];

      function walk() {
        helperService.walkModelNodes(rootNode, (childNode) => {
          attach(rootNode, observer, childNode);
        });
      }

      var observer = new MutationObserver((mutationRecords) => {
        if (helperService.containsNodeType(mutationRecords, "INPUT", "SELECT", "TEXTAREA")) {
          walk();
        }
      });

      attributes.$observe('ngModelInsight', (newValue) => {
        if (newValue) {
          $timeout(() => {
            walk();
            observer.observe(rootNode, mutationObserverConfig);
          }, 1);
        } else {
          observer.disconnect();
          $('.ng-model-insight').remove();
        }
      });
    }

    function attach(node, observer, childNode) {

      if (childNode.error) {
        return;
      }

      if (!childNode.ngElementName) {
        console.error(`Cannot add ngModelInsight because the target not ${childNode.ngModelBinding} has no name`);
        return;
      }

      var name = `ngModelInsight_${childNode.ngElementName.replace(/\./g, "_")}`;

      var selector = `[name="${name}"]`;
      childNode.scope[name] = childNode.ngModel;

      var modelStateElement = $(selector);
      if (modelStateElement.length === 0) {
        let html = `
          <span class='indicator scope'>$${childNode.scope.$id}</span>
          <span class='indicator' ng-class='{"dirty" : ${name}.$dirty}' ng-show='${name}.$dirty'>Dirty</span>
          <span class='indicator' ng-class='{"pristine" : ${name}.$pristine}' ng-show='${name}.$pristine'>Pristine</span>
          <span class='indicator' ng-class='{"valid" : ${name}.$valid}' ng-show='${name}.$valid'>Valid</span>
          <span class='indicator' ng-class='{"invalid" : ${name}.$invalid}' ng-show='${name}.$invalid'>Invalid</span>
          <span name='errors' class='indicator errors'></span>
          <span class='indicator view-value' ng-show='${name}.$viewValue'>View: <em>{{${name}.$viewValue}}</em></span>
          <span class='indicator model-value' ng-show='${name}.$modelValue'>Model: <em>{{${name}.$modelValue}}</em></span>`;

        modelStateElement = angular.element(`<div name='${name}' class='ng-model-insight'>`);
        modelStateElement.append(angular.element(html));

        $compile(modelStateElement)(childNode.scope);

        observer.disconnect();
        childNode.ngElement.after(modelStateElement);
        observer.observe(node, mutationObserverConfig);

        childNode.scope.$watch(() => childNode.ngModel.$viewValue, build);
      }

      function build() {
        observer.disconnect();
        var errorsHtml = '';

        angular.forEach(Object.keys(childNode.scope[name].$error || {}), function (e) {
          errorsHtml += `<span class='indicator error'><em>${e}</em></span>`;
        });

        $(modelStateElement).find('[name="errors"]').html(errorsHtml);
        observer.observe(node, mutationObserverConfig);
      }

      build();
    }
  }
}());
