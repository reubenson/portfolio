"use-strict";
var ctx;

$(function(){
  if ($('canvas').length == 0) { return }
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = $(window).width();
  canvas.height = $(window).height();

  var herringbone = new Herringbone();
  herringbone.draw();
  herringbone.animate = false;
  herringbone.lastPaused = new Date().getTime();
  $(window).click(function(){
    if (event.srcElement == $('body')[0]) {
      herringbone.animate = !herringbone.animate;
      if (herringbone.animate == false) { herringbone.lastPaused = new Date().getTime(); }
      else { herringbone.lastPlayed = new Date().getTime(); }
    }
  });

  window.setInterval(function(){
    herringbone.draw();
  },50);
});

function Herringbone(){
  this.animate = true;
  this.lastPaused = 0.0;
  this.lastPlayed = 0.0;
  this.max_offset = 20;
  this.frequency = 0.5;
  this.margin = 0;
  this.height = $('canvas').height()-this.margin*2;
  this.width = $('canvas').width()-this.margin*2;
  this.fill_screen = true;
  this.n_columns = Math.round(this.width/randomNum(25,40));
  this.col_width = this.width/this.n_columns;
  this.v_spacing = randomNum(25,40);

  function randomNum(min,max){
    return Math.floor((Math.random() * (max-min)) + min);
  };
};

Herringbone.prototype.sine = function(phase) {
  phase = phase || 0;
  var time = new Date().getTime() - (this.lastPlayed - this.lastPaused);
  return this.max_offset*Math.sin(this.frequency*time/1000.0 + phase);
}

Herringbone.prototype.drawLine = function(start,end) {
  ctx.beginPath();
  ctx.moveTo(start.x,start.y);
  ctx.lineTo(end.x,end.y);
  // ctx.lineWidth = 1;
  // ctx.strokeStyle = "#c6c6c6";
  // ctx.strokeStyle = "black";
  ctx.stroke();
}

Herringbone.prototype.drawCurve = function(start,end,i) {
  ctx.beginPath();
  ctx.moveTo(start.x,start.y);
  var midpoint;
  var amp = 0.0;
  switch (i%4) {
    case 0:
      midpoint = {
        x: (start.x) ,
        y: (start.y + end.y)/2.0 + amp*this.sine()
      }; break;
    case 1:
      midpoint = {
       x: (end.x) ,
       y: (start.y + end.y)/2.0 + amp*this.sine()
       }; break;
    case 2:
      midpoint = {
       x: (end.x) ,
       y: (start.y + end.y)/2.0 + amp*this.sine()
      }; break;
    case 3:
      midpoint = {
      x: (start.x) ,
      y: (start.y + end.y)/2.0 + amp*this.sine()
    }; break;
  }
  var x = [start.x,end.x];
  var y = [start.y,end.y];

  midpoint = {
    x: x[Math.round(Math.random()*10)%2],
    y: (start.y + end.y)/2.0
  }

  // if (Math.floor(i/2)%2==0) {
  //   midpoint = {
  //     x: (start.x) ,
  //     y: (end.y + end.y)/2.0 + amp*this.sine()
  //   };
  // } else {
  //   midpoint = {
  //     x: (end.x) ,
  //     y: (start.y + start.y)/2.0 + amp*this.sine()
  //   };
  // }
  ctx.quadraticCurveTo(midpoint.x,midpoint.y ,end.x,end.y);
  ctx.lineWidth = 1;
  // ctx.strokeStyle = "#c6c6c6";
  ctx.strokeStyle = "black";
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.stroke();
}

Herringbone.prototype.draw = function(){
  if (!this.animate) { return }
  ctx.clearRect(0,0,this.width,this.height);

  for (var i = 0; i < this.n_columns; i++) {
    this.drawHerringboneSpine(i);
    this.drawHerringboneRibs(i);
  }
  this.drawHerringboneSpine(i);
}

Herringbone.prototype.drawHerringboneSpine = function(i){
  var x_pos = this.margin+i*this.col_width;
  var y_start = this.margin-this.max_offset;
  var y_end = this.margin+this.height+this.max_offset-this.v_spacing+3;

  if (!this.fill_screen) {
    if (i%2) { y_start = this.margin+this.max_offset-this.sine(); }
    else     { y_start = this.margin+this.max_offset+this.sine(); }
    y_end = y_start + this.height - this.max_offset*2 - this.v_spacing - this.margin + 3;
  }

  this.drawLine({x:x_pos,y:y_start} , {x:x_pos,y:y_end});
}

Herringbone.prototype.drawHerringboneRibs = function(i){
  var x_range = this.fill_screen ? [this.margin-this.max_offset , this.height+this.max_offset] : [this.margin+this.max_offset , this.height-this.max_offset];

  for (var j = x_range[0]; j < x_range[1]; j+=this.v_spacing) {
    var x_start  = this.margin + i*this.col_width;
    var x_end    = this.margin + (i+1)*this.col_width;
    var y_top    = j + this.sine();
    var y_bottom = j - this.sine();

    if (i%2) { this.drawLine({x:x_start,y:y_bottom} , {x:x_end,y:y_top} , i); }
    else     { this.drawLine({x:x_start,y:y_top} , {x:x_end,y:y_bottom} , i); }
  }
}
