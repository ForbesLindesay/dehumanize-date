'use strict';

var MONTH_NAMES = ["january", "february", "march",
                   "april",   "may",      "june",
                   "july",    "august",   "september",
                   "october", "november", "december"];

var DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

exports = module.exports = function parse(str, usa) {
  var now = new Date();

  str = str.trim().toLowerCase();

  return parseNearbyDays(str, now) ||
         parseLastThisNext(str, now) ||
         parseNumberDate(str, usa) ||
         parseNumberDateShortYear(str, usa, 80) ||
         parseWordyDate(str, now) ||
         parseIso8601Date(str);
};

var NUMBER              = /^[0-9]+$/;
var NUMBER_WITH_ORDINAL = /^([0-9]+)(st|nd|rd|th)?$/;
var NUMBER_DATE         = /^(3[0-1]|[1-2][0-9]|0?[1-9])[,\|\\\/\-\. ]+(1[0-2]|0?[1-9])[,\|\\\/\-\. ]+([0-9]{4})$/;
var NUMBER_DATE_USA     = /^(1[0-2]|0?[1-9])[,\|\\\/\-\. ]+(3[0-1]|[1-2][0-9]|0?[1-9])[,\|\\\/\-\. ]+([0-9]{4})$/;
var NUMBER_DATE_SHORT_YEAR         = /^(3[0-1]|[1-2][0-9]|0?[1-9])[,\|\\\/\-\. ]+(1[0-2]|0?[1-9])[,\|\\\/\-\. ]+([0-9]{2})$/;
var NUMBER_DATE_SHORT_YEAR_USA     = /^(1[0-2]|0?[1-9])[,\|\\\/\-\. ]+(3[0-1]|[1-2][0-9]|0?[1-9])[,\|\\\/\-\. ]+([0-9]{2})$/;
var ISO_8601_DATE       = /^([0-9]{4})-?(1[0-2]|0?[1-9])-?(3[0-1]|[1-2][0-9]|0?[1-9])$/;

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
      DAY_NAMES.indexOf(tokens[1]) >= 0 &&
      tokens.length === 2) {
    var dayDiff = DAY_NAMES.indexOf(tokens[1]) - now.getDay();
    if (dayDiff < 0) dayDiff += 7;

    if (tokens[0] === 'last') return addDays(now, dayDiff - 7);
    if (tokens[0] === 'this') return addDays(now, dayDiff);
    if (tokens[0] === 'next') return addDays(now, dayDiff + 7);
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

exports.parseWordyDate = parseWordyDate;
function parseWordyDate(string, today) {
  var tokens = string.split(/[,\s]+/);
  if (tokens.length >= 2) {
    var match;
    if (match = tokens[0].match(NUMBER_WITH_ORDINAL)) {
      return parseWordyDateParts(match[1], tokens[1], tokens[2], today);
    } else if (match = tokens[1].match(NUMBER_WITH_ORDINAL)) {
      return parseWordyDateParts(match[1], tokens[0], tokens[2], today);
    } else {
      return null;
    }
  }
}

function parseWordyDateParts(rawDay, rawMonth, rawYear, today) {
  var day = +rawDay;
  var month = monthFromName(rawMonth);
  var year;

  if (rawYear)
    year = rawYear.match(NUMBER) ? rawYear * 1 : null;
  else
    year = today.getFullYear();

  if (year < 100 && year >= 80) year += 1900;
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

var monthAbreviations = MONTH_NAMES.map(function (name) { return name.substr(0, 3); });
exports.monthFromName = monthFromName;
function monthFromName(month) {
  var monthIndex = month.length === 3 ? monthAbreviations.indexOf(month) : MONTH_NAMES.indexOf(month);
  return monthIndex >= 0 ? monthIndex : null;
}

exports.date = date;
function date(year, month, day) {
  month++;
  if (month > 12 || month < 0) return null;
  if (day > 31 || day < 1) return null;
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
