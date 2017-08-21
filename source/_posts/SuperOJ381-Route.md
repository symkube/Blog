---
title: 「SuperOJ 381」最佳路线
date: 2016-07-27 21:14:30
tags:
  - 图论
  - 最短路
categories: 
  - oi
  - 图论
  - 最短路
---
## 最佳路线
### 题目描述
N 个景区，任意两个景区之间有一条或多条双向的路来连接，现在 Mr.Zeng 想找一条旅游路线，这个路线从 A 点出发并且最后回到 A 点，假设经过的路线为 V1，V2，....VK，V1，那么必须满足 K>2，就是说至除了出发点以外至少要经过 2 个其他不同的景区，而且不能重复经过同一个景区。不存在这样的景区 X：从 X 出发不到达其他景区马上回到 X。现在 Mr.Zeng 需要你帮他找一条这样的路线，并且长度越小越好。
### 输入格式
第一行包含两个正整数：景区个数 N（N<=100），另一个是道路的数目 M（M<10000）。
接下来 M 行每行描述一条路，每一行有三个正整数 A，B，C，其中 A 和 B 分别表示这条路连接的两个景区的编号，C 表示这条路的长度（不超过500的正整数）。
### 输出格式
如果这条观光路线是不存在的话就显示“No solution.”(有句号)；
如果这条观光路线存在就输出经过的最小长度。
<!-- more -->
### 样例数据 1
#### 输入
``` bash
5 7
1 4 1
1 3 300
3 1 10
1 2 16
2 3 100
2 5 15
5 3 20
```
#### 输出
``` bash
61
```
### 备注
#### 【样例说明】
经过路线1 3 5 2 1，长度：10+20+15+16=61
### 分析
在 floyd 的同时，顺便算出最小环，时间复杂度是 O(V<sup>3</sup>)记两点间的最短路为 dis[i][j]，g[i][j]为边 (i,j) 的权值,ans为这张图的最小环。
### 源码
``` cpp
#include <bits/stdc++.h>
#define min(x,y) (y ^ ((x ^ y) & -(x < y)))
#define INF 0x3ffffff
using namespace std;
int g[110][110], dis[110][110];
int n, m, ans = INF;
inline void floyd() {
    for (register int k = 1; k <= n; k++) {
        for (register int i = 1; i <= k - 1; i++)
            for (register int j = 1; j <= i - 1; j++)
                ans = min(ans, dis[i][j] + g[i][k] + g[k][j]);
        for (register int i = 1; i <= n; i++)
            for (register int j = 1; j <= n; j++)
                dis[i][j] = min(dis[i][j], dis[i][k] + dis[k][j]);
    }
    if (ans ^ INF) cout << ans;
    else cout << "No solution.";
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cin >> n >> m;
    for (register int i = 1; i <= n; i++)
        fill(g[i] + 1, g[i] + n + 1, INF), fill(dis[i] + 1, dis[i] + n + 1, INF), g[i][i] = 0;
    int u, v, w;
    while (m--) cin >> u >> v >> w, g[u][v] = g[v][u] = min(g[u][v], w), dis[u][v] = dis[v][u] = min(dis[u][v], w);
    floyd();
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=22683858&auto=1&height=66"></iframe>