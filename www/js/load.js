$('head').append(
    '<style type="text/css">#container { display: none; } #fade, #loader { display: block; }</style>'
);
 
jQuery.event.add(window,"load",function() { // 全ての読み込み完了後に呼ばれる関数
    
    Materialize.toast('RYUHEさん、世界では35億5000万人が現在ランニング中です。Lets RUN!!!', 7000);
    
    
    var pageH = $("#main-contents").height();
 
    $("#fade").css("height", pageH).delay(1200).fadeOut(1100);
    $("#loader").delay(900).fadeOut(600);
    $("#main-contents").css("display", "block");
});