---
title: 「SuperOJ 729」迷宫花园
date: 2016-08-08 18:45:26
tags:
  - 图论
  - 最短路
categories:
  - OI
  - 图论
  - 最短路
---
### 题目描述
给定一个一定存在从起点到终点的路径的四联通迷宫。已知 Tar 左右方向移动的时间为 1 ，上下移动的时间为未知实数 v 。求当 Tar 从起点到终点的最短移动时间为已知实数 L 时，未知实数 v 是多少。
<!-- more -->
### 输入格式
输入数据包含多个测试点。第一行为一个整数 T ，表示测试点的数目。
对于每一个测试点，第一行包含实数 L 和两个整数 R，C。R 为迷宫的上下长度，C 为迷宫的左右长度。
之后的 R 行，每行包含 C 个字符。其中空格表示空地，S 表示起点，E 表示终点，# 表示围墙。
### 输出格式
对于每一个测试点，在单独的一行内输出未知实数 v ，输出保留 5 位小数。
### 样例
**此题样例数据有问题**
### 分析
二分+dijkstra,dijkstra需要高效优化,我用的pb_ds库中的pairing_heap进行优化,此题用spfa应该也能过...
### 源码
``` cpp
#include <bits/stdc++.h>
#include <ext/pb_ds/priority_queue.hpp>
using namespace std;
using namespace __gnu_pbds;
#define tar(i,n) for(int i=1;i<=n;++i)
const int N = 105;
const double eps = 1e-7;
double L;
int R, C;
char mymap[N][N];
int pos[N][N];
int S, T, Tim;
typedef __gnu_pbds::priority_queue <pair<double, int>, greater<pair<double, int> >, pairing_heap_tag> heap;
struct node {
    int next, to;
    bool flag;
} edge[50005];
int first[10005], tot;
inline void Tjb(int x, int y, bool _flag) {
    edge[++tot].to = y; edge[tot].flag = _flag;
    edge[tot].next = first[x]; first[x] = tot;
}

inline void lql() {
    memset(first, 0, sizeof(first)); tot = 0;
}

double Dist[10005];
inline double dijkstra(double X) {
    heap q;
    vector<heap::point_iterator> id;
    id.reserve(1000005);
    tar(i, R * C)Dist[i] = 5000.0; Dist[S] = 0.0;
    q.push(make_pair(Dist[S], S));
    while (!q.empty()) {
        int u = q.top().second; q.pop();
        for (int k = first[u]; k; k = edge[k].next) {
            int v = edge[k].to;
            if (edge[k].flag) {
                if (Dist[v] > Dist[u] + X) {
                    Dist[v] = Dist[u] + X;
                    if (id[v] != 0)
                        q.modify(id[v], make_pair(Dist[v], v));
                    else id[v] = q.push(make_pair(Dist[v], v));
                }
            } else {
                if (Dist[v] > Dist[u] + 1) {
                    Dist[v] = Dist[u] + 1;
                    if (id[v] != 0)
                        q.modify(id[v], make_pair(Dist[v], v));
                    else id[v] = q.push(make_pair(Dist[v], v));
                }
            }
        }
    }
    return Dist[T];
}
inline void Test() {
    lql();
    scanf("%lf%d%d\n", &L, &R, &C);
    Tim = 0;
    tar(i, R) {
        tar(j, C)mymap[i][j] = getchar();
        scanf("\n");
    }

    tar(i, R)tar(j, C)if (mymap[i][j] != '#') {
        pos[i][j] = ++Tim;
        if (mymap[i][j] == 'S')S = pos[i][j]; else if (mymap[i][j] == 'E')T = pos[i][j];
    }

    tar(i, R)tar(j, C)if (mymap[i][j] != '#') {
        if (i != 1 && mymap[i - 1][j] != '#')Tjb(pos[i][j], pos[i - 1][j], true);
        if (i != R && mymap[i + 1][j] != '#')Tjb(pos[i][j], pos[i + 1][j], true);
        if (j != 1 && mymap[i][j - 1] != '#')Tjb(pos[i][j], pos[i][j - 1], false);
        if (j != R && mymap[i][j + 1] != '#')Tjb(pos[i][j], pos[i][j + 1], false);
    }

    double l = 0.0, r = 10.0, ans = 0.0;
    while (r - l > eps) {
        double mid = (l + r) / 2;
        if (dijkstra(mid) < L)ans = mid, l = mid; else r = mid;
    }

    printf("%.5lf\n", ans);
}

int main() {
    int times;
    scanf("%d", &times);
    while (times--)Test();
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=707862&auto=1&height=66"></iframe>