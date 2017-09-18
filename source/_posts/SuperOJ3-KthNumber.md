---
title: 「SuperOJ 3」第 k 小整数
date: 2016-05-24 12:38:23
tags:
  - 排序
categories:
  - OI
  - 排序
---
## 第 k 小整数
### 题目描述
现有 $n$ 个正整数，$n \leq 10000$，要求出这 $n$ 个正整数中的第 $k$ 个最小整数（相同大小的整数只计算一次），$k \leq 4000$，正整数均小于 $30000$。
### 输入格式
第一行为 $n$ 和 $k$；
第二行开始为 $n$ 个正整数的值，整数间用空格隔开。
### 输出格式
第 $k$ 个最小整数的值；若无解，则输出 `NO RESULT`。
<!-- more -->
### 样例数据 1
输入
``` bash
10 3
1 3 3 7 2 5 1 2 4 6
```
输出
``` bash
3
```
### 样例数据 2
输入
``` bash
10 9
1 3 3 7 2 5 1 2 4 6
```
输出
``` bash
NO RESULT
```
### 源码
``` cpp
#include <algorithm>
#include <cstdio>
#include <cstring>
#include <iostream>
#include <vector>
#define MAX 30000
using namespace std;
bool num[MAX];
vector<int> vc;
int main() {
    int tmp, k;
    cin >> tmp >> k;
    while (cin >> tmp) num[tmp] = true;
    for (int i = 0; i < MAX; i++)
        if (num[i] == true) vc.push_back(i);
    sort(vc.begin(), vc.end());
    if (k > vc.size())
        cout << "NO RESULT";
    else
        cout << vc[k - 1];
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=874229&auto=1&height=66"></iframe>