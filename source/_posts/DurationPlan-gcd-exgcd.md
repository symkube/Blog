---
title: 「补档计划」欧几里得与扩展欧几里得算法
date: 2017-04-14 09:28:34
tags:
  - 补档计划
  - 数学
categories:
  - OI
  - 补档计划
---
这里重新复习一下扩展欧几里得算法的常见应用。
<!-- more -->
### 欧几里得算法
这个相信大家都会
``` cpp
#include <bits/stdc++.h>

inline int gcd(int a, int b) {
    return !b ? a : gcd(b, a % b);
}

int main() {
    std::cout << std::__gcd(3, 9) << std::endl;
    std::cout << gcd(3, 9) << std::endl;
}
```
### 扩展欧几里得算法
对于不完全为 $0$ 的非负整数 $a, b$，$gcd(a, b)$ 表示 $a, b$ 的最大公约数，必然存在整数对 $x, y$，使得 $gcd(a, b) = ax + by$。

#### 证明
不妨设 $a > b$，显然当 $b = 0$, $gcd(a, b) = a$。此时 $x = 1, y = 0$。

当 $ab \neq 0$ 时，设 $ax_1 + by_1 = gcd(a, b)$，$bx_2 + (a \% b)y_2 = gcd(b, a \% b)$。

根据欧几里得原理有 $gcd(a, b) = gcd(b, a \% b)$。

则 $ax_1 + by_1 = bx_2 + (a \% b)y_2 = bx_2 + (a - (a / b) \cdot b)y_2 = ay_2 + bx_2 - (a / b)by_2$。

所以 $x_1 = y_2, y_1 = x_2 - (a / b) * y_2$，接下来不断递归就好了。
#### 代码
``` cpp
inline void exgcd(long a, long b, long &g, long &x, long &y) {
    !b ? (x = 1, y = 0, g = a) : (exgcd(b, a % b, g, y, x), y -= (a / b) * x);
}
```
#### 求解线性不定方程
对于不定整数方程 $ax + by = c$，若 $c \%  gcd(a, b) = 0$, 则该方程存在整数解，否则不存在整数解。

这里只求出一组特解。
``` cpp
inline bool linearEquation(long a, long b, long c, long &x, long &y) {
    register long g;
    exgcd(a, b, g, x, y);
    if (c % g) return false;
    register int k = c / g;
    x *= k, y *= k;
    return true;
}
```
#### 求解线性同余方程
$ax \equiv b \text{ (mod c)}$

可以转为不定方程然后求解，`ans` 为最小正整数解。
``` cpp
inline bool modularLinearEquation(long a, long b, long c, long &ans) {
    register long x, y, g;
    exgcd(a, c, g, x, y);
    if (b % g) return false;
    ans = (x * (b / g) % (c / g) + (c / g)) % (c / g);
    return true;
}
```
#### 求逆元
设 $MOD$ 为素数
``` cpp
inline long inv(const long num) {
    register long g, x, y;
    exgcd(num, MOD, g, x, y);
    return (x % MOD + MOD) % MOD;
}
```

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=691504&auto=1&height=66"></iframe>