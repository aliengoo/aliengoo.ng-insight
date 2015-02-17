(function () {
  'use strict';

  angular.module('aliengoo.ng-insight').directive('ngModelInsight', ngModelInsight);

  function ngModelInsight($compile, $window, $document) {
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

      var observer;

      var mutationObserverConfig = {
        childList: true
        , subtree: true
        , attributes: false
        , characterData: false
      };

      function attachNgModelElements() {

        scope.$evalAsync(() => {
          angular.forEach($(element).find('[ng-model]'), (el) => {
            attach(el);
          });
        });
      }

      observer = new MutationObserver(() => {
        console.log('m');
        attachNgModelElements();
      });

      observer.observe(element.get(0), mutationObserverConfig);

      attachNgModelElements();
    }

    function attach(el) {
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

        ngEl.after(modelStateElement);

        ngModel.$viewChangeListeners.push(build);
      }

      function build() {
        var errorsHtml = '';
        angular.forEach(Object.keys(childScope[name].$error || {}), function (e) {
          errorsHtml += `<samp class='indicator error'><em>${e}</em></samp>`;
        });

        $(modelStateElement).find('[name="errors"]').html(errorsHtml);
      }

      build();
    }
  }
}());