'use strict';

var fs = require('fs');
var IDCard = fs.readFileSync('./const/id-card.list', 'utf8');
var moment = require('moment');
var _ = require('lodash');


var getAddress = function(ID) {
  var re = new RegExp('^(.+)' + ID.substr(0, 6) + '$', 'm');
  var result = IDCard.match(re);
  if (result) return result[1];
  return null;
};

var getBirthday = function(ID) {
  var day = moment(ID.substr(6, 8), 'YYYYMMDD');
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
  if (+ID.charAt(16) % 2) {
    return true;
  };
  return false;
};

var getPCC = function(ID) {
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

exports.isValid = function(ID) {
  if (typeof ID !== 'string') return false;

  var isValid = ID.match(/^\d{18}$/g);
  if (!isValid) return false;

  var address = getAddress(ID);
  if (!address) return false;
  
  var birthday = getBirthday(ID);
  if (!birthday) return false;
  
  var PCC = getPCC(ID);
  if (PCC !== ID.charAt(17)) return false;

  return true;
};
