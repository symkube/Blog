---
title: 「POJ-3421」X-factor Chains-质因数分解
date: 2017-01-03 16:24:56
tags:
  - 数学
  - 质因数分解
categories:
  - OI
  - 数学
---
Given a positive integer X, an X-factor chain of length m is a sequence of integers,

$1 = X_0, X_1, X_2,  \cdots , X_m = X$

satisfying

$X_i < X_i+1$ and $X_i | X_i+1$ where a | b means a perfectly divides into b.

Now we are interested in the maximum length of X-factor chains and the number of chains of such length.
<!-- more -->
### 链接
[POJ-3421](http://poj.org/problem?id=3421)
### 题解
分解质因数，然后求幂和的阶乘/幂阶乘的和...
### 代码
``` cpp
#include <cstdio>
#include <cstring>
#include <cstdlib>
#include <algorithm>
#include <cmath>
#include <cctype>
#include <iostream>
typedef long long ll;
const int MAXN = 20;
ll fac[MAXN + 5];
inline void init() {
    fac[1] = 1;
    for (register int i = 2; i <= MAXN; i++) fac[i] = i * fac[i - 1];
}
int main() {
    std::ios::sync_with_stdio(0), std::cin.tie(0);
    init();
    ll n;
    while (std::cin >> n) {
        int ans = 0;
        ll b = 1;
        for (ll i = 2; i * i <= n; i++) {
            if (n % i == 0) {
                register int cnt = 0;
                while (n % i == 0) cnt++, n /= i;
                ans += cnt;
                b *= fac[cnt];
            }
        }
        if (n > 1) ans += 1;
        printf("%d %lld\n", ans, fac[ans] / b);  
    }
    return 0;
}
```

