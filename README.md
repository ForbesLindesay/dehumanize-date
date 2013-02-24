# dehumanize-date

Parse dates in all the formats humans like to use:

 - today/tomorrow/yesterday
 - next/this/last Wednesday
 - 12th January
 - 12th January 1950
 - 09-08-2008
 - 2008-08-09

## Installation

    $ npm install dehumanize-date

  or

    $ component install ForbesLindesay/dehumanize-date

## Usage

A simple function which takes a string as an argument and returns a plain JavaScript date object.

```javascript
var date = dehumanizeDate(userInput);
```