/*
 * bleach
 * a minimal html sanitizer
 * cam@onswipe.com
 */

var bleach = {

  matcher: /<\/?([a-zA-Z0-9]+)*([^\/]*?)>/igm,

  whitelist: [
    'a',
    'p'
  ],

  sanitize: function(html, options){
    var mode = options.mode || 'white',
        list = options.list || this.whitelist;

    var matches = [],
        match;

    // extract all tags
    while ((match = this.matcher.exec(html)) != null) {
      var attrr = match[2].split(' '),
          attrs = [];

      // extract attributes from the tag
      attrr.shift();
      attrr.forEach(function(attr){
        attr = attr.split('=');
        attr = {
          name: attr[0],
          value: attr[1]
        };
        attrs.push(attr);
      });

      var tag = {
        full: match[0],
        name: match[1],
        attr: attrs
      };

      matches.push(tag);
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

    return html;
  }

};

module.exports = bleach;
