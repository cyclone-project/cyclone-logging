/**
 * A filter proxy for the CYCLONE logging system.
 */

const path = require('path');
const	proxy = require('http-proxy');
const express = require('express');
const session = require('express-session');
const	Keycloak = require('keycloak-connect');

const Kibana = require('./kibana');
const config = require('./config');
const filter = require('./filters/cyclone');
const logger = require('./log');

let app = express();
let sessionStore = new session.MemoryStore();
let log = logger.log;

app.disable('x-powered-by');
app.set('port', config.port);
app.use(logger.middleware);
app.use(session({
	secret: config.sessionSecret,
	resave: false,
	saveUninitialized: true,
	store: sessionStore,
}));

// register authentication middleware for all routes
let keycloak = new Keycloak({store: sessionStore}, config.keycloak);
app.use(keycloak.middleware({}));
app.use(keycloak.protect());

let kibana = new Kibana(config.es_front);
let filterProxy = proxy.createProxy({
	xfwd: false,
	target: config.es_back,
});

// check for missing organization
app.use(function(req, res, next) {
	let organization = req.kauth.grant.id_token.content.schacHomeOrganization;
	if (!organization || organization.length === 0) {
		return res.status(400).send('Sorry, we couldn\'t determine your organization.\
			Please contact your administrator.');
	} else {
		next();
	}
});

// Provide Kibana dashboard configuration dynamically
app.get('/kibana/app/dashboards/*', function(req, res, next) {
	let subject = req.kauth.grant.id_token.content.eduPersonPrincipalName;
	let organization = req.kauth.grant.id_token.content.schacHomeOrganization;
	let dashboard = kibana.createUserDashboard(subject, organization);
	return res.status(200).json(dashboard);
});

// Provide Kibana configuration
app.get('/kibana/config.js', function(req, res, next) {
	return res.status(200).send(kibana.config);
});

// Provide all other Kibana files
app.use('/kibana', express.static(path.join(__dirname, 'kibana')));

// A simple health/status check
app.get('/status', function(req, res, next) {
	return res.status(200).json({'status': 'running'});
});

// Filter and proxy all other requests to elasticsearch
app.use('/', function(req, res, next) {
	if (filter.allows(req)) {
		return filterProxy.web(req, res);
	} else {
		return res.status(403).end();
	}
});

app.listen(config.port, config.host, function() {
	log.info('CYCLONE logging filter proxy listens %s:%s and proxies to %s',
		config.host, config.port, config.es_back);
	log.info('Kibana expects Elasticsearch at %s', config.es_front);
});

