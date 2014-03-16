'use strict';

var assert = require('assert');
var dehumanize = require('../');

var day = 60 * 60 * 24 * 1000;

function equal(d, expected) {
  expected += 'T00:00:00.000Z';
  try {
    assert(d.toISOString() === expected,
           d.toISOString() + ' === ' +
           expected);
  } catch (ex) {
    console.dir(d);
    throw ex;
  }
}

describe('parseNearbyDays', function () {
  it('understands "today"', function () {
    equal(dehumanize.parseNearbyDays('today', new Date(2000, 0, 5)), '2000-01-05');
  });
  it('understands "yesterday"', function () {
    equal(dehumanize.parseNearbyDays('yesterday', new Date(2000, 0, 5)), '2000-01-04');
  });
  it('understands "tomorrow"', function () {
    equal(dehumanize.parseNearbyDays('tomorrow', new Date(2000, 0, 5)), '2000-01-06');
  });
  it('returns `null` when it doesn\'t understand', function () {
    assert(dehumanize.parseNearbyDays('foo bar', new Date(2000, 0, 5)) === null);
  });
});


describe('parseLastThisNext', function () {
  it('understands "next monday"', function () {
    equal(dehumanize.parseLastThisNext('next monday', new Date(2000, 0, 5)), '2000-01-17');
  });
  it('understands "last tuesday"', function () {
    equal(dehumanize.parseLastThisNext('last tuesday', new Date(2000, 0, 5)), '2000-01-04');
  });
  it('understands "this wednesday"', function () {
    equal(dehumanize.parseLastThisNext('this thursday', new Date(2000, 0, 5)), '2000-01-06');
  });
  it('returns `null` when it doesn\'t understand', function () {
    assert(dehumanize.parseLastThisNext('foo bar', new Date(2000, 0, 5)) === null);
  });
});

describe('parseNumberDate', function () {
  it('understands "2-2-2012"', function () {
    equal(dehumanize.parseNumberDate('2-2-2012'), '2012-02-02');
  });
  it('understands "2/8/2012"', function () {
    equal(dehumanize.parseNumberDate('2/8/2012'), '2012-08-02');
  });
  it('understands "2\\8\\2012"', function () {
    equal(dehumanize.parseNumberDate('2\\8\\2012'), '2012-08-02');
  });
  it('understands "2,4,2012"', function () {
    equal(dehumanize.parseNumberDate('2,4,2012'), '2012-04-02');
  });
  it('understands "2 4 2012"', function () {
    equal(dehumanize.parseNumberDate('2 4 2012'), '2012-04-02');
  });
  it('understands "02-02-2012"', function () {
    equal(dehumanize.parseNumberDate('02-02-2012'), '2012-02-02');
  });
  it('returns `null` when it doesn\'t understand', function () {
    assert(dehumanize.parseNumberDate('80-80-2012') === null);
  });
});

describe('parseNumberDateShortYear', function () {
  it('understands "2-2-12"', function () {
    equal(dehumanize.parseNumberDateShortYear('2-2-12', false, 80), '2012-02-02');
  });
  it('understands "2/8/12"', function () {
    equal(dehumanize.parseNumberDateShortYear('2/8/12', false, 80), '2012-08-02');
  });
  it('understands "30/01/60"', function () {
    equal(dehumanize.parseNumberDateShortYear('30/01/60', false, 80), '2060-01-30');
  });
  it('understands "02-02-12"', function () {
    equal(dehumanize.parseNumberDateShortYear('02-02-12', false, 80), '2012-02-02');
  });
  it('understands "02-02-85"', function () {
    equal(dehumanize.parseNumberDateShortYear('02-02-85', false, 80), '1985-02-02');
  });
  it('returns `null` when it doesn\'t understand', function () {
    assert(dehumanize.parseNumberDateShortYear('80-80-12', false, 80) === null);
  });
});

describe('monthFromName', function () {
  it('understands "june"', function () {
    assert(dehumanize.monthFromName('june') === 5);
  });
  it('understands "jun', function () {
    assert(dehumanize.monthFromName('jun') === 5);
  });
  it('understands "january"', function () {
    assert(dehumanize.monthFromName('january') === 0);
  });
  it('understands "jan', function () {
    assert(dehumanize.monthFromName('jan') === 0);
  });
  it('returns `null` when it doesn\'t understand', function () {
    assert(dehumanize.monthFromName('foo') === null);
    assert(dehumanize.monthFromName('foobar') === null);
  });
});

describe('parseWordyDate', function () {
  it('understands "june 1st 2012"', function () {
    equal(dehumanize.parseWordyDate('june 1st 2012', new Date(2012, 1, 1)), '2012-06-01');
  });
  it('understands "1st june 2012', function () {
    equal(dehumanize.parseWordyDate('1st june 2012', new Date(2012, 1, 1)), '2012-06-01');
  });
  it('understands "june 1 2012"', function () {
    equal(dehumanize.parseWordyDate('june 1 2012', new Date(2012, 1, 1)), '2012-06-01');
  });
  it('understands "1 june 2012', function () {
    equal(dehumanize.parseWordyDate('1 june 2012', new Date(2012, 1, 1)), '2012-06-01');
  });
  it('understands "12th june 2012"', function () {
    equal(dehumanize.parseWordyDate('12th june 2012', new Date(2012, 1, 1)), '2012-06-12');
  });
  it('understands "12 june 2012', function () {
    equal(dehumanize.parseWordyDate('12 june 2012', new Date(2012, 1, 1)), '2012-06-12');
  });
  it('understands "12th june"', function () {
    equal(dehumanize.parseWordyDate('12th june', new Date(2012, 1, 1)), '2012-06-12');
  });
  it('returns `null` when it doesn\'t understand', function () {
    assert(dehumanize.parseWordyDate('12th ju', new Date(2012, 1, 1)) === null);
    assert(dehumanize.parseWordyDate('12th ju 2012', new Date(2012, 1, 1)) === null);
    assert(dehumanize.monthFromName('36th june', new Date(2012, 1, 1)) === null);
    assert(dehumanize.monthFromName('36th june 2012', new Date(2012, 1, 1)) === null);
  });
});

describe('dehumanize', function () {
  it('understands " 14th July 2012 "', function () {
    equal(dehumanize(' 14th July 2012 '), '2012-07-14');
  });
  it('returns `null` when it doesn\'t understand', function () {
    assert(dehumanize.monthFromName('foo') === null);
    assert(dehumanize.monthFromName('foobar') === null);
  });
});