try {
  var ctx = new (window.AudioContext || window.webkitAudioContext)();
}
catch(e) {
  alert('Web Audio API is not supported in this browser');
}

window.onload = init;
var ctx = new (window.AudioContext || window.webkitAudioContext)();
var t0 = Date.now();
var audioObjects = [];

window.setInterval(updateAudioObjects, 100);
// random range on each parameter
// randomize instrumental sources
var score = {
  'barrage 1': {
    amplitude: 0.2,
    fadeIn: [5,10],
    sustain: [10,20],
    fadeOut: [5,10],
    rest: [0,20],
    durationOff: [500,600],
    durationOn: [300,400]
  },
  'barrage 2': {
    amplitude: 1.0,
    fadeIn: [5,10],
    sustain: [10,20],
    fadeOut: [5,10],
    rest: [0,20],
    durationOff: [500,600],
    durationOn: [300,400]
  },
  'alberta vlf': {
    amplitude: 1.0,
    fadeIn: [5,10],
    sustain: [10,20],
    fadeOut: [5,10],
    rest: [0,20],
    durationOff: [500,600],
    durationOn: [300,400]
  },
  'alberta vlf 2': {
    amplitude: 1.0,
    fadeIn: [5,10],
    sustain: [10,20],
    fadeOut: [5,10],
    rest: [0,20],
    durationOff: [500,600],
    durationOn: [300,400]
  },
  'alberta vlf 3': {
    amplitude: 1.0,
    fadeIn: [5,10],
    sustain: [10,20],
    fadeOut: [5,10],
    rest: [0,20],
    durationOff: [500,600],
    durationOn: [300,400]
  },
  'hawley texas': {
    amplitude: 1.0,
    fadeIn: [5,10],
    sustain: [10,20],
    fadeOut: [5,10],
    rest: [0,20],
    durationOff: [500,600],
    durationOn: [300,400]
  },
  'violin x': [5,15,10],
  'sheet metal': {
    amplitude: 1.0,
    fadeIn: [5,10],
    sustain: [10,20],
    fadeOut: [5,10],
    rest: [0,20],
    durationOff: [500,600],
    durationOn: [300,400]
  },
  'cumiana italy': {
    amplitude: 1.0,
    fadeIn: [5,10],
    sustain: [10,20],
    fadeOut: [5,10],
    rest: [0,20],
    durationOff: [500,600],
    durationOn: [300,400]
  },
  'violin': {
    amplitude: 1.0,
    fadeIn: [5,10],
    sustain: [10,20],
    fadeOut: [5,10],
    rest: [20,300],
    durationOff: [500,600],
    durationOn: [300,400]
  }
}

function init() {
  var audioElements = $('audio')
  for (var i=0; i<audioElements.length; i++) {
    audioObjects.push( new AudioObject(ctx,audioElements[i]) );
  }
}

function updateAudioObjects() {
// console.log((Date.now()-t0)/1000.0);
  audioObjects.forEach(function(element){
    element.updateGain();
  });
}

function elapsedTime(){
  return Date.now() - t0;
}
