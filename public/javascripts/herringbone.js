"use-strict";

$(function(){
  // if ($('svg').length == 0) { return }
  var svgs = document.querySelectorAll("svg");
  for (var i = 0; i < svgs.length; i++) {
    initializeSVG(svgs[i]);
  }

  function initializeSVG(svg) {
    svg.setAttribute('width', $(window).width());
    svg.setAttribute('height', $(window).height());

    var herringbone = new Herringbone(svg);
    herringbone.update();

    if (svg.getAttribute("data-mode") != "text") {
      herringbone.animate = false;
    }
    herringbone.animate = false;

    $(window).on('click touchend',function(event){
      if (event.target.parentNode == $('svg')[0] || event.target == $('body')[0] || event.target == $('#play')[0]) {
        herringbone.switch();
        if (event.target.id  == 'play') { $(play).css('opacity',0); }
      }
    });

    var framerate = (svg.getAttribute("data-mode") == "conway") ? 2000 : 60;
    window.setInterval(function(){
      herringbone.update();
    },framerate);
  }
});

function Herringbone(svg){
  this.initialize(svg);
  this.addCells(svg);
};

Herringbone.prototype.initialize = function(svg) {
  Herringbone.instances = Herringbone.instances || [];
  this.svg = svg;
  this.timer = new Timer();
  this.animate = true;
  this.blockMode = false;
  this.textOrientation = "vertical";
  this.mode = this.svg.getAttribute("data-mode");
  switch (this.mode) {
    case "conway":
      this.blockMode = false;
      this.fillColor = "white";
      this.strokeColor = "black";
      break;
    case "text":
      this.blockMode = false;
      this.fillColor = "transparent";
      this.strokeColor = "transparent";
      break;
    case "background":
      this.blockMode = false;
      this.fillColor = "transparent";
      this.strokeColor = "black";
      break;
  }
  this.max_offset = 20;
  this.frequency = 0.5;
  if (this.svg.getAttribute("data-fullscreen") == "true") {
    this.margin = -this.max_offset;
  }
  else { this.margin = 2*this.max_offset; }
  this.height = this.svg.clientHeight-this.margin*2;
  this.width = this.svg.clientWidth-this.margin*2;

  this.setColumnWidthAndNumber(20);
  this.setRowHeightAndNumber(10);
  if (this.mode == "text") {
    resizeSVG(this);
  }

  this.id = Herringbone.instances.length
  Herringbone.instances.push(this);
};

Herringbone.prototype.setColumnWidthAndNumber = function(cell_width){
  if (this.mode == "text") {
    this.cell_width = 25;
    if (this.textOrientation == 'horizontal') {
      this.n_columns = 6 * text.length - 1;
    } else if (this.textOrientation == 'vertical') {
      var text = this.svg.getAttribute("data-text");
      this.n_columns = text.split(" ").length*5 + 1
    }
  } else {
    cell_width = cell_width || randomNum(30,50);
    this.n_columns = Math.round(this.width/cell_width);
    this.cell_width = this.width/this.n_columns;
    if (this.blockMode) {
      this.n_columns *= 1.0/Math.sin(Math.PI/4.0);
      this.n_columns = Math.round(this.n_columns);
      this.cell_width = this.width/(this.n_columns+0.5) * 1.0/Math.sin(Math.PI/4.0);
    }
  }
}

Herringbone.prototype.setRowHeightAndNumber = function(cell_height){
  if (this.mode == "text") {
    this.cell_height = 15;
    if (this.textOrientation == 'horizontal') {
      this.n_rows = 5;
    } else if (this.textOrientation == 'vertical') {
      var text = this.svg.getAttribute("data-text");
      var words = text.split(" ");
      var length = _.reduce(words,function(result,word){
        return result > word.length ? result : word.length
      },0)
      this.n_rows = length * 6 - 1;
    }
  } else {
    cell_height = cell_height || this.cell_width * randomNum(50,100) / 200;
    this.n_rows = Math.round( (this.height - this.cell_width*0) / cell_height );
    this.cell_height = (this.height + 2*this.max_offset - this.cell_width) / (this.n_rows-1*0);
    if (this.blockMode) {
      this.n_rows *= Math.sin(Math.PI/4.0);
      this.n_rows = Math.round(this.n_rows);
      this.cell_height = (this.height - this.cell_height) / (this.n_rows * 1.0/Math.sin(Math.PI/4.0) + 2);
    }
  }
}

Herringbone.prototype.addCells = function() {
  this.cells = [];
  var scaleWidth = (Math.random()+1)/1.0;
  var scaleHeight = (Math.random()+1)/1.0;

  for (var i = 0; i < this.n_columns ; i++) {
    for (var j = 0; j < this.n_rows ; j++) {
      this.cells.push( new Cell({
        x: i,
        y: j,
        strokeColor: this.strokeColor,
        fillColor: this.fillColor,
        mode: this.mode,
        svg: this.svg,
        herringbone: this,
        xScale: scaleWidth,
        yScale: scaleHeight,
        textOrientation: this.textOrientation
      }));
    }
  }
}

Herringbone.prototype.switch = function() {
  if (this.animate) { this.pause() }
  else              { this.resume() }
}

Herringbone.prototype.pause = function() {
  this.timer.pause();
  this.animate = false;
}

Herringbone.prototype.resume = function() {
  this.timer.resume();
  this.animate = true;
}

Herringbone.prototype.sine = function(phase) {
  phase = phase || 0;
  var time = this.timer.now();
  return this.max_offset*Math.sin(this.frequency*time/1000.0 + phase);
}

Herringbone.prototype.update = function(){
  if (!this.animate) { return }
  for (var i = 0; i < this.cells.length; i++) {
    if (this.blockMode) { this.cells[i].drawTile(this.sine()); }
    else                { this.cells[i].draw(this.sine()); }
  }
};

function Cell(args) {
  this.herringbone_id = args["herringbone"].id;
  this.mode = args["herringbone"].mode;
  Cell.textOrientation = args["herringbone"].textOrientation;
  Cell.animationAttr = 'fill';
  var strokeColor = args["strokeColor"];
  var fillColor = args["fillColor"];
  var svg = args["svg"];
  var width = args["herringbone"].cell_width;
  var height = args["herringbone"].cell_height;
  var margin = args["herringbone"].margin;
  this.x = args["x"];
  this.y = args["y"];
  this.center = [ this.x * width + width/2 + margin , this.y * height + height/2 + margin ];

  var xScale = args["xScale"];
  var yScale = args["yScale"];
  xScale = 1;
  yScale = 1;

  this.tl = [this.center[0] - xScale*width/2 , this.center[1] - yScale*height/2];  // top-left
  this.tr = [this.center[0] + xScale*width/2 , this.center[1] - yScale*height/2];  // top-right
  this.br = [this.center[0] + xScale*width/2 , this.center[1] + yScale*height/2];  // bottom-right
  this.bl = [this.center[0] - xScale*width/2 , this.center[1] + yScale*height/2];  // bottom-left
  this.tl_0 = [this.tl[0] - this.center[0] , this.tl[1] - this.center[1]];
  this.tr_0 = [this.tr[0] - this.center[0] , this.tr[1] - this.center[1]];
  this.br_0 = [this.br[0] - this.center[0] , this.br[1] - this.center[1]];
  this.bl_0 = [this.bl[0] - this.center[0] , this.bl[1] - this.center[1]];
  this.lineWidth = 2;

  var points = [this.tl,this.tr,this.br,this.bl].join();
  this.svg_el = makeSVG('polygon', {points: points, stroke: strokeColor, 'stroke-width': this.lineWidth, 'fill': fillColor, 'fill-opacity': '1.0'});
  if (this.mode == "conway") {
    if (Math.random() <= 0.5) { this.svg_el.setAttribute(Cell.animationAttr,'black'); }
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
  var herringbone = Herringbone.instances[this.herringbone_id];
  var width = herringbone.cell_width ;
  var height = herringbone.cell_height ;
  var angle = Math.PI*0.25;
  var x_offset = 0;
  var y_offset = 0;
  if (this.x%2) {
    angle = -angle;
    y_offset = -height*Math.sin(angle);
  }
  x_offset -= width*(1-Math.sin(Math.abs(angle)))*this.x;
  y_offset += height*(1-Math.sin(Math.abs(angle)))*this.y +this.y*this.lineWidth;
  var sin = Math.sin(angle);
  var cos = Math.cos(angle);

  var points = new Array(8);
  points[0] = this.center[0] + x_offset + this.tl_0[0]*cos - this.tl_0[1]*sin;
  points[1] = this.center[1] + y_offset + this.tl_0[0]*sin + this.tl_0[1]*cos;
  points[2] = this.center[0] + x_offset + this.tr_0[0]*cos - this.tr_0[1]*sin;
  points[3] = this.center[1] + y_offset + this.tr_0[0]*sin + this.tr_0[1]*cos;
  points[4] = this.center[0] + x_offset + this.br_0[0]*cos - this.br_0[1]*sin;
  points[5] = this.center[1] + y_offset + this.br_0[0]*sin + this.br_0[1]*cos;
  points[6] = this.center[0] + x_offset + this.bl_0[0]*cos - this.bl_0[1]*sin;
  points[7] = this.center[1] + y_offset + this.bl_0[0]*sin + this.bl_0[1]*cos;
  this.svg_el.setAttribute('points',points);

  this.updateFill();
};

Cell.prototype.updateFill = function() {
  if (this.mode == "conway") {
    if (this.adjacent()) { this.svg_el.setAttribute(Cell.animationAttr,'black'); }
    else                 { this.svg_el.setAttribute(Cell.animationAttr,'transparent'); }
  } else if (this.mode == "text") {
    var coloredCells = this.getTypographyGrid();
    for (var i = 0; i < coloredCells.length; i++) {
      if (this.x == coloredCells[i][0] && this.y == coloredCells[i][1]) {
        this.svg_el.setAttribute('stroke','white');
        this.svg_el.setAttribute(Cell.animationAttr,'white');
        break;
      }
    }
  }
}

Cell.prototype.getTypographyGrid = function() {
  var words = $('svg')[0].getAttribute("data-text").split(" ");
  // for (var i = 0; i < words.length; i++) {
  //   words[i] = words[i].split("");
  // }
  // var text = $('svg')[0].getAttribute("data-text").split("");
  // var length = words.length;
  // var grid_size;
  // if (Cell.textOrientation == 'horizontal') {
  //   grid_size = [5 * length + length-1 , 5 ];
  // } else {
  //   grid_size = [5 , 5 * length + length-1];
  // }
  var grid = new Array();
  var gridWidth = 6 * words.length - 1;
  for (var i = 0; i < words.length; i++) {
    var letters = words[i].split("");
    for (var j = 0; j < letters.length; j++) {
      addToGrid(i,j);
    }
  }
  return grid;

  function addToGrid(i,j) {
    var squares = translateCharacter_5(letters[j].toLowerCase());
    for (var k = 0; k < squares.length; k++) {
      var loc;
      if (Cell.textOrientation == 'horizontal') {
        loc = [ (squares[k] % 5) + 6*j , Math.floor( squares[k] / 5 ) ];
      } else if (Cell.textOrientation == 'vertical') {

        loc = [ (6*i + squares[k]%5) , Math.floor( squares[k]/5) + 6*j ];
      }
      grid.push(loc);
    }
  }
}

Cell.prototype.adjacent = function() {
  var num = 0;
  var herringbone = Herringbone.instances[this.herringbone_id];
  if (herringbone.cells[index(this.x-1,this.y-1)].svg_el.getAttribute(Cell.animationAttr) != "transparent") { num++ }
  if (herringbone.cells[index(this.x,this.y-1)].svg_el.getAttribute(Cell.animationAttr) != "transparent") { num++ }
  if (herringbone.cells[index(this.x+1,this.y-1)].svg_el.getAttribute(Cell.animationAttr) != "transparent") { num++ }
  if (herringbone.cells[index(this.x-1,this.y)].svg_el.getAttribute(Cell.animationAttr) != "transparent") { num++ }
  if (herringbone.cells[index(this.x+1,this.y)].svg_el.getAttribute(Cell.animationAttr) != "transparent") { num++ }
  if (herringbone.cells[index(this.x-1,this.y+1)].svg_el.getAttribute(Cell.animationAttr) != "transparent") { num++ }
  if (herringbone.cells[index(this.x,this.y+1)].svg_el.getAttribute(Cell.animationAttr) != "transparent") { num++ }
  if (herringbone.cells[index(this.x+1,this.y+1)].svg_el.getAttribute(Cell.animationAttr) != "transparent") { num++ }

  var alive = herringbone.cells[index(this.x-1,this.y-1)].svg_el.getAttribute(Cell.animationAttr) != "transparent" ? true : false;
  if (alive) {
    if (num < 2 || num >3) { return false }
    else { return true }
  }
  else {
    if (num == 3) { return true }
    else { return false }
  }

  function index(x,y) {
    return (x + herringbone.n_columns)%herringbone.n_columns + (y + herringbone.n_rows)%herringbone.n_rows * herringbone.n_columns;
  }
}

function makeSVG(tag, attrs) {
     var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
     for (var k in attrs)
         el.setAttribute(k, attrs[k]);
     return el;
 }

function translateCharacter_3(char) {
// characters are drawn on a 3x5 grid
// adapted from http://lineto.com/1.0/content_82.html
  var table = {
    a: [0,1,2,3,5,6,7,8,9,11,12,14],
    b: [0,1,2,3,5,6,7,9,11,12,13,14],
    c: [0,1,2,3,6,9,12,13,14],
    d: [0,1,3,5,6,8,9,11,12,13],
    e: [0,1,2,3,6,7,9,12,13,14],
    f: [0,1,2,3,6,7,9,12],
    g: [0,1,2,3,6,8,9,11,12,13,14],
    h: [0,2,3,5,6,7,8,9,11,12,14],
    i: [0,1,2,4,7,10,12,13,14],
    j: [2,5,8,9,11,12,13,14],
    k: [0,2,3,5,6,7,9,11,12,14],
    l: [0,3,6,9,12,13,14],
    m: [0,2,3,4,5,6,7,8,9,11,12,14],
    n: [0,2,3,4,5,6,7,8,9,10,11,12,14],
    o: [0,1,2,3,5,6,8,9,11,12,13,14],
    p: [0,1,2,3,5,6,7,8,9,12],
    q: [1,3,5,6,8,9,10,13,14],
    r: [0,1,2,3,5,6,7,9,11,12,14],
    s: [0,1,2,3,6,7,8,11,12,13,14],
    t: [0,1,2,4,7,10,13],
    u: [0,2,3,5,6,8,9,11,12,13,14],
    v: [0,2,3,5,6,8,9,11,13],
    w: [0,2,3,5,6,7,8,9,10,11,12,14],
    y: [0,2,3,5,7,10,13],
    x: [0,2,3,5,7,9,11,12,14],
    z: [0,1,2,5,7,9,12,13,14],
    '0': [0,1,2,3,5,6,8,9,11,12,13,14],
    '1': [1,3,4,7,10,12,13,14],
    '2': [0,1,2,5,7,9,12,13,14],
    '3': [0,1,5,6,7,11,12,13],
    '4': [0,2,3,5,6,7,8,11,14],
    '5': [0,1,2,3,6,7,11,12,13],
    '6': [1,2,3,6,7,9,11,13],
    '7': [0,1,2,5,7,9,12],
    '8': [1,3,5,7,9,11,13],
    '9': [1,3,5,7,8,11,12,13],
    ' ': []
  }
  return table[char];
}

function translateCharacter_5(char) {
// characters are drawn on a 5x5 grid
// adapted from http://lineto.com/1.0/content_82.html
  var table = {
    'a': [1,2,3,5,9,10,11,12,13,14,15,19,20,24],
    'b': [0,1,2,3,5,9,10,11,12,13,15,19,20,21,22,23],
    'c': [1,2,3,5,9,10,15,19,21,22,23],
    'd': [0,1,2,3,5,9,10,14,15,19,20,21,22,23],
    'e': [0,1,2,3,4,5,10,11,12,13,15,20,21,22,23,24],
    'f': [0,1,2,3,4,5,10,11,12,13,15,20],
    'g': [1,2,3,4,5,10,12,13,14,15,19,21,22,23],
    'h': [0,4,5,9,10,11,12,13,14,15,19,20,24],
    'i': [0,1,2,3,4,7,12,17,20,21,22,23,24],
    'j': [2,3,4,9,14,15,19,21,22,23],
    'k': [0,4,5,8,10,11,12,15,18,20,24],
    'l': [0,5,10,15,20,21,22,23,24],
    'm': [0,4,5,6,8,9,10,12,14,15,17,19,20,24],
    'n': [0,4,5,6,9,10,12,14,15,18,19,20,24],
    'o': [1,2,3,5,9,10,14,15,19,21,22,23],
    'p': [0,1,2,3,5,9,10,14,15,16,17,18,20],
    'q': [1,2,3,5,9,10,12,14,15,18,21,22,24],
    'r': [0,1,2,3,5,9,10,11,12,13,15,18,20,24],
    's': [1,2,3,4,5,11,12,13,19,20,21,22,23],
    't': [0,1,2,3,4,7,12,17,22],
    'u': [0,4,5,9,10,14,15,19,21,22,23],
    'v': [0,4,5,9,10,14,16,18,22],
    'w': [0,4,5,7,9,10,12,14,15,17,19,21,23],
    'x': [0,4,6,8,12,16,18,20,24],
    'y': [0,4,5,9,11,12,13,17,22],
    'z': [0,1,2,3,4,8,12,16,20,21,22,23,24],
    '0': [1,2,3,5,8,9,10,12,14,15,16,19,21,22,23],
    '1': [2,6,7,10,12,17,20,21,22,23,24],
    '2': [1,2,3,5,9,12,13,16,20,21,22,23,24],
    '3': [0,1,2,3,9,11,12,13,19,20,21,22,23],
    '4': [0,3,5,8,11,12,13,14,18,23],
    '5': [0,1,2,3,4,5,10,11,12,13,19,20,21,22,23],
    '6': [1,2,3,4,5,10,11,12,13,15,19,21,22,23],
    '7': [0,1,2,3,4,8,12,16,20],
    '8': [1,2,3,5,9,11,12,13,15,19,21,22,23],
    '9': [1,2,3,5,9,11,12,13,14,19,20,21,22,23],
    ' ': []
  }
  return table[char];
}

function Timer() {
  this.lastPaused = new Date().getTime();
  this.lastPlayed = this.lastPaused;
}

Timer.prototype.pause = function(){
  this.lastPaused = new Date().getTime();
}

Timer.prototype.resume = function(){
  this.lastPlayed = new Date().getTime();
}

Timer.prototype.now = function(){
  return new Date().getTime() - (this.lastPlayed - this.lastPaused);
}

function randomNum(min,max){
  return Math.round((Math.random() * (max-min)) + min);
};

function resizeSVG(herringbone) {
  var svg = document.querySelector("svg");
  var width = 1.2 * herringbone.cell_width * herringbone.n_columns;
  var height = 1.2 * herringbone.cell_height * herringbone.n_rows;
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
}
