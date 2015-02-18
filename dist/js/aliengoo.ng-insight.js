"use strict";

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

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

  angular.module("aliengoo.ng-insight").factory("helperService", helperService);

  var nodeListToArray = function (nodeList) {
    return Array.prototype.slice.call(nodeList);
  };

  function helperService() {
    var exports = {
      walkModelNodes: walkModelNodes,
      containsNodeType: containsNodeType
    };

    return exports;

    function containsNodeType(mutationRecords) {
      for (var _len = arguments.length, tagNames = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        tagNames[_key - 1] = arguments[_key];
      }

      var walk = function (rootNode) {
        var treeWalker = document.createTreeWalker(rootNode, NodeFilter.SHOW_ELEMENT, {
          acceptNode: function (n) {
            if (tagNames.filter(function (tn) {
              return n.tagName === tn;
            }).length > 0) {
              return NodeFilter.FILTER_ACCEPT;
            } else {
              return NodeFilter.FILTER_SKIP;
            }
          }
        });

        var count = 0;

        while (treeWalker.nextNode()) {
          count++;
        }

        return count > 0;
      };

      var signalInterestingChange = false;

      for (var _iterator = mutationRecords[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
        var _nodeListToArray;
        var mr = _step.value;
        var allNodes = (_nodeListToArray = nodeListToArray(mr.removedNodes)).concat.apply(_nodeListToArray, _toConsumableArray(nodeListToArray(mr.addedNodes)));

        for (var _iterator2 = allNodes[Symbol.iterator](), _step2; !(_step2 = _iterator2.next()).done;) {
          var childNode = _step2.value;
          if (childNode && walk(childNode)) {
            signalInterestingChange = true;
            break;
            break;
          }
        }
      }

      return signalInterestingChange;
    }

    ///////////////
    function walkModelNodes(rootNode, onNode) {
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
        var ngEl = angular.element(treeWalker.currentNode);
        var nodeData = {
          ngElement: ngEl,
          ngElementName: ngEl.attr("name"),
          ngModelBinding: ngEl.attr("ng-model"),
          ngModel: ngEl.controller("ngModel"),
          scope: ngEl.scope()
        };

        if (!nodeData.ngModel) {
          onNode({
            error: "No ng-model available"
          });
        }

        onNode(nodeData);
      }
    }
  }
})();
(function () {
  "use strict";

  angular.module("aliengoo.ng-insight").directive("ngModelInsight", ngModelInsight);

  var mutationObserverConfig = {
    childList: true,
    subtree: true,
    attributeFilter: ["ng-model"],
    attributes: true,
    characterData: false
  };

  function ngModelInsight($compile, $timeout, $log, helperService) {
    var exports = {
      restrict: "A",
      require: "form",
      link: link
    };

    return exports;

    function link(scope, element, attributes) {
      if (angular.isUndefined($)) {
        console.error("aliengoo.ng-insight requires jQuery!");
        return;
      }

      var rootNode = element[0];

      function walk() {
        helperService.walkModelNodes(rootNode, function (childNode) {
          attach(rootNode, observer, childNode);
        });
      }

      var observer = new MutationObserver(function (mutationRecords) {
        if (helperService.containsNodeType(mutationRecords, "INPUT", "SELECT", "TEXTAREA")) {
          $log.debug("walking for ng-model-insight");
          walk();
        }
      });

      attributes.$observe("ngModelInsight", function (newValue) {
        if (newValue) {
          $timeout(function () {
            walk();
            observer.observe(rootNode, mutationObserverConfig);
          }, 1);
        } else {
          observer.disconnect();
          $(".ng-model-insight").remove();
        }
      });
    }

    function attach(node, observer, childNode) {
      if (childNode.error) {
        return;
      }

      if (!childNode.ngElementName) {
        console.error("Cannot add ngModelInsight because the target not " + childNode.ngModelBinding + " has no name");
        return;
      }

      var name = "ngModelInsight_" + childNode.ngElementName.replace(/\./g, "_");

      var selector = "[name=\"" + name + "\"]";
      childNode.scope[name] = childNode.ngModel;

      var modelStateElement = $(selector);
      if (modelStateElement.length === 0) {
        var html = "\n          <span class='indicator scope'>$" + childNode.scope.$id + "</span>\n          <span class='indicator' ng-class='{\"dirty\" : " + name + ".$dirty}' ng-show='" + name + ".$dirty'>Dirty</span>\n          <span class='indicator' ng-class='{\"pristine\" : " + name + ".$pristine}' ng-show='" + name + ".$pristine'>Pristine</span>\n          <span class='indicator' ng-class='{\"valid\" : " + name + ".$valid}' ng-show='" + name + ".$valid'>Valid</span>\n          <span class='indicator' ng-class='{\"invalid\" : " + name + ".$invalid}' ng-show='" + name + ".$invalid'>Invalid</span>\n          <span name='errors' class='indicator errors'></span>\n          <span class='indicator view-value' ng-show='" + name + ".$viewValue'>View: <em>{{" + name + ".$viewValue}}</em></span>\n          <span class='indicator model-value' ng-show='" + name + ".$modelValue'>Model: <em>{{" + name + ".$modelValue}}</em></span>";

        modelStateElement = angular.element("<div name='" + name + "' class='ng-model-insight'>");
        modelStateElement.append(angular.element(html));

        $compile(modelStateElement)(childNode.scope);

        observer.disconnect();
        childNode.ngElement.after(modelStateElement);
        observer.observe(node, mutationObserverConfig);

        childNode.scope.$watch(function () {
          return childNode.ngModel.$viewValue;
        }, build);
      }

      function build() {
        observer.disconnect();
        var errorsHtml = "";

        angular.forEach(Object.keys(childNode.scope[name].$error || {}), function (e) {
          errorsHtml += "<span class='indicator error'><em>" + e + "</em></span>";
        });

        $(modelStateElement).find("[name=\"errors\"]").html(errorsHtml);
        observer.observe(node, mutationObserverConfig);
      }

      build();
    }
  }
  ngModelInsight.$inject = ["$compile", "$timeout", "$log", "helperService"];
})();