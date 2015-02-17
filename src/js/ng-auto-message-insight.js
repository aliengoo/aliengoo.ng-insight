(function () {
  'use strict';

  angular.module('aliengoo.ng-insight').directive('ngAutoMessageInsight', ngAutoMessageInsight);

  var messages = {
    email : 'Email address is not valid',
    max : 'Above maximum',
    maxlength : 'Maximum length exceeded',
    min : 'Below minimum',
    minlength : 'Minimum length not met',
    number : 'Not a valid number',
    pattern : 'Value is not valid',
    required : 'Value is required',
    url : 'Not a valid URL',
    date : 'Not a valid date',
    datetimelocal : 'Not a valid date/time',
    time : 'Not a valid time',
    week : 'Not a valid week',
    month : 'Not a valid month'
  };

  function ngAutoMessageInsight($compile) {
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




      attribute.$observe('ngAutoMessageInsight', function (enabled) {
        scope.$evalAsync(() => {

          var ngModelElements = formElement.find('[ng-model]').toArray();

          if (enabled === true || enabled === 'true') {
            attach(ngModelElements);
          } else if (enabled === false || enabled === 'false') {
            detach(ngModelElements);
          }
        });
      });

      function attach(ngModelElements) {
        angular.forEach(ngModelElements, (el) => {
          attachMessages(angular.element(el));
        });
      }

      function detach(ngModelElements) {
        angular.forEach(ngModelElements, (el) => {
          detachMessages(angular.element(el));
        });
      }
    }

    function attachMessages(ngElement) {

      var ngModel = ngElement.controller('ngModel');

      if (!ngModel) {
        return;
      }
      var scope = ngElement.scope();

      var name = 'ngAutoMessageInsight_' + ngElement.attr('name').replace('.', '_');

      console.log(name);

      if (scope) {
        scope[name] = ngModel;

        let messagesHtml = '';

        angular.forEach(Object.keys(messages), (propertyName) => {
          var message = messages[propertyName];
          messagesHtml += `<span class='ng-auto-message-insight' ng-message='${propertyName}'>${message}</span>`;
        });

        let html = `<div ng-messages="${name}.$error">${messagesHtml}</div>`;

        let messagesElement = angular.element(html);

        $compile(messagesElement)(scope);

        ngElement.after(messagesElement);
      }
    }

    function detachMessages(ngElement) {
      let name = 'ngAutoMessageInsight_' + ngElement.attr('ng-model').replace('.', '_');
      let selector = `[name="${name}"]`;
      var modelStateElement = $('body').find(selector);
      if (modelStateElement) {
        modelStateElement.remove();
      }
    }
  }
}());