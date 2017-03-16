const test = require('tape');
const filter = require('../filters/cyclone.js');

test('Cyclone Filter Test', function(t) {
	t.plan(6);
	t.false(filter.allows('', 'admin'), 'return false if no queryIndex is specified');
	t.true(filter.allows('_all', 'admin'), 'admin can access _all index');
	t.false(filter.allows('_all', 'org'), 'org can not access _all index');
	t.true(filter.allows('org-2017.02.15', 'admin'), 'admin can access other indexes');
	t.true(filter.allows('org-2017.02.15', 'org'), 'org can access own index');
	t.false(filter.allows('org-2017.02.15', 'org2'), 'org2 can not access org index');
	t.end();
});
