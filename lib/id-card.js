'use strict';

var fs = require('fs');
var IDCard = fs.readFileSync('./const/id-card.list', 'utf8');
var moment = require('moment');
var _ = require('lodash');
var crn = require('chinese-random-name');

var getAddress = function(ID) {
  var re = new RegExp('^(.+)' + ID.substr(0, 6) + '$', 'm');
  var result = IDCard.match(re);
  if (result) return result[1];
  return null;
};

var getBirthday = function(ID) {
  var birth = is15Bits(ID) ? '19' + ID.substr(6, 6) : ID.substr(6, 8);
  var day = moment(birth, 'YYYYMMDD');
  if (!day.isValid) return null;

  var isBeforeNow = day.isBefore(new Date());
  if (!isBeforeNow) return null;

  var birthday = {
    year: day.get('year'),
    month: 1 + day.get('month'),
    day: day.get('date'),
    age: moment(new Date()).diff(day, 'years')
  };

  return birthday;
};

var getGender = function(ID) {
  var rank = is15Bits(ID) ? +ID.charAt(15) : +ID.charAt(17);
  if (rank % 2) {
    return true;
  };
  return false;
};

var getPCC = function(ID) {
  if (!is18Bits(ID)) return;
  var MOD = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  var Table = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  var sum = 0;
  for (let i = 0; i < 17; i ++) {
    sum += MOD[i] * +ID.charAt(i);
  }
  return Table[sum % 11];
};

exports.query = function(ID) {
  var info = {
    valid: false
  };
  var isValid = exports.isValid(ID);
  if (!isValid) {
    return info;
  }

  var address = getAddress(ID);
  var birthday = getBirthday(ID);
  var gender = getGender(ID) ? 'M' : 'F';

  info.valid = true;
  info.address = address;
  info.gender = gender;
  info = _.assignIn(info, birthday);
  
  
  return info;
};

var is15Bits = function(ID) {
  return !!ID.match(/^\d{15}$/g);
};

var is18Bits = function(ID) {
  return !!ID.match(/^\d{18}$/g);
};


exports.isValid = function(ID) {
  if (typeof ID !== 'string') return false;

  if (!is18Bits(ID) && !is15Bits(ID)) return false;

  var address = getAddress(ID);
  if (!address) return false;
  
  var birthday = getBirthday(ID);
  if (!birthday) return false;
  
  if (is18Bits(ID)) {
    var PCC = getPCC(ID);
    if (PCC !== ID.charAt(17)) return false;
  }

  return true;
};

var randomBirthday = function(options) {
  options = _.assignIn({
    years: 100,
    bits: 18
  }, options || {});

  // 15 位身份证只能是 19XX 年的形式
  var nowYear = options.bits == 15 ? 2000 : new Date().getFullYear();
  var thenUnix = moment((nowYear - options.years).toString(), 'YYYY').unix();
  var nowUnix = moment(nowYear.toString(), 'YYYY').unix();
  var num = Math.floor(Math.random() * (nowUnix - thenUnix + 1) + thenUnix);
  var randomDate = moment(num, 'X');

  return options.bits == 15 ? randomDate.format('YYMMDD') : randomDate.format('YYYYMMDD');
};

exports.generate = function(options) {
  options = _.assignIn({
    bits: 18
  }, options || {});
  var list = IDCard.match(/^.+$/mg);
  var length = list.length;
  var randomNumber = Math.floor(Math.random() * length);

  var numOfAddress = list[randomNumber].match(/(\d{6})$/g);
  var numOfBirthday = randomBirthday({ bits: options.bits });
  var numOfSerial = Math.floor(Math.random() * 1000);

  var IDWithoutPcc = '' + numOfAddress + numOfBirthday + numOfSerial;
  var ID;
  if (options.bits == 18) {
    var numOfPCC = getPCC(IDWithoutPcc + '0');
    ID = IDWithoutPcc + numOfPCC;
  } else {
    ID = IDWithoutPcc;
  }
  var result = _.assignIn({
    ID: ID,
    name: crn.generate()
  }, exports.query(ID));

  return result.valid ? result : exports.generate(options);
};
