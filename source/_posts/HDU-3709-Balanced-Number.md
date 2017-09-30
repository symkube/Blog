---
title: 「HDU 3709」Balanced Number-数位 dp
date: 2017-09-26 19:56:09
tags:
  - DP
  - 数位DP
categories:
  - OI
  - DP
  - 数位DP
---
求 $[l, r]$ 中平衡数的个数，平衡数就是一某一位为支点，两侧的力矩相等。

<!-- more -->

### 链接
[HDU 3709](http://acm.hdu.edu.cn/showproblem.php?pid=3709)

### 题解
显然是数位 DP，先看数据范围 $T \leq 30, 0 \leq l \leq r \leq 10 ^ {18}$，直接并不好做。

我们发现支点的位置不会超过 $18$ 个，所以我们可以枚举支点的位置，在做数位 DP 记忆化搜索的时候，记录下两侧力矩之和即可。

### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「HDU 3709」Balanced Number 26-09-2017
 * 数位 dp
 * @author xehoth
 */
#include <bits/stdc++.h>

namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template <typename T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (iosig = false, c = read(); !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read()) x = x * 10 + (c ^ '0');
    iosig ? x = -x : 0;
}

inline int read(char *buf) {
    register int s = 0;
    register char c;
    while (c = read(), isspace(c) && c != -1)
        ;
    if (c == -1) {
        *buf = 0;
        return -1;
    }
    do
        buf[s++] = c;
    while (c = read(), !isspace(c) && c != -1);
    buf[s] = 0;
    return s;
}

const int OUT_LEN = 10000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template <typename T>
inline void print(T x) {
    static int buf[30], cnt;
    if (x == 0) {
        print('0');
    } else {
        x < 0 ? (print('-'), x = -x) : 0;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void print(const char *s) {
    for (; *s; s++) print(*s);
}

inline void flush() { fwrite(obuf, 1, oh - obuf, stdout); }

struct InputOutputStream {
    template <typename T>
    inline InputOutputStream &operator>>(T &x) {
        read(x);
        return *this;
    }

    template <typename T>
    inline InputOutputStream &operator<<(const T &x) {
        print(x);
        return *this;
    }

    ~InputOutputStream() { flush(); }
} io;
}

namespace {

#define long long long

using IO::io;

int digit[20];
long f[20][20][9 * 9 * 9 * 2 + 1];

inline long dfs(int pos, int now, int sum, int limit) {
    if (sum < 0) return 0;
    if (pos < 1) return sum == 0;
    if (!limit && f[pos][now][sum] != -1) return f[pos][now][sum];
    register int end = limit ? digit[pos] : 9;
    register long ret = 0;
    for (register int i = 0; i <= end; i++)
        ret += dfs(pos - 1, now, sum + (pos - now) * i, limit && i == end);
    return !limit ? f[pos][now][sum] = ret : ret;
}

inline long solve(long x) {
    if (x < 0) return 0;
    register int len = 0;
    for (; x; x /= 10) digit[++len] = x % 10;
    register long ret = 0;
    for (register int i = 1; i <= len; i++) ret += dfs(len, i, 0, 1);
    return ret - len + 1;
}

inline void solve() {
    register int T;
    io >> T;
    memset(f, -1, sizeof(f));
    for (register long l, r; T--;) {
        io >> l >> r;
        io << solve(r) - solve(l - 1) << '\n';
    }
}
#undef long
}

int main() {
    solve();
    return 0;
}
```

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=785112&auto=1&height=66"></iframe>