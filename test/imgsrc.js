var vows = require('vows'),
    assert = require('assert'),
    bleach = require('../lib/bleach');

var HTML = '<p>This is an <img src="http://site.com?setting=value&othersetting=othervalue" title="Image" /></p>';

vows.describe('img src tests').addBatch({

  'analyze': {
    topic: function () { return HTML; },

    'gets the correct img src': function ( html ) {
      var tags = bleach.analyze( html );
      assert.equal( tags[1].attr[0].value, 'http://site.com?setting=value&othersetting=othervalue' );
    }
  }

}).export(module);
