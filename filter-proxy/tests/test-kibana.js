const test = require('tape');
const Kibana = require('../kibana.js');

test('Kibana Test', function(t) {
	t.plan(3);

	let esFront = 'http://"+window.location.hostname+":8080';
	let kibana = new Kibana(esFront);
	t.ok(kibana.config
		.includes('"elasticsearch": "http://"+window.location.hostname+":8080"'),
		'Kibana config sets elasticsearch URL correctly');

	let userDashboard = kibana.createUserDashboard('user', 'testorg');
	t.equals(userDashboard.index.pattern, '[testorg-]YYYY.MM.DD',
		'Kibana sets index pattern for users dashboard to users organization correctly');

	let adminDashboard = kibana.createUserDashboard('admin', 'admin');
	t.equals(adminDashboard.index.pattern, '_all',
		'Kibana sets index pattern for admin correctly');

	t.end();
});

