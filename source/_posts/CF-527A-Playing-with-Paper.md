---
title: 「CF-527A」Playing with Paper-模拟
date: 2017-01-03 16:54:08
tags:
  - 数论
  - 模拟
categories:
  - OI
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

