var textArray = [];

$(function () {

    var myPlayer = videojs('my-video', {
        controls: true,
        autoplay: false,
        preload: "auto",
        muted: true
    });

    myPlayer.ready(
        initPlayer(),
        initDocReader('http://oq58gupxj.bkt.clouddn.com/PPT.ppt')
    );

    $('select').material_select(); //init select module

    //play rate control
    $('#play-rate').change(
        function () {
            var rate = $('#play-rate').val();
            myPlayer.playbackRate(rate);
        }
    );
    var canvas = document.getElementById('cover-canvas');
    var context = canvas.getContext('2d');

    var vHeight = $('#video-wrapper').height();
    var vWidth = $('#video-wrapper').width();


    canvas.width = vWidth;
    canvas.height = vHeight;

    //interval for updating barrage
    var isUpdate = false;
    setInterval(
        function () {
            if (isUpdate && context) {
                updateText(context, canvas, myPlayer);
            }
        }, 50
    );

    //binding event
    myPlayer.on("play", function () {
        isUpdate = true;

    });
    myPlayer.on("pause", function () {
        isUpdate = false;
    });
    myPlayer.on("seeked", function () {
        textArray = [];
        getBarrage(myPlayer.currentTime());
    });

    //resize windows
    $(window).resize(function () {
        windowResize(canvas, vHeight, vWidth);
        if (!document.webkitIsFullScreen) {
            $('#main-body').removeClass('fullscreen-extend');
            $('#main-body').addClass('container');
            windowResize(canvas, vHeight, vWidth);
        }
    });

    $('#barrage-config').click(function () {
        $('#config-board').fadeToggle();
    });

    $('.type-list li').on('click', function () {
        $(this).siblings().removeClass('type-active');
        if (!$(this).hasClass('type-active')) {
            $(this).addClass('type-active');
        }
        //console.log($(this).attr('value'));
    });

    //handle barrage send
    $('#sendBtn').click(function () {
        var content = $('#msg').val();
        var type = $('.type-active').attr('value');
        if ($('#color-picker-text').val()) {
            var color = $('#color-picker-text').val();
        } else {
            color = 'white';
        }
        var time = myPlayer.currentTime();
        var date = new Date();
        var data = {
            content: content,
            time: time,
            type: type,
            color: color,
            date: date.toDateString(),
            user: 'test',
            x: 0,
            y: 30,
            vx: -3 - (Math.pow(1.04, content.length)) - Math.abs(Math.random() - 0.5)

        };
        $.ajax({
            url: '/video/barrage_server',
            type: 'post',
            dataType: 'json',
            data: data,
            success: function (result) {
                addText(context, result.content, result.x, result.y, result.time, result.type, result.color);
            },
            error: function (err) {
                console.log(err);
            }
        })
        $('#msg').val('');

    });


    $('[name="color-picker"]').paletteColorPicker({
        colors: ["#F084A5", "#43CBF0", "#e0f040", "#A247F0", "#46F08F"],
        custom_class: 'double',
        onchange_callback: function (color) {
            //$('#color-picker-text').attr('value', color);
        }
    });

});

function initPlayer() {
    $('button.vjs-fullscreen-control').remove();
    var ob = $('div.vjs-control-bar');
    ob.append('<button class="vjs-barrage-control" title="关闭弹幕">' +
        '<span aria-hidden="true" class="vjs-icon-subtitles"></span>' +
        '</button>');
    ob.append('<button class="vjs-fullscreen-control-extend vjs-fullscreen-control vjs-control vjs-button " title="全屏">' +
        '<span aria-hidden="true" class="vjs-icon-placeholder"></span>' +
        // '<span class="vjs-control-text">全屏</span>'+
        '</button>');

    $('button.vjs-barrage-control').on('click', function () {
        if ($('#cover-canvas').css('display') !== 'none') {
            $('#cover-canvas').css('display', 'none');
            $('button.vjs-barrage-control').attr('title', '显示弹幕');
        } else if ($('#cover-canvas').css('display') !== 'block') {
            $('#cover-canvas').css('display', 'block');
            $('button.vjs-barrage-control').attr('title', '关闭弹幕');
        }
    });
    $('button.vjs-fullscreen-control-extend').on('click', toggleFullScreen);


    //load barrage
    getBarrage(0);
}

function initDocReader(url) {
    var reader = $('div#main-document');
    var height = $('#video-wrapper').height();
    reader.append('<iframe id="doc-reader" src="http://view.officeapps.live.com/op/view.aspx?src=' + url + '"></iframe>');
    $('#doc-reader').attr(
        {
            'height': height,
            'width': '100%'
        }
    );

}

function getBarrage(beginTime) {

    var data = {
        time: beginTime
    };
    var temp = [];
    $.ajax({
        url: '/video/barrage_server/default',
        type: 'get',
        dataType: 'json',
        data: data,
        success: function (result) {
            textArray = textArray.concat(result);
            //console.log(textArray);

        },
        error: function (err) {
            console.log(err);
        }
    })
}

function drawText(text, x, y, type, color) {
    var canvas = document.getElementById('cover-canvas');
    var context = canvas.getContext('2d');
    context.font = '26px arial,黑体';
    context.fillStyle = color;
    context.strokeText(text, x, y);
    context.fillText(text, x, y);

}

function updateText(context, canvas, player) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (textArray) {
        for (var i = 0; i < textArray.length; i++) {
            if (textArray[i].time <= player.currentTime()) {
                textArray[i].x -= (textArray[i].vx - (player.playbackRate() - 1));
                var tempX = canvas.width - textArray[i].x;
                drawText(textArray[i].content, tempX, textArray[i].y, textArray[i].type, textArray[i].color);
                if (i >= 1 && textArray[i - 1].x < (context.measureText(textArray[i - 1].content).width + 10)) {
                    textArray[i].y = textArray[i - 1].y + 34;
                }
                if (tempX < ( -context.measureText(textArray[i].content).width)) {
                    textArray.splice(i, 1);
                }
            }
        }
    }

}

function addText(context, text, x, y, time, type, color) {
    var textObj = {
        content: text,
        time: time,
        type: type,
        color: color,
        x: x,
        y: 30,
        vx: -3 - (Math.pow(1.04, text.length)) - Math.abs(Math.random() - 0.5)

    };
    textArray.push(textObj);
}


function toggleFullScreen() {

    var docElm = document.getElementById('main-body');
    if (!document.webkitIsFullScreen) {
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        }
        else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }
        else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        }
        else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        }
        $('#main-body').removeClass('container');
        $('#main-body').addClass('fullscreen-extend');
        $('button.vjs-fullscreen-control-extend').attr('title', '退出全屏');

    } else if (document.webkitIsFullScreen) {

        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
        $('#main-body').removeClass('fullscreen-extend');
        $('#main-body').addClass('container');
        $('button.vjs-fullscreen-control-extend').attr('title', '全屏');

    }

}

function windowResize(canvas, vHeight, vWidth) {
    vHeight = $('#video-wrapper').height();
    vWidth = $('#video-wrapper').width();
    canvas.width = vWidth;
    canvas.height = vHeight;

}