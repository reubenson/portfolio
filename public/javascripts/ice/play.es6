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

var score = {
  'I': [5,5,5],
  'II': [10,1,10],
  'III': [8,8,8],
  'IV': [4,20,14],
  'V': [5,1,5],
  'Todmorden, UK': [15,35,15],
  'Cumiana, NW Italy': [10,40,10],
  'Sebring, Florida': [18,8,28],
  'Hawley, Texas': [41,20,14],
  'Sheffield, UK': [20,20,20]
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