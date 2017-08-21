---
title: 「SuperOJ 225」计算数字
date: 2016-07-27 21:07:20
tags:
  - DP
categories: 
  - oi
  - DP
---
## 计算数字
### 题目描述
当连续写下从十进制整数 1 开始到某个整数 N 之间的所有整数时，能得到如下的数字序列：
   12345678910111213141516171819202122 \cdots  \cdots 
编写一个程序，计算这个序列中的数字个数。
### 输入格式
输入的第一行且是唯一的一行包含：一个整数 N，1 \leq N \leq 100,000,000。
### 输出格式
输出的第一行且是唯一的一行应包含：由给定的整数所产生的序列的数字个数。
<!-- more -->
### 样例数据 1
#### 输入
``` bash
15
```
#### 输出
``` bash
21
```
### 分析
直接暴力肯定会TLE,数学方法递推。
### 源码
``` cpp
#include <bits/stdc++.h>
using namespace std;
int n, t = 1, p, ans;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cin >> n;
    for (; n / t; t = (t << 1) + (t << 3)) ans += ((t << 3) + t) * ++p;
    cout << ans - (t - n - 1) * p;
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=869390&auto=1&height=66"></iframe>