module.exports = function(html) {
  html = String(html) || '';

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

