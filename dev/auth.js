'use strict';

const DAL = require('./dal/dal.js');
const Boom = require('boom');

module.exports = {
	init: function (server) {
		server.method('checkTokin', (token, next) => {
			DAL.users.checkToken(token, (err, docs) => {
				!!err ? next() : next(Boom.unauthorized('invalid token'));
			});
		});
	},
	create: (cb) => {
		DAL.users.createUser('vadim@v.ua', 'ps121212', "token1234", cb);
	},
	login: (login, password, cb) => {
		DAL.users.getUserByEmail(login, (err, docs) => {
			if (!!docs && docs.password == password) {
					let token = newToken();
					DAL.users.updateToken(token, login, (err, docs) => {
						!!docs ? cb({token: docs.token}) : cb(Boom.badImplementation('Server error'));					
					});
			} else {
				cb(Boom.unauthorized('Login or password are wrong'));
			}
		}); 
	}
};

function newToken() {
	const RandToken = require('rand-token');
	return RandToken.generate(16);
}