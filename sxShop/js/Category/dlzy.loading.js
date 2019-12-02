(function ($) {
    //打开加载
    $.loading = function (options) {
        //默认设置
        var settings = $.extend({
            pos: 'fixed',
            zIndex: '99999',
            top: '0',
            left: '0',
            imagePath: '/Content/v2.0/img/loading.gif'
        }, options);
        $('body').append('<div class="dlzyloading"><img src="' + settings.imagePath + '"></div>');
        el = $('.dlzyloading');
        var initStyles = {
            'position': settings.pos,
            'width': "100%",
            'zIndex': settings.zIndex,
            'top': settings.top,
            'left': settings.left,
            'background':'#000',
            'opacity':0.1
        };
        el.css(initStyles);
        var img = $(el).find("img");
        centerLoader(img);
        return el;
    };
    //关闭loadding显示
    $.closeloading = function () {
        $('.dlzyloading').remove();
    };
    //居中显示loading图标
    function centerLoader(img) {
        var winW = $(window).width();
        var winH = $(window).height();

        var imgsrc = new Image();
        imgsrc.src = $(img).attr("src");
        var imgW = imgsrc.width;
        var imgH = imgsrc.height;

        $(img).css({
            'position': 'absolute',
            'left': (winW / 2) - (imgW / 2),
            'top': (winH / 2) - (imgH / 2)
        });
        $(".dlzyloading").css({ 'height': winH });
    }
} (jQuery));




