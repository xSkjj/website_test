// fire all necessary functions, when Site is loaded
$(function () {
    loadSettings();
    lineEffect();
    clickColor();
    autoColor();
    if (localStorage.getItem("userHasNeverChangedColor") === null) {
        setColor()
    }
    boxEffect();
    skipAnim();
    slide()
});

// header move in animation
function skipAnim() {
    if ($("#skipAnim").prop("checked")) {
        $("header h1").animate({fontSize: "3em"}, function () {
            $("header h1").css("transform", "translateY(50%)")
        })
    } else {
        $("header h1").css({
            "transition": "none",
            "font-size": "3em",
            "transform": "translateY(50%)"
        })
    }
}

// lines that follow the cursor
function lineEffect() {
    if ($("#lineEffect").prop("checked")) {
        $("#clickColor, #autoColor").prop("disabled", false);
        if (!($("#clickColor").prop("checked")) && !($("#autoColor").prop("checked"))) {
            $("#setColor").prop("disabled", false)
        }
        $(window).mousemove(function (e) {
            $("#mouseBox line")
                .show()
                .attr({
                    x2: e.pageX,
                    y2: e.pageY
                })
        })
    } else {
        $(window).off("mousemove");
        $("#mouseBox line").hide();
        $("#clickColor, #autoColor, #setColor").prop("disabled", true)
    }
}

// selectBox effect like Windows has
function boxEffect() {
    if ($("#boxEffect").prop("checked")) {
        $("#hideBox").prop("disabled", false)
        $(document).mousedown(function (f) {
            $("#mouseBox rect").attr({
                x: f.pageX,
                y: f.pageY,
                width: 0,
                height: 0
            });
            $(document).mousemove(function (g) {
                if (g.pageX < f.pageX) {
                    $("#mouseBox rect").attr({
                        x: g.pageX,
                        width: f.pageX - g.pageX
                    })
                } else {
                    $("#mouseBox rect").attr({
                        x: f.pageX,
                        width: g.pageX - f.pageX
                    })
                }
                if (g.pageY < f.pageY) {
                    $("#mouseBox rect").attr({
                        y: g.pageY,
                        height: f.pageY - g.pageY
                    })
                } else {
                    $("#mouseBox rect").attr({
                        y: f.pageY,
                        height: g.pageY - f.pageY
                    })
                }
            })
        });
        $(document).mouseup(function () {
            // hide box on mouseup
            if ($("#hideBox").prop("checked")) {
                $("#mouseBox rect").attr({
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                })
            }
            $(document).off('mousemove')
        })
    } else {
        $(document).off("mousedown mouseup");
        $("#hideBox").prop("disabled", true)
    }
}

function unlockBfx() {
    if (!($("#boxEffect").prop("checked"))) {
        $("#boxEffect").prop("checked", true);
        boxEffect();
        storeSetting("boxEffect");
        $("#hideBox").prop("checked", false);
        storeSetting("hideBox");
    }
}

// change line and rect color
function colorchange() {
    if ($("#lineEffect").prop("checked")) {
        var r = Math.floor(Math.random() * 256),
            g = Math.floor(Math.random() * 256),
            b = Math.floor(Math.random() * 256);
        $("#mouseBox line, #setColor + label line").css("stroke", "rgb(" + r + ", " + g + "," + b + ")");
        $("#mouseBox rect").css({
            "fill": "rgba(" + r + ", " + g + "," + b + ", 0.133)",
            "stroke": "rgb(" + r + ", " + g + "," + b + ")"
        })
    }
}

// ...after time period
var autoC = null;

function autoColor() {
    if ($("#autoColor").prop("checked")) {
        autoC = setInterval(colorchange, 5000);
        $("#setColor").prop("disabled", true)
    } else {
        clearInterval(autoC);
        if (!($("#clickColor").prop("checked")) && $("#lineEffect").prop("checked")) {
            $("#setColor").prop("disabled", false)
        }
    }
}

function unlockLfx() {
    if (!($("#lineEffect").prop("checked"))) {
        unlockColor();
    }
}

// ...with manual click
function clickColor() {
    if ($("#clickColor").prop("checked")) {
        $(document).click(colorchange);
        $("#setColor").prop("disabled", true)
    } else {
        $(document).off("click");
        if (!($("#autoColor").prop("checked")) && $("#lineEffect").prop("checked")) {
            $("#setColor").prop("disabled", false)
        }
    }
}

// set color manually
function setColor() {
    localStorage.removeItem("userHasNeverChangedColor");
    $("#mouseBox line, #setColor + label line").css("stroke", $("#setColor").val());
    $("#mouseBox rect").css({
        "fill": $("#setColor").val() + "22",
        "stroke": $("#setColor").val()
    })
}

function unlockColor() {
    $("#lineEffect").prop("checked", true);
    lineEffect();
    storeSetting("lineEffect");
    $("#clickColor").prop("checked", false);
    clickColor();
    storeSetting("clickColor");
    $("#autoColor").prop("checked", false);
    autoColor();
    storeSetting("autoColor")
}

// settings: # or esc
$("#settings").css("display", "flex").hide();
$(window).keyup(function (e) {
    if (e.keyCode === 191 || e.keyCode === 27) {
        toggleSettings();
    }
});

function toggleSettings() {
    $("#settings").stop(true).fadeToggle()
}


// save and load settings with localStorage
// ...ALL
function storeSettings() {
    for (i = 0; i < $("#settings-wrapper input").length; i++) {
        var sett = $("#settings-wrapper input")[i];
        if (sett.type === "checkbox") {
            localStorage.setItem(sett.id, sett.checked);
        } else {
            localStorage.setItem(sett.id, sett.value)
        }
    }
}

function loadSettings() {
    if (localStorage.length === 0) {
        storeSettings();
        localStorage.setItem("userHasNeverChangedColor", true)
    }
    for (i = 0; i < $("#settings-wrapper input").length; i++) {
        var sett = $("#settings-wrapper input")[i];
        if (sett.type === "checkbox") {
            sett.checked = (localStorage.getItem(sett.id) === "true")
        } else {
            sett.value = localStorage.getItem(sett.id)
        }
    }
}

// ...ONE
$("#settings-wrapper input").change(function () {
    storeSetting(this.id)
});

function storeSetting(id) {
    var val = null;
    if ($("#" + id).prop("type") === "checkbox") {
        val = $("#" + id).prop("checked")
    } else {
        val = $("#" + id).val()
    }
    localStorage.setItem(id, val)
}


// Education - how much percent have I progressed through the 3 years of learning
function progress(percentage) {
    var startDate = new Date("2020-08-17T07:15:00").getTime(),
        endDate = new Date("2023-08-15T12:30:00").getTime(),
        now = new Date().getTime(),
        progressTotal = endDate - startDate,
        progressMS = now - startDate,
        percentage = Math.floor(progressMS / progressTotal * 10000) / 100;
    return percentage;
}

// Education - show progress bar
var barState = false;

function openProgBar() {
    if (barState) {
        $("#progressBar").stop(true).fadeOut(function () {
            $("#progressBar,#myProgress").removeAttr("style");
            $("#progressBar").hide();
            $("#myProgress").text("");
        });
        $("#progressBar").fadeIn();
        barState = false;
        return;
    }
    $("#progressBar")
        .stop(true)
        .removeAttr("style")
        .animate({
            width: "90vw",
            height: "20px"
        }, function () {
            $("#myProgress").text(progress() + "%")
        });
    $("#myProgress")
        .animate({
            width: progress() + "%"
        });
    barState = true;
}

// show ".here" text by clicking a ".border" element
$(".border").click(function () {
    $(".here#" + this.id).stop(true).fadeToggle()
});

// show hobbies
function hobby() {
    $(".basic").stop(true).fadeOut(function () {
        $("#hobby-wrapper").stop(true).fadeIn()
    });
    // ...and hide them again (esc)
    $(window).keyup(function (e) {
        if (e.keyCode === 27) {
            $("#hobby-wrapper").stop(true).fadeOut(function () {
                $(".basic").stop(true).fadeIn()
            })
        }
    })
}

// highlight what I do at home/ in my dorm
var highlight = "off";
$(".place").click(function () {
    $("#hobby-wrapper *").removeAttr("style");
    if (this.id === highlight) {
        highlight = "off";
        return
    }
    $(".place#" + this.id).css("background-color", "#333c");
    $(".hobby." + this.id).css("opacity", ".9");
    $(".hobby ." + this.id).show();
    highlight = this.id
});

// show more info by clicking an element that has some
$(".hasinfo").click(function () {
    $(".info#" + this.id).slideToggle()
});

$(".ka").click(function () {
    $(this).fadeTo("slow", 1)
});

$("#home").click(function () { // cryptic...
    $(window).keyup(function (e) {
        if (highlight === "home" && e.keyCode === 192) {
            $(".test").show();
            $(".test").click(function () {
                $(this).text("UCyCdpKr1q2AcLRcCa_5dk8A")
            })
        }
        if (highlight === "home" && e.keyCode === 84) {
            $("p:contains(Streams)").click(function () {
                $(this).text("hmmm...")
            })
        }
    })
});

// timeline slider
$("#timepassed").width(progress() / 4 + "%");
$("#timeleft").width(100 - progress() / 4 + "%");
$("#diff").css("transform", "translate(" + progress() / 4 + "vw, -50%)");
$("#tl-slider").val(progress() * 25);

// show and hide different goals, depending on slider position
function slide() {
    var slider = $("#tl-slider").val();
    $("#diff").width(slider / 100 - progress() / 4 + "%");
    if (slider < Math.floor(progress() * 25)) {
        $(".goal").hide()
    }
    if (slider >= Math.floor(progress() * 25)) {
        $(".goal#laptop, .goal#invhow").show()
    }
    if (slider >= 1337) {
        $(".goal#invest").show()
    }
    if (slider < 1337) {
        $(".goal#invest").hide()
    }
    if (slider > 1669) {
        $(".goal#laptop").hide()
    }
    if (slider >= 2500 && slider <= 3000) {
        $(".goal#abschluss").show();
        $(".goal#job").show()
    }
    if (slider < 2500 || slider > 3000) {
        $(".goal#abschluss").hide();
        $(".goal#job").hide()
    }
    if (slider <= 3000) {
        $(".goal.end").hide()
    }
    if (slider > 3000) {
        $(".goal.end").show()
    }
    if (slider > 4200) {
        $(".goal#invhow").hide()
    }
    if (slider < 10000) {
        $(".goal#profit").hide()
    }
    if (slider === 10000) {
        $(".goal").hide();
        $(".goal#profit").show()
    }
}
