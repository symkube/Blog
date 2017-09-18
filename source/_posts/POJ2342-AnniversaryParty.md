---
title: 「POJ 2342」没有上司的晚会
date: 2016-07-22 20:32:47
tags:
  - DP
categories: 
  - OI
  - DP
---
## 没有上司的晚会
### 题目背景
[poj2342](http://poj.org/problem?id=2342)
### 题目描述
Ural 大学有N 个职员，编号为 1~N。他们有从属关系，也就是说他们的关系就像一棵以校长为根的树，父结点就是子结点的直接上司。每个职员有一个快乐指数。现在有个周年庆宴会，要求与会职员的快乐指数最大。但是，没有职员愿和直接上司一起与会。
### 输入格式
第一行一个整数 N (1<=N<=6000)。
接下来 N 行，第i+1行表示i 号职员的快乐指数Ri(-128<=Ri<=127) 。
接下来 N-1 行，每行输入一对整数 L 和 K。表示 K 是 L 的直接上司
最后一行输入0 0。
### 输出格式
输出最大的快乐指数。
<!-- more -->
### 样例数据 1
#### 输入
``` bash
7
1
1
1
1
1
1
1
1 3
2 3
6 4
7 4
4 5
3 5
0 0
```
#### 输出
``` bash
5
```
### 分析
树形DP,注意边界。
### 源码
``` cpp
#include <bits/stdc++.h>
using namespace std;
char ch;
bool signum;
inline void readInt(int& l) {
    l = 0;
    do
        ch = cin.get();
    while ((ch < '0' || ch > '9') && ch != '-' && ch != '0');
    if (ch == '-') signum = true, ch = cin.get();
    while (ch >= '0' && ch <= '9')
        l = (l << 1) + (l << 3) + ch - '0', ch = cin.get();
    if (signum) l = -l, ch = cin.get();
}
int father[6005], vis[6005], dp[6005][2], t;
void dfs(int node) {
    vis[node] = 1;
    for (register int i = 1; i <= t; i++) {
        if (!vis[i] && father[i] == node) {
            dfs(i);
            dp[node][1] += dp[i][0];
            dp[node][0] += max(dp[i][0], dp[i][1]);
        }
    }
}
int main() {
    int l, k;
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    readInt(t);
    for (register int i = 1; i <= t; i++) readInt(dp[i][1]);
    int root = 0;
    while (readInt(l), readInt(k), l + k > 0) {
        father[l] = k;
        root = k;
    }
    memset(vis, 0, sizeof(vis));
    dfs(root);
    cout << max(dp[root][1], dp[root][0]) << endl;
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=730727&auto=1&height=66"></iframe>