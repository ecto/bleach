var vows   = require('vows'),
    assert = require('assert');
    bleach = require('../lib/bleach');

vows.describe('bleach').addBatch({

  'bleach.analyze(html)': {
    topic: function(){ return bleach.analyze; },
    'is a function': function(analyze) {
      assert.equal(typeof analyze, 'function');
    },
    'returns blank array on invalid or missing input': function(analyze) {
      assert.deepEqual(analyze({}), []);
      assert.deepEqual(analyze([]), []);
      assert.deepEqual(analyze(''), []);
    },
    'finds self-closing tags': function(analyze){
      assert.ok(analyze('<input type="text" />').length > 0);
    },
    'returns an array': function(analyze) {
      assert.isArray(analyze(' '));
    },
    'extracts attributes': function(analyze){
      assert.equal(analyze('<input type="text"></input>')[0].attr[0], { name: 'type', value: '"text"' }.toString());
    }
  },

  'bleach.sanitize(html, options)': {
    topic: function(){ return bleach.sanitize; },
    'is a function': function(sanitize) {
      assert.equal(typeof sanitize, 'function');
    },
    'does not require options to be passed in': function(sanitize){
      assert.doesNotThrow(function(){
        sanitize(' ');
      }, Error);
    },
    'returns a string': function(sanitize) {
      assert.isString(sanitize(' '));
    },
    'returns blank string on invalid or missing input': function(analyze) {
      assert.isString(analyze({}));
      assert.isString(analyze([]));
      assert.isString(analyze(''));
    },
    'whitelist is respected': function(sanitize){
      var whitelist = ['br'],
          input     = '<html><body><p>hello<br />world!</p></body></html><script type="text/javascript" />',
          output    = 'hello<br />world!',
          outcome   = sanitize(input, { list: whitelist });

      assert.equal(output, outcome);
    },
    'blacklist is respected': function(sanitize){
      var blacklist = ['html', 'body'],
          input     = '<html><body><p>hello<br />world!</p></body></html>',
          output    = '<p>hello<br />world!</p>',
          options   = {
            mode: 'black',
            list: blacklist
          },
          outcome = sanitize(input, options);

      assert.equal(output, outcome);
    },

  },

  'bleach.filter(html)': {
    topic: function(){ return bleach.filter; },
    'is a function': function(filter) {
      assert.equal(typeof filter, 'function');
    },
    'allows array or string to be passed in': function(filter){
      assert.doesNotThrow(function(){
        filter([]);
        filter('');
      }, Error);
    },
    'returns a string': function(filter) {
      assert.isString(filter(' ', 'youtube'));
    },
    'allow function to be passed in': function(filter){
      var nyanFilter = function(html){
        return 'nyan';
      }
      assert.equal(filter('nyannyannyan', nyanFilter), 'nyan');
    },
    'allow array of functions to be passed in': function(filter){
      var filters = [
        function(html){
          return 'nyan';
        },
        function(html){
          return html + html;
        }
      ];
      assert.equal(filter('nyannyannyan', filters), 'nyannyan');
    },
  },

  'included youtube filter': {
    topic: function(){ return bleach.filter; },
    'converts a youtube flash object to an iframe': function(filter){
      var input = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="420" height="315" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0"><param name="allowFullScreen" value="true"><param name="allowscriptaccess" value="always"><param name="src" value="http://www.youtube.com/v/aU079Mdkenw?version=3&amp;hl=en_US"><param name="allowfullscreen" value="true"><embed type="application/x-shockwave-flash" width="420" height="315" src="http://www.youtube.com/v/aU079Mdkenw?version=3&amp;hl=en_US" allowscriptaccess="always" allowfullscreen="true" id="s_media_1_0" name="s_media_1_0"></object>',
          output = '<iframe type="text/html" frameborder="0" scrolling="no" allowfullscreen src="http://youtube.com/embed/aU079Mdkenw"></iframe>';

      assert.equal(filter(input, 'youtube'), output);
    },
    'ignores non-youtube flash objects': function(filter){
      var input = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="420" height="315" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0"><param name="allowFullScreen" value="true"><param name="allowscriptaccess" value="always"><param name="src" value="http://www.youtube.com/v/aU079Mdkenw?version=3&amp;hl=en_US"><param name="allowfullscreen" value="true"><embed type="application/x-shockwave-flash" width="420" height="315" src="http://google.com/asdf" allowscriptaccess="always" allowfullscreen="true" id="s_media_1_0" name="s_media_1_0"></object>';

      assert.equal(filter(input, 'youtube'), input);
    },
  }

}).export(module);
