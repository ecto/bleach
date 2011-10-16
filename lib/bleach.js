/*
 * bleach
 * a minimal html sanitizer
 * cam@onswipe.com
 */

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
        attr = {
          name: attr[0],
          value: attr[1]
        };
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

  youtube: function(html) {
    if (!html) throw Error('You must pass in HTML as an argument.');
    if (typeof html != 'string') throw Error('HTML must be a string.');

    var match,
        matches = [],
        regex   = /<object(.*)src="(http:\/\/www.youtube.com)?\/(v\/([-|~_0-9A-Za-z]+)|watch\?v\=([-|~_0-9A-Za-z]+)&?.*?).*<\/object>/gi;

    while (match = regex.exec(html)) {
      matches.push(match);
    } delete match;

    matches.forEach(function(match){
      var full = match[0],
          id   = match[4];

      var rep = '<iframe type="text/html" '
              + 'frameborder="0" '
              + 'scrolling="no" '
              + 'allowfullscreen '
              + 'src="http://youtube.com/embed/' + id + '"></iframe>';

      html = html.replace(full, rep);
    });

    return html;
  }

};

module.exports = bleach;
