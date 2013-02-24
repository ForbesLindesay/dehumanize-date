var MONTH_NAMES = ["january", "february", "march",
                   "april",   "may",      "june",
                   "july",    "august",   "september",
                   "october", "november", "december"];

var DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

exports = module.exports = function parse(str, usa) {
  var now = new Date();
  //strip time information
  now = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  str = str.trim().toLowerCase();

  return parseNearbyDays(str, now) ||
         parseLastThisNext(str, now) ||
         parseNumberDate(str, usa) ||
         parseWordyDate(str, now) ||
         parseIso8601Date(str);
};

var NUMBER              = /^[0-9]+$/;
var NUMBER_WITH_ORDINAL = /^([0-9]+)(st|nd|rd|th)?$/;
var NUMBER_DATE         = /^(3[0-1]|[1-2][0-9]|0?[1-9])[,\|\\\/\-\. ]+(1[0-2]|0?[1-9])[,\|\\\/\-\. ]+([0-9]{4})$/;
var NUMBER_DATE_USA     = /^(1[0-2]|0?[1-9])[,\|\\\/\-\. ]+(3[0-1]|[1-2][0-9]|0?[1-9])[,\|\\\/\-\. ]+([0-9]{4})$/;
var ISO_8601_DATE       = /^([0-9]{4})-?(1[0-2]|0?[1-9])-?(3[0-1]|[1-2][0-9]|0?[1-9])$/;

function addDays(date, numberOfDays) {
  return new Date(date * 1 + numberOfDays * 60 * 60 * 24 * 1000);
}


exports.parseNearbyDays = parseNearbyDays;
function parseNearbyDays(string, today) {
  if (string == 'today') {
    return today;
  } else if (string == 'yesterday') {
    return addDays(today, -1);
  } else if (string == 'tomorrow') {
    return addDays(today, +1);
  } else {
    return null;
  }
}

exports.parseLastThisNext = parseLastThisNext;
function parseLastThisNext(string, today) {
  var tokens = string.split(/[,\s]+/);

  if (['last', 'this', 'next'].indexOf(tokens[0]) >= 0 && 
      DAY_NAMES.indexOf(tokens[1]) >= 0 &&
      tokens.length === 2) {
    var dayDiff = DAY_NAMES.indexOf(tokens[1]) - today.getDay();
    if (dayDiff < 0) dayDiff += 7;

    if (tokens[0] === 'last') return addDays(today, dayDiff - 7);
    if (tokens[0] === 'this') return addDays(today, dayDiff);
    if (tokens[0] === 'next') return addDays(today, dayDiff + 7);
  } else {
    return null;
  }
}

exports.parseNumberDate = parseNumberDate;
function parseNumberDate(str, usa) {
  var match = usa ? NUMBER_DATE_USA.exec(str) : NUMBER_DATE.exec(str);
  if (match) {
    return usa ? new Date(+match[3], match[1] - 1, +match[2]) : new Date(+match[3], match[2] - 1, +match[1]);
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

  if (!(day && month !== null && year))
    return null;

  var result = new Date(year, month, day);

  // Date constructor will happily accept invalid dates
  // so we're checking that day existed in the given month
  if (result.getMonth() != month || result.getDate() != day)
    return null;

  return result;
}

function parseIso8601Date(string) {
  var match;
  if (match = ISO_8601_DATE.exec(string)) {
    return new Date(+match[1], match[2] - 1, +match[3]);
  }
}

var monthAbreviations = MONTH_NAMES.map(function (name) { return name.substr(0, 3); });
exports.monthFromName = monthFromName;
function monthFromName(month) {
  var monthIndex = month.length === 3 ? monthAbreviations.indexOf(month) : MONTH_NAMES.indexOf(month);
  return monthIndex >= 0 ? monthIndex : null;
}