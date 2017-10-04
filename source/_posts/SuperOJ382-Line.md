---
title: 「SuperOJ 382」连线游戏
date: 2016-07-16 21:35:36
tags: 
  - STL
categories: 
  - OI
  - STL
---
## 连线游戏
### 题目描述
Farmer John 最近发明了一个游戏，来考验自命不凡的贝茜。游戏开始的时候，FJ会给贝茜一块画着 $N(2 \leq N \leq 200)$ 个不重合的点的木板，其中第 $i$ 个点的横,纵坐标分别为 $X_i$ 和 $Y_i (-1000 \leq X_i, Y_i \leq 1000)$。

贝茜可以选两个点画一条过它们的直线，当且仅当平面上不存在与画出直线平行的直线。游戏结束时贝茜的得分，就是她画出的直线的总条数。为了在游戏中胜出，贝茜找到了你，希望你帮她计算一下最大可能得分。 
### 输入格式
第 $1$ 行: 输入 $1$ 个正整数：$N$ 

第 $2 \cdots N+1$ 行: 第 $i+1$ 行用 $2$ 个用空格隔开的整数 $X_i, Y_i$，描述了点 $i$ 的坐标。
### 输出格式
输出 $1$ 个整数，表示贝茜的最大得分，即她能画出的互不平行的直线数。
<!-- more -->
### 样例数据 1
#### 输入
``` bash
4
-1 1
-2 0
0 0
1 1
```
#### 输出
``` bash
4
```
### 备注
#### 【输出说明】
贝茜能画出以下 $4$ 种斜率的直线：$-1, 0, \frac {1} {3}$ 以及 $1$。
### 分析
去重,统计个数,STL set秒杀题。
### 源码
``` cpp
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <iostream>
#include <set>
#define INF 0x7ffffff
using namespace std;
set<float> s;
int x[300], y[300];
int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    cin >> n;
    for (register int i = 0; i < n; i++) cin >> x[i] >> y[i];
    for (register int i = 0; i < n; i++) {
        for (register int j = i + 1; j < n; j++) {
            register int x1 = x[i] - x[j], y1 = y[i] - y[j];
            if (x1 == 0)
                s.insert(INF);
            else
                s.insert((float)y1 / x1);
        }
    }
    cout << s.size();
    return 0;
}
```
