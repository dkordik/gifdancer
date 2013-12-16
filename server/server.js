var request = Npm.require("request");
var Future = Npm.require("fibers/future");
 
var async = function (callback) { //let's tuck away some of the nastyness in here
	var future = new Future();
 
	var returnFunc = function () {
		future["return"].apply(future, arguments);
	}
 
	callback(returnFunc);
 
	return future.wait();
}


Meteor.methods({
	"downloadImage": function(url) {
		return async(function(done) {
			var existingGif = GIFS.findOne({url: url});
			if (existingGif) {
				console.log("already in DB: " + url);
				done(existingGif);
				return;
			}
			console.log("downloading " + url);
			var params = { url: url, encoding: null };
			request.get(params, Meteor.bindEnvironment(function(err, res, body) {
				if (err) {
					console.error("Request error: ", err);
					return done(err);
				}
				// var base64prefix = "data:" + res.headers["content-type"] + ";base64,";
				// var image = base64prefix + ;
				GIFS.insert({
					url: url,
					filename: url.substring(url.lastIndexOf("/")).slice(1),
					data: body.toString("base64")
				}, function(err, res) {
					if (err) {
						console.error("Error inserting GIF: ", err);
						return done(err);
					} else {
						done(res);
					}
				});
			}, function (e) { console.log('bind failure with request', e); }));
		})
	}
})