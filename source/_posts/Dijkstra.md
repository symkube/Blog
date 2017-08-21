---
title: Dijkstra 学习笔记
date: 2016-07-07 11:20:56
tags:
  - 最短路
  - 学习笔记
categories:
  - oi
  - 学习笔记
---
## Dijkstra
迪杰斯特拉算法是由荷兰计算机科学家狄克斯特拉于1959 年提出的，因此又叫狄克斯特拉算法。是从一个顶点到其余各顶点的最短路径算法，解决的是有向图中最短路径问题。迪杰斯特拉算法主要特点是以起始点为中心向外层层扩展，直到扩展到终点为止。
<!-- more -->
### Dijkstra模板
``` cpp
#include <algorithm>
#include <cstdio>
#include <cstring>
#include <iostream>
#include <queue>
#include <vector>
#define pair_int std::pair<int, int>
using namespace std;
#define DIJKSTRA_MAX 10010
/*节点*/
struct node {
    /*v编号 w权值*/
    int v, w;
    node() {}
    node(int v0, int w0) : v(v0), w(w0) {}
    bool operator<(const node& b) const { return w < b.w; }
};
bool vis[DIJKSTRA_MAX];
int dis[DIJKSTRA_MAX];
/*利用vector可以很轻松地实现邻接表*/
vector<node> son[DIJKSTRA_MAX];
inline int dijkstra(int s, int t) {
    priority_queue<pair_int, vector<pair_int>, greater<pair_int> > q;
    memset(dis, 127, sizeof(dis));
    memset(vis, false, sizeof(vis));
    dis[s] = 0;
    q.push(make_pair(dis[s], s));
    while (!q.empty()) {
        int now = q.top().second;
        q.pop();
        if (vis[now]) continue;
        vis[now] = true;
        for (int i = 0; i < son[now].size(); i++) {
            node x = son[now][i];
            if (dis[now] + x.w < dis[x.v]) {
                dis[x.v] = dis[now] + x.w;
                q.push(make_pair(dis[x.v], x.v));
            }
        }
    }
    return dis[t];
}
inline void insert(int a, int b, int w) { son[a].push_back(node(b, w)); }
inline void insert_multi(int a, int b, int w) {
    son[a].push_back(node(b, w));
    son[b].push_back(node(a, w));
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=28732503&auto=1&height=66"></iframe>