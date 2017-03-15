/**
 * Logging configuration
 */

const Morgan = require('morgan');
const Winston = require('winston');
require('winston-logstash');

const config = require('./config');

let logtransports = [];
logtransports.push(new (Winston.transports.Console)({
	colorize: true,
	timestamp: true,
	handleExceptions: true,
}));

if (!process.env.NODE_ENV && process.env.NODE_ENV !== 'testing') {
	logtransports.push(new (Winston.transports.Logstash)({
		host: config.logstashHost,
		port: config.logstashPort,
		max_connect_retries: 100,
		timeout_connect_retries: 2000,
		colorize: false,
	}));
}

const log = new (Winston.Logger)({
	transports: logtransports,
	exitOnError: false,
});

log.on('error', function(err) {
	log.error(err);
});

const logMiddleware = Morgan('combined', {
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

