'use strict';

const DAL = require('../dal/dal.js');
const Boom = require('boom');
const Mailer = require('../services/mailer.js');
const config = require('../config.js');

module.exports = function (server) {
  server.route({
    method: 'POST',
    path: '/api/complaint',
    handler: function (request, reply) {
      const message = [
        'Date: ' + request.payload.date,
        'From: ' + request.payload.name + ' (' + request.payload.email + ')',
        'Phone: ' + request.payload.phone,
        'Invoice number: ' + request.payload.invoiceNumber,
        'Location: ' + request.payload.location,
        'Message: ',
        request.payload.complaintMessage
      ].join('\n');
      const mail = {
        from: '"No-reply" <no.reply.ultimatetowing@gmail.com>', // sender address
        to: 'no.reply.ultimatetowing@gmail.com', // list of receivers
        subject: 'Complaint from ' + request.payload.name, // Subject line
        text: message, // plaintext body
        html: '<div style="white-space: pre;">' + message + '</div>' // html body
      };

      Mailer(config.mail).send(mail).then(
        (res) => {
          reply(res);
        }, (err) => {
          reply( Boom.badImplementation(err.message, err) );
        }
      );
    }
  });
};