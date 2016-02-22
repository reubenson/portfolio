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
    fadeIn: [5,10],
    sustain: [10,20],
    fadeOut: [5,10],
    rest: [20,300],
    durationOff: [500,600],
    durationOn: [300,400]
  },
  'barrage 2': {
    fadeIn: [5,10],
    sustain: [10,20],
    fadeOut: [5,10],
    rest: [20,300],
    durationOff: [500,600],
    durationOn: [300,400]
  },
  'alberta vlf': {
    fadeIn: [5,10],
    sustain: [10,20],
    fadeOut: [5,10],
    rest: [20,300],
    durationOff: [500,600],
    durationOn: [300,400]
  },
  'alberta vlf 2': {
    fadeIn: [5,10],
    sustain: [10,20],
    fadeOut: [5,10],
    rest: [20,300],
    durationOff: [500,600],
    durationOn: [300,400]
  },
  'alberta vlf 3': {
    fadeIn: [5,10],
    sustain: [10,20],
    fadeOut: [5,10],
    rest: [20,300],
    durationOff: [500,600],
    durationOn: [300,400]
  },
  'violin x': [5,15,10],
  'sheet metal': {
    fadeIn: [5,10],
    sustain: [10,20],
    fadeOut: [5,10],
    rest: [20,300],
    durationOff: [500,600],
    durationOn: [300,400]
  },
  'Todmorden, UK': [15,35,15],
  'Cumiana, NW Italy': [10,40,10],
  'Sebring, Florida': [18,8,28],
  'Hawley, Texas': [41,20,14],
  'Sheffield, UK': [20,20,20],
  'violin': {
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
