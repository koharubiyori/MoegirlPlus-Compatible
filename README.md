## MoegirlPlus-Compatible

该项目为[Moegirl+](https://github.com/koharubiyori/Moegirl-plus-native]兼容模式渲染器。

如要使用请新建此内容的油猴脚本：

``` js
// ==UserScript==
// @name         moegirl+兼容模式调试
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://mzh.moegirl.org.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moegirl.org.cn
// @grant        none
// ==/UserScript==

(function() {
   const jsUrl = 'http://localhost:9900/main.js?' + Date.now() + Math.random().toString(16).slice(2)
   const scriptTag = document.createElement('script')
   scriptTag.src = jsUrl
   document.head.append(scriptTag)
})();
```







