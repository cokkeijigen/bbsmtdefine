// ==UserScript==
// @name         MT论坛加强插件
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  总之打点字上去!
// @author       CokkezigenDAR
// @match        *bbs.binmt.cc/*
// @grant        none
// @icon         https://bbs.binmt.cc/favicon.ico
// ==/UserScript==

(function() {
    initStyleClass(); // css style
    if (top != self) {
        // Script1  字子口
        initContent();
    } else if (top == self) {
        // Script2   主窗口
        intWindowOnload();
    }
})();

gotoScript1();
gotoScript2();
/* ---------------------public--------------------- */

function initPublic() {
    if (window.location.href.search("mod=guide&view=my") != -1)
        get("append_parent.id").style.display = "none";
}

function initStyleClass() {
    /* 增加class样式 */
    addStyles(MapToStyleClassText({
        "@keyframes fade-in": ["0% { opacity: 0;}100% {opacity: 1;}"]
    }, {
        "*": ["animation: fade-in", "animation-duration: 0.5s"]
    }, {
        "a:hover": ["cursor: pointer"]
    }, {
        "#contentFrame": [
            "margin: auto",
            "width: 80%",
            "height: 85%",
            "z-index: 999",
            "position: fixed",
            "top: 0; bottom: 0",
            "left: 0; right: 0",
            "border-radius:15px",
            "background-color: #ffffff70"
        ]
    }, {
        "#mainIFrame": [
            "border: none",
            "scrolling:no",
            "border-radius:15px",
            "width: 100%", "height: 100%",
            "transform: translate(-50%, -50%)",
            "background-color: #00000000",
            "box-shadow: 0 0 8px #0084ff"
        ]
    }, {
        "#iframe_settings": [
            "text-align: center",
            "position: absolute",
            "bottom: 0",
            "right: 0"
        ]
    }, {
        "#thisSettings": [
            "text-align: center",
            "position: fixed",
            "bottom: 0",
            "animation: none",
            "z-index: 99999",
            "right: 60px",
            "opacity: 0"
        ]
    }, {
        "#thisSettings:hover": ["opacity: 1"]
    }, {
        "#closeIFrame, #openNewTab, #copyUrl, #goBack": [
            "float: right",
            "padding: 10px 15px",
            "margin: 5px 10px",
            "font-weight: bold",
            "font-size: 10px",
            "color: #ffffff",
            "background-color: #6790ff",
            "border-radius: 20px",
            "box-shadow: 0 0 8px #0084ff"
        ]
    }, {
        "#closeIFrame:hover, #openNewTab:hover, #copyUrl:hover, #goBack:hover": [
            "cursor: pointer",
            "background-color: #000c2e",
            "box-shadow: 0 0 8px #ffefaa"
        ]
    }, {
        "boardnavr_comiis_width": ["float: left", "margin-left: -300px"]
    }, {
        "#search_btn": [
            "background: url(https://cdn-bbs.mt2.cn/template/comiis_mi/img/comiis_dss.png) no-repeat center",
            "width: 40px",
            "height: 50px",
            "margin-right: 10px"
        ]
    }, {
        "#search_btn:hover": ["cursor: pointer"]
    }));
}

function get() {
    if (arguments.length != 1 && arguments.length != 2)
        throw "function get(): The number of parameters must be 1 or 2";
    const result = function(val, obj) {
        let Elements = null;
        const to = function(v = 0) {
            if ((v < 0 && 0 > Elements.length - v) || v >= Elements.length || Elements == null) return null;
            return Elements[v >= 0 ? v : Elements.length - v];
        }
        const all = function() { return Elements };
        if (val.substring(val.length - 3) == ".id")
            return obj != null ? obj.getElementById(val.substring(0, val.length - 3)) :
                null;
        if (val.substring(val.length - 6) == ".class")
            return new function() {
                Elements = obj != null ? obj.getElementsByClassName(val.substring(0, val.length - 6)) :
                    null;
                this.to = to;
                this.all = all;
            }
        if (val.substring(val.length - 4) == ".tag")
            return new function() {
                Elements = obj != null ? obj.getElementsByTagName(val.substring(0, val.length - 4)) :
                    null;
                this.to = to;
                this.all = all;
            }
        if (val.substring(val.length - 5) == ".name")
            return new function() {
                Elements = obj != null ? obj.getElementsByName(val.substring(0, val.length - 5)) :
                    null;
                this.to = to;
                this.all = all;
            }
        return new function() {
            this.tag = result(val + ".tag", obj);
            this.class = result(val + ".class", obj);
            this.id = result(val + ".id", obj);
            this.name = result(val + ".name", obj);
        };
    }
    if (arguments.length == 1) return result(arguments[0], document);
    if (arguments.length == 2) return result(arguments[0], arguments[1])
}

function getTagA(obj) {
    return get("a.tag", obj).all();
}

function logd(text) {
    console.log(text);
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

function addStyles(cssText) {
    const style = document.createElement("style");
    style.innerText = cssText;
    get("html").tag.to().appendChild(style);
}

function MapToStyleClassText(...maps) {
    var result = "";
    var map = null;
    for (var i = 0; i < maps.length; i++) {
        map = maps[i];
        for (var key in map)
            result += key + "{" + map[key].toString().replaceAll(",", ";") + "}"
    }
    return result;
}

function setStylesOnForeach(obj, css) {
    for (var i = 0; i < obj.length; i++)
        obj[i].style.cssText = css;
}

function setCallBackOnForeach(obj, func) {
    if (obj == null) return;
    for (var i = 0; i < obj.length; i++) try { func(obj[i], i); } catch (e) {}
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
/* ---------------------public--------------------- */

function gotoScript1() {}
/* ---------------------Script1--------------------- */
function intWindowOnload() {
    const html = get("html").tag.to();
    window.onload = function() {
        html.style.opacity = "0";
        try { initPublic(); } catch (e) {}
        // 设置背景图片
        try { setBackgroundImage("https://s1.ax1x.com/2022/08/14/vNbMp4.png"); } catch (e) {}
        // 替换样式
        try { replaceStyle(); } catch (e) {}
        // 自动签到
        try { autoDaysSign(); } catch (e) {}
        // 初始化子窗口
        try { createIframe(); } catch (e) {}
        // 重载标签加载页面
        try { initLoadPage(); } catch (e) {}
        // 替换搜索按钮
        try { rpeSearchBtn() } catch (e) {}

        html.style.opacity = "1";
    }
}

function rpeSearchBtn() {
    // 将原来的按钮隐藏
    const btn = get("comiis_sousuo.id");
    if (btn != null) btn.style.display = "none";
    const comiis_cjpimg = get("comiis_cjpimg.class").to();
    comiis_cjpimg.innerHTML = "<div id=\"search_btn\"></div>";
    get("search_btn.id").onclick = () =>
        setMainIFrame("https://bbs.binmt.cc/search.php");
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

function setMainIFrame(url) {
    if (url.search("binmt") == -1)
        return window.open(url, "_blank");
    url = url.replace("http", "https").replace("ss", "s");
    const mainIFrame = get("mainIFrame.id");
    mainIFrame.src = url;
    mainIFrame.onload = function() {
        contentFrame.style.display = "";
    }

    if (url.search("binmt.cc/doc/") != -1 || url.search("sitemap.xml") != -1) {
        const openNewTab = get("openNewTab.id");
        openNewTab.style.display = "block";
        openNewTab.onclick = function() {
            window.open(mainIFrame.src, "_blank");
        }
    } else
        openNewTab.style.display = "none";

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
            try {
                const comiis_rollzbox = get("comiis_rollzbox.class").to();
                setStyles(comiis_rollzbox, "padding-top:10px");
                setCallBackOnForeach(
                    get("div.tag", comiis_rollzbox).all(),
                    function(e, n) {
                        try {
                            e.style.backgroundColor = "#ffffff70";
                        } catch (e) {}
                    }
                );
            } catch (e) {}
        }
    } catch (e) {
        logd("replaceStyle err : " + e);
    }
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

function createIframe() {
    const contentFrame = document.createElement("div");
    const mainIFrame = document.createElement("iframe");
    const iframe_settings = document.createElement("div");

    iframe_settings.innerHTML = "<p id=\"closeIFrame\">关闭</p>" +
        "<p id=\"openNewTab\" style=\"display: none\">新建标签打开</p>";
    iframe_settings.id = "iframe_settings";

    mainIFrame.id = "mainIFrame";
    contentFrame.id = "contentFrame";

    mainIFrame.frameborder = "0";
    contentFrame.style.display = "none";
    contentFrame.appendChild(iframe_settings);
    contentFrame.appendChild(mainIFrame);
    get("html").tag.to().appendChild(contentFrame);
    get("closeIFrame.id").onclick = function() {
        contentFrame.style.display = "none";
    }
}

function initLoadPage() {

    const rep = function(e) {
        if (e.innerText == "发消息") return;
        const url = e.href;
        if (url.length < 1) return;
        e.onclick = function() {
            setMainIFrame(url);
        }
        e.removeAttribute("href");
    }

    { // 导航栏内容
        const comiis_nvbox = get("comiis_nvbox.class").to();
        setCallBackOnForeach(get("li.tag", comiis_nvbox).all(), function(e, n) {
            if (n <= 1) return;
            let content = e.innerHTML + "";
            let url = content.split(" ")[1];
            e.onclick = function() {
                setMainIFrame(url.replace("href=", "").replaceAll("&amp;", "&").replaceAll("\"", ""));
            }
            e.innerHTML = content.replaceAll(url, "");
        });

        rep(get("a.tag", get("comiis_key.id")).to());

        const comiis_key_menu = get("comiis_key_menu.id");
        setCallBackOnForeach(get("a.tag", comiis_key_menu).all(), function(e, n) {
            rep(e);
        });

    } { // 中间部分

        try {
            setCallBackOnForeach(get("comiis_vrx.class").all(), (e, n) => {
                setCallBackOnForeach(getTagA(e), (e, n) => rep(e));
            })
        } catch (e) {}

        try {
            setCallBackOnForeach(getTagA(get("fl.class").to()), (e, n) => rep(e));
        } catch (e) {}

        try {
            setCallBackOnForeach(getTagA(get("y.class", get("pt.id")).to()), (e, n) => rep(e));
        } catch (e) {}

        try {
            setCallBackOnForeach(getTagA(get("ul.tag", get("online.id")).to()), (e, n) => rep(e));
        } catch (e) {}

        try { // 导读界面
            setCallBackOnForeach(get("bm_c.class").all(), function(e, n) {
                setCallBackOnForeach(getTagA(e), (e, n) => rep(e));
            })
        } catch (e) {}

        try { // 收藏界面
            setCallBackOnForeach(getTagA(get("favorite_ul.id")), (e, n) => rep(e));
        } catch (e) {}

    } { // 右边部分
        setCallBackOnForeach(getTagA(get("comiis_rollbox.id")), (e, n) => rep(e));
    } { // 最底部
        try {
            setCallBackOnForeach(getTagA(get("newspecial_menu.id")), (e, n) => rep(e));
        } catch (e) {}
        try {
            rep(get("a.tag", get("y.class", get("bar.class").to()).to()).to());
            rep(get("a.tag", get("pnpost.class").to()).to());
        } catch (e) {}
        try {
            setCallBackOnForeach(getTagA(get("frt.id")), (e, n) => rep(e));
        } catch (e) {}

    }
}

/* ---------------------Script1--------------------- */
function gotoScript2() {} // 子窗口
/* ---------------------Script2--------------------- */

function initContent() {
    const html = get("html").tag.to();
    const thisSettings = document.createElement("div");
    thisSettings.innerHTML = "<p id=\"goBack\"><-</p>" +
        "<p id=\"openNewTab\">新建标签打开</p>" +
        "<p id=\"copyUrl\">复制链接</p>";
    thisSettings.id = "thisSettings";
    html.appendChild(thisSettings);
    const openNewTab = get("openNewTab.id");
    const copyUrl = get("copyUrl.id");
    const goBack = get("goBack.id");
    openNewTab.onclick = function() {
        window.open(window.location.href, "_blank");
    }
    copyUrl.onclick = function() {
        const input = document.createElement("input");
        document.body.appendChild(input);
        const text = "标题：" + document.title +
            "，链接：" + window.location.href +
            "，内容出处：MT论坛。";
        input.setAttribute("value", text);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        copyUrl.innerText = text + "-> 复制成功！";
        setTimeout(function() {
            copyUrl.innerText = "复制链接";
        }, 3000);
    }
    goBack.onclick = function() {
        window.history.back();
    }

    window.onload = function() {
        try { initPublic(); } catch (e) {}
        try { get("hd.id").style.display = "none"; } catch (e) {}
        try { get("toptb.id").style.display = "none"; } catch (e) {}
        try { get("comiis_footer.class").to().style.display = "none"; } catch (e) {}
        try { setStyles(get("body.tag").to(), "background: #fffffff0"); } catch (e) {}
        try { setStyles(get("comiis_lbox.class").to(), "display: none"); } catch (e) {}
        try { get("boardnavr.class").to().className = ".boardnavr_comiis_width"; } catch (e) {}
        initOverload();
    }
}

function initOverload() {
    setCallBackOnForeach(get("a.tag").all(), function(e, n) {
        if (e.innerText == "[复制链接]" || e.innerText == "发消息") return;
        const url = e.href.replace("http", "https").replace("ss", "s");
        e.onclick = function() {
            if (url.search("binmt") != -1)
                window.location.href = url; // 站内地址可以继续使用子窗口访问
            else window.open(url, "_blank"); // 站外的地址新建标签页打开
        }
        e.removeAttribute("href");
    });
}
/* ---------------------Script2--------------------- */
