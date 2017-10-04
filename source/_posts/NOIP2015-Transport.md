---
title: '「NOIP 2015」运输计划-树上路径交 + lca + 二分'
date: 2016-11-03 22:47:21
tags:
  - 树上路径交
  - lca
  - 二分
categories: 
  - OI
---
### 分析
求出每条路径两个端点的最近公共祖先，进而求出每条路径的长度。二分一个答案$x$，所有长度$>x$的路径上都至少需要删去一条边。对这些路径求交，最优方案一定是删去路径交中长度最大的边，如果删去最大的边后，最长的路径仍不满足$ \leq x$，则答案$x$不合法。
<!-- more -->
### 源码
``` cpp
#pragma GCC optimize("O3")
#include <bits/stdc++.h>
using namespace std;
#define inline inline __attribute__((always_inline)) __attribute__((optimize("O3")))
const int iol = 1024 * 1024;
char buf[iol], *s1, *t, ioc;
bool iosig;
inline char read() {
    if (s1 == t) {
        t = (s1 = buf) + fread(buf, 1, iol, stdin);
        if (s1 == t) return -1;
    }
    return *s1++;
}
template<class T>
inline bool read(T& x) {
    iosig = false;
    for (ioc = read(); !isdigit(ioc); ioc = read()) {
        if (ioc == -1) return false;
        if (ioc == '-') iosig = true;
    }
    x = 0;
    while (ioc == '0') ioc = read();
    for (; isdigit(ioc); ioc = read())
        x = (x << 1) + (x << 3) + (ioc ^ '0');
    s1--;
    if (iosig) x = -x;
    return true;
}
const int MAX_N = 300000 + 3, MAX_M = 300000 + 3, INF = 0x3f3f3f3f;
struct Node {
    int v, w;
    Node() {}
    Node(int v1, int w1) : v(v1), w(w1) {}
};
vector<Node> pool[MAX_N * 2];
int n, m;
int queryFrom[MAX_M], queryTo[MAX_M], queryCost[MAX_M], queryLca[MAX_M];
int depth[MAX_N], dis[MAX_N], fc[MAX_N], ancestor[20][MAX_N];
int dfsSeq[MAX_N], cnt = 0;
inline void dfs() {
    stack<int> st;
    static bool vis[MAX_N];
    memset(vis, 0, sizeof (bool) * n);
    st.push(0);
    ancestor[0][0] = -1, depth[0] = 0, dis[0] = 0;
    while (!st.empty()) {
        register int u = st.top();
        if (!vis[u]) {
            for (register int i = 0; i < pool[u].size(); i++) {
                Node *e = &pool[u][i];
                if (e->v != ancestor[0][u]) {
                    depth[e->v] = depth[u] + 1;
                    dis[e->v] = dis[u] + e->w;
                    fc[e->v] = e->w;
                    ancestor[0][e->v] = u;
                    st.push(e->v);
                }
            }
            vis[u] = true;
        } else dfsSeq[cnt++] = st.top(), st.pop();
    }
}
inline int lca(int a, int b) {
    if (depth[a] < depth[b]) swap(a, b);
    register int bits = 0, q = 1;
    while (depth[a] - q > 0) bits++, q <<= 1;
    for (int i = bits; i >= 0; --i)
        if (depth[a] - (1 << i) >= depth[b])
            a = ancestor[i][a];
    if (a == b) return a;
    for (register int i = bits; i >= 0; --i)
        if ((depth[a] - (1 << i) >= 0) && ancestor[i][a] != ancestor[i][b])
            a = ancestor[i][a], b = ancestor[i][b];
    return ancestor[0][a];
}
inline void init() {
    dfs();
    for (int w = 1; (1 << w) < n; ++w)
        for (int i = 0; i < n; ++i)
            if (depth[i] - (1 << w) >= 0)
                ancestor[w][i] = ancestor[w - 1][ancestor[w - 1][i]];
    for (int i = 0; i < m; ++i) {
        int LCA = lca(queryFrom[i], queryTo[i]);
        queryCost[i] = dis[queryFrom[i]] + dis[queryTo[i]] - 2 * dis[LCA];
        queryLca[i] = LCA;
    }
}
int s[MAX_N];
inline bool check(int t) {
    int total = 0, maxT = 0;
    memset(s, 0, sizeof (int) * n);
    for (int i = 0; i < m; ++i) {
        if (queryCost[i] <= t) continue;
        total++;
        s[queryFrom[i]]++, s[queryTo[i]]++, s[queryLca[i]] -= 2;
        maxT = max(maxT, queryCost[i] - t);
    }
    for (int i = 0, u; i < n; ++i) {
        u = dfsSeq[i];
        s[ancestor[0][u]] += s[u];
    }
    int dec = 0;
    for (int i = 0; i < n; ++i)
        if (s[i] == total) dec = max(dec, fc[i]);
    return maxT <= dec;
}
inline void solve() {
    int l = -1, r = 300000000;
    while (r - l > 1) {
        int mid = (l + r) >> 1;
        if (check(mid)) r = mid;
        else l = mid;
    }
    cout << r << "\n";
}
int main() {
#ifndef ONLINE_JUDGE
    freopen("in.in", "r", stdin);
#endif
    read(n), read(m);
    for (register int i = 0, f, t, c; i < n - 1; ++i) {
        read(f), f--, read(t), t--, read(c);
        pool[f].push_back(Node(t, c));
        pool[t].push_back(Node(f, c));
    }
    for (register int i = 0; i < m; i++)
        read(queryFrom[i]), queryFrom[i]--, read(queryTo[i]), queryTo[i]--;
    init();
    solve();
    return 0;
}
```
