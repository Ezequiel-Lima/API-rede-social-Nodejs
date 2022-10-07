'use strict';
var config = require('../config');
var sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(config.sendgridKey);

exports.send = async (to, subject, body) => {
    sendgrid.send({
        to: to,
        from: 'joao.lima94@fatec.sp.gov.br',
        subject: subject,
        html: body
    });
}