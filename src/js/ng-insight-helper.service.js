(function () {
  "use strict";

  angular.module('aliengoo.ng-insight').factory('helperService', helperService);

  let nodeListToArray = (nodeList) => {
    return Array.prototype.slice.call(nodeList);
  };

  function helperService() {
    var exports = {
      walkModelNodes: walkModelNodes,
      containsNodeType: containsNodeType
    };

    return exports;

    function containsNodeType(mutationRecords, ...tagNames) {

      let walk = (rootNode) => {
        let treeWalker = document.createTreeWalker(rootNode, NodeFilter.SHOW_ELEMENT, {
          acceptNode: (n) => {
            if (tagNames.filter((tn) => n.tagName === tn).length > 0) {
              return NodeFilter.FILTER_ACCEPT;
            } else {
              return NodeFilter.FILTER_SKIP;
            }
          }
        });

        let count = 0;

        while (treeWalker.nextNode()) {
          count++;
        }

        return count > 0;
      };

      let signalInterestingChange = false;

      for (let mr of mutationRecords) {
        let allNodes = nodeListToArray(mr.removedNodes).concat(...nodeListToArray(mr.addedNodes));

        for (let childNode of allNodes) {
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
        acceptNode: (n) => {
          if (n.tagName === 'INPUT' || n.tagName === 'SELECT' || n.tagName === 'TEXTAREA') {
            return NodeFilter.FILTER_ACCEPT;
          } else {
            return NodeFilter.FILTER_SKIP;
          }
        }
      });

      while (treeWalker.nextNode()) {
        let ngEl = angular.element(treeWalker.currentNode);
        let nodeData = {
          ngElement: ngEl,
          ngElementName: ngEl.attr("name"),
          ngModelBinding: ngEl.attr('ng-model'),
          ngModel: ngEl.controller('ngModel'),
          scope: ngEl.scope()
        };

        if (!nodeData.ngModel) {
          onNode({
            error: 'No ng-model available'
          });
        }

        onNode(nodeData);
      }
    }
  }

}());