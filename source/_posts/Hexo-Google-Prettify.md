---
title: 「Hexo」使用 Google Prettify 高亮代码
date: 2017-06-13 16:31:07
tags:
---
Hexo 的默认代码高亮使用 [highlight.js](https://highlightjs.org/)，但是它对 c++ 支持十分不好，导致一些代码无法高亮，我尝试使用 [prism](http://prismjs.com/) 和 [pygments](http://pygments.org/)，均无效，最后使用了 [Google Prettify](https://github.com/google/code-prettify) 来高亮代码。

<!-- more -->

由于关闭 Hexo 的高亮会引发一些奇怪的 bug，我们这里就不关闭，而采取替换的方法。

### 引入
采用 [bootcss](http://www.bootcdn.cn/) 的 cdn，并引入。

然后在 [color-themes-for-google-code-prettify](https://jmblog.github.io/color-themes-for-google-code-prettify/) 找到一个高亮主题并下载，我这里下的是 `tomorrow.min.css`。
``` html
<script src="//cdn.bootcss.com/prettify/r298/prettify.min.js" type="text/javascript"></script>
<link rel="stylesheet" href="<%- theme.root_url %>/tomorrow.min.css" type="text/css">
```

### 渲染
由于没有禁用 Hexo 的默认高亮，先删去主题里的高亮，然后添加以下代码
``` html
<script>
$(window).load(function(){
    $('pre').addClass('prettyprint');
    prettyPrint();
})
</script>
```

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=28534502&auto=1&height=66"></iframe>