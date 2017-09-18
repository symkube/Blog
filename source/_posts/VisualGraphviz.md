---
title: 「开发」VisualGraphviz
date: 2017-06-19 17:17:29
tags:
  - Development
  - Java
categories:
  - Development
  - Java
---
[Graphviz](http://www.graphviz.org/) 可以方便地画出流程图，但 OI 中想用它快速画出有向/无向图，带权图还是较为麻烦。

于是我用 Java 写了一个跨平台的可视化工具 ([VisualGraphviz](https://github.com/xehoth/VisualGraphviz)) 来实现预览，生成，导出等功能，使用中的 bug 也请告诉我一下。

<div class="github-widget" data-repo="xehoth/VisualGraphviz"></div>

<!-- more -->

### 安装
#### 下载
在 [release](https://github.com/xehoth/VisualGraphviz/releases) 页面下载。

#### 安装 Graphviz & Java
在使用 VisualGraphviz 之前，请先安装 [Graphviz](http://www.graphviz.org/) 和 [Java](https://www.java.com).

然后把他们添加进系统环境变量。

### 使用方法
- 点击 `paint` 或按下 `ctrl-p` 生成预览图。
- 点击 `export` 导出图片。
- 如果为带权图，勾选 `hasWeight`。
- 如果为有向图，勾选 `isDirected`。
- 在右侧文本框输入这个图。
- 在 `config` 文件中配置是否启用自动绘制和数据保存。

**被导出的图片为 `export.xxx`**，程序在运行时还可能会创建 `tmp.png` 和 `tmp.dot`，你可以忽略它们。

### 预览图
![预览](/images/VisualGraphviz.png)

### Todo
- [ ] 优化性能。
- [ ] 美化界面。
- [ ] 增加其他支持导出样式的预览。

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=28534501&auto=1&height=66"></iframe>