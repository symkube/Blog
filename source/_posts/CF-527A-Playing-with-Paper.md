---
title: 「CF-527A」Playing with Paper-模拟
date: 2017-01-03 16:54:08
tags:
  - oi
  - c++
  - 数论
  - 模拟
categories:
  - oi
  - 数论
---
One day Vasya was sitting on a not so interesting Maths lesson and making an origami from a rectangular a mm  ×  b mm sheet of paper (a > b). Usually the first step in making an origami is making a square piece of paper from the rectangular sheet by folding the sheet along the bisector of the right angle, and cutting the excess part.
<!-- more -->
### 链接
[CF-527A](http://codeforces.com/problemset/problem/527/A)
### 题解
直接模拟，什么都不要多想...
### 代码
``` cpp
#include <bits/stdc++.h>
long long a, b, q;
int main() {
    for (std::cin >> a >> b; a;) a ^= b ^= a ^= b, q += a / b, a %= b;
    std::cout << q;
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=849691&auto=1&height=66"></iframe>
