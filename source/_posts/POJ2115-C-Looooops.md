---
title: 「POJ-2115」C Looooops-扩展欧几里德
date: 2017-01-03 17:01:46
tags:
  - 数学
  - 扩展欧几里德
categories:
  - OI
  - 数学
---
A Compiler Mystery: We are given a C-language style for loop of type
for (variable = A; variable != B; variable += C)

  statement;

I.e., a loop which starts by setting variable to value A and while variable is not equal to B, repeats statement followed by increasing the variable by C. We want to know how many times does the statement get executed for particular values of A, B and C, assuming that all arithmetics is calculated in a k-bit unsigned integer type (with values 0 <= x < 2 k) modulo 2 k.
<!-- more -->
### 链接
[POJ-2115](http://poj.org/problem?id=2115)
### 题解
直接套板子...
### 代码
``` cpp
#include <iostream>
#include <cstdio>
#include <cstring>
#include <algorithm>
typedef long long ll;
ll A, B, C, k;
inline void exgcd(ll a,ll b,ll &g,ll &x,ll &y) {
    if (!b) x = 1, y = 0, g = a;
    else exgcd(b, a % b, g, y, x), y -= x * (a / b);
}
int main(){
    while (scanf("%lld%lld%lld%lld", &A, &B, &C, &k) != EOF) {
        if (!A && !B && !C && !k) break;
        ll c = B - A, a = C, b = 1LL << k, g, x, y;
        exgcd(a, b, g, x, y);
        if (c % g) printf("FOREVER\n");
        else b /= g, c /= g, printf("%lld\n", (x % b * c % b + b) % b);
    }
    return 0;
}
```

