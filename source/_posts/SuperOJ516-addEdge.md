---
title: 「SuperOJ 516」加边
date: 2016-07-28 22:56:11
tags:
  - 图论
  - Tarjan
categories:
  - oi
  - 图论
  - Tarjan
---
## 加边
### 题目描述
给出一个 N×M 的矩阵，在这个矩阵上的每一个点都有一个高度值 h 。矩阵中相邻两点是连通的，而且只能从高度高的点到达高度低的点，高度相同的点之间可以相互到达。
现在要求在图中连若干双向边，使图中任意一点 u 出发都可以到达任意的其它点 v ，问至少需要连接多少条双向边？
### 输入格式
第一行是两个整数：（1 \leq N,M \leq 300），其中, N，M分别表示矩阵的行数和列数。
从第二行开始，描述的是一个 N 行 M 列的矩阵，矩阵每个位置上的数字表示该位置的高度 h（1 \leq h \leq 1,000,000）。 
### 输出格式
输出一个整数，即至少需要连接的边的数量。
<!-- more -->
### 样例数据 1
#### 输入 
``` bash
2 3
1 2 3
4 5 6
```
#### 输出
``` bash
1
```
### 样例数据 2
#### 输入 
``` bash
1 1
10
```
#### 输出
``` bash
0
```
### 样例数据 3
#### 输入 
``` bash
7 2
7 7
8 8
8 8
6 5
5 6
8 7
4 8
```
#### 输出
``` bash
4
```
### 分析
tarjan+缩点,注意建图时的判断,然后统计入度和出度为0的点,ans为max{in,out},如果n==m==1,则不需要加边,单独判断输出0就好。
### 源码
``` cpp
#include <bits/stdc++.h>
#define max(x,y) (x ^ ((x ^ y) & -(x < y)))
#define MAX 100000
#define INF 0x3ffffff
using namespace std;
const int dx[] = { -1, 0, 1, 0};
const int dy[] = {0, 1, 0, -1};
int dfn[MAX], low[MAX];
int st[MAX];
bool vis[MAX], f[MAX];
int g[305][305], rg[305][305];
bool r[MAX], c[MAX];
int deg[MAX];
int size, tot, num, top, n, m;
vector <int> vc[MAX];

inline void tarjan(int x) {
    tot++;
    while (st[top] ^ x)
        f[st[top]] = false, deg[st[top]] = tot, top--;
    f[st[top]] = false;
    deg[st[top]] = tot;
    top--;
}

void dfs(int x) {
    size++;
    dfn[x] = size;
    low[x] = size;
    top++;
    st[top] = x;
    f[x] = true;
    for (int i = 0; i < vc[x].size(); i++)
        if (!dfn[vc[x][i]])
            dfs(vc[x][i]), low[x] = min(low[x], low[vc[x][i]]);
        else if (f[vc[x][i]])
            low[x] = min(low[x], low[vc[x][i]]);
    if (dfn[x] == low[x]) tarjan(x);
}

inline void degree() {
    int tot1 = 0, tot2 = 0;
    for (int i = 1; i <= num; i++)
        for (int j = 0; j < vc[i].size(); j++)
            if (deg[i]^deg[vc[i][j]])
                c[deg[i]] = true, r[deg[vc[i][j]]] = true;
    for (int i = 1; i <= tot; i++) {
        if (!c[i]) tot1++;
        if (!r[i]) tot2++;
    }
    cout << max(tot1, tot2);
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cin >> n >> m;
    memset(g, 127, sizeof(g));
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            cin >> g[i][j], rg[i][j] = ++num;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            for (int k = 0; k < 4; k++)
                if (g[i][j] >= g[i + dx[k]][j + dy[k]])
                    vc[rg[i][j]].push_back(rg[i + dx[k]][j + dy[k]]);
    if (n == 1 && m == 1)
        cout << "0\n", exit(0);
    for (int i = 1; i <= num; i++)
        if (!dfn[i])
            dfs(i);
    degree();
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=738423&auto=1&height=66"></iframe>