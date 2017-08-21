---
title: 「BJ模拟」「HDU-5852」Intersection is not allowed!
date: 2017-03-28 19:43:17
tags:
  - 图论
  - 行列式
categories:
  - oi
  - 数学
---
有 $K$ 个棋子在一个大小为N×N的棋盘。一开始，它们都在棋盘的顶端，它们起始的位置是 $(1, a_1),(1, a_2),...,(1, a_k)$，它们的目的地是 $(n, b_1), (n, b_2),...,(n, b_k)$。

一个位于 $(r,c)$ 的棋子每一步只能向右走到 $(r, c + 1)$ 或者向下走到 (r + 1, c)$。

我们把 $i$ 棋子从 $(1, a_i)$ 走到 $(n, b_i)$ 的路径记作 $p_i$。

你的任务是计算有多少种方案把 $n$ 个棋子送到目的地，并且对于任意两个不同的棋子 $i,j$，使得路径 $p_i$ 与 $p_j$ 不相交（即没有公共点）。
<!-- more -->
### 链接
[HDU-5852](http://acm.hdu.edu.cn/showproblem.php?pid=5852)
### 题解
**Lindström–Gessel–Viennot 引理**，传送门[Lindström–Gessel–Viennot lemma - Wikipedia, the free encyclopedia](https://en.wikipedia.org/wiki/Lindstr%C3%B6m%E2%80%93Gessel%E2%80%93Viennot_lemma)

然后就是求一个行列式，然而我并不会高斯消元求行列式，直接转上三角矩阵，答案就是对角线元素的乘积。
### 代码
注意 HDU 上有多组数据，这份代码没有。
``` cpp
/*
 * created by xehoth on 28-03-2017
 */
#include <bits/stdc++.h>

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    if (s == t) {
        t = (s = buf) + fread(buf, 1, IN_LEN, stdin);
        if (s == t) return -1;
    }
    return *s++;
}

template<class T>
inline void read(T &x) {
    static bool iosig;
    static char c;
    for (iosig = false, c = read(); !isdigit(c); c = read()) {
        if (c == '-') iosig = true;
        if (c == -1) return;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    if (iosig) x = -x;
}

const int OUT_LEN = 10000000;
char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    if (oh == obuf + OUT_LEN) fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf;
    *oh++ = c;
}

template<class T>
inline void print(T x) {
    static int buf[30], cnt;
    if (x == 0) {
        print('0');
    } else {
        if (x < 0) print('-'), x = -x;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 + 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}

const int MAXN = 205;
const int MAXM = 100005;
const int MOD = 1e9 + 7;

#define long long long

namespace Task {

long a[MAXN][MAXN];

int sign;
int n, k;

inline long calculate(const int n) {
    register long ans = 1;
    for (register int i = 0; i < n; i++) {
        for (register int j = i + 1; j < n; j++) {
            register int x = i, y = j;
            while (a[y][i]) {
                register long t = a[x][i] / a[y][i];
                for (register int k = i; k < n; k++) {
                    a[x][k] = (a[x][k] - a[y][k] * t) % MOD;
                }
                std::swap(x, y);
            }
            if (x != i) {
                for (register int k = 0; k < n; k++) {
                    std::swap(a[i][k], a[x][k]);
                }
                sign ^= 1;
            }
        }
        if (a[i][i] == 0) return 0;
        else ans = ans * a[i][i] % MOD;
    }
    if (sign) ans = -ans;
    if (ans < 0) ans += MOD;
    return ans;
}

inline int modPow(int a, int b, int mod) {
    register int ans = 1;
    for (; b; b >>= 1, a = (long)a * a % mod)
        if (b & 1) ans = (long)ans * a % mod;
    return ans;
}

int fac[MAXM * 2 + 5], inv[MAXM * 2 + 5];

inline void init(const int n) {
    fac[0] = 1;
    for (register int i = 1; i <= n; i++) fac[i] = (long)fac[i - 1] * i % MOD;
    inv[n - 1] = modPow(fac[n - 1], MOD - 2, MOD);
    for (register int i = n - 2; i >= 0; i--) inv[i] = (long)inv[i + 1] * (i + 1) % MOD;
}

inline void solve() {
    read(n), read(k);
    init(n << 1 | 1);
    static int x[MAXN], y[MAXN];
    for (register int i = 0; i < k; i++) read(x[i]);
    for (register int i = 0; i < k; i++) read(y[i]);
    for (register int i = 0; i < k; i++) {
        for (register int j = 0; j < k; j++) {
            a[i][j] = y[j] < x[i] ? 0 : (long)fac[n - 1 + y[j] - x[i]] *
                      inv[n - 1] % MOD * (long)inv[y[j] - x[i]] % MOD;
        }
    }
    print(calculate(k) % MOD);

}
}


int main() {
#ifndef ONLINE_JUDGE
    freopen("in.in", "r", stdin);
#endif
    Task::solve();
    flush();
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=30854346&auto=1&height=66"></iframe>