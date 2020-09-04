$(document).mousemove(function(e){
    $("line").attr({
        x2: e.pageX,
        y2: e.pageY
    })
})
