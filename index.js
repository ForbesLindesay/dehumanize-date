'use strict';

var isLeapYear = require('is-leap-year');

var MONTH_NAMES = ["january", "february", "march",
                   "april",   "may",      "june",
                   "july",    "august",   "september",
                   "october", "november", "december"];

var DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

var DAYS_IN_MONTH = [
  31,
  null, // 29 in leap years, otherwise 28
  31,
  30,
  31,
  30,
  31,
  31,
  30,
  31,
  30,
  31
];

exports = module.exports = function parse(str, options) {
  if (typeof options !== 'object') {
    options = {usa: options};
  }
  options = options || {};
  options.usa = options.usa !== undefined ? options.usa : false;
  options.now = options.now !== undefined  ? options.now : new Date();
  options.cutoff = options.cutoff !== undefined ? options.cutoff : 80;

  str = str.trim().toLowerCase();

  return parseNearbyDays(str, options.now) ||
         parseLastThisNext(str, options.now) ||
         parseAgoFrom(str, options.now) ||
         parseNumberDate(str, options.usa) ||
         parseNumberDateShortYear(str, options.usa, options.cutoff) ||
         parseNumberDateNoYear(str, options.usa, options.now) ||
         parseWordyDate(str, options.now, options.cutoff) ||
         parseIso8601Date(str);
};
exports.default = module.exports;

var NUMBER              = /^[0-9]+$/;
var NUMBER_WITH_ORDINAL = /^([0-9]+)(st|nd|rd|th)?$/;
var NUMBER_DATE         = /^(3[0-1]|[1-2][0-9]|0?[1-9])[,\|\\\/\-\. ]+(1[0-2]|0?[1-9])[,\|\\\/\-\. ]+([0-9]{4})$/;
var NUMBER_DATE_USA     = /^(1[0-2]|0?[1-9])[,\|\\\/\-\. ]+(3[0-1]|[1-2][0-9]|0?[1-9])[,\|\\\/\-\. ]+([0-9]{4})$/;
var NUMBER_DATE_SHORT_YEAR         = /^(3[0-1]|[1-2][0-9]|0?[1-9])[,\|\\\/\-\. ]+(1[0-2]|0?[1-9])[,\|\\\/\-\. ]+([0-9]{2})$/;
var NUMBER_DATE_SHORT_YEAR_USA     = /^(1[0-2]|0?[1-9])[,\|\\\/\-\. ]+(3[0-1]|[1-2][0-9]|0?[1-9])[,\|\\\/\-\. ]+([0-9]{2})$/;
var NUMBER_DATE_NO_YEAR   = /^(3[0-1]|[1-2][0-9]|0?[1-9])[,\|\\\/\-\. ]+(1[0-2]|0?[1-9])$/;
var NUMBER_DATE_NO_YEAR_USA     = /^(1[0-2]|0?[1-9])[,\|\\\/\-\. ]+(3[0-1]|[1-2][0-9]|0?[1-9])$/;


var ISO_8601_DATE       = /^([0-9]{4})[-/\\]?(1[0-2]|0?[1-9])[-/\\]?(3[0-1]|[1-2][0-9]|0?[1-9])$/;

function addDays(now, numberOfDays) {
  var result = new Date(now * 1 + numberOfDays * 60 * 60 * 24 * 1000);
  return date(result.getFullYear(), result.getMonth(), result.getDate());
}

exports.parseNearbyDays = parseNearbyDays;
function parseNearbyDays(string, now) {
  if (string == 'today') {
    return date(now.getFullYear(), now.getMonth(), now.getDate());;
  } else if (string == 'yesterday') {
    return addDays(now, -1);
  } else if (string == 'tomorrow') {
    return addDays(now, +1);
  } else {
    return null;
  }
}

exports.parseLastThisNext = parseLastThisNext;
function parseLastThisNext(string, now) {
  var tokens = string.split(/[,\s]+/);
  if (['last', 'this', 'next'].indexOf(tokens[0]) >= 0 &&
      tokens.length === 2 ) {
    var dayAbbreviations = DAY_NAMES.map(function (name) { return name.substr(0, tokens[1].length); });
    var dayIndex = dayAbbreviations.indexOf(tokens[1]);
    if (dayIndex !== -1 &&
        dayAbbreviations.indexOf(tokens[1], dayIndex + 1) === -1) {
      var dayDiff = dayIndex - now.getDay();
      if (dayDiff < 0) dayDiff += 7;
      if (tokens[0] === 'last') return addDays(now, dayDiff - 7);
      if (tokens[0] === 'this') return addDays(now, dayDiff);
      if (tokens[0] === 'next') return addDays(now, dayDiff + 7);
    }
    return null;
  } else {
    return null;
  }
}

exports.parseAgoFrom = parseAgoFrom;
function parseAgoFrom(string, now) {
  var tokens = string.split(/[,\s]+/);
  if (['day', 'days', 'week', 'weeks'].indexOf(tokens[1]) >= 0 &&
      tokens[0].match(NUMBER) &&
      ['ago', 'from'].indexOf(tokens[2]) >= 0
    ) {
      if (tokens[2] === 'ago') {
        if (['day', 'days'].indexOf(tokens[1]) >= 0) return addDays(now, tokens[0] * -1);
        if (['week', 'weeks'].indexOf(tokens[1]) >= 0) return addDays(now, (tokens[0] * 7) * -1);
      }
      if (tokens[2] === 'from') {
        if (['day', 'days'].indexOf(tokens[1]) >= 0) return addDays(now, tokens[0]);
        if (['week', 'weeks'].indexOf(tokens[1]) >= 0) return addDays(now, (tokens[0] * 7));
      }
      return null;
    } else {
    return null;
  }
}

exports.parseNumberDate = parseNumberDate;
function parseNumberDate(str, usa) {
  var match = usa ? NUMBER_DATE_USA.exec(str) : NUMBER_DATE.exec(str);
  if (match) {
    return usa ? date(+match[3], match[1] - 1, +match[2]) : date(+match[3], match[2] - 1, +match[1]);
  } else {
    return null;
  }
}

exports.parseNumberDateShortYear = parseNumberDateShortYear;
function parseNumberDateShortYear(str, usa, cutoff) {
  var match = usa ? NUMBER_DATE_SHORT_YEAR_USA.exec(str) : NUMBER_DATE_SHORT_YEAR.exec(str);
  if (match) {
    var year = (+match[3]);
    if (year > cutoff) year += 1900;
    else year += 2000;
    return usa ? date(year, match[1] - 1, +match[2]) : date(year, match[2] - 1, +match[1]);
  } else {
    return null;
  }
}

exports.parseNumberDateNoYear = parseNumberDateNoYear;
function parseNumberDateNoYear(str, usa, today) {
  var match = usa ? NUMBER_DATE_NO_YEAR_USA.exec(str) : NUMBER_DATE_NO_YEAR.exec(str);
  if (match) {
    var year = today.getFullYear();
    return usa ? date(year, match[1] - 1, +match[2]) : date(year, match[2] - 1, +match[1]);
  } else {
    return null;
  }
}

exports.parseWordyDate = parseWordyDate;
function parseWordyDate(string, today, cutoff) {
  var tokens = string.split(/[,\s]+/);
  if (tokens.length >= 2) {
    var match;
    if (match = tokens[0].match(NUMBER_WITH_ORDINAL)) {
      return parseWordyDateParts(match[1], tokens[1], tokens[2], today, cutoff);
    } else if (match = tokens[1].match(NUMBER_WITH_ORDINAL)) {
      return parseWordyDateParts(match[1], tokens[0], tokens[2], today, cutoff);
    } else {
      return null;
    }
  }
}

function parseWordyDateParts(rawDay, rawMonth, rawYear, today, cutoff) {
  var day = +rawDay;
  var month = monthFromName(rawMonth);
  var year;

  if (rawYear)
    year = rawYear.match(NUMBER) ? rawYear * 1 : null;
  else
    year = today.getFullYear();

  if (year < 100 && year >= cutoff) year += 1900;
  if (year < 100) year += 2000;

  if (!(day && month !== null && year))
    return null;

  return date(year, month, day);
}

function parseIso8601Date(string) {
  var match;
  if (match = ISO_8601_DATE.exec(string)) {
    return date(+match[1], match[2] - 1, +match[3]);
  } else {
    return null;
  }
}

exports.monthFromName = monthFromName;
function monthFromName(month) {
  var monthAbbreviations = MONTH_NAMES.map(function (name) { return name.substr(0, month.length); });
  var monthIndex = monthAbbreviations.indexOf(month);
  if (monthIndex !== -1 &&
      monthAbbreviations.indexOf(month, monthIndex + 1) === -1) {
    return monthIndex;
  }
  return null;
}

exports.date = date;
function date(year, month, day) {
  month++;
  if (month > 12 || month < 1) return null;
  if (day < 1) return null;
  if (month === 2) {
    if (day > (isLeapYear(year) ? 29 : 28)) return null;
  } else if (day > DAYS_IN_MONTH[month - 1]) {
    return null;
  }
  if (month < 10) month = '0' + month;
  if (day < 10) day = '0' + day;

  return year + '-' + month + '-' + day;
}
function getISOString(year, month, day) {
  month++;
  if (month < 10) month = '0' + month;
  if (day < 10) day = '0' + day;
  return year + '-' + month + '-' + day + 'T00:00:00.000Z';
}
