window.calculateAvgInterval = function(lastTaps) {
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

	return avgMsInterval;
};

window.GifPlayer = { intervalId: 0 };

GifPlayer.load = function(imgEl, loadedCallback) {
	imgEl = imgEl || document.querySelector("img")
	clearInterval(GifPlayer.intervalId);
	delete window.supergif;
	window.supergif = new window.SuperGif({ auto_play:0, gif: imgEl });
	supergif.load(loadedCallback);
}

GifPlayer.playAtSpeedForBeats = function(msOfOneBeat, numBeats) {
	var numFrames = supergif.get_length();
	var interval = (msOfOneBeat * numBeats) / numFrames;
	clearInterval(GifPlayer.intervalId);
	supergif.move_to(0);
	GifPlayer.intervalId = setInterval(function() {
		supergif.move_relative(1);
	}, interval)
};