/**
 * Logging configuration
 */

var winston = require('winston');
require('winston-logstash');

var log = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            colorize: true, 
            timestamp: true,
            handleExceptions: true
        }),
    ],
    exitOnError: false
});

var rlog = new (winston.Logger)({
    transports: [
        new (winston.transports.Logstash)({
            host: 'logstash',
            port: 9600,
            max_connect_retries: 20,
            timeout_connect_retries: 1000
        }),
        new (winston.transports.Console)({
            colorize: true,
            timestamp: true,
            handleExceptions: true
        })
    ],
    exitOnError: false
});

log.on('error', function(err) { log.error(err) });
rlog.on('error', function(err) { log.error(err) });

module.exports.log = log;
module.exports.rlog = rlog;