/*! meting.aplayer.js v1.2.2 | MIT License */
function r(e) {
    /in/.test(document.readyState) ? setTimeout("r(" + e + ")", 9) : e()
}
r(function () {
    function e(e, t) {
        var a = [],
            r = e.dataset;
        a.element = e, a.music = t, a.showlrc = a.music[0].lrc ? 3 : 0, a.narrow = "true" === r.narrow, a.autoplay = "true" === r.autoplay, a.mutex = "false" !== r.mutex, a.mode = r.mode || "circulation", a.preload = r.preload || "auto", a.listmaxheight = r.listmaxheight || "100px", a.theme = r.theme || "#ad7a86", new APlayer(a)
    }
    console.log("\n %c Meting 1.2.2 %c https://i-meto.com/ghost-aplayer/ \n\n", "color: #fff; background-image: linear-gradient(90deg, rgb(47, 172, 178) 0%, rgb(45, 190, 96) 100%); padding:5px 1px;", "background-image: linear-gradient(90deg, rgb(45, 190, 96) 0%, rgb(255, 255, 255) 100%); padding:5px 0;");
    var t = "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r";
    "undefined" != typeof meting_api && (t = meting_api);
    var a = document.querySelectorAll(".aplayer");
    Array.prototype.forEach.call(a, function (a, r) {
        if (a.dataset.id) {
            var i = new XMLHttpRequest,
                o = t;
            o = (o = (o = (o = o.replace(":server", a.dataset.server)).replace(":type", a.dataset.type)).replace(":id", a.dataset.id)).replace(":r", Math.random()), i.open("GET", o, !0), i.onload = function () {
                if (i.status >= 200 && i.status < 400) {
                    var t = JSON.parse(i.responseText);
                    e(a, t)
                }
            }, i.send()
        } else {
            var n = [];
            n.title = a.dataset.title, n.author = a.dataset.author, n.url = a.dataset.url, n.pic = a.dataset.pic, n.lrc = a.dataset.lrc, e(a, [n])
        }
    })
});