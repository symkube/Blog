---
title: 「补档计划」动态规划
date: 2017-06-05 14:48:35
updateDate: 2017-06-13 16:48:35
tags:
  - 补档计划
  - DP
categories:
  - OI
  - 补档计划
---
dp 太弱，先补动规专题...

<!-- more -->
### 「UVA 11584」Partitioning by Palindromes
#### 链接
[UVA 11584](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=465&page=show_problem&problem=2631)
#### 题意
将一个字符串划分成若干个子串，使得每个子串都是回文串，求最少划分次数。
#### 题解
一道很简单的 dp，值得一提的是 [pkusc 2017](http://bailian.openjudge.cn/ty2017c/A/) 考了这道原题....
令 $f[i]$ 表示 $1 \cdots i$ 最少划分的次数，如果 $s_j \cdots s_i$ 为回文串，则 $f[i] = min(f[i], f[j - 1] + 1)$。
#### 代码
``` cpp
/**
 * 「UVA 11584」Partitioning by Palindromes 05-06-2017
 * dp
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
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read()) x = (x + (x << 2) << 1) + (c ^ '0');
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

const int OUT_LEN = 1000000;

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

inline void flush() { fwrite(obuf, 1, oh - obuf, stdout); }
}

namespace Task {

const int MAXN = 1010;

bool isPalindrome[MAXN][MAXN];
char s[MAXN];

inline void solve() {
    using namespace IO;
    register int t;
    for (read(t); t--;) {
        register int n = read(s);
        memset(isPalindrome, 0, sizeof(isPalindrome));
        for (register int i = 0; i < n; i++) {
            for (register int l = i, r = i; l >= 0 && r < n && s[l] == s[r];
                 l--, r++)
                isPalindrome[l + 1][r + 1] = isPalindrome[r + 1][l + 1] = true;
            for (register int l = i, r = i + 1; l >= 0 && r < n && s[l] == s[r];
                 l--, r++)
                isPalindrome[l + 1][r + 1] = isPalindrome[r + 1][l + 1] = true;
        }
        static int f[MAXN];
        for (register int i = 1; i <= n; i++) {
            f[i] = i;
            for (register int j = 1; j <= i; j++)
                if (isPalindrome[i][j]) f[i] = std::min(f[j - 1] + 1, f[i]);
        }
        print(f[n]), print('\n');
    }
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    Task::solve();
    IO::flush();
    return 0;
}
```
### 「CodeVS 3269」混合背包
#### 链接
[CodeVS 3269](http://codevs.cn/problem/3269/)
#### 题解
01 背包和完全背包直接写就好了，对于多重背包，这里使用单调队列优化。
对于朴素的多重背包:
{% raw %}$$f[v] = max(f[v], f[v - k * c] + k * w), k \in [0, n]$${% endraw %}
令 $m = v / c, r = v \% c$。

`m` 表示当前状态的背包容量全部用来放当前物品能放的件数。<br>
`r` 表示当前状态的背包容量全部用来放当前物品剩余的容量。

我们将原来的枚举 `v` 改为枚举 `r`，在 $[0, m]$ 上枚举 `d`，以 $(m - d) * c + r$ 代替 `v`。
{% raw %}$$f[(m - d) * c + r] = max(f[(m - d) * c + r] + d * w, d \in [0, m], r \in [0, V \ \% \ c])$${% endraw %}
令 $k = m - d$ 代入得
{% raw %}$$f[k * c + r] = max(f[k * c + r] + (m - k) * w, k \in [m - n, m], r \in [0, V \ \% \ c])$$
$$f[k * c + r] = max(f[k * c + r] - k * w, k \in [m - n, m], r \in [0, V \ \% \ c]) + m * w$$
令 $g(k, r) = f[k * c + r] - k * w$ 代入得
$$f[k * c + r] = max(g(k, r), k \in [m - n, m], r \in [0, V \ \% \ c]) + m * w$${% endraw %}
由此得到一个可以用单调队列优化的方程，结合方程我们知道，{% raw %}$f[k * c + r]${% endraw %} 是由之前的 `n + 1` 项的最大值推出的，于是用一个长度为 `n + 1` 的单调队列维护 $g(k, r)$，就可以 $O(1)$ 地求出每个状态。

需要注意的是，在使用单调队列实现这个算法时，方程中的 `m` 应该被替换为当前状态对应的 `k`，因为枚举的 `k` 总是当前状态的**背包容量全部用来放当前物品的最大件数**。
#### 代码
``` cpp
/**
 * 「CodeVS 3269」混合背包 09-06-2017
 * dp + 单调队列
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
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read()) x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

const int OUT_LEN = 1000000;
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

inline void flush() { fwrite(obuf, 1, oh - obuf, stdout); }
}

namespace Task {

const int MAXN = 200;
const int MAXV = 200000;

template <typename T, typename Comparator = std::less<T> >
class MonotoneQueue : public std::deque<std::pair<T, int> > {
   public:
    typedef std::pair<T, int> Pair;
    typedef std::deque<Pair> super;

    MonotoneQueue(Comparator cmp = Comparator()) : cmp(cmp), pos(0), cur(0) {}

    inline void push(const T &v) {
        while (!super::empty() && cmp(super::front().first, v))
            super::pop_front();
        super::push_front(Pair(v, cur++));
    }

    inline void pop() {
        if (super::back().second == pos++) super::pop_back();
    }

    inline const T &top() { return super::back().first; }

    inline void clear() { super::clear(), pos = cur = 0; }

    inline int size() { return cur - pos; }

   private:
    int pos, cur;
    Comparator cmp;
};

int v;
int f[MAXV + 1];

inline void pack(int c, int w, int n) {
    if (n == 1) {
        for (register int v = Task::v; v >= c; v--)
            f[v] = std::max(f[v], f[v - c] + w);
    } else if (n == -1) {
        for (register int v = c; v <= Task::v; v++)
            f[v] = std::max(f[v], f[v - c] + w);
    } else {
        n = std::min(n, Task::v / c);
        for (register int r = 0; r < c; r++) {
            static MonotoneQueue<int> q;
            q.clear();
            register int m = (Task::v - r) / c;
            for (register int k = 0; k <= m; k++) {
                if (q.size() == n + 1) q.pop();
                q.push(f[k * c + r] - k * w);
                f[k * c + r] = q.top() + k * w;
            }
        }
    }
}

inline void solve() {
    using namespace IO;
    register int n;
    read(n), read(v);
    for (register int i = 0, c, w, t; i < n; i++)
        read(c), read(w), read(t), pack(c, w, t);
    print(f[v]);
}
}

int main() {
    Task::solve();
    IO::flush();
    return 0;
}
```
### 「UVA 11137」Ingenuous Cubrency
#### 链接
[UVA 11137](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&category=&problem=2078)
#### 题意
给出一个正整数 $n (n \leq 10000)$，求有多少种方案把 $n$ 表示成几个正整数的立方和的形式。
#### 题解
考虑将每个立方数看做物品，将 $n$ 看作背包，则问题转化为求**装满背包的方案**。

我们直接做完全背包就好了，即
$$f[v] = f[v] + f[v - c], v \in [c, V]$$
#### 代码
``` cpp
/**
 * 「UVA 11137」Ingenuous Cubrency 12-06-2017
 * dp
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
inline bool read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return false;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read()) x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
    return true;
}

const int OUT_LEN = 1000000;

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

inline void flush() { fwrite(obuf, 1, oh - obuf, stdout); }
}

namespace Task {

const int MAXN = 10000;

unsigned long long f[MAXN] = {1}, max;

const int CUBE[22] = {0,    1,    8,    27,   64,   125,  216,  343,
                      512,  729,  1000, 1331, 1728, 2197, 2744, 3375,
                      4096, 4913, 5832, 6859, 8000, 9261};

inline void init(int n) {
    for (register int i = 1; i <= 21; i++)
        for (register int v = CUBE[i]; v <= n; v++) f[v] += f[v - CUBE[i]];
}

inline void print(int n) { IO::print(f[n]), IO::print('\n'); }

inline void solve() {
    static std::vector<int> q;
    q.reserve(MAXN);
    for (register int n; IO::read(n);) q.push_back(n);
    init(*std::max_element(q.begin(), q.end()));
    std::for_each(q.begin(), q.end(), print);
}
}

int main() {
    Task::solve();
    IO::flush();
    return 0;
}
```
### 「BZOJ 1334」「Baltic2008」Elect
#### 链接
[BZOJ 1334](http://www.lydsy.com/JudgeOnline/problem.php?id=1334)
#### 题解
> 显然当席位最少的党是多余的时，方案不合法

令 `f[i]` 表示联合内阁席位数为 $i$ 时，席位最少的党的席位数的最大值。

完成 DP 后扫描整个数组，满足 $i - f[i] \leq \frac {m} {2}$ 的最大的 $i$ 即为答案。
#### 代码
``` cpp
/**
 * 「BZOJ 1334」「Baltic2008」Elect 12-06-2017
 * dp
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
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read()) x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

const int OUT_LEN = 1000000;

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

inline void flush() { fwrite(obuf, 1, oh - obuf, stdout); }
}

namespace Task {

const int MAXN = 100000;

inline void solve() {
    using namespace IO;
    static int f[MAXN], a[MAXN];
    register int n;
    read(n);
    for (register int i = 0; i < n; i++) read(a[i]);
    register int V = std::accumulate(a, a + n, 0);
    f[0] = INT_MAX;
    for (register int i = 0; i < n; i++)
        for (register int v = V; v >= a[i]; v--)
            f[v] = std::max(f[v], std::min(f[v - a[i]], a[i]));
    for (register int i = V; i >= 0; i--) {
        if (i - f[i] <= V / 2) {
            print(i);
            break;
        }
    }
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    Task::solve();
    IO::flush();
    return 0;
}
```
### 「SCOI 2009」粉刷匠
#### 链接
[BZOJ 1296](http://www.lydsy.com/JudgeOnline/problem.php?id=1296)
#### 题解
对于每一行，令 $f[j][k]$ 表示前 $j$ 个格子刷 $k$ 次的最大正确数量。枚举最后一次刷的区间，刷较多的颜色。

令 $w[i][j]$ 表示第 $i$ 行刷 $j$ 次的最大正确数量。

最后用背包求解即可，即令 $g[j]$ 表示刷 $j$ 次的最大正确数量，$g[j] = max(g[j], g[j - k] + w[i][k])$
#### 代码
``` cpp
/**
 * 「SCOI 2009」粉刷匠 14-06-2017
 * dp
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
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read()) x = (x + (x << 2) << 1) + (c ^ '0');
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

const int OUT_LEN = 1000000;

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

inline void flush() { fwrite(obuf, 1, oh - obuf, stdout); }
}

namespace Task {

const int MAXN = 50;
const int MAXM = 50;
const int MAXT = 2500;

inline void solve() {
    using namespace IO;
    register int n, m, t;
    read(n), read(m), read(t);
    static int w[MAXN][MAXM + 1], f[MAXM + 1][MAXM + 1];
    for (register int i = 0; i < n; i++) {
        memset(f, 0, sizeof(f));
        static char s[MAXM];
        read(s);
        for (register int j = 1; j <= m; j++) {
            for (register int k = 1; k <= j; k++) {
                register int cnt[2] = {0, 0};
                for (register int l = j - 1; l >= k - 1; l--) {
                    cnt[s[l] - '0']++;
                    f[j][k] = std::max(f[j][k],
                                       f[l][k - 1] + std::max(cnt[0], cnt[1]));
                    w[i][k] = std::max(w[i][k], f[j][k]);
                }
            }
        }
    }

    static int g[MAXT + 1];
    for (int i = 0; i < n; i++) {
        for (int j = t; j >= 0; j--) {
            for (int k = 1; k <= m; k++) {
                if (k <= j) g[j] = std::max(g[j], g[j - k] + w[i][k]);
            }
        }
    }

    print(g[t]);
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    Task::solve();
    IO::flush();
    return 0;
}
```
### 「BZOJ 4247」挂饰
#### 链接
[BZOJ 4247](http://www.lydsy.com/JudgeOnline/problem.php?id=4247)
#### 题解
允许背包的容量为负，然后做 01 背包，答案为背包容量为 $-n$ 到 $1$ 的结果的最大值。
#### 代码
``` cpp
#include <bits/stdc++.h>
/**
 * 「BZOJ 4247」挂饰 16-06-2017
 * dp
 * @author xehoth
 */
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
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read()) x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, oh - obuf, stdout), oh = obuf) : 0;
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

inline void flush() { fwrite(obuf, 1, oh - obuf, stdout); }
}

namespace Task {

const int MAXN = 2000;

inline void solve() {
    using namespace IO;
    register int n;
    read(n);
    static struct Array {
        int a[MAXN * 2 + 1];
        int &operator[](const int i) { return a[i + MAXN]; }
    } f[MAXN + 1];
    for (register int i = -n; i < 0; i++) f[0][i] = INT_MIN;
    for (register int i = 1, x, v; i <= n; i++) {
        read(x), read(v);
        const int w = 1 - x;
        for (register int j = -n; j <= n; j++) {
            if (j - w >= -n && j - w <= n && f[i - 1][j - w] != INT_MIN)
                f[i][j] = std::max(f[i - 1][j], f[i - 1][j - w] + v);
            else if (j - w > n)
                f[i][j] = std::max(f[i - 1][j], f[i - 1][n] + v);
            else
                f[i][j] = f[i - 1][j];
        }
    }
    print(*std::max_element(&f[n][-n], &f[n][1] + 1));
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    Task::solve();
    IO::flush();
    return 0;
}
```
### 「BZOJ1677」Sumsets 求和
#### 链接
[BZOJ1677](http://www.lydsy.com/JudgeOnline/problem.php?id=1677)
#### 题解
把 $2 ^ i$ 看作物品，$n$ 看作背包，然后求装满背包的方案数就好了。
#### 代码
``` cpp
#include <bits/stdc++.h>
/**
 * 「BZOJ1677」Sumsets 求和 17-06-2017
 * dp
 * @author xehoth
 */
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
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read()) x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

const int OUT_LEN = 1000000;

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

inline void flush() { fwrite(obuf, 1, oh - obuf, stdout); }
}

namespace Task {

const int MAXN = 1000000;
const int MOD = 1000000000;

inline void solve() {
    using namespace IO;
    static int f[MAXN + 1] = {1};
    register int n;
    read(n);
    for (register int i = 0; 1 << i <= n; i++)
        for (register int j = 1 << i; j <= n; j++)
            (f[j] += f[j - (1 << i)]) %= MOD;
    print(f[n]);
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    Task::solve();
    IO::flush();
    return 0;
}
```

