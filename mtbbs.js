// ==UserScript==
// @name         MT论坛加强插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  总之打点字上去!
// @author       CokkezigenDAR
// @match        *.binmt.cc/*
// @grant        none
// @icon         https://bbs.binmt.cc/favicon.ico
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
        setBackgroundImage("https://s1.ax1x.com/2022/08/14/vNbMp4.png");
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
        for (var key in map)
            result += key + "{" + map[key] + "}"
    }
    result = result.replaceAll(",", ";");
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
        "background-attachment: fixed",
        "background-repeat: no-repeat",
        "background-size: 100%",
        "background-size: cover",
        "background-position: center 0"
    ))
}

function get() {
    if (arguments.length != 1 && arguments.length != 2)
        throw "function get(): The number of parameters must be 1 or 2";
    const result = function(val, obj) {
        let Elements = null;
        const to = function(v = 0) {
            if ((v < 0 && 0 > Elements.length - v) || v >= Elements.length) return null;
            return Elements[v >= 0 ? v : Elements.length - v];
        }
        const all = function() { return Elements };
        if (val.substring(val.length - 3) == ".id")
            return (obj != null ? obj : document).getElementById(val.substring(0, val.length - 3));
        if (val.substring(val.length - 6) == ".class")
            return new function() {
                Elements = (obj != null ? obj : document).getElementsByClassName(val.substring(0, val.length - 6));
                this.to = to;
                this.all = all;
            }
        if (val.substring(val.length - 4) == ".tag")
            return new function() {
                Elements = (obj != null ? obj : document).getElementsByTagName(val.substring(0, val.length - 4));
                this.to = to;
                this.all = all;
            }
        if (val.substring(val.length - 5) == ".name")
            return new function() {
                Elements = (obj != null ? obj : document).getElementsByName(val.substring(0, val.length - 5));
                this.to = to;
                this.all = all;
            }
        return new function() {
            this.tag = result(val + ".tag");
            this.class = result(val + ".class");
            this.id = result(val + ".id");
            this.name = result(val + ".name");
        };
    }
    if (arguments.length == 1) return result(arguments[0], null);
    if (arguments.length == 2) return result(arguments[0], arguments[1])
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

function setCallBackOnForeach(obj, func) {
    for (var i = 0; i < obj.length; i++)
        func(obj[i]);
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
            comiis_nvdiv.style.height = "80px";
            comiis_nv.style.height = "auto";
            /* 重定义背景外宽距以及背景圆角 */
            comiis_nv.style.margin = "10px 20px 10px 20px";
            comiis_nv.style.width = "98%";
            comiis_nv.style.borderRadius = "25px";

            const comiis_nvbox = get("comiis_nvbox.class").to();
            setStylesOnForeach(
                /* 替换导航栏项目原来的背景颜色 */
                get("a.tag", comiis_nvbox).all(),
                "background:#00000000"
            );
            foreachSetOnMouse(
                get("li.tag", comiis_nvbox).all(),
                function(e) {
                    const text = e.path[0];
                    const bac = e.path[1];
                    text.style.color = ""
                    bac.style.background = ""
                },
                function(e) {
                    e.path[0].style.color = ""
                    e.path[1].style.background = ""
                }
            );
        } {

            const comiis_rollzbox = get("comiis_rollzbox.class").to();
            setStyles(comiis_rollzbox, "padding-top:10px");
            setCallBackOnForeach(
                get("div.tag", comiis_rollzbox).all(),
                function(e) {
                    e.style.backgroundColor = "#ffffff70";
                }
            );
        }
    } catch (e) {
        logd("replaceStyle err : " + e);
    }
}
