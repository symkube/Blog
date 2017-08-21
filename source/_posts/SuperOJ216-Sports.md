---
title: 「SuperOJ 216」最佳运动员
date: 2016-07-27 12:38:01
tags:
  - 模拟
categories: 
  - oi
  - 模拟
---
## 最佳运动员
### 题目描述
国际运动协会组织了一个评选最佳运动员的活动，评选方式很特殊，只能由网名投票选举，各国的网民可以任选自己喜爱的运动员，得票最高者当选。现在组织者想知道当选者的票数，请你帮他完成。
<!-- more -->
### 输入格式
输入文件中第一行是一个整数 n（1 \leq n \leq 10000）
第二行是一组用空格隔开的 n 个整数，分别表示每个运动员的票数总和。
### 输出格式
输出文件中只有一个整数，即最高选票值。
### 样例数据 1
#### 输入
``` bash
3
54325 678 321
```
#### 输出
``` bash
54325
```
### 分析
一道水题...
### 源码
``` cpp
#include <bits/stdc++.h>
using namespace std;
#define max(x,y) (x ^ ((x ^ y) & -(x < y)))
int ans, tmp;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cin >> tmp;
    while (cin >> tmp) ans = max(ans, tmp);
    cout << ans;
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=850611&auto=1&height=66"></iframe>