'use strict';

describe('nutrionixApp.version module', function() {
  beforeEach(module('nutrionixApp.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
