---
title: 「模拟测试」大逃杀
date: 2017-10-26 22:21:22
tags:
  - DP
  - 模拟测试
categories:
  - OI
  - 模拟测试
---
一棵树，经过一条边花费 $c_i$ 的时间，某些点上有障碍，经过额外花费 $t_i$ 时间，每个节点有 $w_i$ 的价值，求 $T$ 秒后获得的最大价值。

<!-- more -->

### 题解
令 $f[i][j]$ 表示以 $i$ 为根的子树中，花费 $j$ 的时间，从 $i$ 出发且**回到** $i$ 的最大获利，$g[i][j]$ 表示以 $i$ 为根的子树中，花费 $j$ 的时间，从 $i$ 出发且**不回到** $i$ 的最大获利（或从 $i$ 的子树出发回到 $i$），$h[i][j]$ 表示从以 $i$ 为根的**子树中出发**，经过 $i$ 并**回到** $i$ 的子树内，花费 $j$ 的时间的最大获利。

于是我们有以下转移，$c$ 表示边上花费的时间：
1. 从 $u$ 出发经过 $v$ 的状态再返回 $u$
{% raw %}$$f[u][j + k + 2c] = \max\limits_{v \in u} \{f[u][j] + f[v][k]\}, j \leq T, T - j - 2c \geq 0, k \leq T - j - 2c$${% endraw %}
2. 终点在 $u$，时间为 $j + k + 2c$，起点在 $u$ 进入子树的状态，经过 $v$ 并返回 $v$ 的状态，再返回 $u$
{% raw %}$$g[u][j + k + 2c] = \max\limits_{v \in u} \{g[u][j] + f[v][k]\}, j \leq T, T - j - 2c \geq 0, k \leq T - j - 2c$${% endraw %}
3. {% raw %}$$h[u][j + k + 2c] = \max\limits_{v \in u} \big\{\max\{h[u][j] + f[v][k], f[u][j] + h[v][k]\} \big\}, \\ j \leq T, T - j - 2c \geq 0, k \leq T - j - 2c$${% endraw %}
4. {% raw %}$$g[u][j + k + c] = \max\limits_{v \in u} \{f[u][j] + g[v][k]\}, j \leq T, T - j - c \geq 0, k \leq T - j - c$${% endraw %}
5. {% raw %}$$h[u][j + k + c] = \max\limits_{v \in u} \{g[u][j] + g[v][k]\}, j \leq T, T - j - c \geq 0, k \leq T - j - c$${% endraw %}

转移的时候会有顺序问题，所以我们将当前的 $f[u], g[u], h[u]$ 都复制一遍，再转移。

时间复杂度 $O(T ^ 2n)$。

### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「SuperOJ 2012」大逃杀 26-10-2017
 * 树形 DP
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
    for (x = 0; isdigit(c); c = read()) x = x * 10 + (c ^ '0');
    iosig ? x = -x : 0;
    return true;
}

inline void read(char &c) {
    while (c = read(), isspace(c) && c != -1)
        ;
}

inline int read(char *buf) {
    register int s = 0;
    register char c;
    while (c = read(), !isprint(c) && c != -1)
        ;
    if (c == -1) {
        *buf = 0;
        return -1;
    }
    do
        buf[s++] = c;
    while (c = read(), isprint(c) && c != -1);
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

const int MAXN = 310;

struct Node {
    int v, w;

    Node(int v, int w) : v(v), w(w) {}
};

typedef std::vector<Node>::iterator Iterator;

std::vector<Node> edge[MAXN + 1];

using IO::io;

int w[MAXN + 1], t[MAXN + 1], n, T;
int f[MAXN + 1][MAXN + 1], g[MAXN + 1][MAXN + 1], h[MAXN + 1][MAXN + 1];

inline void addEdge(const int u, const int v, const int w) {
    edge[u].push_back(Node(v, w)), edge[v].push_back(Node(u, w));
}

inline void update(int &a, int b) { a < b ? a = b : 0; }

void dfs(const int u, const int fa) {
    register int *f = ::f[u], *g = ::g[u], *h = ::h[u];
    f[t[u]] = g[t[u]] = h[t[u]] = w[u];
    memset(f, 0xc0, sizeof(int) * t[u]);
    memset(g, 0xc0, sizeof(int) * t[u]);
    memset(h, 0xc0, sizeof(int) * t[u]);
    for (register Iterator p = edge[u].begin(); p != edge[u].end(); p++) {
        if (p->v != fa) {
            dfs(p->v, u);
            static int tf[MAXN + 1], tg[MAXN + 1], th[MAXN + 1];
            memcpy(tf, f, sizeof(int) * (T + 1));
            memcpy(tg, g, sizeof(int) * (T + 1));
            memcpy(th, h, sizeof(int) * (T + 1));
            register int *nf = ::f[p->v], *ng = ::g[p->v], *nh = ::h[p->v];
            for (register int j = 0; j <= T && T - j - p->w * 2 >= 0; j++) {
                for (register int k = 0; k <= T - j - p->w * 2; k++) {
                    update(f[j + k + p->w * 2], tf[j] + nf[k]);
                    update(g[j + k + p->w * 2], tg[j] + nf[k]);
                    update(h[j + k + p->w * 2],
                           std::max(th[j] + nf[k], tf[j] + nh[k]));
                }
            }
            for (register int j = 0; j <= T && T - j - p->w >= 0; j++) {
                for (register int k = 0; k <= T - j - p->w; k++) {
                    update(g[j + k + p->w], tf[j] + ng[k]);
                    update(h[j + k + p->w], tg[j] + ng[k]);
                }
            }
        }
    }
}

inline void solve() {
    io >> n >> T;
    register int sum = 0;
    for (register int i = 1; i <= n; i++) io >> w[i], sum += w[i];
    if (sum == 0) {
        io << '0';
        return;
    }
    for (register int i = 1; i <= n; i++)
        io >> t[i], t[i] = std::min(t[i], T + 1);
    for (register int i = 1, u, v, w; i < n; i++)
        io >> u >> v >> w, addEdge(u, v, w);
    dfs(1, 0);
    register int ans = 0;
    for (register int i = 1; i <= n; i++) {
        ans = std::max(
            ans, std::max(*std::max_element(f[i], f[i] + T + 1),
                          std::max(*std::max_element(g[i], g[i] + T + 1),
                                   *std::max_element(h[i], h[i] + T + 1))));
    }
    io << ans;
}
}

int main() {
    solve();
    return 0;
}
```