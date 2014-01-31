uwords
======

Get words from text by grouping together characters from Unicode letter groups
(Lu, Ll, Lt, Lm, Lo).

Installation
------------

    npm isntall uwords

Example
-------

    var uwords = require('uwords');

    var words = uwords('Привет - Hi');

    // words now is [ 'Привет', 'Hi' ]

Details
-------

Returns words from given text by going through the text and grouping together
characters that belongs to one the Unicode Letter groups: Lu, Ll, Lt, Lm, Lo.
