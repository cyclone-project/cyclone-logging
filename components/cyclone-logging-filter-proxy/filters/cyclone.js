
var url = require('url'),
	logging = require('../logging');

var log  = logging.log,
	rlog = logging.rlog;
	
var placeholder = '#cycloneId#';

var nodesPattern 		= /^\/_nodes$/, 
	dataPatternTemplate = '^/(' + placeholder + '-[\\d\\.,]+)+/(_aliases|_search|_mapping)$';

module.exports.allows = function allows(req) {		
	var reqUrl = url.parse(req.url).pathname;
	var id = req.auth.grant.id_token.content.schacHomeOrganization;
	var dataPattern = new RegExp(dataPatternTemplate.replace(placeholder, id));	
	
	return (nodesPattern.test(reqUrl) || dataPattern.test(reqUrl));
}