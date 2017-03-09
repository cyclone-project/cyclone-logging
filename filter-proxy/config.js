/**
 * Configuration
 */

module.exports = {
	/**
	 * Filter Proxy Host
	 */
	'host': '0.0.0.0',

	/**
	 * Filter Proxy Port
	 */
	'port': 8080,

	/**
	 * Elasticsearch Address, Frontend
	 */
	'es_front': 'http://"+window.location.hostname+":8080',

	/**
	 * Elasticsearch Address, Backend
	 */
	'es_back': 'http://elasticsearch:9200',

	/**
	 * Logstash Host (for logging to logstash)
	 */
	'logstashHost': 'http://logstash',

	/**
	 * Logstash Port (for logging to logstash)
	 */
	'logstashPort': '9600',

	/**
	 * Session Secret
	 */
	'sessionSecret': 'secret',

	/**
	 * Proxy IP
	 * Set this according to
	 * https://expressjs.com/en/guide/behind-proxies.html
	 */
	'proxy_ip': process.env.PROXY_IP,

	/**
	 * Keycloak Configuration
	 */
	'keycloak': {
		'realm': 'master',
		'auth-server-url': 'http://localhost/auth',
		'ssl-required': 'none',
		'resource': 'test',
		'public-client': true,
	},
};

