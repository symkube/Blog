---
title: HTML图片排版
date: 2016-07-07 10:53:10
tags:
  - HTML
categories: 
  - HTML
---
## HTML图片排版
### float
使文字包围图片,只需要用style中的float即可。
``` html
style="float:left;"
```
### margin
只使用float会出现一个问题,文字会紧贴图片,所以我们可以用margin来调整间距。
``` html
<img src="" style="float:left;margin-right:10px;margin-top:10px;margin-bottom:10px;">
```
<!-- more -->
### shadow
这样修改以后,比最初已美观许多,然而我们可以再为她加上一个带阴影的边框。
``` html
<img src="" style="float:left;margin-right:10px;margin-top:10px;margin-bottom:10px;-webkit-box-shadow:0 0 10px rgba(0, 204, 204, .5);  
  -moz-box-shadow:0 0 10px rgba(0, 204, 204, .5);  
  box-shadow:0 0 10px rgba(0, 204, 204, .5);width:240px;height:180px;">
```
**最终效果可见[首页](http://blog.xehoth.cc)**
