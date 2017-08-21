---
title: 「SuperOJ 430」太空飞行计划
date: 2016-07-22 20:36:00
tags:
  - 图论
  - 最大流
categories:
  - oi
  - 图论
  - 最大流
---
## 太空飞行计划
### 题目描述
W 教授正在为国家航天中心计划一系列的太空飞行。每次太空飞行可进行一系列商业性实验而获取利润。现已确定了一个可供选择的实验集合 E={E1，E2， \cdots ，Em}，和进行这些实验需要使用的全部仪器的集合 I={I1， I2， \cdots In}。 实验 Ej 需要用到的仪器是 I 的子集 Rj∈I。配置仪器 Ik 的费用为 Ck 美元。实验 Ej 的赞助商已同意为该实验结果支付 Pj 美元。W 教授的任务是找出一个有效算法， 确定在一次太空飞行中要进行哪些实验并因此而配置哪些仪器才能使太空飞行的净收益最大。这里净收益是指进行实验所获得的全部收入与配置仪器的全部费用的差额。 
对于给定的实验和仪器配置情况，编程找出净收益最大的试验计划，输出最大收益值。
<!-- more -->
### 输入格式
输入文件第 1 行有 2 个正整数 m 和 n（1<=m,n<=400）。其中 m 是实验数，n 是仪器数。接下来的 m 行，每行是一个实验的有关数据（每个数不超过50）。第一个数赞助商同意支付该实验的费用；接着是该实验需要用到的若干仪器的编号。最后一行的 n 个数是配置每个仪器的费用。
### 输出格式
输出一个整数，即最大的净收益值。 
### 样例数据 1
#### 输入
``` bash
2 3
10 1 2
25 2 3
5 6 7
```
#### 输出
``` bash
17
```
### 分析
最大权闭合图，转化为求最小割，最终为最大流。
最大利润 = 总收入 - 最大权闭合图权值即
最大利润 = 总收入 - 最大流
**注意处理输入,我用的cin.peek()**
### 源码
``` cpp
#include <bits/stdc++.h>
using namespace std;
int n, m;
int index;
int e[50000][3];
int head[1005];
const int INF = 100000;
bool vis[1005];
int level[1005];
inline bool bfs() {
    for (int i = 0; i <= n + m + 1; i++) vis[i] = level[i] = 0;
    queue<int> q;
    q.push(0);
    vis[0] = true;
    while (!q.empty()) {
        register int cur = q.front();
        q.pop();
        for (int i = head[cur]; i != -1; i = e[i][1]) {
            int v = e[i][0];
            if (!vis[v] && e[i][2] > 0) {
                level[v] = level[cur] + 1;
                if (v == n + 1 + m) return true;
                vis[v] = true;
                q.push(v);
            }
        }
    }
    return vis[n + 1 + m];
}
int dfs(int u, int minf) {
    if (minf == 0 || u == n + 1 + m) return minf;
    int sumf = 0, f;
    for (int i = head[u]; i != -1 && minf; i = e[i][1]) {
        int v = e[i][0];
        if (level[v] == level[u] + 1 && e[i][2] > 0) {
            f = dfs(v, minf < e[i][2] ? minf : e[i][2]);
            e[i][2] -= f;
            e[i ^ 1][2] += f;
            minf -= f;
            sumf += f;
        }
    }
    return sumf;
}
inline void addedge(int f, int to, int w) {
    e[index][0] = to;
    e[index][1] = head[f];
    head[f] = index;
    e[index++][2] = w;
    e[index][0] = f;
    e[index][1] = head[to];
    head[to] = index;
    e[index++][2] = 0;
}
inline int dinic() {
    int sum = 0;
    while (bfs()) sum += dfs(0, INF);
    return sum;
}
vector<int> vc;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cin >> m >> n;
    for (int i = 0; i <= m + n + 1; i++) head[i] = -1;
    index = 0;
    int sum = 0;
    int x, y, w;
    for (int i = 1; i <= m; i++) {
        cin >> w;
        addedge(0, i, w);
        while (cin.peek() != '\n') {
            cin >> y;
            addedge(i, y + m, INF);
        }
        sum += w;
    }
    for (int i = m + 1; i <= m + n; i++) {
        cin >> w;
        addedge(i, n + m + 1, w);
    }
    int ans = sum - dinic();
    for (int i = 1; i < n + m + 1; i++)
        if (vis[i]) vc.push_back(i);
    sort(vc.begin(), vc.end());
    cout << ans << endl;
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=28230954&auto=1&height=66"></iframe>