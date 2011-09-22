# bleach

Sanitize your HTML the easy way!

![bleach](http://i.imgur.com/9qSfd.png)

## install

    npm install bleach

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

var html = bleach.sanitize(aBunchOfHTML);

console.log(html);
````

## usage

### bleach.sanitize(html, options)

Options may contain the following optional attributes:

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
