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
    var matches = [],
        match;

    // extract all tags
    while ((match = matcher.exec(res.html)) != null) {
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

    return matches;
  }

};

module.exports = bleach;
