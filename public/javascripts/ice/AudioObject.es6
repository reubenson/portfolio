'use strict'

var productionMode = false;

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

		this.title = $(audio_source).data().title;
		this.envelope = new Envelope(this,score[this.title]);
		this.envelope.offset = this.envelope.duration() * 0.5 * this.id;

	}

	updateGain() {
		this.gainNode.gain.value = this.envelope.level();
	}

	// static reset(){
	// 	t0 = Date.now();
	// 	// debugger;
	// }

	// static count() {
	// 	var id = counter();
	// 	return function() {
	// 		return id();
	// 	}
	// };
}

class Envelope {
	constructor(audioObject,args){
		this.audioObjectId = audioObject.id;
		this.riseRange = args.fadeIn;
		this.sustainRange = args.sustain;
		this.fallRange = args.fadeOut;
		this.restRange = args.rest;
		this.durationOffRange = args.durationOff;
		this.durationOnRange = args.durationOn;
		this.playCount = 0;
		this.mute = false;
		this.setAttributes();

		appendReadout(audioObject,this);
	}

	setAttributes(){
		if (productionMode || $('.readout') != []) {
			this.rise = pickNum(this.riseRange)*1000;
			this.sustain = pickNum(this.sustainRange)*1000;
			this.fall = pickNum(this.fallRange)*1000;
			this.rest = pickNum(this.restRange)*1000;
			this.durationOff = pickNum(this.durationOffRange)*1000;
			this.durationOn = pickNum(this.durationOnRange)*1000;
		} else {
			var el = $($('.readout')[this.audioObjectId]);
			this.rise =	1000*Number(el.find('input[name="rise"]').val());
			this.sustain = 1000*Number(el.find('input[name="sustain"]').val());
			this.fall =	1000*Number(el.find('input[name="fall"]').val());
			this.rest =	1000*Number(el.find('input[name="rest"]').val());
		}
	}

	duration() { return (this.rise + this.sustain + this.fall + this.rest + this.durationOff*0 + this.durationOn*0); }

	incrementPlayCount() {
		return Math.floor( elapsedTime() / this.duration() ) - this.playCount >= 1;
	}

	checkForReset() {
		if (this.incrementPlayCount()) {
			this.playCount++;
			this.setAttributes();
		}
	};

	level() {
		this.checkForReset();
	  var t = ( elapsedTime()-this.offset*0 )			// ms since start
	  var t_env = t % this.duration();
	  var amp = 0;

		if (t_env < 0 || this.mute) { return amp }

	  if (t_env <= this.rise) {
	    amp = t_env / this.rise;
	  } else if (t_env <= this.rise + this.sustain) {
	    amp = 1;
	  } else if (t_env <= this.rise + this.sustain + this.fall){
	    amp = 1 - (t_env-this.rise-this.sustain) / this.fall;
	  } else {
			amp = 0;
		}

		updateReadout(this.audioObjectId,amp);
	  return amp;
	}

	readout() {

	}
}

function pickNum(range){
  return Math.round((Math.random() * (range[1]-range[0])) + range[0]);
};

function appendReadout(audioObject,envelope) {
	var newReadout = $('<div class="readout" data-id="' + audioObject.id + '"></div>');
  $('#readouts').append(newReadout);
	var readout = $('.readout').last()[0];
	readout.innerHTML = prototypingTemplate(audioObject.title,envelope,0);
	// debugger;
}

function updateReadout(id,level) {
	var audioObject = audioObjects[id];
	var table = $('.readout').find('table')[id];
	if (productionMode) {
		$(table).find('td')[1].innerHTML = audioObject.envelope.rise/1000.0;
		$(table).find('td')[3].innerHTML = audioObject.envelope.sustain/1000.0;
		$(table).find('td')[5].innerHTML = audioObject.envelope.fall/1000.0;
		$(table).find('td')[7].innerHTML = audioObject.envelope.rest/1000.0;
	}
	$(table).find('td')[9].innerHTML = level.toFixed(2);
	$(table).find('input:last')[0].value = level.toFixed(2);
	// var readout = $('.readout')[id];
	// readout.innerHTML = readoutTemplate(audioObjects[id],level);
}

function readoutTemplate(title,envelope,level){
	return "<table>" +
				 "<tr><td>Track Title: </td><td>" + title + "</td></tr>" +
				 "<tr><td>Rise Time: </td><td>" + envelope.rise/1000.0 + "</td></tr>" +
				 "<tr><td>Sustain: </td><td>" + envelope.sustain/1000.0 + "</td></tr>" +
				 "<tr><td>Fall: </td><td>" + envelope.fall/1000.0 + "</td></tr>" +
				 "<tr><td>Rest: </td><td>" + envelope.rest/1000.0 + "</td></tr>" +
				 "<tr><td>Amplitude Level: </td><td>" + level.toFixed(2) + "</td></tr>" +
				 "<td><input type='range' min='0' max='1' step='0.01' value='" + level.toFixed(2) + "'/></td>"
				 "</table>";
}

function prototypingTemplate(title,envelope,level){
	return "<div class='track-title'>" + title + '</div>' +
				 "<table>" +
				 "<tr><td>Rise Time: </td><td>" + "<input type='text' name='rise' value='" + envelope.rise/1000.0 + "'>" + "</td></tr>" +
				 "<tr><td>Sustain: </td><td>" + "<input type='text' name='sustain' value='" + envelope.sustain/1000.0 + "'>" + "</td></tr>" +
				 "<tr><td>Fall: </td><td>" + "<input type='text' name='fall' value='" + envelope.fall/1000.0 + "'>" + "</td></tr>" +
				 "<tr><td>Rest: </td><td>" + "<input type='text' name='rest' value='" + envelope.rest/1000.0 + "'>" + "</td></tr>" +
				 "<tr><td>Amplitude Level: </td><td>" + level.toFixed(2) + "</td></tr>" +
				 "<tr>" +
				 "<td><input type='range' min='0' max='1' step='0.01' value='" + level.toFixed(2) + "'/></td>" +
				 "<td><button value='mute'>Mute</button></td>" +
				 "</tr>"
				 "</table>";
}

$(function(){
	$(document).on('click','button',function(){
		var id = $(this).parents(".readout").data('id');
		// debugger;
		audioObjects[id].envelope.mute = !audioObjects[id].envelope.mute;
		if (this.textContent == "Mute") { this.textContent = "Unmute"; }
		else 														{ this.textContent = "Mute"; }
	});

	$(document).on('change', ':text', function(){
		var id = $(this).parents(".readout").data('id');
		t0 = Date.now();
		// audioObjects[id].envelope.setAttributes();
	})
});
