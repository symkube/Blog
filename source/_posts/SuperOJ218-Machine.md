---
title: 「SuperOJ 218」老旧的机器
date: 2016-07-27 20:42:52
tags:
  - DP
categories: 
  - oi
  - DP
---
## 老旧的机器
### 题目描述
伟大的工程师阿克蒙德买了一台机器，为了维持这台机器的正常运作，他每年必须花费一定的费用来维修这台机器。但是随着这台机器的使用，机器会损坏更快以至于每年用来维修这台机器的费用都是上一年的 1.5 倍。已知第一年仅需花费 1 元。现在阿克蒙德想知道，如果他想用 n 年，他总共需要花费多少钱来维修这台机器。
<!-- more -->
### 输入格式
输入文件中只有一个整数 n，表示阿克蒙德想用 n 年，已知1 \leq n \leq 40 。
### 输出格式
输出文件中只有一个整数，表示维修的总费用。结果四舍五入到个位（即只保留整数）。
### 样例数据 1
#### 输入
``` bash
3
```
#### 输出
``` bash
5
```
### 分析
简单递推题,**但注意输出格式,据某同学经验,谨慎使用floor**,直接(int)强转就好。
### 源码
``` cpp
#include <bits/stdc++.h>
using namespace std;
int n;
float sum;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cin >> n;
    if (n ^ 1) {
        for (register int i = 1, range = n; i < n; i++) sum += pow(1.5, i);
        cout << (int)(sum + 1.5);
    } else
        cout << "1";
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=834433&auto=1&height=66"></iframe>