---
title: 「Hexo」gitalk 评论
date: 2017-08-20 19:53:49
tags:
  - Hexo
categories:
  - Development
  - Hexo
---
各种评论服务都挂了后，感觉还是 github 最靠谱，[Gitalk](https://github.com/gitalk/gitalk/blob/master/readme-cn.md) 是一个基于 Github Issue 和 Preact 开发的评论插件。  
这里记录 Hexo 使用 gitalk 作为评论插件的修改方法（支持 markdown + mathjax）。

<!-- more -->

### 使用方法
#### Github Application
Gitalk 需要 Github Application，如果没有请点击 [Register a new OAuth application](https://github.com/settings/applications/new) 注册，**注意** `Authorization callback URL` 要填写使用插件的域名，比如我的博客就填写的 [https://blog.xehoth.cc](https://blog.xehoth.cc)。

#### 安装 gitalk
``` bash
npm i --save gitalk
```
然后我们可以在 `node_modules` 找到 `gitalk`，我们只需要其中 `dist` 目录下的 `gitalk.css`，`gitalk.css.map`，`gitalk.js`，`gitalk.js.map`，将其复制到主题对应目录下。

**注意：**我尝试过使用 `gitalk.min.js`，但出现了一些~~玄学~~错误，所以这里用的 `gitalk.js`，然后用个插件压缩一下就好。

#### 引入 & 调用
在主题 `layout/_partial` 里找到 `head.ejs` 在其中加入 `gitalk.js` 和 `gitalk.css` 的引入。
``` html
<link rel="stylesheet" href="<%- theme.root_url %>/css/gitalk.css">
<script src="<%- theme.root_url %>/js/gitalk.js"></script>
```
当然你也可以直接引入 cdn......

然后在 `article.ejs` 中加入
``` html
<% if (!index && post.comments){ %>
    <div id="gitalk-container" style="display: inline-block; width: 90%; margin-left: 4%;"></div>
    <script type="text/javascript">
        var gitalk = new Gitalk({
            clientID: 'Github Application Client ID',
            clientSecret: 'Github Application Client Secret',
            repo: 'Github repo',
            owner: 'Github repo owner',
            admin: ['Github repo collaborators'],
        });

        gitalk.render('gitalk-container')
    </script>
<% } %>
```
其中 `clientID`，`clientSecret` 都可以在 Github Application 找到，`repo` 只用来存放评论的项目，你可以新建一个，然后填项目名，另外两个填自己的 id 就好。

#### 添加 mathjax 支持
在 `footer.ejs` 或 `after-footer.ejs` 中加入
``` html
<script type="text/x-mathjax-config">
    var mathId = document.getElementById("gitalk-container");
    MathJax.Hub.Config({
        showProcessingMessages: false,
        messageStyle: "none",
        extensions: ["tex2jax.js"],
        jax: ["input/TeX", "output/HTML-CSS"],
        tex2jax: {
            inlineMath:  [ ["$", "$"] ],
            displayMath: [ ["$$","$$"] ],
            skipTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'a'],
            ignoreClass:"comment-content"
        },
        "HTML-CSS": {
            availableFonts: ["STIX","TeX"]
        }
    });
    if (mathId != null) {
        window.onload = function() {
            $(".gt-container").bind("DOMNodeInserted", function() {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub], document.getElementById("gitalk-container"));
            })
            MathJax.Hub.Queue(["Typeset", MathJax.Hub], mathId);
        }
    }
</script>
<script src="<%- theme.CDN.mathjax %>?config=TeX-AMS-MML_HTMLorMML" async="async">
</script>
```
由于 gitalk 的输入框会引起已经渲染的公式失效，所以我们用 JQuery 监听 `gt-container` 就行了。

