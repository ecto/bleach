var vows = require('vows'),
    assert = require('assert'),
    bleach = require('../lib/bleach');

var HTML1 = 'This is <a href="#html">HTML</a> with a <script>\nvar x = 1;</script>SCRIPT',
    HTML2 = 'This is <a href="#html">HTML</a> with a SCRIPT',
    HTML3 = 'This is HTML with a SCRIPT';

vows.describe('script tests').addBatch({

  'whitelist mode': {
    topic: function (){ return HTML1; },

    'eliminates script tags but keeps listed tags': function (HTML1){
      var HTML = bleach.sanitize(HTML1, {mode: 'white', list:['a']});
      assert.equal(HTML, HTML2);
    },

    'eliminates all tags when given an empty list': function (HTML1){
      var HTML = bleach.sanitize(HTML1, {mode: 'white', list:[]});
      assert.equal(HTML, HTML3);
    }
  }

}).export(module);
