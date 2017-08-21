---
title: 「SuperOJ 221」解密
date: 2016-07-27 20:54:58
tags:
  - 字符串
categories: 
  - oi
  - 字符串
---
## 解密
### 题目描述
为了保密，QW 星球使用了特殊的指令，指令以字符的形式发出，并且应用了加密策略。现在，他们的加密规则被我们熟悉，原来规则如此有趣：将所有 a～z 或 A～Z 字母变成它的后继，例如“A”变成“B”，“a”变成“b”,“Z”变成“A”，“z”变成“a”，其他非字母的字符保持不变。现在请你破译接收到的一串指令。
<!-- more -->
### 输入格式
输入文件只有一行，是一串经过 QW 星球加密的字符，字符个数不超过 2000 个，该串字符以“#”标志结束，所以“#”不算密码的一部分。
### 输出格式
输出文件只有一行，是一串字符，就是经过解密后的密码原文。
### 样例数据 1
#### 输入
``` bash
A2k6D*Z#
```
#### 输出
``` bash
Z2j6C*Y
```
### 分析
一般的字符串处理...
### 源码
``` cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    char c;
    while ((c = cin.get()) != '#') {
        if ((c >= 'b' && c <= 'z') || (c >= 'B' && c <= 'Z'))
            putchar(c - 1);
        else if (c == 'a')
            cout << 'z';
        else if (c == 'A')
            cout << 'Z';
        else
            cout << c;
    }
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=27669786&auto=1&height=66"></iframe>