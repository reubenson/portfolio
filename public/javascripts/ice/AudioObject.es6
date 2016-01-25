'use strict'

function counter() {
	var i = 0;
	return function(){
		return i++;
	};
};

var generateId = counter();

class AudioObject {
	constructor(ctx,audio_source) {
		this.id = generateId();
		this.source = ctx.createMediaElementSource(audio_source);
		this.gainNode = ctx.createGain();
		this.gainNode.gain.value = 0;
		this.pan = ctx.createStereoPanner();
		var n_audios = $('audio').length;
		this.pan.pan.value = -1 + this.id * (2 / (n_audios-1)) || 0;

		this.source.connect(this.gainNode);
		this.gainNode.connect(this.pan);
		this.pan.connect(ctx.destination);

		var title = $(audio_source).data().title;
		this.envelope = new Envelope(score[title]);
		this.envelope.offset = this.envelope.duration() * 0.5 * this.id;
	}

	updateGain() {
		this.gainNode.gain.value = this.envelope.level();
	}

	// static count() {
	// 	var id = counter();
	// 	return function() {
	// 		return id();
	// 	}
	// };
}

class Envelope {
	constructor(params = [5,5,5]) {
		this.rise = params[0]*1000.0;
		this.sustain = params[1]*1000.0;
		this.fall = params[2]*1000.0;
	}

	duration() { return (this.rise + this.sustain + this.fall); }

	level() {
	  var t = ( Date.now()-t0-this.offset )			// ms since start
	  var t_env = t % this.duration();
	  var amp = 0;

		if (t_env < 0) { return amp }

	  if (t_env <= this.rise) {
	    amp = t_env / this.rise;
	  } else if (t_env <= this.rise + this.sustain) {
	    amp = 1;
	  } else {
	    amp = 1 - (t_env-this.rise-this.sustain) / this.fall;
	  }
	  return amp;
	 }

}
