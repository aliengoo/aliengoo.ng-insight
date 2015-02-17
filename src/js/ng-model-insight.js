(function () {
  'use strict';

  angular.module('aliengoo.ng-insight').directive('ngModelInsight', ngModelInsight);

  var mutationObserverConfig = {
    childList: true
    , subtree: true
    , attributes: false
    , characterData: false
  };

  function ngModelInsight($compile, $window, $document) {
    var exports = {
      restrict: 'A',
      require: 'form',
      link: link
    };

    return exports;

    function link(scope, element) {

      // weird issue where element is undefined.
      if (element){
        return;
      }

      if (angular.isUndefined($)) {
        console.error('aliengoo.ng-insight requires jQuery!');
        return;
      }

      function update() {
        scope.$evalAsync(() => {
          angular.forEach($(element).find('[ng-model]'), (el) => {
            attach(element, observer, el);
          });
        });
      }

      var observer = new MutationObserver(() => {
        update();
      });

      observer.observe(element.get(0), mutationObserverConfig);

      update();
    }

    function attach(formElement, observer, el) {
      var ngEl = angular.element(el);
      var ngModel = ngEl.controller('ngModel');
      var name = 'ngModelInsight_' + ngEl.attr('name').replace('.', '_');
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
        observer.observe(formElement.get(0), mutationObserverConfig);

        childScope.$watch(() => ngModel.$viewValue, build);
      }

      function build() {
        observer.disconnect();
        var errorsHtml = '';

        angular.forEach(Object.keys(childScope[name].$error || {}), function (e) {
          errorsHtml += `<samp class='indicator error'><em>${e}</em></samp>`;
        });

        $(modelStateElement).find('[name="errors"]').html(errorsHtml);
        observer.observe(formElement.get(0), mutationObserverConfig);
      }

      build();
    }
  }
}());