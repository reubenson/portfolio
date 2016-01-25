var direction = 1;
var max_offset = 60;
var counter = -30;
var margin = 0;
var fill_screen = true;
var animate = true;


$(function(){
  // $('body').css('margin',0);
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
  var ctx = canvas.getContext("2d");
  canvas.width = $(window).width();
  canvas.height = $(window).height();
  var height = $('canvas').height()-margin*2;
  var width = $('canvas').width()-margin*2;
  ctx.clearRect(0,0,width,height);

  var n_columns = 20;
  var col_width = width/n_columns;
  var offset = counter;
  var v_spacing = 20;

  for (var i = 0; i < n_columns+1; i++) {
    if (i%2) {
      draw_line(ctx , {x:margin+i*col_width,y:margin-max_offset} , {x:margin+i*col_width,y:margin+height+max_offset-v_spacing+3});
    } else {
      draw_line(ctx , {x:margin+i*col_width,y:margin-max_offset} , {x:margin+i*col_width,y:margin+height+max_offset-v_spacing+3});
    }

    if (i == n_columns) {break;}

    for (var j = margin-max_offset; j < height+max_offset; j+=v_spacing) {
      if (i%2){
        draw_line(ctx , {x:margin+i*col_width,y:j-offset} , {x:margin+(i+1)*col_width,y:j+offset});
      } else {
        draw_line(ctx , {x:margin+i*col_width,y:j+offset} , {x:margin+(i+1)*col_width,y:j-offset});
      }
    }
  }
  counter += direction;
  if (counter == max_offset) { direction *= -1 }
  else if (counter == -max_offset) {direction *= -1 }
}

function draw() {
  var canvas = document.querySelector("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = $(window).width()-20;
  canvas.height = $(window).height()-20;
  var height = $('canvas').height()-margin*2;
  var width = $('canvas').width()-margin*2;
  ctx.clearRect(0,0,width,height);

  var n_columns = 18;
  var col_width = width/n_columns;
  var offset = counter;
  var v_spacing = 10;

  for (var i = 0; i < n_columns+1; i++) {
    if (i%2) {
      draw_line(ctx , {x:margin+i*col_width,y:margin+max_offset-offset} , {x:margin+i*col_width,y:margin+height-max_offset-offset-v_spacing+3});
    } else {
      draw_line(ctx , {x:margin+i*col_width,y:margin+max_offset+offset} , {x:margin+i*col_width,y:margin+height-max_offset+offset-v_spacing+3});
    }

    if (i == n_columns) {break;}

    for (var j = max_offset+margin; j < height-max_offset; j+=v_spacing) {
      if (i%2){
        draw_line(ctx , {x:margin+i*col_width,y:j-offset} , {x:margin+(i+1)*col_width,y:j+offset});
      } else {
        draw_line(ctx , {x:margin+i*col_width,y:j+offset} , {x:margin+(i+1)*col_width,y:j-offset});
      }
    }
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
  ctx.stroke();
}
