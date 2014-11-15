var canvasSize = 100;
var canvasMidpoint = canvasSize/2;
var gearRadius = 0.85*canvasSize/2;
var lineWidth = 0.05*canvasSize;

var sAngles = [Math.PI, 3*Math.PI/2, Math.PI/2, 0];
var eAngles = [3*Math.PI/2, 0, Math.PI, Math.PI/2];

var cardinalOffsets = [{x:0,y:-gearRadius}, {x:gearRadius,y:0}, {x:0,y:gearRadius}, {x:-gearRadius,y:0}];

var ordinalOffsets = [
    {x:-gearRadius*Math.cos(Math.PI/4), y:-gearRadius*Math.sin(Math.PI/4)},
    {x:-gearRadius*Math.cos(3*Math.PI/4), y:-gearRadius*Math.sin(3*Math.PI/4)},
    {x:-gearRadius*Math.cos(5*Math.PI/4), y:-gearRadius*Math.sin(5*Math.PI/4)},
    {x:-gearRadius*Math.cos(7*Math.PI/4), y:-gearRadius*Math.sin(7*Math.PI/4)}
];

var teethRadius = gearRadius + lineWidth;
var n = teethRadius,
    alpha = 2*Math.PI / n,
    teethPoints = [],
    i = 0;
while(i<=n) {
    var theta = alpha * i,
        theta2 = alpha * (i+1);

    teethPoints.push({
        x: (Math.cos(theta) * teethRadius) + canvasMidpoint,
        y: (Math.sin(theta) * teethRadius) + canvasMidpoint,
        ex: (Math.cos(theta2) * teethRadius) + canvasMidpoint,
        ey: (Math.sin(theta2) * teethRadius) + canvasMidpoint
    });
    i += 2;
}

function handleInput(input) {
    var instructions = [];
    for(var i in input) {
        instructions.push(gearMapper[input[i]]);
    }
    instructions = instructions.filter(Boolean);

    var jqGears = $("#gears");
    jqGears.html('');
    for(var i in instructions) {
        var id_canvas = 'canvas_'+i;
        jqGears.append('<canvas class="gear_canvas" id="'+id_canvas+'" height="'+canvasSize+'" width="'+canvasSize+'">');
        gearBuilder(id_canvas, instructions[i]);
    }

    console.log(instructions);
}

function gearBuilder(id, instructions) {
    var c = document.getElementById(id);
    var ctx = c.getContext("2d");
    ctx.lineWidth = lineWidth;

    drawTeeth(ctx);
    drawOutline(ctx);
    drawArc(ctx, instructions.arc);
    drawCardinal(ctx, instructions.cardinal);
    drawOrdinal(ctx, instructions.ordinal);
}

function drawOutline(ctx) {
    ctx.strokeStyle='#ddd';
    ctx.beginPath();
    // context.arc(x,y,r,sAngle,eAngle,counterclockwise);
    ctx.arc(canvasMidpoint, canvasMidpoint, gearRadius, 0, 2*Math.PI);
    ctx.stroke();
    ctx.strokeStyle='black';
}

function drawTeeth(ctx) {
    ctx.strokeStyle='#ddd';
    ctx.beginPath();
    for(var i in teethPoints){
        ctx.moveTo(teethPoints[i].x, teethPoints[i].y);
        ctx.lineTo(teethPoints[i].ex, teethPoints[i].ey);
        ctx.stroke();
    }
    ctx.strokeStyle='black';
}

function drawArc(ctx, instructions) {
    for(var i in instructions) {
        if(instructions[i]==1) {
            ctx.beginPath();
            ctx.arc(canvasMidpoint, canvasMidpoint, gearRadius, sAngles[i], eAngles[i]);
            ctx.stroke();
        }
    }
}
function drawCardinal(ctx, instructions) {
    for(var i in instructions) {
        if(instructions[i]==1) {
            ctx.beginPath();
            ctx.moveTo(canvasMidpoint, canvasMidpoint);
            ctx.lineTo(canvasMidpoint+cardinalOffsets[i].x, canvasMidpoint+cardinalOffsets[i].y);
            ctx.stroke();
        }
    }
}
function drawOrdinal(ctx, instructions) {
    for(var i in instructions) {
        if(instructions[i]==1) {
            ctx.beginPath();
            ctx.moveTo(canvasMidpoint, canvasMidpoint);
            ctx.lineTo(canvasMidpoint+ordinalOffsets[i].x, canvasMidpoint+ordinalOffsets[i].y);
            ctx.stroke();
        }
    }
}

var rotation = 0;
var interval;
function startGears() {
    clearInterval(interval);
    interval = setInterval(function(){
        rotation += 3;
        $('.gear_canvas:odd').rotate(-rotation);
        $('.gear_canvas:even').rotate(rotation);
    }, 50);
}

function stopGears() {
    clearInterval(interval);
    rotation = 0;
    $('.gear_canvas').rotate(rotation);
}

$(function(){
    $.fn.rotate = function(degrees) {
        $(this).css({'-webkit-transform' : 'rotate('+degrees+'deg)',
                     '-moz-transform' : 'rotate('+degrees+'deg)',
                     '-ms-transform' : 'rotate('+degrees+'deg)',
                     'transform' : 'rotate('+degrees+'deg)'});
    };
});
