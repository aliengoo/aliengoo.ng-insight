(function () {
  'use strict';

  angular.module('aliengoo.ng-insight').directive('ngScopeInsight', ngScopeInsight);

  function ngScopeInsight() {
    var exports = {
      restrict: 'A',
      link: link
    };

    return exports;

    function link(scope, element) {

      if (!element.length) {
        return;
      }

      if (angular.isUndefined($)) {
        console.error('aliengoo.ng-insight requires jQuery!');
        return;
      }

      var body = $('body');

      function processElement(element) {
        let ngElement = angular.element(element);
        var scope = ngElement.scope();

        if (scope) {
          let name = ngElement.attr('name');
          $(`span.ng-scope-insight[name="${name}"]`).remove();
          let id = scope.$id;
          let offset = ngElement.offset();
          let left = offset.left;
          let top = offset.top - $(document).scrollTop();

          var html = `<span class="ng-scope-insight" name='${name}' style='position:absolute;left:${left}px;top:${top}px'>${id}</span>`;

          body.append(angular.element(html));
        }
      }

      var observer = new MutationObserver(function (mutationRecords) {
        angular.forEach(mutationRecords, (mutationRecord) => {
          processElement(mutationRecord.target);
        });
      });

      var config = {childList: true};


      scope.$evalAsync(() => {
        let ngModelElements = $(element).find('[ng-model]');

        $(window).resize(function(){
          angular.forEach(ngModelElements, processElement);
        });

        angular.forEach(ngModelElements, (ngModelElement) => {
          observer.observe(ngModelElement, config);
        });
      });
    }
  }
}());