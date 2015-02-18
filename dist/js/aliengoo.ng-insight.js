"use strict";

(function () {
  "use strict";



  angular.module("aliengoo.ng-insight", ["ngMessages"]);

  try {
    var m = angular.module("ngMessages");
  } catch (ex) {
    console.error("ngMessage module is required");
  }
})();
(function () {
  "use strict";

  angular.module("aliengoo.ng-insight").directive("ngAutoMessageInsight", ngAutoMessageInsight);

  var mutationObserverConfig = {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  };

  var messages = {
    email: "Email address is not valid",
    max: "Above maximum permitted value",
    maxlength: "Maximum length exceeded",
    min: "Below minimum permitted value",
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

    function link(scope, element, attributes) {
      if (!element.length) {
        return;
      }

      if (angular.isUndefined($)) {
        console.error("aliengoo.ng-insight requires jQuery!");
        return;
      }

      function update() {
        scope.$evalAsync(function () {
          angular.forEach($(element).find("[ng-model]"), function (el) {
            attach(element, observer, el, attributes);
          });
        });
      }

      var observer = new MutationObserver(function () {
        update();
      });

      observer.observe(element.get(0), mutationObserverConfig);

      update();
    }

    function attach(formElement, observer, el, attributes) {
      var ngEl = angular.element(el);
      var ngModel = ngEl.controller("ngModel");
      var name = "ngAutoMessageInsight_" + ngEl.attr("ng-model").replace(/\./g, "_");
      var selector = "[name=\"" + name + "\"]";
      var childScope = angular.element(ngEl).scope();
      childScope[name] = ngModel;
      var messagesEl = $(selector);

      if (messagesEl.length === 0) {
        (function () {
          var messagesHtml = "";

          angular.forEach(Object.keys(messages), function (propertyName) {
            var message = messages[propertyName];
            messagesHtml += "<span class='ng-auto-message-insight' ng-message='" + propertyName + "'>" + message + "</span>";
          });

          var whenDirty = "";

          if (attributes.hasOwnProperty("ngAutoMessageInsightWhenDirty")) {
            whenDirty = " ng-show=\"" + name + ".$dirty\"";
          }

          var html = "<div ng-messages=\"" + name + ".$error\" " + whenDirty + " name=\"" + name + "\">" + messagesHtml + "</div>";

          var messagesElement = angular.element(html);

          $compile(messagesElement)(childScope);

          observer.disconnect();

          ngEl.after(messagesElement);

          observer.observe(formElement.get(0), mutationObserverConfig);
        })();
      }
    }
  }
  ngAutoMessageInsight.$inject = ["$compile"];
})();

(function () {
  "use strict";

  angular.module("aliengoo.ng-insight").directive("ngModelInsight", ngModelInsight);

  var mutationObserverConfig = {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  };

  function ngModelInsight($compile, $timeout) {
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

      var rootNode = element[0];

      function walk() {
        var treeWalker = document.createTreeWalker(rootNode, NodeFilter.SHOW_ELEMENT, {
          acceptNode: function (n) {
            if (n.tagName === "INPUT" || n.tagName === "SELECT" || n.tagName === "TEXTAREA") {
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

      $timeout(function () {
        walk();
        observer.observe(rootNode, mutationObserverConfig);
      }, 1);
    }

    function attach(node, observer, el) {
      var ngEl = angular.element(el);
      var ngModel = ngEl.controller("ngModel");

      if (!ngModel) {
        return;
      }

      var elementName = ngEl.attr("name");

      if (angular.isUndefined(elementName)) {
        throw "ng-model-insight requires " + ngEl.attr("ng-model") + " has a name";
      }

      var name = "ngModelInsight_" + elementName.replace(/\./g, "_");

      var selector = "[name=\"" + name + "\"]";
      var childScope = angular.element(ngEl).scope();

      childScope[name] = ngModel;

      var modelStateElement = $(selector);
      if (modelStateElement.length === 0) {
        var html = "\n          <samp class='indicator' ng-class='{\"dirty\" : " + name + ".$dirty}' ng-show='" + name + ".$dirty'>Dirty</samp>\n          <samp class='indicator' ng-class='{\"pristine\" : " + name + ".$pristine}' ng-show='" + name + ".$pristine'>Pristine</samp>\n          <samp class='indicator' ng-class='{\"valid\" : " + name + ".$valid}' ng-show='" + name + ".$valid'>Valid</samp>\n          <samp class='indicator' ng-class='{\"invalid\" : " + name + ".$invalid}' ng-show='" + name + ".$invalid'>Invalid</samp>\n          <samp name='errors' class='indicator errors'></samp>\n          <samp class='indicator view-value' ng-show='" + name + ".$viewValue'>View: <em>{{" + name + ".$viewValue}}</em></samp>\n          <samp class='indicator model-value' ng-show='" + name + ".$modelValue'>Model: <em>{{" + name + ".$modelValue}}</em></samp>";

        modelStateElement = angular.element("<div name='" + name + "' class='ng-model-insight'>");
        modelStateElement.append(angular.element(html));

        $compile(modelStateElement)(childScope);

        observer.disconnect();
        ngEl.after(modelStateElement);
        observer.observe(node, mutationObserverConfig);

        childScope.$watch(function () {
          return ngModel.$viewValue;
        }, build);
      }

      function build() {
        observer.disconnect();
        var errorsHtml = "";

        angular.forEach(Object.keys(childScope[name].$error || {}), function (e) {
          errorsHtml += "<samp class='indicator error'><em>" + e + "</em></samp>";
        });

        $(modelStateElement).find("[name=\"errors\"]").html(errorsHtml);
        observer.observe(node, mutationObserverConfig);
      }

      build();
    }
  }
  ngModelInsight.$inject = ["$compile", "$timeout"];
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
      if (!element.length) {
        return;
      }

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