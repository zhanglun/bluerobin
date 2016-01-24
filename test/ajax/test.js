var mocha = require('mocha');
var expect = require('chai').expect;

var $ajax = require('../../app/services/ajax.js');
var root = 'http://zhanglun.daoapp.io/api';

var settings = {
	url: root
};

describe('ajax', function(){
	 it('get', function() {
        expect($ajax.get({})).to.be.equal(2);
    });
});

