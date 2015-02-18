(function () {
  "use strict";

  angular.module('aliengoo.ng-insight').factory('helperService', helperService);

  function helperService() {
    var exports = {
      walkModelNodes : walkModelNodes,
      containsNodeType : containsNodeType
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

      for(let i = 0; i < mutationRecords.length; i++){
        var mutationRecord = mutationRecords[i];

        let allNodes = [];

        if (mutationRecord.removedNodes && mutationRecord.removedNodes.length){
          for(let i = 0; i < mutationRecord.removedNodes.length; i++){
            allNodes.push(mutationRecord.removedNodes[i])
          }
        }

        if (mutationRecord.addedNodes && mutationRecord.addedNodes.length){
          for(let i = 0; i < mutationRecord.addedNodes.length; i++){
            allNodes.push(mutationRecord.addedNodes[i])
          }
        }

        for(let j = 0; j < allNodes.length; j++){
          let childNode = allNodes[i];

          if(childNode && walk(childNode)){
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
        var ngEl = angular.element(treeWalker.currentNode);
        var ngModel = ngEl.controller('ngModel');

        if (!ngModel) {
          return {
            error : 'No ng-model available'
          };
        }

        var elementName = ngEl.attr("name");
        var childScope = ngEl.scope();

        onNode({
          ngElement : ngEl,
          ngElementName : elementName,
          ngModelBinding : ngEl.attr('ng-model'),
          ngModel : ngModel,
          scope : childScope
        });
      }
    }
  }

}());