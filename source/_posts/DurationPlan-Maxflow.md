---
title: 「补档计划」最大流和最小割
date: 2017-04-30 22:17:11
tags:
  - 补档计划
  - 最大流
  - 网络流
categories:
  - oi
  - 补档计划
---
一些最大流和最小割题目...
填坑中...
<!-- more -->
### 「SCOI2007」蜥蜴
#### 链接
[BZOJ-1066](http://www.lydsy.com/JudgeOnline/problem.php?id=1066)
#### 题解
对于每个石柱，我们把它拆成 $2$ 个点，称为入点和出点，入点和出点连一条边，容量为高度，如果 $A$ 石柱能跳到 $B$ 石柱，就把出点 $A$ 和入点 $B$ 连一条边，容量为无限，这条边模拟的是跳的过程。如果该石柱能跳出去，就在该石柱出点和汇点 $T$ 连一条边，容量无限。这条边模拟跳出去的过程。 如果该石柱有蜥蜴，在源点 $S$ 和该石柱入点连一条边，容量为 $1$.

这样的话，每个有蜥蜴的石柱上都有一只蜥蜴，如果该蜥蜴想从该石柱跳开，必定要先从该石柱入点跑到该石柱出点，这样会消耗 $1$ 的容量，然后跳出去后，跳到另一石柱时，想再跳的话，又会消耗那个石柱的容量 ，直到跳到汇点 $T$，贡献了 $1$ 的流量。所以这幅图的最大流表示的就是能逃脱的蜥蜴数量，输出答案时减一下就行了。
#### 代码
``` cpp
/*
 * created by xehoth on 27-04-2017
 */
#include <bits/stdc++.h>

namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template<class T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

inline int read(char *buf) {
    register int s = 0;
    register char c;
    while (c = read(), isspace(c) && c != -1);
    if (c == -1) {
        *buf = '\0';
        return -1;
    }
    do buf[s++] = c; while (c = read(), !isspace(c) && c != -1);
    buf[s] = '\0';
    return s;
}

inline void read(char &c) {
    c = read();
    while (isspace(c)) c = read();
}
}

namespace MaxFlow {

const int MAXN = 1010;

int gap[MAXN], h[MAXN];

struct Node {
    int v, f, index;
    Node(int v, int f, int index) : v(v), f(f), index(index) {}
};

std::vector<Node> edge[MAXN];

inline void addEdge(int u, int v, int f) {
    edge[u].push_back(Node(v, f, edge[v].size()));
    edge[v].push_back(Node(u, 0, edge[u].size() - 1));
}

inline int sap(int v, int flow, int s, int t, int n) {
    static int iter[MAXN];
    if (v == t) return flow;
    register int rec = 0;
    for (register int i = iter[v]; i < edge[v].size(); i++) {
        Node *p = &edge[v][i];
        if (h[v] == h[p->v] + 1) {
            register int ret = sap(p->v, std::min(flow - rec, p->f), s, t, n);
            p->f -= ret, edge[p->v][p->index].f += ret, iter[v] = i;
            if ((rec += ret) == flow) return flow; 
        }
    }
    iter[v] = 0;
    if (!(--gap[h[v]])) h[s] = n;
    gap[++h[v]]++;
    return rec;
}

const int INF = INT_MAX >> 1;

inline int sap(int s, int t, int n) {
    register int ret = 0;
    gap[0] = n;
    while (h[s] < n) ret += sap(s, INF, s, t, n);
    return ret;
}

inline double dis(int x1, int y1, int x2, int y2) {
    return sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

inline void solve() {
    using namespace IO;
    register int r, c, d;
    read(r), read(c), read(d);
    register int s = 0, t = r * c * 2 + 1;
    static int a[25][25];
    register int ans = 0;
    for (register int i = 1; i <= r; i++) {
        for (register int j = 1; j <= c; j++) {
            register char ch;
            read(ch);
            a[i][j] = ch - '0';
            if (a[i][j] && (i - d <= 0 || i + d > r || j - d <= 0 || j + d > c))
                addEdge((i - 1) * c + j + t / 2, t, INF);
        }
    }
    for (register int x1 = 1; x1 <= r; x1++) {
        for (register int y1 = 1; y1 <= c; y1++) {
            if (!a[x1][y1]) continue;
            for (register int x2 = 1; x2 <= r; x2++) {
                for (register int y2 = 1; y2 <= c; y2++) {
                    if (x1 == x2 && y1 == y2) continue;
                    if (dis(x1, y1, x2, y2) <= d) 
                        addEdge((x1 - 1) * c + y1 + t /2 , (x2 - 1) * c + y2, INF);
                }
            }
        }
    }
    for (register int i = 1; i <= r; i++) {
        for (register int j = 1; j <= c; j++) {
            register char ch;
            read(ch);
            if (ch == 'L') addEdge(s, (i - 1) * c + j, 1), ans++;
        }
    }
    for (register int i = 1; i <= r; i++) {
        for (register int j = 1; j <= c; j++) {
            if (a[i][j]) addEdge((i - 1) * c + j, (i - 1) * c + j + t / 2, a[i][j]);
        }
    }
    std::cout << ans - sap(s, t, t + 1);
}
}

int main() {
    MaxFlow::solve();
    return 0;
}
```
### 「BZOJ-1280」「POJ-1149」Emmy卖猪pigs
#### 链接
[BZOJ-1280](http://www.lydsy.com/JudgeOnline/problem.php?id=1280)
[POJ-1149](http://poj.org/problem?id=1149)
#### 题解
部分参考自 Edelweiss 网络流建模汇总。

首先用最暴力的方法构建出模型，此时图中最多有

$2 + n + m \times n$ 个节点 (~~其实已经可以跑了，只是写起来麻烦~~)，可以按照以下规律来简化：

1. 如果几个结点的流量的来源完全相同，则可以把它们合并成一个。
2. 如果几个结点的流量的去向完全相同，则可以把它们合并成一个。
3. 如果从点 $u$ 到点 $v$ 有一条容量为 $\infty$ 的边，并且点 $v$ 除了点 $u$ 以外没有别的流量来源，则可以把这两个结点合并成一个。

所以我们可以这样建图：

- 每个顾客分别用一个结点来表示。
- 对于每个猪圈的第一个顾客，从源点向他连一条边，容量就是该猪圈里的

猪的初始数量。如果从源点到一名顾客有多条边，则可以把它们合并成一
条，容量相加。

- 对于每个猪圈，假设有 $n$ 个顾客打开过它，则对所有整数 $i \in [1, n)$，从该

猪圈的第 $i$ 个顾客向第 $i + 1$ 个顾客连一条边，容量为 $\infty$。

- 从各个顾客到汇点各有一条边，容量是各个顾客能买的数量上限。

#### 代码
**注意:**poj 有多组数据，这份是 bzoj 的代码。
``` cpp
/*
 * created by xehoth on 27-04-2017
 */
#include <bits/stdc++.h>

namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template<class T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}
}

namespace MaxFlow {

const int MAXN = 1500;

const int INF = INT_MAX >> 1;

struct Node {
    int v, f, index;

    Node(const int v, const int f, const int index) : v(v), f(f), index(index) {}
};

std::vector<Node> edge[MAXN];

inline void addEdge(const int u, const int v, const int f) {
    edge[u].push_back(Node(v, f, edge[v].size()));
    edge[v].push_back(Node(u, 0, edge[u].size() - 1));
}

int gap[MAXN], h[MAXN];

inline int sap(int v, int flow, int s, int t, int n) {
    if (v == t) return flow;
    static int iter[MAXN];
    register int rec = 0;
    for (register int i = iter[v]; i < edge[v].size(); i++) {
        Node *p = &edge[v][i];
        if (p->f > 0 && h[v] == h[p->v] + 1) {
            register int ret = sap(p->v, std::min(flow - rec, p->f), s, t, n);
            p->f -= ret, edge[p->v][p->index].f += ret, iter[v] = i;
            if ((rec += ret) == flow) return flow;
        }
    }
    if (!(--gap[h[v]])) h[s] = n;
    gap[++h[v]]++, iter[v] = 0;
    return rec;
}

inline int sap(int s, int t, int n) {
    register int ret = 0;
    gap[0] = n;
    while (h[s] < n) ret += sap(s, INF, s, t, n);
    return ret;
}

inline void solve() {
    using namespace IO;
    register int n, m;
    read(m), read(n);
    static int buc[MAXN];
    register int s = 0, t = n * 2 + m + 1;
    for (register int i = 1, a; i <= m; i++) 
        read(a), addEdge(buc[i] = i + n, t, a);
    for (register int i = 1; i <= n; i++) {
        register int q, a;
        read(q);
        while (q--)
            read(a), addEdge(i + n + m, buc[a], INF), buc[a] = i + n + m;
        addEdge(i, i + n + m, INF);
        read(a), addEdge(s, i, a);
    }
    printf("%d", sap(s, t, t + 1));
}
}

int main() {
    MaxFlow::solve();
    return 0;
}
```
### 「Usaco2005 mar」Ombrophobic Bovines 发抖的牛
#### 链接
[BZOJ-1378](http://www.lydsy.com/JudgeOnline/problem.php?id=1738)

[POJ-2391](http://poj.org/problem?id=2391)
#### 题解
将每个点 $i$ 拆成两个点 $i'$, $i''$，连边 $(s, i', a_i)$, $(i'', t, b_i)$。二分最短时间 $T$，令 $d[i][j]$ 表示点 $i, j$ 之间的最短距离，若 $d[i][j] <= T$，则加边 $(i', j'', \infty)$。每次根据最大流调整二分
的上下界即可。

清空 `edge` 时一定要从 `s` 开始，不要忘记 $s = 0$ 而从 $1$ 开始....
#### 代码
``` cpp
/*
 * created by xehoth on 27-04-2017
 */
#include <bits/stdc++.h>

namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template<class T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}
}

namespace MaxFlow {

const int MAXN = 1010;

#define long long long

const int INF = 1000000000;

struct Node {
    int v, f, index;

    Node(const int v, const int f, const int index) : v(v), f(f), index(index) {}
};

std::vector<Node> edge[MAXN];

inline void addEdge(const int u, const int v, const int f) {
    edge[u].push_back(Node(v, f, edge[v].size()));
    edge[v].push_back(Node(u, 0, edge[u].size() - 1));
}

int gap[MAXN], h[MAXN];

inline int sap(int v, int flow, int s, int t, int n) {
    if (v == t) return flow;
    static int iter[MAXN];
    register int rec = 0;
    for (register int i = iter[v]; i < edge[v].size(); i++) {
        Node *p = &edge[v][i];
        if (p->f > 0 && h[v] == h[p->v] + 1) {
            register int ret = sap(p->v, std::min(flow - rec, p->f), s, t, n);
            p->f -= ret, edge[p->v][p->index].f += ret, iter[v] = i;
            if ((rec += ret) == flow) return flow;
        }
    }
    if (!(--gap[h[v]])) h[s] = n;
    gap[++h[v]]++, iter[v] = 0;
    return rec;
}

inline int sap(int s, int t, int n) {
    register int ret = 0;
    memset(gap, 0, sizeof(int) * (n + 1));
    memset(h, 0, sizeof(int) * (n + 1));
    gap[0] = n;
    while (h[s] < n) ret += sap(s, INF, s, t, n);
    return ret;
}

long d[MAXN][MAXN];
int n, m, s, t, sum;
int a[MAXN], b[MAXN];

inline bool check(long x) {
    s = 0, t = 2 * n + 1;
    /* 记得从 0 开始清空 */
    for (register int i = s; i <= t; i++) edge[i].clear();
    for (register int i = 1; i <= n; i++)
        addEdge(s, i, a[i]), addEdge(n + i, t, b[i]);
    for (register int i = 1; i <= n; i++)
        for (register int j = 1; j <= n; j++)
            if (d[i][j] <= x) addEdge(i, j + n, INF);
    return sap(s, t, t + 1) == sum;
}

inline void solve() {
    using namespace IO;
    read(n), read(m);
    for (register int i = 1; i <= n; i++) read(a[i]), read(b[i]), sum += a[i];
    for (register int i = 1; i <= n; i++) 
        for (register int j = 1; j <= n; j++)
            d[i][j] = INF * 200ll;
    for (register int i = 1, u, v; i <= m; i++) {
        register long w;
        read(u), read(v), read(w);
        d[u][v] = d[v][u] = std::min(d[u][v], w);
    }
    for (register int i = 1; i <= n; i++) d[i][i] = 0;
    for (register int k = 1; k <= n; k++)
        for (register int i = 1; i <= n; i++)
            for (register int j = 1; j <= n; j++)
                d[i][j] = std::min(d[i][j], d[i][k] + d[k][j]);
    long l = 0, r = INF * 200ll - 1, ans = -1;
    while (l <= r) {
        register long mid = l + r >> 1;
        if (check(mid)) r = mid - 1, ans = mid;
        else l = mid + 1;
    }
    std::cout << ans;
}
}

int main() {
    MaxFlow::solve();
    return 0;
}
```
### 「ZJOI2009」假期的宿舍
#### 链接
[BZOJ-1433](http://www.lydsy.com/JudgeOnline/problem.php?id=1433)
#### 题解
$s$ 向所有有床位的连边，需要床位的向 $t$ 连边，如果 $i$ 可以睡 $j$ 的床

$i$ 向 $j'$ 连边。
#### 代码
``` cpp
/*
 * created by xehoth on 27-04-2017
 */
#include <bits/stdc++.h>

namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template<class T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}
}

namespace Maxflow {

const int MAXN = 110;

struct Node {
    int v, f, index;

    Node(const int v, const int f, const int index) : v(v), f(f), index(index) {}
};

std::vector<Node> edge[MAXN];

inline void addEdge(const int u, const int v, const int f) {
    edge[u].push_back(Node(v, f, edge[v].size()));
    edge[v].push_back(Node(u, 0, edge[u].size() - 1));
}

int h[MAXN], gap[MAXN];

inline int sap(int v, int flow, int s, int t, int n) {
    if (v == t) return flow;
    static int iter[MAXN];
    register int rec = 0;
    for (register int i = iter[v]; i < edge[v].size(); i++) {
        Node *p = &edge[v][i];
        if (p->f > 0 && h[v] == h[p->v] + 1) {
            register int ret = sap(p->v, std::min(flow - rec, p->f), s, t, n);
            p->f -= ret, edge[p->v][p->index].f += ret, iter[v] = i;
            if ((rec += ret) == flow) return flow;
        }
    }
    if (!(--gap[h[v]])) h[s] = n;
    gap[++h[v]]++, iter[v] = 0;
    return rec;
}

const int INF = INT_MAX >> 1;

inline int sap(int s, int t, int n) {
    register int ret = 0;
    memset(gap, 0, sizeof(int) * (n + 1));
    memset(h, 0, sizeof(int) * (n + 1));
    gap[0] = n;
    while (h[s] < n) ret += sap(s, INF, s, t, n);
    return ret;
}

inline void solve() {
    using namespace IO;
    register int T;
    read(T);
    while (T--) {
        static int a[MAXN / 2];
        register int n, ans = 0;
        read(n);
        register int s = 0, t = n * 2 + 1;
        memset(edge, 0, sizeof(std::vector<Node>) * (t + 1));
        for (register int i = 1; i <= n; i++)
            read(a[i]), a[i] ? (addEdge(i + n, t, 1), 0) : 0;
    
        for (register int i = 1, x; i <= n; i++) {
            read(x);
            if ((a[i] && !x) || !a[i])
                addEdge(s, i, 1), ans++;
        }

        for (register int i = 1, x; i <= n; i++) {
            for (register int j = 1; j <= n; j++) {
                read(x);
                if (x || i == j) addEdge(i, j + n, 1);
            }
        }
        puts(sap(s, t, t + 1) == ans ? "^_^" : "T_T");
    }
}
}

int main() {
    Maxflow::solve();
    return 0;
}
```
### 二分图匹配
设二分图左右两列分别为 $X$ 和 $Y$，建立超级源点 $S$，从 $S$ 向 $X$ 中的每个点连一条边，容量为 $1$，建立超级汇点 $T$，从 $Y$ 中的每个点向 $T$ 连一条边，容量为 $1$。最后对于原图的每一条边 $(u, v)$（假设 $u$ 在左侧 $v$ 在右侧），连接一条由 $u$ 指向 $v$ 的有向边，容量为 $1$。然后跑一遍最大流就是最大匹配。
#### 代码
[UOJ-78](http://uoj.ac/problem/78)
``` cpp
/*
 * created by xehoth on 28-04-2017
 */
#include <bits/stdc++.h>

namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template<class T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
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
}

namespace Maxflow {

const int MAXN = 1010;

struct Node {
    int v, f, index;

    Node(const int v, const int f, const int index) : v(v), f(f), index(index) {}
};

std::vector<Node> edge[MAXN];

inline void addEdge(const int u, const int v, const int f) {
    edge[u].push_back(Node(v, f, edge[v].size()));
    edge[v].push_back(Node(u, 0, edge[u].size() - 1));
}

int gap[MAXN], h[MAXN];

const int INF = INT_MAX >> 1;

inline int sap(int v, int flow, int s, int t, int n) {
    if (v == t) return flow;
    register int rec = 0;
    static int iter[MAXN];
    for (register int i = iter[v]; i < edge[v].size(); i++) {
        Node *p = &edge[v][i];
        if (p->f > 0 && h[v] == h[p->v] + 1) {
            register int ret = sap(p->v, std::min(flow - rec, p->f), s, t, n);
            p->f -= ret, edge[p->v][p->index].f += ret, iter[v] = i;
            if ((rec += ret) == flow || h[s] >= n) return rec;
        }
    }
    if (!(--gap[h[v]])) h[s] = n;
    gap[++h[v]]++, iter[v] = 0;
    return rec;
}

inline int sap(int s, int t, int n) {
    register int ret = 0;
    gap[0] = n;
    while (h[s] < n) ret += sap(s, INF, s, t, n);
    return ret;
}

inline void solve() {
    using namespace IO;
    register int nl, nr, m, s = 0;
    read(nl), read(nr), read(m);
    register int t = nl + nr + 1;
    for (register int i = 1; i <= nl; i++) addEdge(s, i, 1);
    for (register int i = 1; i <= nr; i++) addEdge(i + nl, t, 1);
    for (register int i = 1, u, v; i <= m; i++) {
        read(u), read(v), addEdge(u, v + nl, 1);
    }
    print(sap(s, t, t + 1)), print('\n');
    for (register int i = 1, x, p; i <= nl; print(x), print(' '), i++) {
        for (x = 0, p = 0; p < edge[i].size(); p++) {
            if (!edge[i][p].f && edge[i][p].v != s) {
                x = edge[i][p].v - nl;
                break;
            }
        }
    }
}
}

int main() {
    Maxflow::solve();
    IO::flush();
    return 0;
}
```
### 最小路径覆盖
#### 链接
[COGS-728](http://cogs.pro/cogs/problem/problem.php?pid=728)
#### 题解
用最少的路径覆盖所有的点。先从最简单的图开始，如果图中没有边，那么每个点都是一条独立的路径；如果添加一条边进去，那么需要的路径数量就减小 $1$；如果再添加一条边进去，并且这条边与上一条边有相同起点或终点的话，那么这条边对答案是没有贡献的，如果这条边与上一条边首尾相接或者不相交的话，那么需要的路径数量减小 $1$。

综上所述，问题转化为，从一个有向无环图中选出尽量多的边，使任意两条边没有相同起点或终点。

进一步将问题转化为二分图匹配，将每个点拆成左右两个，对于原图中任意一条有向边 $(u, v)$，在新图中将左边的 $u$ 和右边的 $v$ 连接，然后求出最大匹配，用总点数减去最大匹配就是答案。

输出方案，只要枚举起点然后沿着匹配边向下搜就好了。

> 结论:最小路径覆盖 = 点数 - 最大匹配数

#### 代码
``` cpp
/*
 * created by xehoth on 28-04-2017
 */
#include <bits/stdc++.h>

namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template<class T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
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
}

namespace Maxflow {

const int MAXN = 310;

struct Node {
    int v, f, index;

    Node(const int v, const int f, const int index) : v(v), f(f), index(index) {}
};

std::vector<Node> edge[MAXN];

int h[MAXN], gap[MAXN];

const int INF = INT_MAX >> 1;

inline void addEdge(const int u, const int v, const int f) {
    edge[u].push_back(Node(v, f, edge[v].size()));
    edge[v].push_back(Node(u, 0, edge[u].size() - 1));
}

inline int sap(int v, int flow, int s, int t, int n) {
    if (v == t) return flow;
    register int rec = 0;
    static int iter[MAXN];
    for (register int i = iter[v]; i < edge[v].size(); i++) {
        Node *p = &edge[v][i];
        if (p->f > 0 && h[v] == h[p->v] + 1) {
            register int ret = sap(p->v, std::min(flow - rec, p->f), s, t, n);
            p->f -= ret, edge[p->v][p->index].f += ret, iter[v] = i;
            if ((rec += ret) == flow || h[s] >= n) return rec;
        }
    }
    if (!(--gap[h[v]])) h[s] = n;
    gap[++h[v]]++, iter[v] = 0;
    return rec;
}

inline int sap(int s, int t, int n) {
    register int ret = 0;
    gap[0] = n;
    while (h[s] < n) ret += sap(s, INF, s, t, n);
    return ret;
}

bool vis[MAXN];

int n;

inline void dfs(int v) {
    IO::print(v = v > n ? v - n : v), IO::print(' ');
    vis[v] = true;
    for (register int i = 0; i < edge[v].size(); i++) {
        Node *p = &edge[v][i];
        if (!p->f && p->v != 0 && !vis[p->v]) {
            dfs(p->v);
            break;
        }
    }
}

inline void solve() {
    using namespace IO;
    register int m;
    read(n), read(m);
    register int s = 0, t = n << 1 | 1;
    for (register int i = 1; i <= n; i++) addEdge(s, i, 1), addEdge(i + n, t, 1);
    for (register int i = 0, u, v; i < m; i++) read(u), read(v), addEdge(u, v + n, 1);
    register int ans = sap(s, t, t + 1);
    for (register int i = 1; i <= n; i++) {
        if (!vis[i]) {
            dfs(i), print('\n');
        }
    }
    print(n - ans), print('\n');
}
}

int main() {
    freopen("path3.in", "r", stdin);
    freopen("path3.out", "w", stdout);
    Maxflow::solve();
    IO::flush();
    return 0;
}
```
### 最大权闭合图
#### 「NOI2006」最大获利
[BZOJ-1497](http://www.lydsy.com/JudgeOnline/problem.php?id=1497)
#### 题解
最大权闭合图可以用最小割模型来求解：添加源点和汇点，对于原图中的每个正权点，连接一条从源点流向该点的边，容量为权值；对于原图中的每个负权点，连接一条从该点流向汇点的边，容量为权值的绝对值；对于原图中的每一条有向边，对应在网络中连接一条容量为正无穷的边。求出该网络的最小割，割边中所有边一定是从源点连接到一个正权点或从一个负权点连到汇点，这些与割边相连的正权点是不选择的点，与割边相连的负权点是选择的负权点。

然后直接做就完了。
#### 代码
``` cpp
/*
 * created by xehoth on 02-05-2017
 */
#include <bits/stdc++.h>

namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template<class T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}
}

namespace Maxflow {

const int MAXN = 60000;

struct Node {
    int v, f, index;

    Node(const int v, const int f, const int index) : v(v), f(f), index(index) {}
};

std::vector<Node> edge[MAXN];

inline void addEdge(const int u, const int v, const int f) {
    edge[u].push_back(Node(v, f, edge[v].size()));
    edge[v].push_back(Node(u, 0, edge[u].size() - 1));
}

int h[MAXN], gap[MAXN];

inline int sap(int v, int flow, int s, int t, int n) {
    if (v == t) return flow;
    register int rec = 0;
    static int iter[MAXN];
    for (register int i = iter[v]; i < edge[v].size(); i++) {
        Node *p = &edge[v][i];
        if (p->f > 0 && h[v] == h[p->v] + 1) {
            register int ret = sap(p->v, std::min(flow - rec, p->f), s, t, n);
            p->f -= ret, edge[p->v][p->index].f += ret, iter[v] = i;
            if ((rec += ret) == flow || h[v] >= n) return rec;
        }
    }
    if (!(--gap[h[v]])) h[s] = n;
    gap[++h[v]]++, iter[v] = 0;
    return rec;
}

inline int sap(int s, int t, int n) {
    register int ret = 0;
    gap[0] = n;
    while (h[s] < n) ret += sap(s, INT_MAX, s, t, n);
    return ret;
}

inline void solve() {
    using namespace IO;
    register int n, m;
    read(n), read(m);
    const int s = 0, t = n + m + 1;
    register int sum = 0;
    for (register int i = 1, p; i <= n; i++) read(p), addEdge(i, t, p);
    for (register int i = 1, u, v, c; i <= m; i++) {
        read(u), read(v), read(c);
        sum += c, addEdge(s, i + n, c);
        addEdge(i + n, u, INT_MAX), addEdge(i + n, v, INT_MAX);
    }
    std::cout << sum - sap(s, t, t + 1);
}
}

int main() {
    Maxflow::solve();
    return 0;
}   
```
### 「BZOJ2561」最小生成树
#### 题解
对于某一条边，如果边权小于它的边能使其两个端点连通，则这条边一定不会出现在最小生成树中。最大生成树同理。

所以问题转化为，删去最少的边，使小于该边权的边不能使两端点连通,大于该边权的边也不能使两端点连通。

我们只需要分别建图求最小割，并对两次结果取和。
#### 代码
``` cpp
/*
 * created by xehoth on 03-05-2017
 */
#include <bits/stdc++.h>

namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template<class T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}
}

namespace Maxflow {

const int MAXN = 20010;
const int MAXM = 200001;

struct Node {
    int v, f, index;

    Node(const int v, const int f, const int index) : v(v), f(f), index(index) {}
};

std::vector<Node> edge[MAXN];

inline void addEdge(const int u, const int v, const int f) {
    edge[u].push_back(Node(v, f, edge[v].size()));
    edge[v].push_back(Node(u, f, edge[u].size() - 1));
}

int h[MAXN], gap[MAXN];

inline int sap(int v, int flow, int s, int t, int n) {
    if (v == t) return flow;
    register int rec = 0;
    static int iter[MAXN];
    for (register int i = iter[v]; i < edge[v].size(); i++) {
        Node *p = &edge[v][i];
        if (p->f > 0 && h[v] == h[p->v] + 1) {
            register int ret = sap(p->v, std::min(flow - rec, p->f), s, t, n);
            p->f -= ret, edge[p->v][p->index].f += ret, iter[v] = i;
            if ((rec += ret) == flow || h[v] >= n) return rec;
        }
    }
    if (!(--gap[h[v]])) h[s] = n;
    gap[++h[v]]++, iter[v] = 0;
    return rec;
}

inline int sap(int s, int t, int n) {
    register int ret = 0;
    gap[0] = n;
    while (h[s] < n) ret += sap(s, INT_MAX, s, t, n);
    return ret;
}

inline void solve() {
    using namespace IO;

    static struct Edge {
        int u, v, w;
    } e[MAXM];

    register int n, m, l, s, t;
    read(n), read(m);
    for (register int i = 0; i < m; i++) 
        read(e[i].u), read(e[i].v), read(e[i].w);
    read(s), read(t), read(l);
    for (register int i = 0; i < m; i++)
        e[i].w < l ? (addEdge(e[i].u, e[i].v, 1), 0) : 0;
    register int ans = sap(s, t, n);
    memset(edge, 0, sizeof(std::vector<Node>) * (n + 1));
    memset(gap, 0, sizeof(int) * (n + 1));
    memset(h, 0, sizeof(int) * (n + 1));
    for (register int i = 0; i < m; i++)
        e[i].w > l ? (addEdge(e[i].u, e[i].v, 1), 0) : 0;
    std::cout << ans + sap(s, t, n);
}
}

int main() {
    Maxflow::solve();
    return 0;
}
```
## 总结
### 多源多汇问题
源点和汇点有多个，流可以从任意一个源点流出，也可以流向任意一个汇点。
#### 建模
加一个附加源点 $s$ 和附加汇点 $t$，然后从 $s$ 向每个源点连一条有向边，容量为 `INF`；每个汇点向 $t$ 连一条有向边，容量为 `INF`。
### 结点有容量问题
每个结点有一个允许通过的最大流量，称为结点容量。
#### 建模
把原图 $G$ 中每个结点 $u$ 拆成两个结点 $u_1$ 和 $u_2$，中间连一条有向边，容量为结点容量；原先流向 $u$ 的边现在指向 $u_1$，从 $u$ 流出的有向边改为从 $u_2$ 流出。
### 最大权闭合图
这里闭合图的概念就很好引出了。在一个图中，我们选取一些点构成集合，记为 $V$，且集合中的出边(即集合中的点的向外连出的弧)，所指向的终点(弧头)也在 $V$ 中，则我们称 $V$ 为闭合图。最大权闭合图即在所有闭合图中，集合中点的权值之和最大的 $V$，我们称 $V$ 为最大权闭合图。
#### 建模
最大权闭合图可以用最小割模型来求解：添加源点和汇点，对于原图中的每个正权点，连接一条从源点流向该点的边，容量为权值；对于原图中的每个负权点，连接一条从该点流向汇点的边，容量为权值的绝对值；对于原图中的每一条有向边，对应在网络中连接一条容量为正无穷的边。求出该网络的最小割，割边中所有边一定是从源点连接到一个正权点或从一个负权点连到汇点，这些与割边相连的正权点是不选择的点，与割边相连的负权点是选择的负权点。
### 二分图最大匹配
一个「匹配」（matching）是一个边的集合，其中任意两条边都没有公共顶点，一个图所有匹配中，所含匹配边数最多的匹配，称为这个图的最大匹配
#### 建模
设二分图左右两列分别为 $X$ 和 $Y$，建立超级源点 $S$，从 $S$ 向 $X$ 中的每个点连一条边，容量为 $1$，建立超级汇点 $T$，从 $Y$ 中的每个点向 $T$ 连一条边，容量为 $1$。最后对于原图的每一条边 $(u, v)$（假设 $u$ 在左侧 $v$ 在右侧），连接一条由 $u$ 指向 $v$ 的有向边，容量为 $1$。然后跑一遍最大流就是最大匹配。
### 二分图最小点覆盖
选择尽量少的点，使每条边至少有一个端点被选中。
#### 建模
> 最小点覆盖 = 最大匹配

### 二分图最大独立集
选择尽量多的点，使得任意两个结点不相邻（即任意一条边的两个端点不能同时被选中）。
#### 建模
最大独立集和最小覆盖集是互补的。
> 最大独立集 = n - 最小点覆盖 = n - 最大匹配

### 二分图最小点权覆盖集
设有无向图 $G(V, E)$，对于任意结点 $u$，都对应一个非负权值 $w$，称为结点的点权。点权之和最小的点覆盖集为最小点权覆盖集。
#### 建模
> 二分图最小点权覆盖集 = 最小割

将原问题的图 $G$ 构造为网络为 $N = (V,E)$ 的最小割模型：

1. 新增源点 $s$ 和汇点 $t$。
2. 将图中每条边 $u \rightarrow v$ 加上容量为。
3. 对于出点集中每个点 $u$，新增有向边 $s \rightarrow u$，边权为结点 $u$ 的权值。
4. 对于入点集中每个点 $v$，新增有向边 $v \rightarrow t$，边权为结点 $v$ 的权值。

### 二分图最大点权独立集
给出一个二分图，每个结点有一个权值，要求选出一些结点，使得这些点之间没有边相连，并且权值和最大。
#### 建模
刚才二分图最大独立集和最小覆盖集是互补的，二分图最大点权独立集和最小点权覆盖集也是互补的。所以我们只要知道所有点权和以及最小点权覆盖集，那么最大点权独立集也就知道了。

> 最大点权独立集 = 点权和 - 最小点权独立集 = 点权和 - 最小割

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=744722&auto=1&height=66"></iframe>