---
title: 「补档计划」ISAP 和 HLPP 算法
date: 2017-04-30 22:16:11
tags:
  - 补档计划
  - 最大流
  - 网络流
categories:
  - OI
  - 补档计划
---
求解网络流最大流问题有很多算法，ISAP 是图论求最大流的算法之一，它很好的平衡了运行时间和程序复杂度之间的关系，因此性价比很高。
而 HLPP 算法理论复杂度十分优秀，在实际运用中由于上界更紧而并不一定会快于 ISAP，但是 HLPP 在分层图中表现十分出色，甚至比在分层图上复杂度为 $O(n^2)$ 的 MPM 算法还快。
这里简单的给出这两个算法的思想以及代码实现。
<!-- more -->
### ISAP
概括地说，ISAP (Improved Shortest Augmenting Path) 算法就是不停地找最短增广路，找到之后增广；如果遇到死路就 retreat，直到发现 $s$, $t$ 不连通，算法结束。找最短路本质上就是无权最短路径问题，因此采用 BFS 的思想。具体来说，使用一个数组 $d$，记录每个节点到汇点 $t$ 的最短距离。搜索的时候，只沿着满足 $d[u] = d[v] + 1$ 的边 $u \rightarrow v$（这样的边称为允许弧）走。显然，这样走出来的一定是最短路。
#### 实现
ISAP 有许多实现，这里采用没有预先 BFS 标号的递归实现 (对于**网格图**和**分层图一定要写 BFS 标号**)，同时开启了当前弧和 gap 优化，时间复杂度 $O(n^2m)$
#### 代码
``` cpp
const int MAXN = 1000010;

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
```
#### 效率
默认使用读入优化，以下数据均算上了输入输出时间。
在一般情况下，这份代码在 $2000$ 个点 $4000000$ 条边上耗时 $450 ms$ 左右，在 $1000000$ 个点 $2000000$ 条边上耗时 $400 ms$ 左右，注意如果图很小，建议将 `vector` 换成前向星，反之建议使用 `vector`。
### HLPP
HLPP (Highest Label Preflow Push) 算法，这个算法全称叫最高标号预流推进，这里默认已经学会了一般预流推进算法。
效率较高的预流推进一般只有前置重贴标签算法 (Relabel-to-front Algorithm) 和最高标号预流推进算法 (Highest Label Preflow Push Algorithm)。

#### 前置重贴标签算法
1. 建立一个 `list`，里面包含所有点（但不包括源点汇点）。
   注：此list从头到尾一直都是当下 admissible network 的拓扑排序。
2. preflow。
3. 按照 `list`顺序读取各点
    1. 如果不是含水点，就继续下一个点，
    2. 如果是含水点，就discharge，并且于discharge完之后
        1. 如果刚才的discharge有抬高此点（有relabel），
         就把此点移到list开头，并重新由list开头读取。
        2. 如果刚才的discharge没有抬高此点（没有relabel），
         就继续下一个点。

时间复杂度 $O(n^3)$
#### 最高标号预流推进算法
类似于前置重贴标签算法，最高标号预流推进算法只是每次找最高的含水点进行 discharge（不包括源点汇点），直到图上无含水点（不包括源点汇点），同时 HLPP 必须要加上 gap 优化，否则其复杂度无法降低至 $O(n^2 \sqrt m)$ 
#### 代码
``` cpp
/*
 * created by xehoth on 27-04-2017
 */
#include <bits/stdc++.h>

const int MAXN = 1000015;

template<class T = int>
struct HighestLabelPreflowPush {

    struct Node {
        int u, v, index;
        T c, f;
        Node(int u, int v, int c, const T &f, const T &index) : u(u), v(v), c(c), f(f), index(index) {}
    };

    std::vector<Node> edge[MAXN];
    std::vector<int> q[MAXN];
    int dis[MAXN], cnt[MAXN + 1], pos, n;
    T exc[MAXN];
    bool act[MAXN];

    inline void addEdge(int u, int v, const T &c) {
        edge[u].push_back(Node(u, v, c, 0, edge[v].size()));
        if (u == v) edge[u].back().index++;
        edge[v].push_back(Node(v, u, 0, 0, edge[u].size() - 1));
    }

    inline void enqueue(int v) {
        if (!act[v] && exc[v] > 0 && dis[v] < n) {
            act[v] = true, q[dis[v]].push_back(v);
            pos = std::max(pos, dis[v]);
        }
    }

    inline void push(Node &e) {
        register T amt = std::min(exc[e.u], e.c - e.f);
        if (dis[e.u] == dis[e.v] + 1 && amt > 0) {
            e.f += amt;
            edge[e.v][e.index].f -= amt;
            exc[e.v] += amt;
            exc[e.u] -= amt;
            enqueue(e.v);
        }
    }

    inline void gap(int k) {
        for (register int v = 0; v < n; v++) {
            if (dis[v] >= k) {
                cnt[dis[v]]--;
                dis[v] = std::max(dis[v], n);
                cnt[dis[v]]++;
                enqueue(v);
            }
        }
    }

    inline void relabel(int v) {
        cnt[dis[v]]--, dis[v] = n;
        for (register int i = 0; i < edge[v].size(); i++) {
            Node *e = &edge[v][i];
            if (e->c - e->f > 0) dis[v] = std::min(dis[v], dis[e->v] + 1);
        }
        cnt[dis[v]]++;
        enqueue(v);
    }

    inline void discharge(int v) {
        for (register int i = 0; i < edge[v].size(); i++) {
            Node &e = edge[v][i];
            if (exc[v] > 0) push(e);
            else break;
        }
        if (exc[v] > 0) {
            if (cnt[dis[v]] == 1) gap(dis[v]);
            else relabel(v);
        }
    }

    inline T getMaxflow(int s, int t) {
        pos = 0;
        for (register int i = 0; i < edge[s].size(); i++)
            exc[s] += edge[s][i].c;
        cnt[0] = n;
        enqueue(s);
        act[t] = true;
        while (pos >= 0) {
            if (!q[pos].empty()) {
                register int v = q[pos].back();
                q[pos].pop_back();
                act[v] = false;
                discharge(v);
            } else {
                pos--;
            }
        }
        return exc[t];
    }

    inline void init(int n) {
        memset(edge, 0, sizeof(std::vector<Node>) * (n + 1));
        memset(exc, 0, sizeof(T) * (n + 1));
        memset(q, 0, sizeof(std::vector<int>) * (n + 1));
        memset(act, 0, sizeof(bool) * (n + 1));
        memset(cnt, 0, sizeof(int) * (n + 2));
        memset(dis, 0, sizeof(int) * (n + 1));
        this->n = n;
    }
};
```
#### 效率
同上面的 ISAP，HLPP 分别耗时 $650 ms$ 和 $600 ms$ 左右。
### 总结
一般情况使用性价比较高的 ISAP，当遇到分层图问题时尽量使用 HLPP，如 [ZOJ-2364/SGU-212 Data Transmission](http://acm.zju.edu.cn/onlinejudge/showProblem.do?problemCode=2364)，此题求一个分层图的阻塞流，HLPP 能够很快的得出答案，而 ISAP / Dinic 必须要使用贪心预流的技术才能通过。
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=874229&auto=1&height=66"></iframe>