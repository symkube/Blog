---
title: 「POJ-1284」Primitive Roots-原根+欧拉函数
date: 2017-01-03 17:28:44
tags:
  - 数学
  - 原根
  - 欧拉函数
  - 线筛
categories:
  - OI
  - 数学
---
We say that integer x, 0 < x < p, is a primitive root modulo odd prime p if and only if the set { (xi mod p) | 1 <= i <= p-1 } is equal to { 1, ..., p-1 }. For example, the consecutive powers of 3 modulo 7 are 3, 2, 6, 4, 5, 1, and thus 3 is a primitive root modulo 7.
Write a program which given any odd prime 3 <= p < 65536 outputs the number of primitive roots modulo p.
<!-- more -->
### 链接
[POJ-1284](http://poj.org/problem?id=1284)
### 题解
结论题，一个质数 $p$ 的原根为 $phi(p - 1)$，然后就没有了...

证明?~~我也不会...~~
### 代码
``` cpp
#include <cstdio>
#include <iostream>
#include <algorithm>
#include <cctype>
#include <climits>
#include <ctime>
#include <cstdlib>
const int MAXN = 70000;
int phi[MAXN + 10], prime[MAXN + 10], mu[MAXN + 10], tot;
bool vis[MAXN + 10];
inline void init() {
    mu[1] = phi[1] = 1;
    for (register int i = 2; i <= MAXN; i++) {
        if (!vis[i]) prime[++tot] = i, phi[i] = i - 1, mu[i] = -1;
        for (register int j = 1; j <= tot && i * prime[j] <= MAXN; j++) {
            vis[i * prime[j]] = 1;
            if (i % prime[j] == 0) {
                phi[i * prime[j]] = phi[i] * prime[j], mu[i * prime[j]] = 0;
                break;
            } else phi[i * prime[j]] = phi[i] * (prime[j] - 1), mu[i * prime[j]] = -mu[i];
        }
    }
}
int main() {
    init();
    register int t;
    std::ios::sync_with_stdio(0), std::cin.tie(0);
    while (std::cin >> t) std::cout << phi[t - 1] << "\n";
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=27669789&auto=1&height=66"></iframe>
