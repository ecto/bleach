var vows   = require('vows'),
    assert = require('assert');
    bleach = require('../lib/bleach');

vows.describe('bleach').addBatch({
  'bleach.analyze()': {
    topic: function(){ return bleach.analyze; },
    'is a function': function(analyze) {
      assert.equal(typeof analyze, 'function');
    },
    'returns an array': function(analyze) {
      assert.isArray(analyze(' '));
    },
    'requires input': function(analyze) {
      assert.throws(function(){
        analyze();
      }, Error);
    },
    'only accepts strings': function(analyze) {
      assert.throws(function(){
        analyze(Object);
      }, Error);
    },
    'finds self-closing tags': function(analyze){
      assert.ok(analyze('<input type="text" />').length > 0);
    },
    'extracts attributes': function(analyze){
      assert.equal(analyze('<input type="text"></input>')[0].attr[0], { name: 'type', value: '"text"' }.toString());
    }
  },
  'bleach.sanitize()': {
    topic: function(){ return bleach.sanitize; },
    'is a function': function(sanitize) {
      assert.equal(typeof sanitize, 'function');
    },
    'does not require options': function(sanitize){
      assert.doesNotThrow(function(){
        sanitize('');
      });
    },
    'returns a string': function(sanitize) {
      assert.isArray(sanitize(' '));
    },
  }
}).export(module);
