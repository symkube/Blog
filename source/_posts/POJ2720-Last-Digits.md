---
title: 「POJ-2720」Last Digits-欧拉函数
date: 2017-01-03 18:22:52
tags:
  - 数学
  - 欧拉函数
categories:
  - OI
  - 数学
---
Exponentiation of one integer by another often produces very large results. In this problem, we will compute a function based on repeated exponentiation, but output only the last n digits of the result. Doing this efficiently requires careful thought about how to avoid computing the full answer.

Given integers b, n, and i, we define the function f(x) recursively by f(x) = b f(x-1) if x > 0, and f(0)=1. Your job is to efficiently compute the last n decimal digits of f(i).
<!-- more -->
### 链接
[POJ-2720](http://poj.org/problem?id=2720)
### 题解
这是一道神题，令 $f(x) = a^x$ mod $m$，当 $x \geq \varphi (m)$ 时，$f(x) = a^{x \text { mod } \varphi (m) + \varphi(m)} \text { mod } m$，否则暴力就好了,
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
#include <iomanip>
int table[] = {1, 10, 100, 1000, 10000, 100000, 1000000, 10000000 };
inline int pow(int x, int y) {
    if (y < 0) return -1;
    register int ans = 1;
    for (register int i = 0; i < y; i++) {
        ans *= x;
        if (ans >= table[7]) return -1;
    }
    return ans;
}
const int MAXN = 3000;
typedef long long ll;
int phi[MAXN + 10], prime[MAXN + 10], tot;
bool vis[MAXN + 10];
int f[101][101], ans[101][101];
int getPhi(int x) {
    int ret = x;
    for (int i = 2; i * i <= x; i++) {
        if (x % i == 0) {
            ret = ret / i * (i - 1);
            for (; x % i == 0; x /= i);
        }
    }
    if (x != 1) {
        ret = ret / x * (x - 1);
    }
    return ret;
}
inline void init() {
    phi[1] = 1;
    for (register int i = 2; i <= MAXN; i++) {
        if (!vis[i]) prime[++tot] = i, phi[i] = i - 1;
        for (register int j = 1; j <= tot; j++) {
            if (i * prime[j] > MAXN) break;
            vis[i * prime[j]] = 1;
            if (i % prime[j] == 0) {
                phi[i * prime[j]] = phi[i] * prime[j];
                break;
            } else phi[i * prime[j]] = phi[i] * (prime[j] - 1);
        }
    }
    memset(ans, -1, sizeof(ans));
    for (register int i = 1; i < 101; i++) {
        f[i][0] = 1;
        for (register int j = 1; j < 101; j++)
            f[i][j] = pow(i, f[i][j - 1]);
    }
}
inline int modPow(ll x, int b, int mod) {
    register int ret = 1;
    for (; b; b >>= 1, x = x * x % mod) if (b & 1) ret = ret * x % mod;
    return ret;
}
inline int solve(int b, int x, int mod) {
    if (x == 0) return 1;
    if (mod == 1) return 0;
    if (f[b][x] < 0) {
        register int euler = getPhi(mod);
        return modPow(b, solve(b, x - 1, euler) + euler, mod);
    } else return f[b][x] % mod;
}
int main() {
    init();
    int b, i, n, ans;
    char format[] = "%00d\n";
    while (~scanf("%d", &b) && b) {
        scanf("%d%d", &i, &n);
        format[2] = char(n + '0');
        if (::ans[b][i] == -1) {
            if (b == 1) ans = 1;
            else ans = solve(b, i, table[7]);
            ::ans[b][i] = ans;
        }
        ans = ::ans[b][i] % table[n];
        printf(format, ans);
    }
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=28230943&auto=1&height=66"></iframe>
