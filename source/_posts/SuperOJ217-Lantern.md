---
title: 「SuperOJ 217」灯笼
date: 2016-07-27 12:41:25
tags:
  - 模拟
categories: 
  - OI
  - 模拟
---
## 灯笼
### 题目描述
2012 年国庆节的时候，成都人民公园的树上挂了 N 个灯笼来村托节日气氛。现在国庆节结束了，需要将树上的灯笼都取下来。公园将这个任务安排给石室中学的小航。但是小航身高有限，当他不能直接用手取到灯笼的时候，他可以踩到一个 30 厘米高的凳子上试一试。
现在已知每个灯笼到地面的高度，以及小航把手伸直的时候能够达到的最大高度，请帮小航算一下他能够取到灯笼的数目。假设他碰到灯笼，灯笼就可以取下来。
<!-- more -->
### 输入格式
输入文件包括两行数据：
第一行包括两个正整数 N（5 \leq N \leq 200） 和 M（100 \leq M \leq 150）的整数，分别表示灯笼的数量和小航伸手能达到的最大高度（以厘米为单位）。
第二行包含 N 个 100 到 200 之间（包括 100 和 200）的整数（以厘米为单位），分别表示N个灯笼到地面的高度，两个相邻的整数之间用一个空格隔开。 
### 输出格式
输出文件包括一行，这一行只包含一个整数，表示小航能够取到的灯笼数目。
### 样例数据 1
#### 输入
``` bash
10 110
100 200 150 140 129 134 167 198 200 111
```
#### 输出
``` bash
5
```
### 分析
简单模拟。
### 源码
``` cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    int n, h;
    int count = 0;
    cin >> n >> h;
    h += 30;
    int tmp;
    while (n--) {
        cin >> tmp;
        if (tmp <= h) count++;
    }
    cout << count;
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=766020&auto=1&height=66"></iframe>