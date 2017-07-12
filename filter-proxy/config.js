/**
 * Configuration
 */

/**
 * Filter Proxy Host
 * host the filter-proxy binds to
 */
const host = process.env.FPROXY_HOST || '0.0.0.0';

/**
 * Filter Proxy Port
 * port the filter-proxy binds to
 */
const port = process.env.FPROXY_PORT || 8080;

/**
 * Elasticsearch URL
 * The suburl part of the elasticsearch address (if any)
 * as accessed from outside. This is important for routing purposes
 * and should be reflected in es_front as well.
 * This part will be stripped from the url before proxying to elasticsearch.
 */
const es_url = process.env.FPROXY_ESURL || '/elasticsearch';

/**
 * Elasticsearch Address, Frontend
 * address kibana (on the client-side) uses to
 * to reach elasticsearch, e.g.
 * window.location.hostname points to the filter-proxies outside url
 */
const es_front = process.env.FPROXY_ESFRONT ||
			'http://"+window.location.hostname+"' + (port ? ':'+port : '') + es_url;

/**
 * Elasticsearch Address, Backend
 * address the filter-proxy (on the server side) uses to
 * reach elasticsearch and proxy requests to
 */
const es_back = process.env.FPROXY_ESBACK || 'http://elasticsearch:9200';

/**
 * Logstash Host (for logging to logstash)
 */
const logstashHost = process.env.FPROXY_LSHOST || 'logstash';

/**
 * Logstash Port (for logging to logstash)
 */
const logstashPort = process.env.FPROXY_LSPORT || '9600';

/**
 * Session Secret
 * Change this for production
 */
const sessionSecret = process.env.FPROXY_SECRET || 'secret';

/**
 * Proxy IP
 * Set this according to
 * https://expressjs.com/en/guide/behind-proxies.html
 */
const proxy_ip = process.env.PROXY_IP;

/**
 * Keycloak Client Configuration
 */
const keycloak = {
	'realm': process.env.FPROXY_KCREALM || 'master',
	'auth-server-url': process.env.FPROXY_KCURL || 'https://federation.cyclone-project.eu/auth',
	'ssl-required': process.env.FPROXY_SSLREQ || 'external',
	'resource': process.env.FPROXY_KCRESOURCE || 'test',
	'public-client': (process.env.FPROXY_KCISPUB === undefined) ? true : process.env.KEYCLOAK_ISPUB,
};

module.exports = {
	host,
	port,
	es_url,
	es_front,
	es_back,
	logstashHost,
	logstashPort,
	sessionSecret,
	keycloak,
};
