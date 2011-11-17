# bleach

Sanitize your HTML the easy way!

![bleach](http://i.imgur.com/9qSfd.png)

## install

    npm install bleach

## test

    vows --spec test/*

## example

Basic:

````javascript

var bleach = require('bleach');

var html = bleach.sanitize(aBunchOfHTML);

console.log(html);
````

Advanced:

````javascript

var bleach = require('bleach');

var whitelist = [
  'a',
  'b',
  'i',
  'em',
  'strong'
]

var options = {
  mode: 'white',
  list: whitelist
}

var html = bleach.sanitize(aBunchOfHTML, options);

console.log(html);
````

## usage

### bleach.sanitize(html, options)

Runs HTML through sanitizer and returns sanitized HTML as string.

`options` may contain the following optional attributes:

*   `mode` may be set to `'white'` or `'black'`
*   `list` is an array containing tags to match against

`white`mode will remove all tags from `html`, excluding those in `list`

`black`mode will remove all tags found in `list` that are found in `html`

### bleach.analyze(html)

Will extract all tags from HTML and return an array of JSON objects. Example return:

````javascript
[
  {
    full: '<div id="post-119477">',
    name: 'div',
    attr: [
      "id": "post-119477"
    ]
  },
  ...
]
````

### bleach.filter(html, filters)

SEXY FUN TIME

````javascript

var nyanFilter = function(input){
  return input.replace('cats', 'nyannyannyan');
}

console.log(
  bleach.filter('cats', nyanFilter)
);

// nyannyannyan

````

````javascript

var cutFilter = function(input){
  return input.slice(0, 3);
}

console.log(
  bleach.filter('cats', [
    nyanFilter,
    cutFilter
  ])
);

// nyan

````

You may also define longer filters and include them in the ./node_modules/bleach/filters directory.
A sample filter is included to convert YouTube flash embed objects to iDevice-compatible YouTube iframes.

````javascript

var html = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="420" height="315" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0"><param name="allowFullScreen" value="true"><param name="allowscriptaccess" value="always"><param name="src" value="http://www.youtube.com/v/aU079Mdkenw?version=3&amp;hl=en_US"><param name="allowfullscreen" value="true"><embed type="application/x-shockwave-flash" width="420" height="315" src="http://www.youtube.com/v/aU079Mdkenw?version=3&amp;hl=en_US" allowscriptaccess="always" allowfullscreen="true" id="s_media_1_0" name="s_media_1_0"></object>';

console.log(
  bleach.filter(html, 'youtube')
);

// <iframe type="text/html" frameborder="0" scrolling="no" allowfullscreen src="http://youtube.com/embed/aU079Mdkenw"></iframe>

````

Refer to the filters directory for the template.

## disclaimer

This is not a port of the Python **bleach** library - in fact their implementations are very different.

## license

(The MIT License)

Copyright (c) 2011 Cam Pedersen <cam@onswipe.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
