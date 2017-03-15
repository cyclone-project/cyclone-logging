const log = require('./log').log;

const allIndex = {
	'default': '_all',
	'interval': 'none',
	'pattern': '_all',
	'warm_fields': true,
};

class Kibana {

	constructor(esUrl) {
		this.config = '\
			define(["settings"],\
			function(Settings) {\
				"use strict";\
				return new Settings({\
					"elasticsearch": "' + esUrl + '",\
					"default_route": "/dashboard/file/default.json",\
					"kibana_index": "kibana-int",\
					"panel_names": [\
						"histogram",\
						"map",\
						"goal",\
						"table",\
						"filtering",\
						"timepicker",\
						"text",\
						"hits",\
						"column",\
						"trends",\
						"bettermap",\
						"query",\
						"terms",\
						"stats",\
						"sparklines"\
					]\
				});\
			});';
	}

	createUserDashboard(subject, organization) {
		log.info('Accessing Kibana Dashboard', {
			'category': 'logging',
			'client-id': organization,
			'subject-id': subject,
		});

		let userIndex;
		if (organization === 'admin') {
			userIndex = allIndex;
		} else {
			userIndex = {
				'default': 'NO_TIME_FILTER_OR_INDEX_PATTERN_NOT_MATCHED',
				'interval': 'day',
				'pattern': '[' + organization + '-]YYYY.MM.DD',
			};
		}

		return {
			'rows': [
				{
					'title': 'Graph',
					'height': '400px',
					'editable': false,
					'collapse': false,
					'collapsable': true,
					'panels': [
						{
							'span': 12,
							'editable': false,
							'group': [
								'default',
							],
							'type': 'histogram',
							'mode': 'count',
							'time_field': '@timestamp',
							'value_field': null,
							'auto_int': true,
							'resolution': 100,
							'interval': '30s',
							'fill': 3,
							'linewidth': 3,
							'timezone': 'browser',
							'spyable': false,
							'zoomlinks': true,
							'bars': true,
							'stack': false,
							'points': false,
							'lines': false,
							'legend': true,
							'x-axis': true,
							'y-axis': true,
							'percentage': false,
							'interactive': true,
							'queries': {
								'mode': 'all',
								'ids': [
									0,
								],
							},
							'title': 'Events over time',
							'intervals': [
								'auto',
								'1s',
								'1m',
								'5m',
								'10m',
								'30m',
								'1h',
								'3h',
								'12h',
								'1d',
								'1w',
								'1M',
								'1y',
							],
							'options': true,
							'tooltip': {
								'value_type': 'individual',
								'query_as_alias': true,
							},
							'scale': 1,
							'y_format': 'none',
							'grid': {
								'max': null,
								'min': 0,
							},
							'annotate': {
								'enable': false,
								'query': '*',
								'size': 20,
								'field': 'priority',
								'sort': [
									'priority',
									'desc',
								],
							},
							'pointradius': 5,
							'show_query': true,
							'legend_counts': true,
							'zerofill': false,
							'derivative': false,
							'scaleSeconds': false,
						},
					],
					'notice': false,
				},
				{
					'title': 'Events',
					'height': '350px',
					'editable': false,
					'collapse': false,
					'collapsable': true,
					'panels': [
						{
							'title': 'All events',
							'error': false,
							'span': 12,
							'editable': false,
							'group': [
								'default',
							],
							'type': 'table',
							'size': 50,
							'pages': 10,
							'offset': 0,
							'sort': [
								'@timestamp',
								'desc',
							],
							'style': {
								'font-size': '9pt',
							},
							'overflow': 'min-height',
							'fields': [
							],
							'localTime': true,
							'timeField': '@timestamp',
							'highlight': [],
							'sortable': true,
							'header': true,
							'paging': true,
							'spyable': false,
							'queries': {
								'mode': 'all',
								'ids': [
									0,
								],
							},
							'field_list': false,
							'status': 'Stable',
							'trimFactor': 1000,
							'normTimes': true,
							'all_fields': false,
						},
					],
					'notice': false,
				},
			],
			'services': {
				'query': {
					'list': {
						'0': {
							'id': 0,
							'type': 'lucene',
							'query': '*',
							'alias': '',
							'color': '#7EB26D',
							'pin': false,
							'enable': true,
						},
					},
					'ids': [
						0,
					],
				},
				'filter': {
					'list': {
						'0': {
							'type': 'time',
							'field': '@timestamp',
							'from': 'now-1h',
							'to': 'now',
							'mandate': 'must',
							'active': true,
							'alias': '',
							'id': 0,
						},
					},
					'ids': [
						0,
					],
				},
			},
			'editable': false,
			'style': 'light',
			'title': 'CYCLONE Logs',
			'failover': false,
			'index': userIndex,
			'panel_hints': true,
			'pulldowns': [
				{
					'type': 'query',
					'collapse': false,
					'notice': false,
					'enable': true,
					'query': '*',
					'pinned': true,
					'history': [
						'*',
					],
					'remember': 10,
				},
				{
					'type': 'filtering',
					'collapse': false,
					'notice': false,
					'enable': true,
				},
			],
			'nav': [
				{
					'type': 'timepicker',
					'collapse': false,
					'notice': false,
					'enable': true,
					'status': 'Stable',
					'time_options': [
						'5m',
						'15m',
						'30m',
						'1h',
						'6h',
						'12h',
						'24h',
						'2d',
						'7d',
						'30d',
						'90d',
						'1y',
					],
					'refresh_intervals': [
						'5s',
						'10s',
						'30s',
						'1m',
						'5m',
						'15m',
						'30m',
						'1h',
						'2h',
						'1d',
					],
					'timefield': '@timestamp',
					'now': true,
				},
			],
			'loader': {
				'save_gist': false,
				'save_elasticsearch': false,
				'save_local': false,
				'save_default': false,
				'save_temp': false,
				'save_temp_ttl_enable': false,
				'save_temp_ttl': '0s',
				'load_gist': false,
				'load_elasticsearch': false,
				'load_elasticsearch_size': 0,
				'load_local': false,
				'hide': false,
				'show_home': false,
			},
			'refresh': false,
		};
	}

}

module.exports = Kibana;

