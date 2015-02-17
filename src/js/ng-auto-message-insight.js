(function () {
  'use strict';

  angular.module('aliengoo.ng-insight').directive('ngAutoMessageInsight', ngAutoMessageInsight);

  var mutationObserverConfig = {
    childList: true
    , subtree: true
    , attributes: false
    , characterData: false
  };

  var messages = {
    email: 'Email address is not valid',
    max: 'Above maximum permitted value',
    maxlength: 'Maximum length exceeded',
    min: 'Below minimum permitted value',
    minlength: 'Minimum length not met',
    number: 'Not a valid number',
    pattern: 'Value is not valid',
    required: 'Value is required',
    url: 'Not a valid URL',
    date: 'Not a valid date',
    datetimelocal: 'Not a valid date/time',
    time: 'Not a valid time',
    week: 'Not a valid week',
    month: 'Not a valid month'
  };

  function ngAutoMessageInsight($compile) {
    var exports = {
      restrict: 'A',
      require: 'form',
      link: link
    };

    return exports;

    function link(scope, element, attributes) {
      
      if (!element.length){
        return;
      }

      if (angular.isUndefined($)) {
        console.error('aliengoo.ng-insight requires jQuery!');
        return;
      }

      function update() {
        scope.$evalAsync(() => {
          angular.forEach($(element).find('[ng-model]'), (el) => {
            attach(element, observer, el, attributes);
          });
        });
      }

      var observer = new MutationObserver(() => {
        update();
      });

      observer.observe(element.get(0), mutationObserverConfig);

      update();
    }

    function attach(formElement, observer, el, attributes) {
      var ngEl = angular.element(el);
      var ngModel = ngEl.controller('ngModel');
      var name = 'ngAutoMessageInsight_' + ngEl.attr('ng-model').replace(/\./g, '_');
      var selector = `[name="${name}"]`;
      var childScope = angular.element(ngEl).scope();
      childScope[name] = ngModel;
      var messagesEl = $(selector);

      if (messagesEl.length === 0) {

        let messagesHtml = '';

        angular.forEach(Object.keys(messages), (propertyName) => {
          var message = messages[propertyName];
          messagesHtml += `<span class='ng-auto-message-insight' ng-message='${propertyName}'>${message}</span>`;
        });

        let whenDirty = '';

        if (attributes.hasOwnProperty('ngAutoMessageInsightWhenDirty')){
          whenDirty = ` ng-show="${name}.$dirty"`;
        }

        let html = `<div ng-messages="${name}.$error" ${whenDirty} name="${name}">${messagesHtml}</div>`;

        let messagesElement = angular.element(html);

        $compile(messagesElement)(childScope);

        observer.disconnect();

        ngEl.after(messagesElement);

        observer.observe(formElement.get(0), mutationObserverConfig);
      }
    }
  }
}());
