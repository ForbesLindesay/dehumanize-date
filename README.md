# dehumanize-date

Parse dates in all the formats humans like to use:

 - today/tomorrow/yesterday
 - next/this/last Wednesday
 - 12th January
 - 12th January 1950
 - 09-08-2008
 - 2008-08-09

[![Build Status](https://travis-ci.org/ForbesLindesay/dehumanize-date.png?branch=master)](https://travis-ci.org/ForbesLindesay/dehumanize-date)
[![Dependency Status](https://gemnasium.com/ForbesLindesay/dehumanize-date.png)](https://gemnasium.com/ForbesLindesay/dehumanize-date)
[![NPM version](https://badge.fury.io/js/dehumanize-date.png)](http://badge.fury.io/js/dehumanize-date)

## Installation

    $ npm install dehumanize-date

## Usage

A simple function which takes a string as an argument and returns a plain JavaScript date object.

```javascript
var date = dehumanizeDate(userInput);
```

Note that the "time" portion of the date will be 00:00:00.000 in UTC.

If you want to use US formats for numerical dates you should pass `true` as the second parameter:

```javascript
var date = dehumanizeDate(userInput, true);
```

## License

MIT