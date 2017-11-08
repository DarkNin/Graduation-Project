/**
 * Created by DarkNin on 2017/7/18.
 */
var WINDOW_WIDTH = document.documentElement.clientWidth * 0.8;
var WINDOW_HEIGHT = document.documentElement.clientHeight * 0.8;

var textArray = [];

window.onload = function () {
    var socket = io('ws://localhost:1025');
    var canvas = document.getElementById('cover-canvas');
    var context = canvas.getContext('2d');
    //console.log(WINDOW_HEIGHT + ':' + WINDOW_WIDTH)
    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;
    setInterval(
        function () {
            updateText(context, canvas);
            //console.log('interval updated');
        },50
    );
    socket.on('message', function (obj) {
        //console.log('message emmit');
        var canvasX = canvas.width;
        var canvasY = canvas.height;
        addText(context, obj.content, obj.counter, canvasX, canvasY);
    });
    $('#sendBtn').click(function () {
        var content = $('#msg').val();

            console.log('button pressed');
            socket.emit('message', content);
            $('input[name="msg"]').val('');

        }
    );

};

function drawText(text, x, y) {
    var canvas = document.getElementById('cover-canvas');
    var context = canvas.getContext('2d');
    context.font = '24px arial,黑体';
    context.fillText(text, x, y);
    console.log('text drew' + text + x + y)

}

function updateText(context, canvas) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (textArray) {
        for (var i = 0; i < textArray.length; i++) {
            textArray[i].x += textArray[i].vx;
            console.log('array updated');
            drawText(textArray[i].content, textArray[i].x, textArray[i].y);
            if ( i >= 1 && textArray[i - 1].x > (canvas.width - context.measureText(textArray[i - 1].content).width - 10) && textArray[i].y === textArray[i-1].y){
                textArray[i].y += 34;
            }
            if (textArray[i].x < ( - context.measureText(textArray[i].content).width)){
                textArray.splice(i, 1);
            }
        }
    }

}

function addText(context, text, num, canvasX, canvasY) {
    var textObj = {
        content: text,
        counter: num,
        x: canvasX,
        y: 30,
        vx: -3 - (Math.pow(1.04, text.length)) - Math.abs(Math.random() - 0.5)
    };
    textArray.push(textObj)
}