// 1.格式化日期时间函数
function formatDates(dt) {
    dt = dt || new Date()
    var str = ""//存储时间的字符串
    //获取年
    var year = dt.getFullYear()
    //获取月
    var month = dt.getMonth() + 1
    //获取日
    var day = dt.getDate()
    //获取小时
    var hour = dt.getHours()
    //获取分钟
    var min = dt.getMinutes()
    //获取秒
    var sec = dt.getSeconds()
    month = month < 10 ? "0" + month : month
    day = day < 10 ? "0" + day : day
    hour = hour < 10 ? "0" + hour : hour
    min = min < 10 ? "0" + min : min
    sec = sec < 10 ? "0" + sec : sec
    str = year + "年" + month + "月" + day + "日 " + hour + ":" + min + ":" + sec
    return str
}

// 2.获取对应id或者class的DOM对象
function $i(id) {
    return document.getElementById(id)
}
function $c(cls) {
    return document.getElementsByClassName(cls)[0]
}

// 3.获取当前浏览器的类型
function userBrowser() {
    var broType = ''
    var browserName = navigator.userAgent.toLowerCase()
    if (/msie/i.test(browserName) && !/opera/.test(browserName)) {
        broType = "IE"
    } else if (/firefox/i.test(browserName)) {
        broType = "Firefox"
    } else if (/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName)) {
        broType = "Chrome"
    } else if (/opera/i.test(browserName)) {
        broType = "Opera"
    } else if (/webkit/i.test(browserName) && !(/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName))) {
        broType = "Safari"
    } else {
        broType = "Unknown"
    }
    return broType
}

// 4.为任意一个元素绑定事件
function addEventListener(element, type, fn) {
    if (element.addEventListener) {
        //支持
        element.addEventListener(type, fn, false)
    } else if (element.attachEvent) {
        element.attachEvent("on" + type, fn)
    } else {
        element["on" + type] = fn
    }
}

// 5.为任意一个元素解绑事件
function removeEventListener(element, type, fn) {
    if (element.removeEventListener) {
        element.removeEventListener(type, fn, false)
    } else if (element.detachEvent) {
        element.detachEvent("on" + type, fn)
    } else {
        element["on" + type] = null
    }
}

// 6.获取页面向上或者向左卷曲出去的距离
function getScroll() {
    return {
        top: window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop || 0,
        left: window.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft || 0
    }
}

// 7.限制字符显示字数
function cutLongString(string, number) {
    var newString = ''
    if (string.length > number) {
        return newString = string.sunstring(0, number) + '...'
    } else {
        return newString
    }
}

// 8.ajax原生代码封装
// ajax({
//     url: "", //请求地址
//     type: 'GET', //请求方式
//     async:true,//同步异步设置
//     timeout:6000,//超时设置
//     data: {
//         name: '',
//         age: '',
//         email: ''
//     }, //请求参数
//     success: function(response, xml) {
//         console.log(response); //   此处执行请求成功后的回调
//     },
//     error: function(status) {
//         console.log('状态码为' + status); // 此处为请求失败后的回调
//     }
// })
function ajax(options) {
    options = options || {};
    options.type = (options.type || "GET").toUpperCase();
    options.dataType = options.dataType || 'json';
    options.async = options.async || true;
    options.timeout = options.timeout || 5000;//超时处理，默认5s
    var params = getParams(options.data);
    var timeoutFlag = null;
    var xhr;
    var that = this;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }
    xhr.onreadystatechange = function () {
        if (options.dataType === 'json') {
            if (xhr.readyState == 4) {
                window.clearTimeout(that.timeoutFlag);
                var status = xhr.status;
                if (status >= 200 && status < 300) {
                    // 如果需要像 html 表单那样 POST 数据，请使用 setRequestHeader() 来添加 http 头。
                    options.success && options.success(xhr.responseText, xhr.responseXML);
                } else {
                    options.error && options.error(status);
                }
            }
        } else {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                window.clearTimeout(that.timeoutFlag);
                var oScript = document.createElement('script');
                document.body.appendChild(oScript);
                var callbackname = 'ajaxCallBack'
                oScript.src = options.url + "?" + params + '&callback=' + callbackname;
                window['ajaxCallBack'] = function (data) {
                    options.success(data);
                    document.body.removeChild(oScript);
                };
            }
        }
    };
    if (options.type == 'GET') {
        xhr.open("GET", options.url + '?' + params, options.async);
        xhr.send(null)
    } else if (options.type == 'POST') {
        xhr.open('POST', options.url, options.async);
        if (options.contentType == "undefined" || options.contentType == null) {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(params);
        } else {
            xhr.setRequestHeader('Content-Type', options.contentType);
            xhr.send(JSON.stringify(options.data));
        }
    }
    this.timeoutFlag = window.setTimeout(function () {//计时器，超时后处理
        window.clearTimeout(that.timeoutFlag);
        //options.error("timeout");
        xhr.abort();
    }.bind(this), options.timeout);
}
function getParams(data) {
    var arr = [];
    for (var param in data) {
        arr.push(encodeURIComponent(param) + '=' + encodeURIComponent(data[param]));
    }
    return arr.join('&');
}

// 9.比值函数
var compareUp = function (a, b) {//升序比值函数
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    } else {
        return 0;
    }
}
var compareDown = function (a, b) {//降序比值函数
    if (a < b) {
        return 1;
    } else if (a > b) {
        return -1;
    } else {
        return 0;
    }
}
var compareObjArr = function (prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    }
}

// 10.获取地址栏参数
function getParamString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  // 匹配目标参数
    if (r != null) return unescape(r[2]); return null; // 返回参数值
}

// 11.移动端适配方案，rem快速布局
// PC端使用请将此代码注释掉
// 750px图，图片尺寸/100=rem尺寸
// iphone6调式开发，屏幕尺寸/100*2=rem尺寸
// (function () {
//     var width = document.documentElement.clientWidth;
//     var html = document.querySelector("html");
//     html.style.fontSize = width / 7.5 + "px";
// })();

// 12.移动端PC端页面动态跳转解决方案
// 将此JS代码放到跳板页面的头部
// function IsPC() {
//     var userAgentInfo = navigator.userAgent;
//     var Agents = ["Android", "iPhone",
//         "SymbianOS", "Windows Phone",
//         "iPad", "iPod"];
//     var flag = true;
//     for (var v = 0; v < Agents.length; v++) {
//         if (userAgentInfo.indexOf(Agents[v]) > 0) {
//             flag = false;
//             break;
//         }
//     }
//     return flag;
// }
// IsPC();
// if (!IsPC()) {
//     //跳到移动端
//     window.location.href = '';
// } else {
//     //跳到PC端
//     window.location.href = '';
// }

// 13. 取min-max之间的随机数
// 函数始终返回介于 min（包括）和 max（不包括）之间的随机数
// 函数始终返回介于 min（包括）和 max（不包括）之间的随机整数
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}
// 这个 JavaScript 函数始终返回介于 min 和 max（都包括）之间的随机整数：
function getRandomPlus(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

// 14.获取传入参数的数据类型
function gettype(o) {
    var s = Object.prototype.toString.call(o)
    var shorts = s.slice(8)
    return shorts.replace(shorts.slice(-1), '').toLowerCase()
}

// 15.深拷贝递归函数
// 根据传递进来的参数，返回值是一个深拷贝出来的新数据
function deepCopy(obj) {
    var newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') {
        return;
    }
    for (var i in obj) {
        newobj[i] = typeof obj[i] === 'object' ?
        deepCopy(obj[i]) : obj[i];
    }
    return newobj
}