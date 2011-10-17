/*
 * bleach
 * a minimal html sanitizer
 * cam@onswipe.com
 */

var fs = require('fs');

var bleach = {

  matcher: /<\/?([a-zA-Z0-9]+)*(.*?)\/?>/igm,

  whitelist: [
    'a',
    'b',
    'p',
    'em',
    'strong'
  ],

  analyze: function(html) {
    html = String(html) || '';

    var matches = [],
        match;

    // extract all tags
    while ((match = bleach.matcher.exec(html)) != null) {
      var attrr = match[2].split(' '),
          attrs = [];

      // extract attributes from the tag
      attrr.shift();
      attrr.forEach(function(attr){
        attr = attr.split('=');
        // remove quotes from attributes
        if (attr[1] && attr[1].charAt(0).match(/'|"/)) attr[1] = attr[1].slice(1);
        if (attr[1] && attr[1].charAt(attr[1].length-1).match(/'|"/)) attr[1] = attr[1].slice(0, -1);
        attr = {
          name: attr[0],
          value: attr[1]
        };
        if (!attr.value) delete attr.value;
        if (attr.name) attrs.push(attr);
      });

      var tag = {
        full: match[0],
        name: match[1],
        attr: attrs
      };

      matches.push(tag);
    }
    
    return matches;
  },

  sanitize: function(html, options) {
    html = String(html) || '';
    options = options || {};

    var mode = options.mode || 'white',
        list = options.list || bleach.whitelist;

    var matches = bleach.analyze(html);

    matches.forEach(function(tag){
      if (mode == 'white') {
        if (list.indexOf(tag.name) == -1) {
          html = html.replace(tag.full, '');
        }
      } else if (mode == 'black') {
        if (list.indexOf(tag.name) != -1) {
          html = html.replace(tag.full, '');
        }
      } else {
        throw new Error('Unknown sanitization mode "' + mode + '"');
      }
    });

    return html;
  },

  filter: function(html, filters) {
    html = String(html) || '';

    if (!filters) return;

    var available = fs.readdirSync(__dirname + '/../filters');

    if (Array.isArray(filters)) {
      for (var i in filters) {
        var file = filters[i] + '.js';
        for (var j in available) {
          if (file == available[j]) {
            html = require('../filters/' + file)(html);
          }
        }
      }
      return html;
    } else if (typeof filters == 'string') {
      var file = filters + '.js';
      for (var i in available) {
        if (file == available[i]) {
          html = require('../filters/' + file)(html);
          return html;
        }
      }
    } else return html;

  }

};

module.exports = bleach;
