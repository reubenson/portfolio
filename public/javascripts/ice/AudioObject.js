'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function counter() {
	var i = 0;
	return function () {
		return i++;
	};
};

var generateId = counter();

var AudioObject = function () {
	function AudioObject(ctx, audio_source) {
		_classCallCheck(this, AudioObject);

		this.id = generateId();
		this.source = ctx.createMediaElementSource(audio_source);
		this.gainNode = ctx.createGain();
		this.gainNode.gain.value = 0;
		this.pan = ctx.createStereoPanner();
		var n_audios = $('audio').length;
		this.pan.pan.value = -1 + this.id * (2 / (n_audios - 1)) || 0;

		this.source.connect(this.gainNode);
		this.gainNode.connect(this.pan);
		this.pan.connect(ctx.destination);

		this.title = $(audio_source).data().title;
		this.envelope = new Envelope(this.id, score[this.title]);
		this.envelope.offset = this.envelope.duration() * 0.5 * this.id;
	}

	_createClass(AudioObject, [{
		key: 'updateGain',
		value: function updateGain() {
			this.gainNode.gain.value = this.envelope.level();
		}

		// static count() {
		// 	var id = counter();
		// 	return function() {
		// 		return id();
		// 	}
		// };

	}]);

	return AudioObject;
}();

var Envelope = function () {
	function Envelope(id, args) {
		_classCallCheck(this, Envelope);

		this.audioObjectId = id;
		this.riseRange = args.fadeIn;
		this.sustainRange = args.sustain;
		this.fallRange = args.fadeOut;
		this.restRange = args.rest;
		this.durationOffRange = args.durationOff;
		this.durationOnRange = args.durationOn;
		// this.rise
		// this.rise = params[0]*1000.0;
		// this.sustain = params[1]*1000.0;
		// this.fall = params[2]*1000.0;
		this.setAttributes();
		this.needsReset = false;
		this.playCount = 0;

		appendReadout(this.title);
	}

	_createClass(Envelope, [{
		key: 'setAttributes',
		value: function setAttributes() {
			this.rise = pickNum(this.riseRange) * 1000;
			this.sustain = pickNum(this.sustainRange) * 1000;
			this.fall = pickNum(this.fallRange) * 1000;
			this.rest = pickNum(this.restRange) * 1000;
			this.durationOff = pickNum(this.durationOffRange) * 1000;
			this.durationOn = pickNum(this.durationOnRange) * 1000;
		}
	}, {
		key: 'duration',
		value: function duration() {
			return this.rise + this.sustain + this.fall + this.rest + this.durationOff * 0 + this.durationOn * 0;
		}
	}, {
		key: 'incrementPlayCount',
		value: function incrementPlayCount() {
			return this.playCount != Math.floor(elapsedTime() / this.duration());
		}
	}, {
		key: 'checkForReset',
		value: function checkForReset() {
			if (this.incrementPlayCount()) {
				this.playCount++;
				this.setAttributes();
			}
		}
	}, {
		key: 'level',
		value: function level() {
			// this.checkForReset();
			var t = elapsedTime() - this.offset * 0; // ms since start
			var t_env = t % this.duration();
			var amp = 0;

			if (t_env < 0) {
				return amp;
			}

			if (t_env <= this.rise) {
				amp = t_env / this.rise;
			} else if (t_env <= this.rise + this.sustain) {
				amp = 1;
			} else if (t_env <= this.rise + this.sustain + this.fall) {
				amp = 1 - (t_env - this.rise - this.sustain) / this.fall;
			} else {
				amp = 0;
			}

			updateReadout(this.audioObjectId, amp);
			return amp;
		}
	}, {
		key: 'readout',
		value: function readout() {}
	}]);

	return Envelope;
}();

function pickNum(range) {
	return Math.round(Math.random() * (range[1] - range[0]) + range[0]);
};

function appendReadout(title) {
	var newReadout = $('<div class="readout"></div>');
	$('#readouts').append(newReadout);
}

function updateReadout(id, level) {
	var readout = $('.readout')[id];
	readout.innerHTML = readoutTemplate(audioObjects[id], level);
}

function readoutTemplate(audioObject, level) {
	return "<p>Track Title: " + audioObject.title + "</p>" + "<p>Rise Time: " + audioObject.envelope.rise / 1000.0 + " seconds</p>" + "<p>Sustain Time: " + audioObject.envelope.sustain / 1000.0 + " seconds</p>" + "<p>Fall Time: " + audioObject.envelope.fall / 1000.0 + " seconds</p>" + "<p>Rest Time: " + audioObject.envelope.rest / 1000.0 + " seconds</p>" + "<p>Amplitude Level: " + level.toFixed(2) + "</p>";
}
