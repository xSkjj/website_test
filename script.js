/*$(document).mousemove(function(e){
    $("line").attr({
        x2: e.pageX,
        y2: e.pageY
    })
})*/
$(window).mousedown(function(e) {
    $(window).mousemove(function(f){
        if (e.pageX > f.pageX) {
            $("rect").attr({
                x: f.pageX,
                width: e.pageX - f.pageX
            })
        } else {
            $("rect").attr({
                x: e.pageX,
                width: f.pageX - e.pageX
            })
        };
        if (e.pageY > f.pageY) {
            $("rect").attr({
                y: f.pageY,
                height: e.pageY - f.pageY
            })
        } else {
            $("rect").attr({
                y: e.pageY,
                height: f.pageY - e.pageY
            })
        }
    });
    $(window).mouseup(function(){
        $("rect").attr({
            x: 0,
            y: 0,
            width: 0,
            height: 0
        });
        $(window).off("mousemove")
    })
})
