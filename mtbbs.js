// ==UserScript==
// @name         MT论坛加强插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  总之打点字上去!
// @author       CokkezigenDAR
// @match        *.binmt.cc/*
// @grant        none
// ==/UserScript==

(function() {
    /* 增加class样式 */
    addStyles(MapToStyleClassText({
        "@keyframes fade-in": ["0% { opacity: 0;}", "100% {opacity: 1;}"]
    }, {
        "*": ["animation: fade-in", "animation-duration: 0.8s"]
    }));

    window.onload = function() {
        // 设置背景图片 
        setBackgroundImage("https://s1.ax1x.com/2022/08/13/vN2BXF.jpg");
        // 替换样式
        replaceStyle();
        // 自动签到
        autoDaysSign();
    }
})();

function MapToStyleClassText(...maps) {
    var result = "";
    var map = null;
    for (var i = 0; i < maps.length; i++) {
        map = maps[i];
        for (var key in map) {
            result += key + "{"
            result += map[key].toString().replace("\'", "").replace(",", ";")
            result += "}"
        }
    }
    return result;
}

function addStyles(cssText) {
    const style = document.createElement("style");
    style.innerText = cssText;
    get("html").tag.to().appendChild(style);
}

function setBackgroundImage(url) {
    setStyles(get("body.tag").to(), ListToCssText(
        "background-image: url(" + url + ")",
        "background-repeat: repeat-y"
    ))
}

function get(val) {
    let Elements = null;
    const to = function(v = 0) {
        if ((v < 0 && 0 > Elements.length - v) || v >= Elements.length) return null;
        return Elements[v >= 0 ? v : Elements.length - v];
    }
    const all = function() { return Elements };
    if (val.substring(val.length - 3) == ".id")
        return document.getElementById(val.substring(0, val.length - 3));
    if (val.substring(val.length - 6) == ".class")
        return new function() {
            Elements = document.getElementsByClassName(val.substring(0, val.length - 6));
            this.to = to;
            this.all = all;
        }
    if (val.substring(val.length - 4) == ".tag")
        return new function() {
            Elements = document.getElementsByTagName(val.substring(0, val.length - 4));
            this.to = to;
            this.all = all;
        }
    if (val.substring(val.length - 5) == ".name")
        return new function() {
            Elements = document.getElementsByName(val.substring(0, val.length - 5));
            this.to = to;
            this.all = all;
        }
    return new function() {
        this.tag = get(val + ".tag");
        this.class = get(val + ".class");
        this.id = get(val + ".id");
        this.name = get(val + ".name");
    };
}

function gets(obj, val) {
    let Elements = null;
    const to = function(v = 0) {
        if ((v < 0 && 0 > Elements.length - v) || v >= Elements.length) return null;
        return Elements[v >= 0 ? v : Elements.length - v];
    }
    const all = function() { return Elements };
    if (val.substring(val.length - 3) == ".id")
        return obj.getElementById(val.substring(0, val.length - 3));
    if (val.substring(val.length - 6) == ".class")
        return new function() {
            Elements = obj.getElementsByClassName(val.substring(0, val.length - 6));
            this.to = to;
            this.all = all;
        }
    if (val.substring(val.length - 4) == ".tag")
        return new function() {
            Elements = obj.getElementsByTagName(val.substring(0, val.length - 4));
            this.to = to;
            this.all = all;
        }
    if (val.substring(val.length - 5) == ".name")
        return new function() {
            Elements = obj.getElementsByName(val.substring(0, val.length - 5));
            this.to = to;
            this.all = all;
        }
}

function logd(text) {
    console.log(text);
}

function autoDaysSign() {
    try {
        const JD_sign = get("JD_sign.id");
        if (JD_sign == null) return;
        if (((JD_sign.childNodes[1].innerHTML).replace(/\s*/g, "")) === "签到") {
            JD_sign.click();
            logd("自动签到成功！");
        } else {
            logd("今日已签到！");
        }
    } catch (e) {
        logd("签到失败？ " + e);
    }
}

function setStyles(...obj) {
    if (obj.length < 2) return;
    const css = obj[obj.length - 1];
    try {
        if (obj.length == 2) {
            obj[0].style.cssText = css;
        } else
            for (var i = 0; i < obj.length - 1; i++)
                obj[i].style.cssText = css;
    } catch (e) {
        logd("setStyles err : " + e);
    }
}

function setStylesOnForeach(obj, css) {
    for (var i = 0; i < obj.length; i++)
        obj[i].style.cssText = css;
}

function foreachSetOnMouse(obj, over, out) {
    for (var i = 0; i < obj.length; i++) {
        obj[i].onmouseout = out;
        obj[i].onmouseover = over;
    }
}

function ListToCssText(...data) {
    var result = "";
    for (var i = 0; i < data.length; i++)
        result += data[i] + ";";
    return result;
}

function replaceStyle() {
    try {
        { // 头部导航栏
            const comiis_nv = get("comiis_nv.id");
            const comiis_nvdiv = get("comiis_nvdiv.class").to();
            /* 去除默认高度的限制 */
            setStyles(comiis_nv, comiis_nvdiv, "height: auto");
            /* 重定义背景外宽距以及背景圆角 */
            setStyles(comiis_nv, ListToCssText(
                "margin:10px 20px 10px 20px",
                "border-radius:25px"
            ));
            const comiis_nvbox = get("comiis_nvbox.class").to();
            setStylesOnForeach(
                /* 替换导航栏项目原来的背景颜色 */
                gets(comiis_nvbox, "a.tag").all(),
                "background:#00000000"
            );
            foreachSetOnMouse(
                gets(comiis_nvbox, "li.tag").all(),
                function(e) {
                    const text = e.path[0];
                    const bac = e.path[1];
                    text.style.color = "#000000"
                    bac.style.background = "#CCFFFF"
                },
                function(e) {
                    e.path[0].style.color = ""
                    e.path[1].style.background = ""
                }
            );
        } {
            const wp = get("wp.id");
            setStyles(wp, "margin-top:10px");
        }
    } catch (e) {
        logd("replaceStyle err : " + e);
    }
}

(function() {
    window.onload = function() {
        // 替换样式
        replaceStyle();
        // 自动签到
        autoDaysSign();
    }
})();
