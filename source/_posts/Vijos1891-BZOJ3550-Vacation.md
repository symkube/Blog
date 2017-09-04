---
title: 「Vijos 1891」「BZOJ 3550」Vacation-线性规划
date: 2017-09-04 10:02:18
tags:
  - 线性规划
  - 费用流
  - 单纯形
categories:
  - oi
  - 线性规划
---
给出一个长度为 $3n$ 的序列，规定连续 $n$ 个数字中不能选择超过 $k$ 个，问最多能取出的数的权值和是多少。

<!-- more -->

### 链接
[BZOJ 3550](http://www.lydsy.com/JudgeOnline/problem.php?id=3550)  
[Vijos 1891](https://vijos.org/p/1891)

### 题解
#### 单纯形
~~对于单纯形来说，这个题就是裸题。~~

设每个数的权值为 $a_i$，$x_i$ 表示是否选这个数。  
最大化：
$$\sum_{i = 1} ^ {3n} a_ix_i$$

满足：
$$x_i \leq 1$$
$$\sum_{i} ^ {i + n - 1}a_i \leq k,\ \  i + n - 1 \leq 3n$$

然后直接跑单纯形就完了。

#### 费用流
令 $n = 3N, m = n$，还是先列出对应的限制条件：
$$\begin{cases}0\le x_i\le1\\x_1+x_2+ \cdots +x_m\le k\\x_2+x_3+ \cdots +x_{m+1}\le k\\ \cdots \\x_{n-m+1}+x_{n-m+2}+ \cdots +x_n\le k\end{cases}$$

添加变量 $y_i$ 转化为相等关系：

$$\begin{cases}0\le x_i\le1\\y_i\ge0\\x_1+x_2+ \cdots +x_m+y_1= k\\x_2+x_3+ \cdots +x_{m+1}+y_2= k\\ \cdots \\x_{n-m+1}+x_{n-m+2}+ \cdots +x_n+y_{n-m+1}= k\end{cases}$$

上下差分可得：

$$\begin{cases}x_1+x_2+ \cdots +x_m+y_1-k=0\\x_{m+1}-x_1+y_2-y_1=0\\x_{m+2}-x_2+y_3-y_2=0\\ \cdots \\x_{n-1}-x_{n-m-1}+y_{n-m}-y_{n-m-1}=0\\x_n-x_{n-m}+y_{n-m+1}-y_{n-m}=0\\-x_{n-m+1}-x_{n-m+2}- \cdots -x_n-y_{n-m+1}+k=0\end{cases}$$

将这 $n - m + 2$ 个限制看成点，$S \rightarrow 1$，容量为 $k$，费用为 $0$，$n - m + 2 \rightarrow T$，容量为 $k$，费用为 $0$，$i \rightarrow i + 1$，容量为 $\infty$，费用为 $0$，对于每个变量 $x_i$，系数为 $+1$ 的位置向系数为 $-1$ 的位置连边，容量为 $1$，费用为 $-c_i$，然后跑最小费用最大流取费用的相反数即为答案。

### 代码
#### 单纯形
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「BZOJ 3550」Vacation 18-08-2017
 * 单纯形
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

namespace Simplex {

const int MAXN = 600;
const int MAXM = 1000;
const double EPS = 1e-8;
const double INF = 1e15;

struct Simplex {
    int n, m;
    double a[MAXM + 1][MAXN + 1];
    int q[MAXN + 1];

    inline void pivot(int l, int e) {
        register double t = a[l][e];
        a[l][e] = 1;
        for (register int i = 0; i <= n; i++) a[l][i] /= t;
        register int p = 0;
        for (register int i = 0; i <= n; i++)
            if (fabs(a[l][i]) > EPS) q[++p] = i;
        for (register int i = 0; i <= m; i++) {
            if (i != l && fabs(a[i][e]) > EPS) {
                t = a[i][e], a[i][e] = 0;
                for (register int j = 1; j <= p; j++)
                    a[i][q[j]] -= t * a[l][q[j]];
            }
        }
    }

    inline bool simplex() {
        for (;;) {
            register int l = 0, e = 0;
            register double min = INF;
            for (register int i = 1; i <= n; i++) {
                if (a[0][i] > EPS) {
                    e = i;
                    break;
                }
            }
            if (!e) break;
            for (register int i = 1; i <= m; i++)
                if (a[i][e] > EPS && a[i][0] / a[i][e] < min)
                    min = a[i][0] / a[i][e], l = i;
            if (!l) return false;
            pivot(l, e);
        }
        return true;
    }
} task;

inline void solve() {
    using namespace IO;
    register int n, k, m;
    read(n), read(k), m = n * 3;
    for (register int i = 1, t; i <= m; i++) read(t), task.a[0][i] = t;
    for (register int i = 1; i <= m - n + 1; i++) {
        task.a[i][0] = k;
        for (register int j = 1; j <= n; j++) task.a[i][i + j - 1] = 1;
    }
    task.m = m - n + 1, task.n = m;
    for (register int i = 1; i <= task.n; i++)
        task.a[++task.m][i] = 1, task.a[task.m][0] = 1;
    if (task.simplex()) {
        print((int)(-task.a[0][0] + 0.5));
    } else {
        print(-1);
    }
}
}

int main() {
    Simplex::solve();
    IO::flush();
    return 0;
}
```

#### 费用流
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「BZOJ 3550」Vacation 04-09-2017
 * 费用流
 * @author xehoth
 */
#include <bits/stdc++.h>
#include <ext/pb_ds/priority_queue.hpp>

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
    for (x = 0; isdigit(c); c = read()) x = x * 10 + (c ^ '0');
    iosig ? x = -x : 0;
}

inline void read(char &c) {
    while (c = read(), isspace(c) && c != -1)
        ;
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

using IO::io;

const int MAXN = 200;
const int MAX_NODE = 200 * 4 + 2;
const int INF = 0x3f3f3f3f;

struct Node {
    int v, f, w, index;

    Node(int v, int f, int w, int index) : v(v), f(f), w(w), index(index) {}
};

struct Graph {
    typedef std::vector<Node> Vector;
    Vector edge[MAX_NODE + 1];

    inline void addEdge(const int u, const int v, const int f, const int w) {
        edge[u].push_back(Node(v, f, w, edge[v].size()));
        edge[v].push_back(Node(u, 0, -w, edge[u].size() - 1));
    }

    inline Vector &operator[](const int i) { return edge[i]; }
};

struct PrimalDual {
    Graph g;

    typedef std::pair<int, int> Pair;
    typedef Graph::Vector::iterator Iterator;
    typedef __gnu_pbds::priority_queue<Pair, std::greater<Pair> > PriorityQueue;

    bool vis[MAX_NODE + 1];
    int h[MAX_NODE + 1], d[MAX_NODE + 1];
    int pree[MAX_NODE + 1], prev[MAX_NODE + 1];

    inline void bellmanFord(const int s, const int n) {
        static std::queue<int> q;
        memset(h, 0x3f, sizeof(int) * (n + 1));
        q.push(s), h[s] = 0;
        while (!q.empty()) {
            register int u = q.front();
            q.pop(), vis[u] = false;
            for (Iterator p = g[u].begin(); p != g[u].end(); p++) {
                if (p->f > 0 && h[u] + p->w < h[p->v]) {
                    h[p->v] = h[u] + p->w;
                    if (!vis[p->v]) q.push(p->v), vis[p->v] = true;
                }
            }
        }
    }

    inline void dijkstra(const int s, const int n) {
        static PriorityQueue::point_iterator id[MAX_NODE + 1];
        static PriorityQueue q;
        memset(vis, 0, sizeof(bool) * (n + 1));
        memset(d, 0x3f, sizeof(int) * (n + 1));
        memset(id, 0, sizeof(PriorityQueue::point_iterator) * (n + 1));
        id[s] = q.push(Pair(d[s] = 0, s));
        while (!q.empty()) {
            Pair now = q.top();
            q.pop();
            register int u = now.second;
            if (vis[u] || d[u] < now.first) continue;
            vis[u] = true;
            for (register int i = 0; i < g[u].size(); i++) {
                Node *p = &g[u][i];
                register int w = d[u] + p->w + h[u] - h[p->v];
                if (p->f > 0 && w < d[p->v]) {
                    d[p->v] = w, prev[p->v] = u, pree[p->v] = i;
                    if (id[p->v] != NULL)
                        q.modify(id[p->v], Pair(d[p->v], p->v));
                    else
                        id[p->v] = q.push(Pair(d[p->v], p->v));
                }
            }
        }
    }

    inline Pair primalDual(const int s, const int t, const int n, int f = INF) {
        Pair ans(0, 0);
        for (bellmanFord(s, n); f > 0;) {
            dijkstra(s, n);
            if (d[t] == INF) break;
            for (register int i = 0; i <= n; i++) h[i] = h[i] + d[i];
            register int flow = f;
            for (register int i = t; i != s; i = prev[i])
                flow = std::min(flow, g[prev[i]][pree[i]].f);
            f -= flow, ans.first += flow, ans.second += flow * h[t];
            for (register int i = t; i != s; i = prev[i]) {
                Node *p = &g[prev[i]][pree[i]];
                p->f -= flow, g[p->v][p->index].f += flow;
            }
        }
        return ans;
    }

    inline void solve() {
        register int n, k, m;
        io >> n >> k;
        m = n, n *= 3;
        const int S = 0, T = n - m + 3;
        g.addEdge(S, 1, k, 0), g.addEdge(T - 1, T, k, 0);
        for (register int i = 1; i <= n - m + 1; i++)
            g.addEdge(i, i + 1, INF, 0);
        for (register int i = 1, x; i <= n; i++) {
            io >> x;
            if (i <= m)
                g.addEdge(1, i + 1, 1, -x);
            else if (i > n - m)
                g.addEdge(i - m + 1, n - m + 2, 1, -x);
            else
                g.addEdge(i - m + 1, i + 1, 1, -x);
        }
        io << -primalDual(S, T, T + 1).second;
    }
} task;
}

int main() {
    task.solve();
    return 0;
}
```

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=730810&auto=1&height=66"></iframe>