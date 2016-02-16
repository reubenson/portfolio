"use-strict";
var ctx;

$(function(){
  if ($('canvas').length == 0) { return }
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = $(window).width();
  canvas.height = $(window).height();
  $(canvas).css('width',canvas.width);
  $(canvas).css('height', canvas.height);

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
  this.blockMode = false;
  this.lastPaused = 0.0;
  this.lastPlayed = 0.0;
  this.max_offset = 20;
  this.frequency = 0.5;
  this.margin = 0;
  this.height = $('canvas').height()-this.margin*2;
  this.width = $('canvas').width()-this.margin*2;
  this.fill_screen = true;
  this.n_columns = Math.round(this.width/randomNum(50,70));
  this.col_width = this.width/this.n_columns;
  if (this.blockMode) { this.col_width *= 0.98/Math.sin(Math.PI/4.0); }
  this.n_rows = Math.round(this.height/randomNum(10,20));
  this.v_spacing = this.height/this.n_rows;
  if (this.blockMode) { this.v_spacing *= Math.sin(Math.PI/4.0); }

  this.cells =[];
  for (var i = 0; i < this.n_columns ; i++) {
    for (var j = 0; j < this.n_rows ; j++) {
      this.cells.push( new Cell(i,j,this.col_width,this.v_spacing, "white"));
    }
  }

  function randomNum(min,max){
    return Math.round((Math.random() * (max-min)) + min);
  };
};

Herringbone.prototype.sine = function(phase) {
  phase = phase || 0;
  var time = new Date().getTime() - (this.lastPlayed - this.lastPaused);
  return this.max_offset*Math.sin(this.frequency*time/1000.0 + phase);
}

Herringbone.prototype.draw = function(){
  if (!this.animate) { return }
  ctx.clearRect(0,0,this.width,this.height);

  for (var i = 0; i < this.cells.length; i++) {
    if (this.blockMode) { this.cells[i].drawTile(this.sine()); }
    else                { this.cells[i].draw(this.sine()); }
  }
}

function Cell(x,y,width,height,color) {
  this.x = x;
  this.y = y;
  this.center = {};
  this.center.x = x * width + width/2;
  this.center.y = y * height + height/2;
  this.tl = [x * width, y * height];         // top-left
  this.tr = [(x+1) * width, y * height];     // top-right
  this.br = [(x+1) * width, (y+1) * height]; // bottom-right
  this.bl = [x * width, (y+1) * height];     // bottom-left
  this.tl_0 = [this.tl[0] - this.center.x , this.tl[1] - this.center.y];
  this.tr_0 = [this.tr[0] - this.center.x , this.tr[1] - this.center.y];
  this.br_0 = [this.br[0] - this.center.x , this.br[1] - this.center.y];
  this.bl_0 = [this.bl[0] - this.center.x , this.bl[1] - this.center.y];
  this.width = width;
  this.height = height;
  this.lineWidth = 2;
  this.color = color;
};

Cell.prototype.draw = function(offset) {
  var left_offset = (this.x%2)==0 ? offset : -offset;
  var right_offset = -left_offset;
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.moveTo(this.tl[0],this.tl[1] + left_offset);
  ctx.lineTo(this.tr[0],this.tr[1] + right_offset);
  ctx.lineTo(this.br[0],this.br[1] + right_offset);
  ctx.lineTo(this.bl[0],this.bl[1] + left_offset);
  ctx.strokeStyle = this.color;
  ctx.stroke();
  if ((this.y+this.x)%2) {
    ctx.fillStyle = this.color;
    // ctx.fill();
  }
};

Cell.prototype.drawTile = function() {
  var angle = Math.PI*0.25;
  var x_offset = 0;
  var y_offset = 0;
  if (this.x%2) {
    angle = -angle;
    // x_offset = -this.width*(1-Math.sin(angle));
    y_offset = -this.height*Math.sin(angle);
  }
  x_offset -= this.width*(1-Math.sin(Math.abs(angle)))*this.x;
  y_offset += this.height*(1-Math.sin(Math.abs(angle)))*this.y +this.y*this.lineWidth;
  var sin = Math.sin(angle);
  var cos = Math.cos(angle);
  ctx.beginPath();
  ctx.lineWidth = this.lineWidth;
  ctx.strokeStyle = this.color;

  ctx.moveTo(this.center.x + x_offset + this.tl_0[0]*cos - this.tl_0[1]*sin , this.center.y + y_offset + this.tl_0[0]*sin + this.tl_0[1]*cos);
  ctx.lineTo(this.center.x + x_offset + this.tr_0[0]*cos - this.tr_0[1]*sin , this.center.y + y_offset + this.tr_0[0]*sin + this.tr_0[1]*cos);
  ctx.lineTo(this.center.x + x_offset + this.br_0[0]*cos - this.br_0[1]*sin , this.center.y + y_offset + this.br_0[0]*sin + this.br_0[1]*cos);
  ctx.lineTo(this.center.x + x_offset + this.bl_0[0]*cos - this.bl_0[1]*sin , this.center.y + y_offset + this.bl_0[0]*sin + this.bl_0[1]*cos);
  ctx.lineTo(this.center.x + x_offset + this.tl_0[0]*cos - this.tl_0[1]*sin , this.center.y + y_offset + this.tl_0[0]*sin + this.tl_0[1]*cos);
  ctx.stroke();

  if ((this.y+this.x)%2) {
    ctx.fillStyle = this.color;
    // ctx.fill();
  }
};
