---
title: 「补档计划」2-SAT
date: 2017-06-20 15:21:28
tags:
  - 补档计划
  - 图论
  - 2-SAT
categories:
  - OI
  - 图论
  - 2-SAT
---
一些 2-SAT 题目。
<!-- more -->
### 「JSOI 2010」满汉全席
#### 题解
令每个评委的要求为 $a_i, b_i$，由于要满足每个评委至少一项要求，即不满足 $a$ 就能推出满足 $b$，所以建图如下：
$$\neg a_i \rightarrow b_i, \neg b_i \rightarrow a_i$$
然后跑 tarjan 判断命题 $p$ 与 $\neg p$ 是否在一个强连通分量内就好了。
#### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「JSOI 2010」满汉全席 20-06-2017
 * 2-SAT
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

inline void read(char &c) {
    while (c = read(), isspace(c))
        ;
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
}

namespace TwoSat {

const int MAXN = 250;

std::vector<int> edge[MAXN];

inline void debug(int u) {
    if (u & 1)
        std::cerr << 'h';
    else
        std::cerr << 'm';
}

inline void addEdge(const int u, const int v) {
    edge[u].push_back(v);
    edge[v ^ 1].push_back(u ^ 1);
}

bool vis[MAXN];
int inComponent[MAXN], dfn[MAXN], low[MAXN], idx, cnt;

std::vector<int> st;

inline void tarjan(const int u) {
    register int v;
    vis[u] = true, st.push_back(u), low[u] = dfn[u] = ++idx;
    for (register int i = 0; i < edge[u].size(); i++) {
        if (!dfn[v = edge[u][i]])
            tarjan(v), low[u] = std::min(low[u], low[v]);
        else if (vis[v])
            low[u] = std::min(low[u], dfn[v]);
    }
    if (low[u] == dfn[u]) {
        cnt++;
        do
            vis[v = st.back()] = false, st.pop_back(), inComponent[v] = cnt;
        while (u != v);
    }
}

inline void init(int n) {
    n = (n << 1 | 1) + 1;
    memset(edge, 0, sizeof(std::vector<int>) * n);
    memset(dfn, 0, sizeof(int) * n);
    memset(low, 0, sizeof(int) * n);
    st.clear();
    idx = cnt = 0;
}

inline void solve() {
    using namespace IO;
    register int k, n, m;
    for (read(k); read(n), read(m), k--;) {
        init(n);
        register char a, b;
        register int u, v;
        for (register int i = 0; i < m; i++) {
            read(a), read(u), read(b), read(v);
            addEdge(u << 1 | a == 'h' ^ 1, v << 1 | b == 'h');
        }
        for (register int i = 2, r = n << 1 | 1; i <= r; i++)
            if (!dfn[i]) tarjan(i);
        for (register int i = 1; i <= n; i++) {
            if (inComponent[i << 1] == inComponent[i << 1 | 1]) {
                print("BAD\n");
                break;
            }
            i == n ? print("GOOD\n") : (void)0;
        }
    }
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    TwoSat::solve();
    IO::flush();
    return 0;
}
```
### 「BZOJ 2199」奶牛议会
#### 题解
建图方式同上，然后用 tarjan 缩点，先判断是否存在可行解。  
若存在可行解，对缩点后的图拓扑排序并求出每个点有哪些点能到达它（用 bitset 维护）。
#### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「BZOJ 2199」奶牛议会 21-06-2017
 * 2-SAT
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

inline void read(char &c) {
    while (c = read(), isspace(c))
        ;
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
}

namespace ShrinkedGraph {

const int MAXN = 100005;

std::vector<int> edge[MAXN];
int in[MAXN];

typedef std::bitset<2005> BitSet;

BitSet map[2004], comMap[2005];

inline void addEdge(const int u, const int v) { in[v]++, edge[u].push_back(v); }

inline void topoSort(int n) {
    static std::vector<int> st;
    st.reserve(n * 4 + 4);
    for (register int i = 2, r = n << 1 | 1; i <= r; i++)
        if (!in[i]) st.push_back(i);
    while (!st.empty()) {
        register int u = st.back();
        st.pop_back();
        for (register int i = 0, v; i < edge[u].size(); i++) {
            map[v = edge[u][i]] |= map[u];
            if (!(--in[v])) st.push_back(v);
        }
    }
}
}

namespace TwoSat {

const int MAXN = 100005;

std::vector<int> edge[MAXN];

inline void addEdge(const int u, const int v) {
    edge[u].push_back(v);
    edge[v ^ 1].push_back(u ^ 1);
}

std::vector<int> st;
int low[MAXN], dfn[MAXN], idx, cnt, inComponent[MAXN];
bool vis[MAXN];

inline void tarjan(const int u) {
    vis[u] = true, st.push_back(u), low[u] = dfn[u] = ++idx;
    register int v;
    for (register int i = 0; i < edge[u].size(); i++) {
        if (!dfn[v = edge[u][i]])
            tarjan(v), low[u] = std::min(low[u], low[v]);
        else if (vis[v])
            low[u] = std::min(low[u], dfn[v]);
    }
    if (dfn[u] == low[u]) {
        cnt++;
        do
            vis[v = st.back()] = false, st.pop_back(), inComponent[v] = cnt;
        while (u != v);
    }
}

inline void solve() {
    using namespace IO;
    register int n, m;
    read(n), read(m);
    for (register int i = 0; i < m; i++) {
        register int u, v;
        register char a, b;
        read(u), read(a), read(v), read(b);
        addEdge(u << 1 | a == 'Y' ^ 1, v << 1 | b == 'Y');
    }
    for (register int i = 2, r = n << 1 | 1; i <= r; i++)
        if (!dfn[i]) tarjan(i);
    for (register int i = 1; i <= n; i++) {
        if (inComponent[i << 1] == inComponent[i << 1 | 1]) {
            print("IMPOSSIBLE\n");
            return;
        }
    }
    for (register int i = 2, r = n << 1 | 1, u, v; i <= r; i++) {
        for (register int j = 0; j < edge[i].size(); j++) {
            if (inComponent[i] != inComponent[edge[i][j]]) {
                ShrinkedGraph::addEdge(inComponent[i], inComponent[edge[i][j]]);
            }
        }
    }
    for (register int i = 2, r = n << 1 | 1; i <= r; i++)
        ShrinkedGraph::map[inComponent[i]].set(i);
    for (register int i = 1; i <= cnt; i++)
        ShrinkedGraph::comMap[i] = ShrinkedGraph::map[i];
    ShrinkedGraph::topoSort(n);
    static int vis[MAXN];
    memset(vis, -1, sizeof(vis));
    for (register int i = 1; i <= cnt; i++) {
        using namespace ShrinkedGraph;
        for (register int j = 1; j <= n; j++) {
            if (comMap[i][j << 1] && map[i][j << 1 | 1])
                vis[j] = 0;
            else if (comMap[i][j << 1 | 1] && map[i][j << 1])
                vis[j] = 1;
        }
    }
    for (register int i = 1; i <= n; i++)
        if (vis[i] == 1)
            print('Y');
        else if (vis[i] == 0)
            print('N');
        else
            print('?');
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    TwoSat::solve();
    IO::flush();
    return 0;
}
```
### 「POJ 3683」Priest John's Busiest Day
#### 链接
[POJ 3683](http://poj.org/problem?id=3683)
#### 题解
设一场婚礼的可能举办时间区间为 $a = s_1 \sim t_1$ 和 $b = s_2 \sim t_2$，设另一场婚礼的区间为 $a' = s'_1 \sim t'_1$ 和 $b' = s'_2 \sim t'_2$，若 $a$ 与 $b'$ 相交，那么选 $a$ 就必须选 $a'$，所以按如下建图
$$u \rightarrow \neg v, u \cap v \neq \varnothing$$
对于方案的输出，由于 tarjan 就是逆拓扑序的顺序求出强连通分量的，所以我们直接比较 `scc` 编号的大小选取小的输出就可以了。
#### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「POJ 3683」Priest John's Busiest Day 23-06-2017
 * 2-SAT
 * @author xehoth
 */
#include <cstdio>
#include <cstdlib>
#include <iostream>
#include <vector>

namespace TwoSat {

const int MAXN = 2001;

struct Data {
    int s, t;
} data[MAXN];

int low[MAXN], dfn[MAXN], scc[MAXN], idx, cnt, n;
bool vis[MAXN];
std::vector<int> st;

int ans[MAXN];
std::vector<int> edge[MAXN];

inline void tarjan(int u) {
    st.push_back(u), low[u] = dfn[u] = ++idx, vis[u] = true;
    register int v;
    for (register int i = 0; i < edge[u].size(); i++) {
        if (!dfn[v = edge[u][i]])
            tarjan(v), low[u] = std::min(low[u], low[v]);
        else if (vis[v])
            low[u] = std::min(low[u], dfn[v]);
    }
    if (dfn[u] == low[u]) {
        cnt++;
        do
            vis[v = st.back()] = false, st.pop_back(), scc[v] = cnt;
        while (u != v);
    }
}

inline bool isIntersect(const Data &a, const Data &b) {
    return (a.s <= b.s && a.t > b.s) || (b.s <= a.s && b.t > a.s);
}

inline void addEdge(const int u, const int v) {
    edge[u].push_back(v);
    edge[v ^ 1].push_back(u ^ 1);
}

inline void solve() {
    scanf("%d", &n);
    for (register int i = 0, u1, v1, u2, v2, d; i < n; i++) {
        scanf("%d:%d %d:%d %d", &u1, &v1, &u2, &v2, &d);
        data[i << 1].s = u1 * 60 + v1;
        data[i << 1].t = u1 * 60 + v1 + d;
        data[i << 1 | 1].s = u2 * 60 + v2 - d;
        data[i << 1 | 1].t = u2 * 60 + v2;
    }
    for (register int i = 0; i < 2 * n; i++)
        for (register int j = i + 1; j < 2 * n; j++)
            if (((i >> 1) != (j >> 1)) && isIntersect(data[i], data[j]))
                addEdge(i, j ^ 1);
    st.reserve(n);
    for (register int i = 0, r = n << 1; i < r; i++)
        if (!dfn[i]) tarjan(i);
    for (register int i = 0; i < n; i++) {
        if (scc[i << 1] == scc[i << 1 | 1]) {
            printf("NO\n");
            return;
        }
    }
    for (register int i = 0; i < n; i++)
        ans[i] = (scc[i << 1] < scc[i << 1 | 1] ? (i << 1) : (i << 1 | 1));
    printf("YES\n");
    div_t tmp;
    for (register int i = 0; i < n; i++) {
        tmp = div(data[ans[i]].s, 60);
        printf("%02d:%02d ", tmp.quot, tmp.rem);
        tmp = div(data[ans[i]].t, 60);
        printf("%02d:%02d\n", tmp.quot, tmp.rem);
    }
}
}

int main() {
    TwoSat::solve();
    return 0;
}
```

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=34916603&auto=1&height=66"></iframe>