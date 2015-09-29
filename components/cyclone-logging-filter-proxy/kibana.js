var logging = require('./logging');
var log = logging.log;
var rlog = logging.rlog;

var placeholderId 	 = '#cycloneId#',
	placeholderIndex = '#index#',
	placeholderUrl	 = '#url#';

var indexAll 	 = '"default": "_all", "interval": "none", "pattern": "_all", "warm_fields": true',
	indexLimited = '"default": "NO_TIME_FILTER_OR_INDEX_PATTERN_NOT_MATCHED", "interval": "day", "pattern": "['+placeholderId+'-]YYYY.MM.DD"';

var dashboardTemplate = require('./kibana_dashboard_template'),
	configTemplate 	  = require('./kibana_config_template');

var kibana = function(es_url) {
	this.config = configTemplate.replace(placeholderUrl, es_url);
};

kibana.prototype.getDashboardConfig = function(req) {
	var id = req.auth.grant.id_token.content.schacHomeOrganization;
	var subject = req.auth.grant.id_token.content.eduPersonPrincipalName;	
	rlog.info("Accessing kibana dashboard", { category: 'logging', 'client-id': id, 'subject-id': subject });
	
	// TODO remove or debug flag
	//return dashboardTemplate.replace(placeholderIndex, indexAll);
	
	return dashboardTemplate.replace( placeholderIndex, indexLimited.replace(placeholderId, id) );
};

kibana.prototype.getConfig = function() {
	return this.config;
};

module.exports = kibana;