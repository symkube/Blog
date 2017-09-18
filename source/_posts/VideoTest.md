---
title: 视频播放测试
date: 2016-06-29 22:23:29
tags:
  - 测试
categories:
  - 测试
---
## 视频播放测试
<br>
### 使用
使用 [hexo bilibili插件](https://github.com/Z4Tech/hexo-tag-bilibili),可以很方便地插入b站视频
``` git
npm install --save hexo-tag-bilibili
```
`_config.yml` 更改新增
``` yml
bilibili:
  width: 452
  height: 544
```
<!-- more -->
### 格式
av_id即av号,page即p数
``` html
{% bilibili [av_id] %}
or
{% bilibili [av_id] [page] %}
```
### 测试
{% bilibili 706%}
