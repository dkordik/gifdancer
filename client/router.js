Meteor.Router.add({
	'/': 'main',
	'/tap': 'tapper',
	'*': 'not_found'
});