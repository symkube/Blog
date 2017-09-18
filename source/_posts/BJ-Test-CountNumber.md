---
title: 「BJ模拟」计数-组合数+dp
date: 2017-03-06 10:42:38
tags:
  - 数学
  - DP
categories:
  - OI
  - DP
---
将 $n_1$ 个 $A$，$n_2$ 个 $B$，$n_3$ 个 $C$，$n_4$ 个 $D$ 排成一个序列。求问有多少种排列方案使得排成的序列任意相邻的两个字母不同。
<!-- more -->

### 题解
先将所有的 `A` 放置，考虑在相邻的两个 `A` 里面插入 `B`。

插完了之后就是 `..A..B..B..B..A..B..A..B..` 的形式。

> 由题意可以知道如果两个相邻字符相同，则它们之间必须插入一些其它字符；如果两个相邻字符不同，那么他们之间是可以插入一些其它字符。

那么原问题就变成在 $n$ 个区间中插入给定次数的 `C` 和 `D`。

每个区间只有一下四种类型:
1. C...DCDC
2. D...CDCD
3. CD...CDCD
4. DC...DCDC

枚举 **1** 出现了几次，就可以确定出 **2** 出现了几次，因为 `C` 和 `D` 的差是一定的。

那么 **3** 和 **4** 就是剩下的区间了，而这两种类型没有本质区别，只需要计算一个，然后将 $ans \times 2$ 就好了。剩下的就直接组合数了。

详细题解见[计数 Solution](/document/计数 Solution.html)

### 代码
``` cpp
/* 
 * created by xehoth on 04-03-2017
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

const int OUT_LEN = 1000000;
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

const int MAXN = 2005;
const int MOD = 1e9 + 7;

#define long long long
typedef unsigned int uint;

int C[MAXN][MAXN], p[MAXN], s1[MAXN], s2[MAXN];

inline uint getC(int x, int y) {
    return y < 0 ? x < 0 : C[x][y];
}

inline uint calc(int a, int b, int cnt) {
    if (a < b) std::swap(a, b);
    long ret = 0;
    for (register int i = a - b, r = std::min(a, cnt), j, k; i <= r; i++) {
        j = i - a + b, k = cnt - i - j;
        if (j >= 0 && j <= b && k >= 0 && a - i - k >= 0)
            (ret += (long)C[cnt][i] * C[cnt - i][j] % MOD * (long)p[k] % MOD * 
                        getC(a - i - k + cnt - 1, cnt - 1)) %= MOD;
    }
    return ret;
}

int main() {
#ifndef ONLINE_JUDGE
    freopen("in.in", "r", stdin);
#endif
    register int n1, n2, n3, n4;
    read(n1), read(n2), read(n3), read(n4);
    p[0] = C[0][0] = 1;
    register int max = std::max(n1 + n2, n3 + n4) + 1;
    for (register int i = 1; i < max; i++) p[i] = ((long)p[i - 1] << 1) % MOD;
    for (register int i = 1; i < max; i++) C[i][0] = 1;
    for (register int i = 1; i < max; i++)
        for (register int j = 1; j <= i; j++)
            C[i][j] = (C[i - 1][j - 1] + C[i - 1][j]) % MOD;

    for (register int i = 0, r = n1 + n2; i <= r; i++) 
        s1[i + 1] = calc(n1, n2, i);
    for (register int i = 0, r = n3 + n4; i <= r; i++) 
        s2[i + 1] = calc(n3, n4, i);
    register long ans = 0;
    for (register int i = 1, r = n1 + n2 + 1; i <= r; i++) (ans += (long)s1[i] *
            (s2[i - 1] + (long)2 * s2[i] + s2[i + 1])) %= MOD;
    print(ans);
    flush();
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=793740&auto=1&height=66"></iframe>