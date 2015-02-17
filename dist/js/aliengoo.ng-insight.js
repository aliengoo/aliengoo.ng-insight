"use strict";

(function () {
  "use strict";

  angular.module("aliengoo.ng-insight", []);
})();
(function () {
  "use strict";

  angular.module("aliengoo.ng-insight").directive("ngAutoMessageInsight", ngAutoMessageInsight);

  var messages = {
    email: "Email address is not valid",
    max: "Above maximum",
    maxlength: "Maximum length exceeded",
    min: "Below minimum",
    minlength: "Minimum length not met",
    number: "Not a valid number",
    pattern: "Value is not valid",
    required: "Value is required",
    url: "Not a valid URL",
    date: "Not a valid date",
    datetimelocal: "Not a valid date/time",
    time: "Not a valid time",
    week: "Not a valid week",
    month: "Not a valid month"
  };

  function ngAutoMessageInsight($compile) {
    var exports = {
      restrict: "A",
      require: "form",
      link: link
    };

    return exports;

    function link(scope, element, attribute) {
      if (angular.isUndefined($)) {
        console.error("aliengoo.ng-insight requires jQuery!");
        return;
      }

      var formElement = $(element);




      attribute.$observe("ngAutoMessageInsight", function (enabled) {
        scope.$evalAsync(function () {
          var ngModelElements = formElement.find("[ng-model]").toArray();

          if (enabled === true || enabled === "true") {
            attach(ngModelElements);
          } else if (enabled === false || enabled === "false") {
            detach(ngModelElements);
          }
        });
      });

      function attach(ngModelElements) {
        angular.forEach(ngModelElements, function (el) {
          attachMessages(angular.element(el));
        });
      }

      function detach(ngModelElements) {
        angular.forEach(ngModelElements, function (el) {
          detachMessages(angular.element(el));
        });
      }
    }

    function attachMessages(ngElement) {
      var ngModel = ngElement.controller("ngModel");

      if (!ngModel) {
        return;
      }
      var scope = ngElement.scope();

      var name = "ngAutoMessageInsight_" + ngElement.attr("name").replace(".", "_");

      console.log(name);

      if (scope) {
        (function () {
          scope[name] = ngModel;

          var messagesHtml = "";

          angular.forEach(Object.keys(messages), function (propertyName) {
            var message = messages[propertyName];
            messagesHtml += "<span class='ng-auto-message-insight' ng-message='" + propertyName + "'>" + message + "</span>";
          });

          var html = "<div ng-messages=\"" + name + ".$error\">" + messagesHtml + "</div>";

          var messagesElement = angular.element(html);

          $compile(messagesElement)(scope);

          ngElement.after(messagesElement);
        })();
      }
    }

    function detachMessages(ngElement) {
      var name = "ngAutoMessageInsight_" + ngElement.attr("ng-model").replace(".", "_");
      var selector = "[name=\"" + name + "\"]";
      var modelStateElement = $("body").find(selector);
      if (modelStateElement) {
        modelStateElement.remove();
      }
    }
  }
  ngAutoMessageInsight.$inject = ["$compile"];
})();
(function () {
  "use strict";

  angular.module("aliengoo.ng-insight").directive("ngModelInsight", ngModelInsight);

  function ngModelInsight($compile, $window, $document) {
    var exports = {
      restrict: "A",
      require: "form",
      link: link
    };

    return exports;

    function link(scope, element) {
      if (angular.isUndefined($)) {
        console.error("aliengoo.ng-insight requires jQuery!");
        return;
      }

      var observer;

      var mutationObserverConfig = {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
      };

      function attachNgModelElements() {
        scope.$evalAsync(function () {
          angular.forEach($(element).find("[ng-model]"), function (el) {
            attach(el);
          });
        });
      }

      observer = new MutationObserver(function () {
        console.log("m");
        attachNgModelElements();
      });

      observer.observe(element.get(0), mutationObserverConfig);

      attachNgModelElements();
    }

    function attach(el) {
      var ngEl = angular.element(el);
      var ngModel = ngEl.controller("ngModel");
      var name = "ngModelInsight_" + ngEl.attr("name").replace(".", "_");
      var selector = "[name=\"" + name + "\"]";
      var childScope = angular.element(ngEl).scope();

      childScope[name] = ngModel;

      var modelStateElement = $(selector);
      if (modelStateElement.length === 0) {
        var html = "\n          <samp class='indicator' ng-class='{\"dirty\" : " + name + ".$dirty}' ng-show='" + name + ".$dirty'>Dirty</samp>\n          <samp class='indicator' ng-class='{\"pristine\" : " + name + ".$pristine}' ng-show='" + name + ".$pristine'>Pristine</samp>\n          <samp class='indicator' ng-class='{\"valid\" : " + name + ".$valid}' ng-show='" + name + ".$valid'>Valid</samp>\n          <samp class='indicator' ng-class='{\"invalid\" : " + name + ".$invalid}' ng-show='" + name + ".$invalid'>Invalid</samp>\n          <samp name='errors' class='indicator errors'></samp>\n          <samp class='indicator view-value' ng-show='" + name + ".$viewValue'>View: <em>{{" + name + ".$viewValue}}</em></samp>\n          <samp class='indicator model-value' ng-show='" + name + ".$modelValue'>Model: <em>{{" + name + ".$modelValue}}</em></samp>";

        modelStateElement = angular.element("<div name='" + name + "' class='ng-model-insight'>");
        modelStateElement.append(angular.element(html));

        $compile(modelStateElement)(childScope);

        ngEl.after(modelStateElement);

        ngModel.$viewChangeListeners.push(build);
      }

      function build() {
        var errorsHtml = "";
        angular.forEach(Object.keys(childScope[name].$error || {}), function (e) {
          errorsHtml += "<samp class='indicator error'><em>" + e + "</em></samp>";
        });

        $(modelStateElement).find("[name=\"errors\"]").html(errorsHtml);
      }

      build();
    }
  }
  ngModelInsight.$inject = ["$compile", "$window", "$document"];
})();
(function () {
  "use strict";

  angular.module("aliengoo.ng-insight").directive("ngScopeInsight", ngScopeInsight);

  function ngScopeInsight() {
    var exports = {
      restrict: "A",
      link: link
    };

    return exports;

    function link(scope, element) {
      if (angular.isUndefined($)) {
        console.error("aliengoo.ng-insight requires jQuery!");
        return;
      }

      var body = $("body");

      function processElement(element) {
        var ngElement = angular.element(element);
        var scope = ngElement.scope();

        if (scope) {
          var _name = ngElement.attr("name");
          $("span.ng-scope-insight[name=\"" + _name + "\"]").remove();
          var id = scope.$id;
          var offset = ngElement.offset();
          var left = offset.left;
          var _top = offset.top - $(document).scrollTop();

          var html = "<span class=\"ng-scope-insight\" name='" + _name + "' style='position:absolute;left:" + left + "px;top:" + _top + "px'>" + id + "</span>";

          body.append(angular.element(html));
        }
      }

      var observer = new MutationObserver(function (mutationRecords) {
        angular.forEach(mutationRecords, function (mutationRecord) {
          processElement(mutationRecord.target);
        });
      });

      var config = { childList: true };


      scope.$evalAsync(function () {
        var ngModelElements = $(element).find("[ng-model]");

        $(window).resize(function () {
          angular.forEach(ngModelElements, processElement);
        });

        angular.forEach(ngModelElements, function (ngModelElement) {
          observer.observe(ngModelElement, config);
        });
      });
    }
  }
})();