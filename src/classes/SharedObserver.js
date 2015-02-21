(function () {
  'use strict';

  class SharedObserver {

    constructor(rootNode) {
      this._rootNode = rootNode;
      this._mutationListeners = new Map();

      this._mutationCallback = (mutationRecords) => {

        this._mutationListeners.forEach((listener, key) => {
          listener(mutationRecords);
        });
      };

      this._mutationObserver = new MutationObserver(rootNode, this._mutationCallback);
    }

    addListener(key, listener) {
      if (this._mutationListeners.has(key)){
        throw "Cannot added listener ${key}, because it already exists";
      }

      this._mutationListeners.set(key, listener);
    }

    removeListener(key) {
      if (this._mutationListeners.has(key)){
        this._mutationListeners.delete(key);
      }

    }
  }

}());
