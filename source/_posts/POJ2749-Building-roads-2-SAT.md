---
title: 「POJ-2749」Building roads-2-SAT
date: 2017-01-01 19:19:48
tags:
  - 图论
  - Tarjan
  - 2-SAT
categories:
  - oi
  - 图论
  - Tarjan
---
Farmer John's farm has $N$ barns, and there are some cows that live in each barn. The cows like to drop around, so John wants to build some roads to connect these barns. If he builds roads for every pair of different barns, then he must build $N * (N - 1) / 2$ roads, which is so costly that cheapskate John will never do that, though that's the best choice for the cows.
<!-- more -->
Clever John just had another good idea. He first builds two transferring point $S1$ and $S2$, and then builds a road connecting $S1$ and $S2$ and $N$ roads connecting each barn with $S1$ or $S2$, namely every barn will connect with $S1$ or $S2$, but not both. So that every pair of barns will be connected by the roads. To make the cows don't spend too much time while dropping around, John wants to minimize the maximum of distances between every pair of barns.

That's not the whole story because there is another troublesome problem. The cows of some barns hate each other, and John can't connect their barns to the same transferring point. The cows of some barns are friends with each other, and John must connect their barns to the same transferring point. What a headache! Now John turns to you for help. Your task is to find a feasible optimal road-building scheme to make the maximum of distances between every pair of barns as short as possible, which means that you must decide which transferring point each barn should connect to.

We have known the coordinates of $S1$, $S2$ and the N barns, the pairs of barns in which the cows hate each other, and the pairs of barns in which the cows are friends with each other.

Note that John always builds roads vertically and horizontally, so the length of road between two places is their Manhattan distance. For example, saying two points with coordinates $(x1, y1)$ and $(x2, y2)$, the Manhattan distance between them is $|x1 - x2| + |y1 - y2|$.
### 链接
[POJ-2749](http://poj.org/problem?id=2749)
### 题解
相互讨厌是 $!((a$ and $b)$ or $(!a$ and $!b)$ 化简得 $(!a$ or $!b)$ and $(a$ or $b)$ 相互喜欢是 $!(a$ and $!b)$ or $(!a$ and $b)$ 化简得 $(!a$ or $b)$ and $(a$ or $!b)$，二分答案就好。
### 代码
``` cpp
#include <cstdio>
#include <cstring>
#include <cstdlib>
#include <vector>
#include <algorithm>
#include <cmath>
const int MAXN = 505;
struct TwoSat {
    int n;
    std::vector<int> edge[MAXN * 2];
    bool vis[MAXN * 2];
    int st[MAXN * 2], sn;
    inline void init(int tot) {
        n = tot << 1;
        for (register int i = 0; i < n; i += 2) {
            edge[i].clear();
            edge[i ^ 1].clear();
        }
        memset(vis, false, sizeof(vis));
    }
    inline void addEdge(int u, int uval, int v, int vval) {
        u = u * 2 + uval;
        v = v * 2 + vval;
        edge[u ^ 1].push_back(v);
        edge[v ^ 1].push_back(u);
    }
    inline void deleteEdge(int u, int uval, int v, int vval) {
        u = u * 2 + uval;
        v = v * 2 + vval;
        edge[u ^ 1].pop_back();
        edge[v ^ 1].pop_back();
    }
    inline bool dfs(int u) {
        if (vis[u ^ 1]) return false;
        if (vis[u]) return true;
        vis[u] = true;
        st[sn++] = u;
        for (register int i = 0; i < edge[u].size(); i++) {
            register int v = edge[u][i];
            if (!dfs(v)) return false;
        }
        return true;
    }
    inline bool solve() {
        for (register int i = 0; i < n; i += 2) {
            if (!vis[i] && !vis[i + 1]) {
                sn = 0;
                if (!dfs(i)){
                    for (register int j = 0; j < sn; j++)
                        vis[st[j]] = false;
                    sn = 0;
                    if (!dfs(i + 1)) return false;
                }
            }
        }
        return true;
    }
} task;
int n, a, b;
struct Point {
    int x, y;
    inline void read() { scanf("%d%d", &x, &y); }
} s1, s2, p[MAXN], A[MAXN * 2], B[MAXN * 2];
inline int dis(Point a, Point b) {
    register int dx = a.x - b.x;
    register int dy = a.y - b.y;
    return abs(dx) + abs(dy);
}
int edge[MAXN][MAXN][4];
inline bool check(int d) {
    task.init(n);
    for (register int i = 0; i < a; i++) {
        task.addEdge(A[i].x - 1, 0, A[i].y - 1, 0);
        task.addEdge(A[i].x - 1, 1, A[i].y - 1, 1);
    }
    for (register int i = 0; i < b; i++) {
        task.addEdge(B[i].x - 1, 0, B[i].x - 1, 1);
        task.addEdge(B[i].x - 1, 0, B[i].y - 1, 1);
        task.addEdge(B[i].y - 1, 0, B[i].x -1 , 1);
        task.addEdge(B[i].y - 1, 0, B[i].y - 1, 1);
    }
    for (register int i = 0; i < n; i++) {
        for (register int j = 0; j < i; j++) {
            if (edge[i][j][3] > d)
                task.addEdge(i, 0, j, 1);
            if (edge[i][j][2] > d)
                task.addEdge(i, 1, j, 0);
            if (edge[i][j][1] > d)
                task.addEdge(i, 0, j, 0);
            if (edge[i][j][0] > d)
                task.addEdge(i, 1, j, 1);
        }
    }
    return task.solve();
}

int main() {
    while (~scanf("%d%d%d", &n, &a, &b)) {
        s1.read(); s2.read();
        for (int i = 0; i < n; i++) {
            p[i].read();
            for (int j = 0; j < i; j++) {
                edge[i][j][0] = dis(p[i], s1) + dis(p[j], s1);
                edge[i][j][1] = dis(p[i], s2) + dis(p[j], s2);
                edge[i][j][2] = dis(p[i], s1) + dis(p[j], s2) + dis(s1, s2);
                edge[i][j][3] = dis(p[i], s2) + dis(p[j], s1) + dis(s1, s2);
            }
        }
        for (int i = 0; i < a; i++) A[i].read();
        for (int i = 0; i < b; i++) B[i].read();
        register int l = 0, r = 8000000;
        if (!check(r)) printf("-1\n");
        else {
            while (l < r) {
                register int mid = l + r >> 1;
                if (check(mid)) r = mid;
                else l = mid + 1;
            }
            printf("%d\n", l);
        }
    }
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=26107975&auto=1&height=66"></iframe>
