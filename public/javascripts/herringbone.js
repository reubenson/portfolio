var direction = 1;
var max_offset = 60;
var counter = -30;
var margin = -5;
var fill_screen = true;
var animate = true;
var col_width = 100;
var v_spacing = 20;
var ctx;


$(function(){
  drawHerringbone();
  animate = false;
  $(window).click(function(){
    if (event.srcElement == $('body')[0]) {
      animate = !animate
    }
  })
  window.setInterval(drawHerringbone,50);
})

function drawHerringbone() {
  if (!animate) { return }
  var canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = $(window).width();
  canvas.height = $(window).height();
  var height = $('canvas').height()-margin*2;
  var width = $('canvas').width()-margin*2;
  ctx.clearRect(0,0,width,height);

  var n_columns = Math.round(width/col_width);
  col_width = width/n_columns;

  var offset = counter;

  for (var i = 0; i < n_columns+1; i++) {
    drawHerringboneSpine(i,height,width,offset);

    if (i == n_columns) {break;}

    drawHerringboneRibs(i,height,width,offset);

  }
  counter += direction;
  if (counter == max_offset) { direction *= -1 }
  else if (counter == -max_offset) {direction *= -1 }
}

function draw_line(ctx,start,end) {
  ctx.beginPath();
  ctx.moveTo(start.x,start.y);
  ctx.lineTo(end.x,end.y);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#c6c6c6";
  ctx.stroke();
}

function drawHerringboneSpine(i,height,width,offset){
  var x_pos = margin+i*col_width;
  var y_start = margin-max_offset;
  var y_end = margin+height+max_offset-v_spacing+3;

  if (!fill_screen) {
    if (i%2) { y_start = margin+max_offset-offset; }
    else     { y_start = margin+max_offset+offset; }
    y_end = y_start + height - max_offset*2 - v_spacing - margin + 3;
  }

  draw_line(ctx , {x:x_pos,y:y_start} , {x:x_pos,y:y_end});
}

function drawHerringboneRibs(i,height,width,offset){
  var x_range = fill_screen ? [margin-max_offset , height+max_offset] : [margin+max_offset , height-max_offset];

  for (var j = x_range[0]; j < x_range[1]; j+=v_spacing) {
    var x_start  = margin + i*col_width;
    var x_end    = margin + (i+1)*col_width;
    var y_top    = j + offset;
    var y_bottom = j - offset;

    if (i%2){ draw_line(ctx , {x:x_start,y:y_bottom} , {x:x_end,y:y_top}); }
    else {    draw_line(ctx , {x:x_start,y:y_top} , {x:x_end,y:y_bottom}); }
  }
}
