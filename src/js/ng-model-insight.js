(function () {
  'use strict';

  angular.module('aliengoo.ng-insight').directive('ngModelInsight', ngModelInsight);

  function ngModelInsight($compile) {
    var exports = {
      restrict: 'A',
      require: 'form',
      link: link
    };

    return exports;

    function link(scope, element, attribute) {

      if (angular.isUndefined($)) {
        console.error('aliengoo.ng-insight requires jQuery!');
        return;
      }

      var formElement = $(element);
      attribute.$observe('ngModelInsight', (enabled) => {
        scope.$evalAsync(() => {

          var ngModelElements = formElement.find('[ng-model]').toArray();

          if (enabled === true || enabled === 'true') {
            observe(ngModelElements);
          } else if (enabled === false || enabled === 'false') {
            unobserve(ngModelElements);
          }
        });
      });

      function observe(ngModelElements) {
        ngModelElements.forEach((el) => {
          observeModel(scope, angular.element(el));
        });
      }

      function unobserve(ngModelElements) {
        ngModelElements.forEach((el) => {
          unobserveModel(angular.element(el));
        });
      }
    }

    function observeModel(scope, ngElement) {
      let ngModel = ngElement.controller('ngModel');
      let props = "dirty,pristine,error,valid,invalid,viewValue,modelValue".split(',');
      let childScope;
      let name = 'ngModelInsight_' + ngElement.attr('ng-model').replace('.', '_');
      let selector = `[name="${name}"]`;
      let modelStateElement = $('body').find(selector);

      if (modelStateElement) {
        let oldScope = angular.element(modelStateElement).scope();
        if (oldScope) {
          childScope = oldScope;
        }
      }

      if (!childScope) {
        childScope = scope.$new();

        let html = `
          <samp class='indicator' ng-class='{"dirty" : dirty}' ng-show='dirty'>Dirty</samp>
          <samp class='indicator' ng-class='{"pristine" : pristine}' ng-show='pristine'>Pristine</samp>
          <samp class='indicator' ng-class='{"valid" : valid}' ng-show='valid'>Valid</samp>
          <samp class='indicator' ng-class='{"invalid" : invalid}' ng-show='invalid'>Invalid</samp>
          <samp name='errors' class='indicator errors'></samp>
          <samp class='indicator view-value' ng-show='viewValue'>View: <em>{{viewValue}}</em></samp>
          <samp class='indicator model-value' ng-show='modelValue'>Model: <em>{{modelValue}}</em></samp>`;

        modelStateElement = angular.element(`<div name='${name}' class='ng-model-insight'>`);
        modelStateElement.append(angular.element(html));

        $compile(modelStateElement)(childScope);

        ngElement.parent().append(modelStateElement);

        let build = () => {
          var errorsHtml = '';
          for (let e of Object.keys(childScope.error || {})) {
            errorsHtml += `<samp class='indicator error'><em>${e}</em></samp>`;
          }

          $(modelStateElement).find('[name="errors"]').html(errorsHtml);
          for (let prop of props) {
            childScope[prop] = ngModel[`$${prop}`];
          }
        };

        childScope.$watch(() => ngModel.$viewValue, build);

        build();
      }
    }

    function unobserveModel(ngElement) {
      let name = 'ngModelInsight_' + ngElement.attr('ng-model').replace('.', '_');
      let selector = `[name="${name}"]`;
      var modelStateElement = $('body').find(selector);
      if (modelStateElement) {
        let oldScope = angular.element(modelStateElement).scope();
        if (oldScope) {
          oldScope.$destroy();
          oldScope = null;
        }

        modelStateElement.remove();
      }
    }

  }
}());