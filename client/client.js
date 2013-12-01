Template.add.events({
	"click button": function(ev, el) {
		newGifUrl = el.find("input").value;
		if (newGifUrl) {
			GIFS.insert({ url: newGifUrl });
		}
	}
})

Template.tapper.helpers({
	bpm: function () {
		return Session.get("bpm") || 0;
	}
})

var calculateBPM = function(lastTaps) {
	var msNow = new Date().getTime();
	var timeLimit = msNow - 8000;
	var recent = lastTaps.filter(function(tap) {
		return tap > timeLimit;
	});
	var deltas = [];
	if (recent.length <= 1) {
		return 0;
	}
	for (var i=0; i<recent.length; i++) {
		if (i != 0) {
			var delta = recent[i] - recent[i-1];
			deltas.push(delta);
		}
	}
	var avgMsInterval = 
		deltas.reduce(
			function(a, b) { return a + b }
		) / deltas.length;

	return (60000 / avgMsInterval).toFixed(2);
};

Template.tapper.events({
	"click button": function() {
		var lastTaps = Session.get("lastTaps") || [];
		if (lastTaps.length >= 5) { lastTaps.shift(); }
		lastTaps.push(new Date().getTime());
		Session.set("lastTaps", lastTaps);
		var bpm = calculateBPM(lastTaps);
		Session.set("bpm", bpm);
	}
})

Template.gifs.helpers({
	gifs: function() {
		return GIFS.find();
	}
})