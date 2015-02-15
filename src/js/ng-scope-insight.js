(function () {
  'use strict';

  angular.module('aliengoo.ng-insight').directive('ngScopeInsight', ngScopeInsight);

  function ngScopeInsight() {
    var exports = {
      restrict: 'A',
      link: link
    };

    return exports;

    function link(scope, element, attributes) {

      if (angular.isUndefined($)) {
        console.error('aliengoo.ng-insight requires jQuery!');
        return;
      }

      var interestElements = 'input,textarea,select'.split(',');

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
            let id = scope.$id;
            el.attr('data-scope', id);
            el.addClass('ng-scope-insight');
          }
        }
      } while (treeWalker.nextNode());
    }
  }
}());