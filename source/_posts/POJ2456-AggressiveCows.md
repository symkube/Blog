---
title: 「POJ 2456」Aggressive cows
date: 2016-07-05 14:49:56
tags:
  - 二分
categories:
  - OI
  - 二分
---
## Aggressive cows
### 题目背景
[POJ2456](http://poj.org/problem?id=2456)
### 题目描述
农夫约翰搭了一间有 N 间牛舍的小屋。牛舍排在一条线上，第 i 号牛舍在 $X_i$ 的位置。但是他的 M 头牛对小屋很不高兴，因此经常互相攻击。约翰为了防止牛之间互相伤害，因此决定把每头牛都放在离其他牛尽可能远的牛舍。也就是要最大化最近的两头牛之间的距离。
### 输入格式
输入第一行: 两个正整数 N 和 M。
接下来 N 行，每行一个整数 $X_i$。
### 输出格式
一个整数，即最近的两头牛之间的最大距离。
<!-- more -->
### 样例数据 1
输入
``` bash
5 3
1
2
8
4
9
```
输出
``` bash
3
```
### 备注
#### 数据范围
$2 \leq N \leq 100000, 2 \leq M \leq N, 0 \leq X_i \leq 10 ^ 9$
#### 样例说明
在位置 $1, 4, 9$ 的牛舍中放入三头牛，得到最长距离 $3$。
### 分析
看到数据量和最小化的最大值就会想到二分。
### 源码
``` cpp
#include <stdio.h>
#include <algorithm>
#include <iostream>
using namespace std;
char ch_buffer;
bool signum;
inline void readInt(int &l) {
    l = 0;
    do
        ch_buffer = getchar();
    while ((ch_buffer < '0' || ch_buffer > '9') && ch_buffer != '0' &&
           ch_buffer != '-');
    if (ch_buffer == '-') ch_buffer = getchar(), signum = true;
    while (ch_buffer <= '9' && ch_buffer >= '0')
        l = (l << 3) + (l << 1) + ch_buffer - '0', ch_buffer = getchar();
    if (signum) l = -l, signum = false;
}
#define MAX_N 100005
#define INF 0x7fffffff
int x[MAX_N];
int n, c;
inline bool check(int m) {
    int last = 0;
    for (int i = 1; i < c; i++) {
        /*当前的牛舍位置*/
        int cur = last + 1;
        while (cur < n && x[cur] - x[last] < m) cur++;
        /*只放下第一头牛，无法放下第二头牛，使二者的距离大于等于m*/
        if (cur == n) return false;
        last = cur;
        /*把第i头牛放在编号为cur的牛舍里*/
    }
    return true;
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    readInt(n), readInt(c);
    for (int i = 0; i < n; i++) readInt(x[i]);
    sort(x, x + n);
    int l = 0, r = INF;
    for (int i = 0; i < 100; i++) {
        int m = (l + r) >> 1;
        if (check(m))
            l = m;
        else
            r = m;
    }
    cout << l << endl;
    return 0;
}
```
