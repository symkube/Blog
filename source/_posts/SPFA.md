---
title: SPFA 学习笔记
date: 2016-07-07 11:21:09
tags:
  - 最短路
  - 学习笔记
categories:
  - OI
  - 学习笔记
---
## SPFA
SPFA（Shortest Path Faster Algorithm）（队列优化）算法是求单源最短路径的一种算法，它还有一个重要的功能是判负环（在差分约束系统中会得以体现），在Bellman-ford算法的基础上加上一个队列优化，减少了冗余的松弛操作，是一种高效的最短路算法。
<!-- more -->
### SPFA模板
``` cpp
#include <algorithm>
#include <cstdio>
#include <cstring>
#include <iostream>
#include <queue>
#include <vector>
#define pair_int std::pair<int, int>
using namespace std;
template <class T>
class Queue : public std::queue<T> {
   public:
    T pop() {
        T tmp = std::queue<T>::front();
        std::queue<T>::pop();
        return tmp;
    }
};
#define SPFA_MAX 10010
struct node {
    int v, w;
    node(int v0, int w0) : v(v0), w(w0) {}
};
bool vis[SPFA_MAX];
int dis[SPFA_MAX];
vector<node> vc[SPFA_MAX];
inline void insert(int a, int b, int w) { vc[a].push_back(node(b, w)); }
inline void insert_multi(int a, int b, int w) {
    vc[a].push_back(node(b, w));
    vc[b].push_back(node(a, w));
}
inline int spfa(int s, int t) {
    Queue<int> q;
    memset(dis, 127, sizeof(dis));
    q.push(s), dis[s] = 0, vis[s] = true;
    while (!q.empty()) {
        int now = q.pop();
        vis[now] = false;
        for (int i = 0; i < vc[now].size(); ++i) {
            node x = vc[now][i];
            if (dis[x.v] > dis[now] + x.w) {
                dis[x.v] = dis[now] + x.w;
                if (!vis[x.v]) vis[x.v] = true, q.push(x.v);
            }
        }
    }
    return dis[t];
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=412785761&auto=1&height=66"></iframe>