---
title: 「补档计划」最小费用流 Primal Dual 算法
date: 2017-05-03 14:39:57
tags:
  - 补档计划
  - 网络流
  - 费用流
categories:
  - OI
  - 补档计划
---
求解最小费用流的算法有很多，如增广路算法(SPFA)，消圈算法，zkw 算法，Primal Dual 算法及网络单纯形，其中消圈算法和网络单纯形较为通用但速度不够快或编程复杂度过高，SPFA 和 zkw 在不同的图上各有所长，这里介绍不容易被卡掉的 Primal Dual 算法。

注意: Primal Dual 算法也不能适用于存在负圈的图。
<!-- more -->
### 思想
实际上我们算法的核心仍然是交替的进行最短路与最大流操作。
### 定义
#### 势
势指的是给每个顶点赋予一个新的标号 $h(v)$，在这个势的基础上，将边 $e = (u, v)$，的长度变为 $d'(e) = d(e) + h(u) - h(v)$，于是从 $d'$ 中的 $s-t$ 路径的长度中减去常数 $h(s) - h(t)$ 就得到了 $d$ 中对应路径的长度，因此 $d'$ 中的最短路也就是 $d$ 中的最短路。

因此,合理的选取势,使得对所有的 $e$ 都有 {% raw %}$d'(e) \geq 0${% endraw %} 的话，我们就可以在 $d'$ 中用 Dijkstra 算法求最短路,从而得到 $d$ 的最短路。

对于不含负圈的图,我们可以通过选取 $h(v) = (s$ 到 $v$ 的最短距离$)$ 来做到 {% raw %}$d'(e) \geq 0${% endraw %}。

因为对于边 $e = ( u , v )$ 有:

<center>
$( s $到 $v$的最短距离$ ) \leq ( s$ 到 $u$ 的最短距离 $) + d ( e )$
</center>

因此 {% raw %}$d'( e ) = d ( e ) + h ( u ) - h ( v ) \geq 0${% endraw %}

下面来考虑如何依次更新流量为 $i$ 时的最小费用流 {% raw %}$f_i${% endraw %} 以及其所对应的势 $h_i$ 。首先我们定义以下变量:

1. {% raw %}$f_i ( e )${% endraw %} : 流量为 $i$ 的最小费用流中边 $e$ 的流量
2. {% raw %}$h_i ( v )${% endraw %} : $f_i$ 的残量网络中 $s$ 到 $v$ 的最短距离
3. {% raw %}$d_i ( e )${% endraw %} : 考虑势 $h_i$ 后边 $e$ 的长度

### 实现
#### 初始化
若原图不含负圈,则我们可以将 $f_i (e )$ 初始化为 $0$，若原图也不存在负权边，那么我们还可以直接用 Dijkstra 计算 $h$，否则我们先使用 SPFA 计算 $h$，再使用 Dijkstra 计算 $d$。
#### 增广
求得 $f_i$ 与 $h_i$ 后,我们沿着 {% raw %}$f_i${% endraw %} 的残量网络中 $s$ 到 $t$ 的最短路增广,我们就得到了 {% raw %}$f_{i + 1}${% endraw %},而这步可以借助 $h_i$，找到那些只经过 {% raw %}$d_i( e ) = 0${% endraw %} 的边的路径进行增广(这些边一定在最短路上)．

而为了求 {% raw %}$h_{i + 1}${% endraw %}, 我们需要求 $f_{i + 1}$ 的残量网络上的最短路。考虑 {% raw %}$f_{i + 1}${% endraw %} 的残量网络中的边 $e = ( u , v )$ 。如果 $e$ 也是 $f_i$ 的残量网络中的边的话,那么根据 $h$ 的定义有 {% raw %}$d_i ( e ) \geq 0${% endraw %}。如果 $e$ 不是 $f_i$ 的残量网络中的边的话,那么 $rev (e )$ 一定是 $f_i$ 的残量网络中 $s$ 到 $t$ 的最短路中的边,所以有 {% raw %}$d_i ( e ) = - d_i ( rev ( e )) = 0${% endraw %}。综上, {% raw %}$f_{i + 1}${% endraw %} 的残量网络中的所有边 $e$ 满足 {% raw %}$d_i ( e ) \geq 0${% endraw %},因而可以用 Dijkstra 算法求最短路。
#### 时间复杂度
当原图不存在负权时，我们直接使用优先队列优化 Dijkstra 算法，此时 Primal Dual 算法的复杂度为 $O(f \cdot (V + E) \log V)$，若使用斐波那契堆优化，复杂度降为 $O(f \cdot (E + V \log V))$。

当原图存在负权时，我们先使用 SPFA 计算 $h$，再使用 Dijkstra 算法，此时 Primal Dual 算法的复杂度为 $O(VE + f \cdot (V + E) \log V)$，若使用斐波那契堆优化，复杂度降为 $O(VE + f \cdot (E + V \log V))$。
#### 代码
使用 `pb_ds` 中的优先队列优化，复杂度为 $O(VE + f \cdot (E + V \log V))$，若没有负权，自行去掉 SPFA，同时使 $h$ 的初始值为 $0$。
``` cpp
/*
 * created by xehoth on 03-05-2017
 */
#include <bits/stdc++.h>
#include <ext/pb_ds/priority_queue.hpp>

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
    static char c;
    static bool iosig;
    for (iosig = false, c = read(); !isdigit(c); c = read()) {
        if (c == -1) return;
        if (c == '-') iosig = true;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    if (iosig) x = -x;
}

namespace PrimalDual {
const int MAXN = 410;
struct Node {
    int v, f, w, index;

    Node(int v, int f, int w, int index) : v(v), f(f), w(w), index(index) {}
};

std::vector<Node> edge[MAXN];

inline void addEdge(const int u, const int v, const int f, const int w) {
    edge[u].push_back(Node(v, f, w, edge[v].size()));
    edge[v].push_back(Node(u, 0, -w, edge[u].size() - 1));
}

typedef std::pair<int, int> Pair;

const int INF = 0x3f3f3f3f;

typedef __gnu_pbds::priority_queue<Pair, std::greater<Pair> > PriorityQueue;
int pree[MAXN], prev[MAXN];
PriorityQueue::point_iterator id[MAXN];

int h[MAXN], d[MAXN];
bool vis[MAXN];

inline void spfa(const int s, const int n) {
    static std::queue<int> q;
    memset(h, 0x3f, sizeof(int) * (n + 1));
    memset(vis, 0, sizeof(bool) * (n + 1));
    q.push(s), h[s] = 0;
    while (!q.empty()) {
        register int u = q.front();
        q.pop();
        vis[u] = false;
        for (register int i = 0; i < edge[u].size(); i++) {
            Node *e = &edge[u][i];
            if (e->f && h[u] + e->w < h[e->v]) {
                h[e->v] = h[u] + e->w;
                if (!vis[e->v]) q.push(e->v), vis[e->v] = true;
            }
        }
    }
}

inline void dijkstra(const int s, const int n) {
    memset(vis, 0, n + 1);
    memset(d, 0x3f, sizeof(int) * (n + 1));
    memset(id, 0, sizeof(PriorityQueue::point_iterator) * (n + 1));
    static PriorityQueue q;
    d[s] = 0, id[s] = q.push(Pair(0, s));
    while (!q.empty()) {
        Pair now = q.top();
        q.pop();
        register int v = now.second;
        if (vis[v] || d[v] < now.first) continue;
        vis[v] = true;
        for (register int i = 0; i < edge[v].size(); i++) {
            Node *p = &edge[v][i];
            register int w = d[v] + p->w + h[v] - h[p->v];
            if (p->f > 0 && d[p->v] > w) {
                d[p->v] = w, prev[p->v] = v, pree[p->v] = i;
                if (id[p->v] != NULL) q.modify(id[p->v], Pair(d[p->v], p->v));
                else id[p->v] = q.push(Pair(d[p->v], p->v));
            }
        }
    }
}

inline Pair minCostFlow(const int s, const int t, const int n, int f) {
    Pair ans(0, 0);
    spfa(s, n);
    while (f > 0) {
        dijkstra(s, n);
        if (d[t] == INF) break;
        for (register int i = 0; i <= n; i++) h[i] += d[i];
        register int flow = f;
        for (register int i = t; i != s; i = prev[i])
            flow = std::min(flow, edge[prev[i]][pree[i]].f);
        f -= flow, ans.first += flow, ans.second += flow * h[t];
        for (register int i = t; i != s; i = prev[i]) {
            Node *p = &edge[prev[i]][pree[i]];
            p->f -= flow, edge[p->v][p->index].f += flow;
        }
    }
    return ans;
}

inline void solve() {
    register int n, m;
    read(n), read(m);
    for (register int i = 0, u, v, c, w; i < m; i++) {
        read(u), read(v), read(c), read(w);
        addEdge(u - 1, v - 1, c, w);
    }
    Pair res = minCostFlow(0, n - 1, n, INT_MAX);
    printf("%d %d\n", res.first, res.second);
}
}

int main() {
    PrimalDual::solve();
    return 0;
}
```
