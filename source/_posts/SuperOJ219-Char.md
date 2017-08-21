---
title: 「SuperOJ 219」字符个数
date: 2016-07-27 20:46:52
tags:
  - 字符串
categories: 
  - oi
  - 字符串
---
## 字符个数
### 题目描述
输入一串字符，以“?”结束。分别统计其中字母的个数,数字个数和其它符号的个数。
其中字母个数是指大,小写字母的总数，及 A—— Z 和 a —— z；
其中数字指从 0—— 9 范围的数字。
三个统计数字在一行，分别用一个空格隔开，“？”不参与统计。
<!-- more -->
### 输入格式
输入文件中只有一行，即一串字符，字符个数小于 200；
### 输出格式
输出文件中只有一行，是分别用空格隔开的三个数字，分别是输入字符串中包含的字母个数,数字个数和其它符号的个数。
### 样例数据 1
#### 输入
``` bash
AB234*#ef?
```
#### 输出
``` bash
4 3 2
```
### 分析
普通的字符串统计题,直接判断,计数器累加就好...
### 源码
``` cpp
#include <bits/stdc++.h>
using namespace std;
int ans1, ans2, ans3;
char tmp;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    while ((tmp = cin.get()) ^ '?') {
        if ((tmp >= 'a' && tmp <= 'z') || (tmp >= 'A' && tmp <= 'Z'))
            ans1++;
        else if (tmp >= '0' && tmp <= '9')
            ans2++;
        else
            ans3++;
    }
    cout << ans1 << " " << ans2 << " " << ans3;
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=730690&auto=1&height=66"></iframe>