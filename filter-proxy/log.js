/**
 * Logging configuration
 */

const Morgan = require('morgan');
const Winston = require('winston');
require('winston-logstash');

const config = require('./config');

const log = new (Winston.Logger)({
	transports: [
		new (Winston.transports.Console)({
			colorize: true,
			timestamp: true,
			handleExceptions: true,
		}),
		new (Winston.transports.Logstash)({
			host: config.logstashHost,
			port: config.logstashPort,
			max_connect_retries: 20,
			timeout_connect_retries: 1000,
		}),
	],
	exitOnError: false,
});

log.on('error', function(err) {
	log.error(err);
});

const logMiddleware = Morgan('dev', {
	stream: {
		write(message, encoding) {
			log.info(message);
		},
	},
});

module.exports = {
	log: log,
	middleware: logMiddleware,
};

