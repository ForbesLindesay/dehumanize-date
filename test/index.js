'use strict';

var test = require('tape');
var dehumanize = require('../');

function describe(name, parseDate, fn) {
  test(name, function (t) {
    var queue = [];
    fn(function (input, expected) {
      var initialExpected = expected;
      var actual = parseDate(input);
      t.equal(actual, expected, input + ' -> ' + initialExpected);
    });
    t.end();
  });
}

describe('parseNearbyDays', function (input) {
  return dehumanize.parseNearbyDays(input, new Date(2000, 0, 5));
}, function (equal) {
  equal('today', '2000-01-05');
  equal('yesterday', '2000-01-04');
  equal('tomorrow', '2000-01-06');
  equal('foo bar', null);
});

describe('parseLastThisNext', function (input) {
  return dehumanize.parseLastThisNext(input, new Date(2000, 0, 5));
}, function (equal) {
  equal('next monday', '2000-01-17');
  equal('last tuesday', '2000-01-04');
  equal('this thursday', '2000-01-06');
  equal('foo bar', null);
});

describe('parseNumberDate', function (input) {
  return dehumanize.parseNumberDate(input, false);
}, function (equal) {
  equal('2-2-2012', '2012-02-02');
  equal('2/8/2012', '2012-08-02');
  equal('2\\8\\2012', '2012-08-02');
  equal('2,4,2012', '2012-04-02');
  equal('2 4 2012', '2012-04-02');
  equal('02-02-2012', '2012-02-02');
  equal('80-80-2012', null);
});

describe('parseNumberDateShortYear', function (input) {
  return dehumanize.parseNumberDateShortYear(input, false, 80);
}, function (equal) {
  equal('2-2-12', '2012-02-02');
  equal('2/8/12', '2012-08-02');
  equal('2\\8\\12', '2012-08-02');
  equal('2,4,12', '2012-04-02');
  equal('2 4 12', '2012-04-02');
  equal('02-02-12', '2012-02-02');
  equal('30/01/60', '2060-01-30');
  equal('02-02-85', '1985-02-02');
  equal('80-80-12', null);
});

describe('parseNumberDateNoYear', function (input) {
  return dehumanize.parseNumberDateNoYear(input, false, new Date(2012, 1, 1));
}, function (equal) {
  equal('2-2', '2012-02-02');
  equal('2/8', '2012-08-02');
  equal('2\\8', '2012-08-02');
  equal('2,4', '2012-04-02');
  equal('2 4', '2012-04-02');
  equal('02-02', '2012-02-02');
  equal('30/01', '2012-01-30');
  equal('80-80', null);
});

describe('monthFromName', function (input) {
  return dehumanize.monthFromName(input);
}, function (equal) {
  equal('june', 5);
  equal('jun', 5);
  equal('january', 0);
  equal('jan', 0);
  equal('foo', null);
  equal('foobar', null);
});

describe('parseWordyDate', function (input) {
  return dehumanize.parseWordyDate(input, new Date(2012, 1, 1));
}, function (equal) {
  equal('june 1st 2012', '2012-06-01');
  equal('1st june 2012', '2012-06-01');
  equal('june 1 2012', '2012-06-01');
  equal('1 june 2012', '2012-06-01');
  equal('12th june 2012', '2012-06-12');
  equal('12 june 2012', '2012-06-12');
  equal('12th june', '2012-06-12');
  equal('12th ju', null);
  equal('12th ju 2012', null);
  equal('36th june', null);
  equal('36th june 2012', null);

  equal('1st december 2012', '2012-12-01');
});

describe('dehumanize', function (input) {
  return dehumanize(input);
}, function (equal) {
  equal(' 14th July 2012 ', '2012-07-14');
  equal('foo', null);
  equal('foobar', null);
  equal('29/2/15', null);
  equal('28/2/15', '2015-02-28');
  equal('29/2/2004', '2004-02-29');
  equal('31-6-2012', null);
});
