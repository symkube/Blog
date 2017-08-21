---
title: 「POJ-1741」tree-点分治
date: 2016-12-20 10:25:57
tags:
  - 点分治
categories:
  - oi
  - 点分治
---
Give a tree with n vertices,each edge has a length(positive integer less than 1001). 
Define dist(u,v)=The min distance between node u and v. 
Give an integer k,for every pair (u,v) of vertices is called valid if and only if dist(u,v) not exceed k. 
Write a program that will count how many pairs which are valid for a given tree. 
题意：给一棵边带权树，问两点之间的距离小于等于K的点对有多少个。
<!-- more -->
### 链接
[poj1741](http://poj.org/problem?id=1741)
### 题解
将无根树转化成有根树进行观察。满足条件的点对有两种情况：两个点的路径横跨树根，两个点位于同一颗子树中。
如果我们已经知道了此时所有点到根的距离 $dis[i]$，$dis[x] + a[y] <= k$ 的 $(x, y)$ 对数就是结果，这个可以通过排序之后 $O(n)$ 的复杂度求出。然后点分治，每次找树的重心，分别对所有的儿子求一遍即可，但是这会出现重复的——当前情况下两个点位于一颗子树中，那么应该将其减掉。

时间复杂度 $O(nlogn)$
### 代码
``` cpp
#include <cstdio>
#include <algorithm>
#include <vector>
#include <cstring>
#include <iostream>
const int MAXN = 10000 + 10;
struct Node {
    int v, w;
    Node(int v, int w) : v(v), w(w) {}
};
std::vector<Node> edge[MAXN];
inline void addEdge(int u, int v, int w) {
    edge[u].push_back(Node(v, w));
    edge[v].push_back(Node(u, w));
}
int n, k, size, s[MAXN], f[MAXN], root, dis[MAXN], ans;
std::vector<int> dep;
bool vis[MAXN];
inline void getRoot(int u, int father) {
    s[u] = 1, f[u] = 0;
    for (register int i = 0, v; i < edge[u].size(); i++)
        if ((v = edge[u][i].v) != father && !vis[v])
            getRoot(v, u), s[u] += s[v], f[u] = std::max(f[u], s[v]);
    f[u] = std::max(f[u], size - s[u]);
    if (f[u] < f[root]) root = u;
}
inline void getDeep(int u, int father) {
    dep.push_back(dis[u]), s[u] = 1;
    for (register int i = 0, v; i < edge[u].size(); i++)
        if ((v = edge[u][i].v) != father && !vis[v])
            dis[v] = dis[u] + edge[u][i].w, getDeep(v, u), s[u] += s[v];
}
inline int calc(int u, int init) {
    dep.clear(), dis[u] = init, getDeep(u, 0);
    std::sort(dep.begin(), dep.end());
    register int ret = 0;
    for (register int l = 0, r = dep.size() - 1; l < r;) {
        if (dep[l] + dep[r] <= k) ret += r - l++;
        else r--;
    }
    return ret;
}
inline void work(int u) {
    ans += calc(u, 0), vis[u] = true;
    for (register int i = 0, v; i < edge[u].size(); i++)
        if (!vis[v = edge[u][i].v])
            ans -= calc(v, edge[u][i].w), f[0] = size = s[v], getRoot(v, root = 0), work(root);
}
int main() {
    while (scanf("%d %d", &n, &k) == 2) {
        if (n == 0 && k == 0) break;
        memset(edge, 0, sizeof(edge));
        memset(vis, false, sizeof(vis));
        for (register int i = 1, u, v, w; i < n; i++) 
            scanf("%d %d %d", &u, &v, &w), addEdge(u, v, w);
        f[0] = size = n;
        getRoot(1, root = 0);
        ans = 0;
        work(root);
        std::cout << ans << "\n";
    }
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=28884156&auto=1&height=66"></iframe>