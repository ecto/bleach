var vows = require('vows'),
    assert = require('assert'),
    bleach = require('../lib/bleach');

var HTML1 = 'This is <a href="#html">HTML</a> with a <script>\nvar x = 1;</script>SCRIPT',
    HTML2 = 'This is &lt;a href=&quot;#html&quot;&gt;HTML&lt;/a&gt; with a SCRIPT',
    HTML3 = 'This is HTML with a SCRIPT';

vows.describe('encode tests').addBatch({

  'whitelist mode': {
    topic: function (){ return HTML1; },

    'eliminates script tags but encodes listed tags': function (HTML1){
      var HTML = bleach.sanitize(HTML1, {mode: 'white', list:['a'], encode_entities: true});
      assert.equal(HTML, HTML2);
    },

    'eliminates all tags when given an empty list': function (HTML1){
      var HTML = bleach.sanitize(HTML1, {mode: 'white', list:[], encode_entities: true});
      assert.equal(HTML, HTML3);
    }
  },

  'blacklist mode': {
    topic: function (){ return HTML1; },

    'eliminates listed tags but encodes other tags': function (HTML1){
      var HTML = bleach.sanitize(HTML1, {mode: 'black', list:['script'], encode_entities: true});
      assert.equal(HTML, HTML2);
    }
  }

}).export(module);
