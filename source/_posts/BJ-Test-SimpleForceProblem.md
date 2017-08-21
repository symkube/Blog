---
title: 「BJ模拟」简单精暴的题目-二项式定理
date: 2017-03-08 18:27:09
tags:
  - 数学
  - 二项式定理
categories:
  - oi
  - 数学
---
问题很简单，已知 $n, k, s(l)$，$\forall i \in N^+, i \leq n$，求 $\sum_{j = 1}^i (\sum_{l = j}^i s(l))^k) \text{ mod } 1000000007$。
即求:
<center>

$\sum_{j = 1}^1 (\sum_{l = j}^1 s(l))^k) \text{ mod } 1000000007$
<br>
$\sum_{j = 1}^2 (\sum_{l = j}^2 s(l))^k) \text{ mod } 1000000007$
<br>
$\cdots$
<br>
$\sum_{j = 1}^n (\sum_{l = j}^n s(l))^k) \text{ mod } 1000000007$

</center>

共 $n$ 个数，其中 $\sum_{i = a}^b f(i)$ 表示 $f(a) + \cdots + f(b)$ 的和。

<!-- more -->
### 链接
[THOJ25](http://thoj.xehoth.cc/problem/25)

### 题解
对于 $k$ 的整数倍的数，用二项式定理算出 $F(i - k, 1) \cdots F(i - k, k)$ 对 $F(i, 1) \cdots F(i, k)$ 的贡献，而 $i - k + 1 ~ i - 1$ 的数暴力计算贡献，对于 $k$ 的非整数倍位置上的数，利用上一个整数倍位置的数，以及快速幂直接计算 $F(i, k)$。

时间复杂度为 $O(\frac {n} {k} \times (k^2 + k^ \text{ log } k) + (n - \frac {n} {k}) \times (k + k \text{ log } k)) = O(nk \text{ log } k)$

### 代码
``` cpp
/*
 * created by xehoth on 08-03-2017
 */
#include <bits/stdc++.h>
#ifndef XEHOTH_HEADER
#define XEHOTH_HEADER
namespace xehoth {

namespace io {

template<class T>
inline T parseFloat(char *str) {
    char *s = str;
    if (*s == '0' || *s == '\0') return 0.0;
    register T sum = 0.0;
    register int flag = 1, pow = 0;
    if(*s == '-') flag = -1, s++;
    while (*s != '\0') {
        if(*s == '.') {
            pow = 1, s++;
            continue;
        }
        sum = *s - '0' + sum * 10, pow *= 10, s++;
    }
    return flag * sum / pow;
}

template<size_t size = 1000000>
struct BufferedInputStream {
    char buf[size], *s, *t;

    inline char read() {
        if (s == t) {
            t = (s = buf) + fread(buf, 1, size, stdin);
            if (s == t) return -1;
        }
        return *s++;
    }

    inline void read(char &c) {
        c = read();
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

    inline int read(char *buf) {
        register size_t s = 0;
        register char ch;
        while (ch = read(), isspace(ch) && ch != -1);
        if (ch == EOF) {
            *buf = '\0';
            return -1;
        }
        do buf[s++] = ch; while (ch = read(), !isspace(ch) && ch != -1);
        buf[s] = '\0';
        return s;
    }

    inline void read(float &x) {
        static char buf[64];
        read(buf);
        x = parseFloat<float>(buf);
    }

    inline void read(double &x) {
        static char buf[128];
        read(buf);
        x = parseFloat<float>(buf);
    }

    template<class T1, class T2>
    inline void read(T1 &a, T2 &b) {
        read(a), read(b);
    }

    template<class T1, class T2, class T3>
    inline void read(T1 &a, T2 &b, T3 &c) {
        read(a), read(b), read(c);
    }

    template<class T1, class T2, class T3, class T4>
    inline void read(T1 &a, T2 &b, T3 &c, T4 &d) {
        read(a), read(b), read(c), read(d);
    }

    inline int nextInt() {
        register int i;
        read(i);
        return i;
    }

    inline long nextLong() {
        register long i;
        read(i);
        return i;
    }

    inline float nextFloat() {
        register float i;
        read(i);
        return i;
    }

    inline double nextDouble() {
        register double i;
        read(i);
        return i;
    }
};
 
template<size_t size = 1000000>
struct BufferedOutputStream {
    char buf[size], *s;

    inline void print(char c) {
        if (s == buf + size) fwrite(buf, 1, size, stdout), s = buf;
        *s++ = c;
    }

    inline void print(const char *s) {
        char *p = s;
        while (*p != '\0') print(*p++);
    }

    template<class T>
    inline void println(T x) {
        print(x), print('\n');
    }

    template<class T>
    inline void print(T x) {
        static int buf[30], cnt, y;
        if (x == 0) {
            print('0');
        } else {
            if (x < 0) print('-'), x = -x;
            for (; x; x = y) y = x / 10, 
                buf[++cnt] = x - (y + (y << 2) << 1) + 48;
            while (cnt) print((char)buf[cnt--]);
        }
    }

    template<class T1, class T2>
    inline void print(T1 a, T2 b) {
        print(a), print(b);
    }

    template<class T1, class T2, class T3>
    inline void print(T1 a, T2 b, T3 c) {
        print(a), print(b), print(c);
    }

    template<class T1, class T2, class T3, class T4>
    inline void print(T1 a, T2 b, T3 c, T4 d) {
        print(a), print(b), print(c), print(d);
    }

    template<class T1, class T2>
    inline void println(T1 a, T2 b) {
        print(a), println(b);
    }

    template<class T1, class T2, class T3>
    inline void println(T1 a, T2 b, T3 c) {
        print(a), print(b), println(c);
    }

    template<class T1, class T2, class T3, class T4>
    inline void println(T1 a, T2 b, T3 c, T4 d) {
        print(a), print(b), print(c), println(d);
    }
    
    BufferedOutputStream() : s(buf) {}

    ~BufferedOutputStream() {
        fwrite(buf, 1, s - buf, stdout);
    }
};

}

}

typedef unsigned long long ull;
typedef unsigned int uint;
#define long long long

xehoth::io::BufferedInputStream<> in;
xehoth::io::BufferedOutputStream<> out;

#endif

const int MOD = 1000000007;
const int MAXN = 50010;

int C[101][101];

template<class T>
inline void add(T &x, const T val) {
    x += val;
    if (x >= MOD) x -= MOD;
}

inline void init(const int n) {
    for (register int i = 0; i <= n; i++) C[i][0] = 1;
    for (register int i = 1; i <= n; i++) {
        for (register int j = 1; j <= i; j++) {
            add(C[i][j], C[i - 1][j - 1]), add(C[i][j], C[i - 1][j]);
        }
    }
    for (register int i = 0; i <= n; i++) C[i][i] = 1;
}

inline int calculateContribute(int x) {
    return x & 1 ? -1 : 1;
}

int main() {
#ifndef ONLINE_JUDGE
    freopen("in.in", "r", stdin);
#endif
    register int n, k;
    in.read(n, k);
    static int s[MAXN];
    for (register int i = 1; i <= n; i++) in.read(s[i]);
    for (register int i = 1; i <= n; i++) add(s[i], s[i - 1]);
    init(k);
    static int t[MAXN] = {1}, buf[MAXN];
    for (register int i = 1; i <= n; i++) {
        buf[0] = 1;
        for (register int j = 1; j <= k; j++) buf[j] = (long)buf[j - 1] * s[i] % MOD;
        for (register int j = 0; j <= k; j++) t[j] = (t[j] + buf[j]) % MOD;
        register int ans = 0;
        for (register int x = 0; x <= k; x++) {
            ans = (ans + (long)calculateContribute(k - x) * 
                   C[k][x] * buf[x] % MOD * t[k - x]) % MOD;
        }
        if (ans < 0) ans += MOD;
        out.print(ans, ' ');
    }
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=26220032&auto=1&height=66"></iframe>