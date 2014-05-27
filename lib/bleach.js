/*
 * bleach
 * a minimal html sanitizer
 * cam@onswipe.com
 */

var fs = require('fs'),
    he = require('he');

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
        var attr_name = attr[0],
            attr_val = attr.length > 1 ? attr.slice(1).join('=') : null;
        // remove quotes from attributes
        if (attr_val && attr_val.charAt(0).match(/'|"/)) attr_val = attr_val.slice(1);
        if (attr_val && attr_val.charAt(attr_val.length-1).match(/'|"/)) attr_val = attr_val.slice(0, -1);
        attr = {
          name: attr_name,
          value: attr_val
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

    if ((mode == 'white' && list.indexOf('script') == -1)
     || (mode == 'black' && list.indexOf('script') != -1)) {
      html = html.replace(/<script(.*?)>(.*?[\r\n])*?(.*?)(.*?[\r\n])*?<\/script>/gim, '');
    }


    if ((mode == 'white' && list.indexOf('style') == -1)
     || (mode == 'black' && list.indexOf('style') != -1)) {
      html = html.replace(/<style(.*?)>(.*?[\r\n])*?(.*?)(.*?[\r\n])*?<\/style>/gim, '');
    }

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

    if ( options.encode_entities ) html = he.encode( html );

    return html;
  },

  filterSync: function(html, filters) {
    html = String(html) || '';

    if (!filters) return;

    var available = fs.readdirSync(__dirname + '/../filters');

    if (Array.isArray(filters)) {
      for (var i in filters) {
        if (typeof filters[i] == 'function') {
          html = filters[i](html);
        } else {
          var file = filters[i] + '.js';
          for (var j in available) {
            if (file == available[j]) {
              html = require('../filters/' + file)(html);
            }
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
      } else if (typeof filters == 'function') {
        html = filters(html);
        return html;
      } else return html;
  },

  filter: function(html, filters, callback) {
    if (typeof(callback) != 'function') {
      return bleach.filterSync(html, filters);
    }

    html = String(html) || '';

    if (!filters) callback('no filters provided', undefined);

    var available = fs.readdir(__dirname + '/../filters', function() {
      if (Array.isArray(filters)) {
        for (var i in filters) {
          if (typeof filters[i] == 'function') {
            html = filters[i](html);
          } else {
            var file = filters[i] + '.js';
            for (var j in available) {
              if (file == available[j]) {
                html = require('../filters/' + file)(html);
              }
            }
          }
        }
        return html;
      } else if (typeof filters == 'string') {
        var file = filters + '.js';
        for (var i in available) {
          if (file == available[i]) {
            html = require('../filters/' + file)(html);
            callback(undefined, html);
          }
        }
        } else if (typeof filters == 'function') {
          html = filters(undefined, html);
          callback(undefined, html);
        } else callback(undefined, html);
    });
  }

};

module.exports = bleach;
