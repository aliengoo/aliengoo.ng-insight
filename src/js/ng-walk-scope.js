(function () {
  'use strict';

  angular.module('aliengoo.ng-insight').directive('ngWalkScope', ngWalkScope);

  function ngWalkScope() {
    var exports = {
      restrict: 'A',
      link: link,
      scope : false
    };

    return exports;

    function link(scope, element, attribute) {

      let upChain = [];
      let downChain = [];

      function walkUp(s, chain) {
        if (s.$parent){
          walkUp(s.$parent, chain);
        }

        chain.push(s.$id);
      }

      function walkDown(s, chain){
        if(s.$$ChildScope){
          walkDown(s, chain);
        }

        chain.push(s.$id);
      }

      walkUp(scope, upChain);
      walkDown(scope, downChain);

      let set = new Set(upChain.concat(...downChain));

      let temp = '';

      set.forEach((x) => {
        if (x) {
          let scopeCss = 'scope';
          if (scope.$id === x){
            scopeCss = 'current-scope';
          }
          temp += `<span class='indicator ${scopeCss}'>&lt;$${x}</span>`;
        }
      });

      let html = `<div class='ng-walk-scope'>${temp}</div>`;

      element.after(html);
    }
  }
}());