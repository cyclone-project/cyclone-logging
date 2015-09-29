/**
 * A filter proxy for the CYCLONE logging system.
 */

var config = {
	host 	:	process.env.LOGGING_FILTER_HOST || 'localhost',
	port 	:	process.env.LOGGING_FILTER_PORT || 4004,
	es_host :	process.env.ES_HOST 			|| 'http://localhost',
	es_port	:	process.env.ES_PORT 			|| 9200,
	es_url	:	process.env.ES_URL 				|| 'http://"+window.location.hostname+":4004',
	k_path	:	process.env.KIBANA_PATH			|| __dirname + '/kibana',
	r_port	:	process.env.REDIRECT_PORT		|| 4004
};

var log 	  = require('./logging').log,
	morgan	  = require('morgan'),
	logstream = { write: function(message, encoding) { log.info(message); }};

var express = require('express'),
	proxy = require('http-proxy'),
	Keycloak = require('connect-keycloak');

var	Session = require('express-session'),
	sessionStore = new Session.MemoryStore();

var Kibana = require('./kibana'),
	filter = require('./filters/cyclone');

/* === Setup ==================================================================== */
var app = express();
app.disable('x-powered-by');
app.set('port', config.r_port);
app.use( morgan('dev', { stream: logstream }) );
app.use(Session({										// TODO switch to proper session store (e.g. redis)
	secret: 'secret',
	resave: false,
	saveUninitialized: true,
	store: sessionStore
}));

// Register keycloak middleware
var keycloak = new Keycloak({ store: sessionStore });
app.use(keycloak.middleware({}));
app.use(keycloak.protect());

var kibana 		= new Kibana(config.es_url),
	filterProxy = proxy.createProxy( { xfwd: false, target: config.es_host+':'+config.es_port } );

/* === Paths ==================================================================== */
// Provide Kibana dashboard configuration dynamically
app.get('/kibana/app/dashboards/*', function(req, res, next) {
	return res.status(200)
			  .type('application/json')
			  .send( kibana.getDashboardConfig(req) );
});

// Provide Kibana configuration
app.get('/kibana/config.js', function(req, res, next) {
	return res.status(200)
			  .type('application/javascript')
			  .send( kibana.getConfig() ); 
});

// Provide all other Kibana files
app.use('/kibana/', express.static(config.k_path));

// A simple health/status check
app.get('/status', function(req, res, next) {
	return res.json({ 'status': 'running' });
});

// Filter and proxy all other requests to elasticsearch
app.use('/', function(req ,res, next) {
	if (filter.allows(req))
		return filterProxy.web(req, res);
	
	return res.status(403).end();
});

/* === Begin ==================================================================== */
var server = app.listen(config.port, config.host, function() {
	log.info('CYCLONE logging filter proxy listens on '+config.host+':'+config.port+', proxies to '+config.es_host+':'+config.es_port+'.');
	log.info('Kibana expects elasticsearch at ' + config.es_url);	
});