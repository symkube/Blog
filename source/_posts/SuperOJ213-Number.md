---
title: 「SuperOJ 213」数字分离
date: 2016-07-27 12:07:45
tags:
  - 字符串
categories: 
  - OI
  - 字符串
---
## 数字分离
### 题目描述
给定一个有6位数字的正整数，请你把它每位数字分离出来并求和。
### 输入格式
输入文件只有一个6位数字的正整数。
### 输出格式
输出文件有一个正整数，即分离出来每位数字之和。
<!-- more -->
### 样例数据 1
#### 输入
``` bash
123456
```
#### 输出
``` bash
21
```
### 分析
简单题,直接stringstream就好了...
### 源码
``` cpp
#include <bits/stdc++.h>
using namespace std;
stringstream ssm;
string num;
int sum;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cin >> num;
    for (register int i = 0, range = num.length(), tmp; i < range; i++)
        ssm << num[i], ssm>>tmp, ssm.clear(), sum += tmp;
    cout << sum;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=28230943&auto=1&height=66"></iframe>