---
title: 「POJ-2891」Strange Way to Express Integers-扩展欧几里德
date: 2017-01-03 17:13:55
tags:
  - 数学
  - 扩展欧几里德
categories:
  - oi
  - 数学
---
Elina is reading a book written by Rujia Liu, which introduces a strange way to express non-negative integers. The way is described as following:
Choose k different positive integers a1, a2,  \cdots , ak. For some non-negative m, divide it by every ai (1  \leq  i  \leq  k) to find the remainder ri. If a1, a2,  \cdots , ak are properly chosen, m can be determined, then the pairs (ai, ri) can be used to express m.

“It is easy to calculate the pairs from m, ” said Elina. “But how can I find m from the pairs?”

Since Elina is new to programming, this problem is too difficult for her. Can you help her?
<!-- more -->
### 链接
[POJ-2891](http://poj.org/problem?id=2891)
### 代码
``` cpp
#include <cstdio>
#include <cstring>
#include <cstdlib>
#include <vector>
#include <algorithm>
#include <cmath>
#include <cctype>
#include <iostream>
typedef long long ll;
inline void exgcd(ll a, ll b, ll &g, ll &x, ll &y) {
    if (!b) x = 1, y = 0, g = a;
    else exgcd(b, a % b, g, y, x), y -= (a / b) * x;
}
int main() {
    std::ios::sync_with_stdio(0), std::cin.tie(0);
    register int n;
    register ll a, b, c1, c2, c, x, y, d;
    while (std::cin >> n) {
        std::cin >> a >> c1;
        register int f = 1;
        for (register int i = 1; i < n; i++) {
            std::cin >> b >> c2, exgcd(a, b, d, x, y), c = c2 - c1;
            if (c % d) f = 0;
            c /= d;
            ll t = b / d;
            x = (x * c % t + t) % t, c1 += a * x, a = a / d * b, c1 %= a;
        }
        if (f) std::cout << c1 << "\n";
        else std::cout << "-1\n";
    }
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=849739&auto=1&height=66"></iframe>
