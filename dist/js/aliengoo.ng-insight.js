"use strict";

(function () {
  "use strict";

  angular.module("aliengoo.ng-insight", []);
})();
(function () {
  "use strict";

  angular.module("aliengoo.ng-insight").directive("ngModelInsight", ngModelInsight);

  function ngModelInsight($compile) {
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
      attribute.$observe("ngModelInsight", function (enabled) {
        scope.$evalAsync(function () {
          var ngModelElements = formElement.find("[ng-model]").toArray();

          if (enabled === true || enabled === "true") {
            observe(ngModelElements);
          } else if (enabled === false || enabled === "false") {
            unobserve(ngModelElements);
          }
        });
      });

      function observe(ngModelElements) {
        ngModelElements.forEach(function (el) {
          observeModel(scope, angular.element(el));
        });
      }

      function unobserve(ngModelElements) {
        ngModelElements.forEach(function (el) {
          unobserveModel(angular.element(el));
        });
      }
    }

    function observeModel(scope, ngElement) {
      var ngModel = ngElement.controller("ngModel");
      var props = "dirty,pristine,error,valid,invalid,viewValue,modelValue".split(",");
      var childScope = undefined;
      var name = "ngModelInsight_" + ngElement.attr("ng-model").replace(".", "_");
      var selector = "[name=\"" + name + "\"]";
      var modelStateElement = $("body").find(selector);

      if (modelStateElement) {
        var oldScope = angular.element(modelStateElement).scope();
        if (oldScope) {
          childScope = oldScope;
        }
      }

      if (!childScope) {
        childScope = scope.$new();

        var html = "\n          <samp class='indicator' ng-class='{\"dirty\" : dirty}' ng-show='dirty'>Dirty</samp>\n          <samp class='indicator' ng-class='{\"pristine\" : pristine}' ng-show='pristine'>Pristine</samp>\n          <samp class='indicator' ng-class='{\"valid\" : valid}' ng-show='valid'>Valid</samp>\n          <samp class='indicator' ng-class='{\"invalid\" : invalid}' ng-show='invalid'>Invalid</samp>\n          <samp name='errors' class='indicator errors'></samp>\n          <samp class='indicator view-value' ng-show='viewValue'>View: <em>{{viewValue}}</em></samp>\n          <samp class='indicator model-value' ng-show='modelValue'>Model: <em>{{modelValue}}</em></samp>";

        modelStateElement = angular.element("<div name='" + name + "' class='ng-model-insight'>");
        modelStateElement.append(angular.element(html));

        $compile(modelStateElement)(childScope);

        ngElement.after(modelStateElement);

        var build = function () {
          var errorsHtml = "";
          for (var _iterator = Object.keys(childScope.error || {})[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
            var e = _step.value;
            errorsHtml += "<samp class='indicator error'><em>" + e + "</em></samp>";
          }

          $(modelStateElement).find("[name=\"errors\"]").html(errorsHtml);
          for (var _iterator2 = props[Symbol.iterator](), _step2; !(_step2 = _iterator2.next()).done;) {
            var prop = _step2.value;
            childScope[prop] = ngModel["$" + prop];
          }
        };

        childScope.$watch(function () {
          return ngModel.$viewValue;
        }, build);

        build();
      }
    }

    function unobserveModel(ngElement) {
      var name = "ngModelInsight_" + ngElement.attr("ng-model").replace(".", "_");
      var selector = "[name=\"" + name + "\"]";
      var modelStateElement = $("body").find(selector);
      if (modelStateElement) {
        var oldScope = angular.element(modelStateElement).scope();
        if (oldScope) {
          oldScope.$destroy();
          oldScope = null;
        }

        modelStateElement.remove();
      }
    }
  }
  ngModelInsight.$inject = ["$compile"];
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

    function link(scope, element, attributes) {
      if (angular.isUndefined($)) {
        console.error("aliengoo.ng-insight requires jQuery!");
        return;
      }

      var interestElements = "input,textarea,select".split(",");

      var treeWalker = document.createTreeWalker(document, NodeFilter.SHOW_ALL, {
        acceptNode: function (node) {
          return NodeFilter.FILTER_ACCEPT;
        }
      }, false);

      do {
        var localName = treeWalker.currentNode.localName;

        if (interestElements.indexOf(localName) >= 0) {
          var el = angular.element(treeWalker.currentNode);

          var scope = el.scope();

          if (scope) {
            var id = scope.$id;
            el.attr("data-scope", id);
            el.addClass("ng-scope-insight");
          }
        }
      } while (treeWalker.nextNode());
    }
  }
})();