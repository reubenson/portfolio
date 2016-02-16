"use-strict";

$(function(){
  if ($('svg').length == 0) { return }
  var svg = document.querySelector("svg");
  svg.setAttribute('width', $(window).width());
  svg.setAttribute('height', $(window).height());

  var herringbone = new Herringbone(svg);
  herringbone.draw();
  herringbone.animate = false;
  herringbone.lastPaused = new Date().getTime();
  $(window).on('click touchend',function(event){
    if (event.target.parentNode == $('svg')[0] || event.target == $('body')[0] || event.target == $('#play')[0]) {
      herringbone.animate = !herringbone.animate;
      if (event.target.id  == 'play') { $(play).css('opacity',0); }
      if (herringbone.animate == false) { herringbone.lastPaused = new Date().getTime(); }
      else { herringbone.lastPlayed = new Date().getTime(); }
    }
  });

  var framerate = Boolean(svg.getAttribute("data-conway")) ? 2000 : 150;
  window.setInterval(function(){
    herringbone.draw();
  },framerate);
});

function Herringbone(svg){
  this.animate = true;
  this.blockMode = false;
  this.conway = Boolean(svg.getAttribute("data-conway"));
  if (this.conway) { this.blockMode = true }
  this.lastPaused = 0.0;
  this.lastPlayed = 0.0;
  this.max_offset = 20;
  this.frequency = 0.5;
  if (svg.getAttribute("data-fullscreen") == "true") {
    this.margin = -this.max_offset;
  }
  else { this.margin = 2*this.max_offset; }
  this.height = $('svg').height()-this.margin*2;
  this.width = $('svg').width()-this.margin*2;
  this.n_columns = Math.round(this.width/randomNum(60,90));
  this.cell_width = this.width/this.n_columns;
  if (this.blockMode) {
    this.n_columns *= 1.0/Math.sin(Math.PI/4.0);
    this.n_columns = Math.round(this.n_columns);
    this.cell_width = this.width/(this.n_columns+0.5) * 1.0/Math.sin(Math.PI/4.0);
  }
  this.n_rows = Math.round( (this.height - this.cell_width*0) / randomNum(15,30) );
  this.cell_height = (this.height + 2*this.max_offset - this.cell_width) / (this.n_rows-1*0);
  if (this.blockMode) {
    this.n_rows *= Math.sin(Math.PI/4.0);
    this.n_rows = Math.round(this.n_rows);
    this.cell_height = (this.height - this.cell_height) / (this.n_rows * 1.0/Math.sin(Math.PI/4.0) + 2);
  }

  this.cells =[];
  for (var i = 0; i < this.n_columns ; i++) {
    for (var j = 0; j < this.n_rows ; j++) {
      this.cells.push( new Cell(i,j, "white",svg,this) );
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
  for (var i = 0; i < this.cells.length; i++) {
    if (this.blockMode) { this.cells[i].drawTile(this.sine()); }
    else                { this.cells[i].draw(this.sine()); }
  }
};

function Cell(x,y,color,svg,herringbone) {
  this.herringbone = herringbone;
  var width = herringbone.cell_width;
  var height = herringbone.cell_height;
  var margin = herringbone.margin;
  this.x = x;
  this.y = y;
  this.center = {};
  this.center.x = x * width + width/2 + margin;
  this.center.y = y * height + height/2 + margin;
  this.tl = [this.center.x - width/2 , this.center.y - height/2];  // top-left
  this.tr = [this.center.x + width/2 , this.center.y - height/2];  // top-right
  this.br = [this.center.x + width/2 , this.center.y + height/2];  // bottom-right
  this.bl = [this.center.x - width/2 , this.center.y + height/2];  // bottom-left
  this.tl_0 = [this.tl[0] - this.center.x , this.tl[1] - this.center.y];
  this.tr_0 = [this.tr[0] - this.center.x , this.tr[1] - this.center.y];
  this.br_0 = [this.br[0] - this.center.x , this.br[1] - this.center.y];
  this.bl_0 = [this.bl[0] - this.center.x , this.bl[1] - this.center.y];
  this.width = width;
  this.height = height;
  this.lineWidth = 2;

  var points = [this.tl,this.tr,this.br,this.bl].join();
  this.svg_el = makeSVG('polygon', {points: points, stroke: color, 'stroke-width': '1', 'fill': 'transparent', 'fill-opacity': '1.0'});
  if (herringbone.conway) {
    if (Math.random() <= 0.5) { this.svg_el.setAttribute('fill','black'); }
  }
  svg.appendChild(this.svg_el);
};


Cell.prototype.draw = function(offset) {
  offset = (this.x%2)==0 ? offset : -offset;

  var points = this.svg_el.getAttribute('points').split(',');
  points[1] = this.tl[1] + offset;
  points[3] = this.tr[1] - offset;
  points[5] = this.br[1] - offset;
  points[7] = this.bl[1] + offset;
  this.svg_el.setAttribute('points',points);

  this.updateFill();
};

Cell.prototype.drawTile = function() {
  var angle = Math.PI*0.25;
  var x_offset = 0;
  var y_offset = 0;
  if (this.x%2) {
    angle = -angle;
    y_offset = -this.height*Math.sin(angle);
  }
  x_offset -= this.width*(1-Math.sin(Math.abs(angle)))*this.x;
  y_offset += this.height*(1-Math.sin(Math.abs(angle)))*this.y +this.y*this.lineWidth;
  var sin = Math.sin(angle);
  var cos = Math.cos(angle);

  var points = new Array(8);
  points[0] = this.center.x + x_offset + this.tl_0[0]*cos - this.tl_0[1]*sin;
  points[1] = this.center.y + y_offset + this.tl_0[0]*sin + this.tl_0[1]*cos;
  points[2] = this.center.x + x_offset + this.tr_0[0]*cos - this.tr_0[1]*sin;
  points[3] = this.center.y + y_offset + this.tr_0[0]*sin + this.tr_0[1]*cos;
  points[4] = this.center.x + x_offset + this.br_0[0]*cos - this.br_0[1]*sin;
  points[5] = this.center.y + y_offset + this.br_0[0]*sin + this.br_0[1]*cos;
  points[6] = this.center.x + x_offset + this.bl_0[0]*cos - this.bl_0[1]*sin;
  points[7] = this.center.y + y_offset + this.bl_0[0]*sin + this.bl_0[1]*cos;
  this.svg_el.setAttribute('points',points);

  this.updateFill();
};

Cell.prototype.updateFill = function() {
  if (this.adjacent()) { this.svg_el.setAttribute('fill','black'); }
  else                 { this.svg_el.setAttribute('fill','transparent'); }
}

Cell.prototype.adjacent = function() {
  var num = 0;
  var self = this.herringbone;
  if (this.herringbone.cells[index(this.x-1,this.y-1)].svg_el.getAttribute('fill') != "transparent") { num++ }
  if (this.herringbone.cells[index(this.x,this.y-1)].svg_el.getAttribute('fill') != "transparent") { num++ }
  if (this.herringbone.cells[index(this.x+1,this.y-1)].svg_el.getAttribute('fill') != "transparent") { num++ }
  if (this.herringbone.cells[index(this.x-1,this.y)].svg_el.getAttribute('fill') != "transparent") { num++ }
  if (this.herringbone.cells[index(this.x+1,this.y)].svg_el.getAttribute('fill') != "transparent") { num++ }
  if (this.herringbone.cells[index(this.x-1,this.y+1)].svg_el.getAttribute('fill') != "transparent") { num++ }
  if (this.herringbone.cells[index(this.x,this.y+1)].svg_el.getAttribute('fill') != "transparent") { num++ }
  if (this.herringbone.cells[index(this.x+1,this.y+1)].svg_el.getAttribute('fill') != "transparent") { num++ }

  var alive = this.herringbone.cells[index(this.x-1,this.y-1)].svg_el.getAttribute('fill') != "transparent" ? true : false;
  if (alive) {
    if (num < 2 || num >3) { return false }
    else { return true }
  }
  else {
    if (num == 3) { return true }
    else { return false }
  }

  function index(x,y) {
    return (x + self.n_columns)%self.n_columns + (y + self.n_rows)%self.n_rows * self.n_columns;
  }
}

function makeSVG(tag, attrs) {
     var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
     for (var k in attrs)
         el.setAttribute(k, attrs[k]);
     return el;
 }
