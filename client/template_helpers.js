Template.tapper.helpers({
	interval: function () {
		return Session.get("interval") || 0;
	}
})

Template.tapper.events({
	"click button": function() {
		var lastTaps = Session.get("lastTaps") || [];
		var maxTaps = 10;
		if (lastTaps.length >= maxTaps) { lastTaps.shift(); }
		lastTaps.push(new Date().getTime());
		Session.set("lastTaps", lastTaps);
		var interval = calculateAvgInterval(lastTaps);
		Session.set("interval", interval);
	}
})

Template.gifs.helpers({
	gifs: function() {
		return GIFS.find();
	}
})

Template.gifs.events({
	"click img": function(ev, el) {
		var model = this;
		GifPlayer.load(ev.target, function() {
			$("canvas").addClass("fullscreen");
			GifPlayer.playAtSpeedForBeats(Session.get("interval"), model.beats);
		});
	}
})

Template.newgif.events({
	"submit form.upload": function(ev, el) {
		ev.preventDefault();
		var url = el.find("input.url").value;
		if (!url) {
			alert("Paste an image URL");
			return;
		}
		Session.set("downloading", true);
		Meteor.call("downloadImage", url, function(err, data) {
			console.log("callback received. ", arguments);
			if (err) {
				alert("Problem downloading image. Please check URL and internet connection");
			}
			Session.set("downloading", false);
			Session.set("uploadingImageUrl", url);
		});
	},
	"submit form.add": function(ev, el) {
		ev.preventDefault();
		var beats = el.find("input.beats").value;
		if (!beats) {
			alert("Enter the number of beats. When the GIF plays " +
				"through one iteration, how many times does the character " +
				"bob around? This will make sure it looks like they're dancing right!"
			);
			return;
		}
		var currentGif = GIFS.findOne({ url: Session.get("uploadingImageUrl") });
		GIFS.update(currentGif._id, {$set: { beats: beats } }, function() {
			Meteor.Router.to('/');
		});
	}
})

Template.newgif.helpers({
	downloading: function() {
		return Session.get("downloading");
	},
	uploadingImage: function() {
		return Session.get("uploadingImageUrl");
	},
	uploadingImageData: function() {
		return GIFS.findOne({ url: Session.get("uploadingImageUrl") }).data;
	}
})