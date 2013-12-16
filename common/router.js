if (Meteor.isClient) {
	Meteor.Router.add({
		'/': 'main',
		'/newgif': function() {
			Session.set("uploadingImageUrl", null);
			return 'newgif'
		},
		'/tap': 'tapper',
		'/giftest': 'giftest',
		'*': 'not_found'
	});
}

if (Meteor.isServer) {
	Meteor.Router.add({
		'/images/:url': function(url) {
			var gif = GIFS.findOne({ filename: url.replace(/\./g,"\.") });
			if (!gif) {
				return [ 404, "Image not found" ];
			} else {
				return [ 200, { "Content-Type": "image/gif" }, new Buffer(gif.data, "base64") ];
			}
		}
	});
}