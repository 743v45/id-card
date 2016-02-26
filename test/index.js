'use strict';

var should = require('should');
var idCard = require('../index');

describe('index.js', function() {
  context('isValid', function() {
    it('when ID is valid', function() {
      idCard.isValid('220303197807074202').should.be.eql(true);
    });

    it('when ID is not valid', function() {
      idCard.isValid('2202323').should.be.eql(false);
    });
  });

  context('query', function() {
    it('when ID is valid', function() {
      var result = idCard.query('220303197807074202');
      result.should.have.properties({
        valid: true,
        address: '吉林省四平市铁东区',
        gender: 'F',
        year: 1978,
        month: 7,
        day: 7,
        age: 37
      });
    });

    it('when ID is not valid', function() {
      var result = idCard.query('110');
      result.should.have.properties({
        valid: false
      });
    });
  });

  context('generate', function() {
    it('could return a random information whth 18 bits ID', function() {
      var result = idCard.generate();
      result.ID.should.have.length(18);
    });

    it('could return a random information whth 15 bits ID', function() {
      var result = idCard.generate({ bits: 15 });
      result.ID.should.have.length(15);
    });
  });
});
