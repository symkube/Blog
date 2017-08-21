---
title: 「ZJOI-2015」幻想乡战略游戏-动态树分治
date: 2016-12-20 15:59:08
tags:
  - 数据结构
  - 动态树分治
categories:
  - oi
  - 数据结构
---
傲娇少女幽香正在玩一个非常有趣的战略类游戏，本来这个游戏的地图其实还不算太大，幽香还能管得过来，但是不知道为什么现在的网游厂商把游戏的地图越做越大，以至于幽香一眼根本看不过来，更别说和别人打仗了。
在打仗之前，幽香现在面临一个非常基本的管理问题需要解决。
整个地图是一个树结构，一共有 $n$ 块空地，这些空地被 $n-1$ 条带权边连接起来，使得每两个点之间有一条唯一的路径将它们连接起来。在游戏中，幽香可能在空地上增加或者减少一些军队。同时，幽香可以在一个空地上放置一个补给站。
如果补给站在点 $u$ 上，并且空地 $v$ 上有 $d_v$ 个单位的军队，那么幽香每天就要花费：$d_v \times dist(u,v)$的金钱来补给这些军队。由于幽香需要补给所有的军队，因此幽香总共就要花费为 $\sum_{v=1}^{n}d_v \cdot dist(u, v)$ 的代价。其中 $dist(u,v)$ 表示 $u$ 和 $v$ 在树上的距离（唯一路径的权和）。
因为游戏的规定，幽香只能选择一个空地作为补给站。在游戏的过程中，幽香可能会在某些空地上制造一些军队，也可能会减少某些空地上的军队，进行了这样的操作以后，出于经济上的考虑，幽香往往可以移动她的补给站从而省一些钱。但是由于这个游戏的地图是在太大了，幽香无法轻易的进行最优的安排，你能帮帮她吗？ 你可以假定一开始所有空地上都没有军队。
<!-- more -->
### 输入格式
第一行两个数 $n$ 和 $Q$ 分别表示树的点数和幽香操作的个数，其中点从 $1$ 到 $n$ 标号。
接下来 $n-1$ 行，每行三个正整数 $a,b,c (1 \leq c \leq 1000)$，表示 $a$ 和 $b$ 之间有一条边权为 $c$ 的边。
接下来 $Q$ 行，每行两个数 $u$，$e (0 \leq |e| \leq 1000)$，表示幽香在点 $u$ 上放了 $e$ 单位个军队（如果 $e<0$，就相当于是幽香在 $u$ 上减少了$|e|$单位个军队，说白了就是$du \leftarrow du+e$）。
数据保证任何时刻个点上的军队数量都是非负的。 
### 输出格式
对于幽香的每个操作，输出操作完成以后，每天的最小花费，也即如果幽香选择最优的补给点进行补给时的花费。
### 样例数据 1
#### 输入
``` bash
10 5
1 2 1
2 3 1
2 4 1
1 5 1
2 6 1
2 7 1
5 8 1
7 9 1
1 10 1
3 1
2 1
8 1
3 1
4 1
```
#### 输出
``` bash
0
1
4
5
6
```
### 备注
对于 $15\%$ 的数据：$n \leq 5000$；$Q \leq 2000$。
另有 $10\%$ 的数据：$n \leq 10^5$；$Q \leq 10^5$，这个树的结构是一条链。 
另有 $5\%$ 的数据：$n \leq 10^5$；$Q \leq 10^5$，这个树是随机生成的，生成方法为对于每个点 $i>1$ ，在 $<i$ 的点中随机一个作为它的父亲。
另有 $5\%$ 的数据：$n \leq 10^5$；$Q \leq 10^5$，这个树的结构是一个十字（即两条链通过一个公共点相交，例子见下图）。
![幻想乡战略游戏【浙江省选2015】](http://oeicis1qk.bkt.clouddn.com/bzoj3924.jpg)
另有 $5\%$ 的数据：$n \leq 10^5$；$Q \leq 10^5$，这个树的结构是一个以 $1$ 号节点为根的完全二叉树，并且标号方法与二叉堆相同（我相信大家都知道什么是完全二叉树，就不说明了）。
另有 $30\%$ 的数据：$n \leq 10^5$；$Q \leq 10^5$，幽香只会增加军队（所有 $e \geq 0$）。
另有 $30\%$ 的数据：$n \leq 10^5$；$Q \leq 10^5$。
非常神奇的是，对于所有数据，这棵树上所有点的度数都不超过 $20$ ，并且 $n,Q \geq 1$。
### 题解
动态树分治，写过捉迷藏的人应该都知道可以每个点记录子树中带权距离之和，以及权值之和，再在每个子树中记录一个需要减掉的版本，然后一直向上扫到根就能统计了。
然后对于点分树的每一个点，枚举它的出边，如果某条出边连向的点的距离之和小于当前点，那么答案一定在那条出边指向的子树中，分治做下去就行了，如果不存在小于当前点的出边，那么当前点就是重心。
时间复杂度 $O(n \log^2n)$
### 代码
``` cpp
#include <bits/stdc++.h>
const int MAXN = 100100;
inline char read() {
    static const int IO_LEN = 1024 * 1024;
    static char buf[IO_LEN], *ioh, *iot;
    if (ioh == iot) {
        iot = (ioh = buf) + fread(buf, 1, IO_LEN, stdin);
        if (ioh == iot) return -1;
    }
    return *ioh++;
}
template<class T>
inline void read(T &x) {
    static char ioc;
    static bool iosig = 0;
    for (iosig = 0, ioc = read(); !isdigit(ioc); ioc = read()) if (ioc == '-') iosig = 1;
    for (x = 0; isdigit(ioc); ioc = read()) x = (x << 1) + (x << 3) + (ioc ^ '0');
    if (iosig) x = -x;
}
typedef long long ll;
struct Node {
    int v, w;
    Node(int v, int w) : v(v), w(w) {}
};
std::vector<Node> edge[MAXN];
inline void addEdge(int u, int v, int w) {
    edge[u].push_back(Node(v, w));
    edge[v].push_back(Node(u, w));
}
bool vis[MAXN];
int s[MAXN], f[MAXN], root, size;
inline void dfs(int u, int fa) {
    s[u] = 1; f[u] = 0;
    int v = 0;
    for (register int i = 0; i < edge[u].size(); i++) {
        if (vis[v = edge[u][i].v] || v == fa) continue;
        dfs(v, u);
        s[u] += s[v];
        f[u] = std::max(f[u], s[v]);
    }
    f[u] = std::max(f[u], size - s[u]);
    if (f[u] < f[root]) root = u;
}
std::vector<std::pair<ll, ll> > pre[MAXN];
inline void getdist(int u, int fa, int tar, int dist) {
    pre[u].push_back(std::make_pair(tar, dist));
    s[u] = 1; int v = 0;
    for (register int i = 0; i < edge[u].size(); i++) {
        if (vis[v = edge[u][i].v] || v == fa) continue;
        getdist(v, u, tar, dist + edge[u][i].w);
        s[u] += s[v];
    }
}
std::vector<std::pair<ll, std::pair<ll, ll> > > ch[MAXN];
inline void work(int u) {
    vis[u] = 1;
    int v = 0;
    pre[u].push_back(std::make_pair(u, 0));
    for (int i = 0; i < edge[u].size(); i++) {
        if (vis[v = edge[u][i].v]) continue;
        getdist(v, 0, u, edge[u][i].w);
        f[0] = size = s[v];
        dfs(v, root = 0);
        ch[u].push_back(std::make_pair(root, std::make_pair(v, edge[u][i].w)));
        work(root);
    }
}
ll cnt[MAXN], sum[MAXN];
std::vector<ll> sumdist[MAXN];
inline void update(int x, ll y, ll z) {
    for (int i = 0; i < pre[x].size(); i++) {
        int u = pre[x][i].first;
        cnt[u] += y; sum[u] += z + y * pre[x][i].second;
        if (i != pre[x].size() - 1) {
            int j = 0;
            for (; j < ch[u].size(); j++)
                if (ch[u][j].first == pre[x][i + 1].first) sumdist[u][j] += z + y * pre[x][i].second;
        }
    }
}
int realroot;
std::vector<std::pair<ll, std::pair<ll, ll> > > record;
inline ll query() {
    int x = realroot;
    int mx = 0;
    record.clear();
    while (x) {
        mx = 0;
        for (int i = 1; i < ch[x].size(); i++)
            if (cnt[ch[x][mx].first] < cnt[ch[x][i].first]) mx = i;
        if (ch[x].size() == 0 || cnt[ch[x][mx].first] * 2 <= cnt[x]) {
            ll ans = sum[x];
            for (int i = 0; i < record.size(); i++)
                update(record[i].first, record[i].second.first, record[i].second.second);
            return ans;
        }
        int v = ch[x][mx].first;
        record.push_back(std::make_pair(ch[x][mx].second.first, std::make_pair(-(cnt[x] - cnt[v]), -(sum[x] - sumdist[x][mx] + (cnt[x] - cnt[v])*ch[x][mx].second.second))));
        update(ch[x][mx].second.first, cnt[x] - cnt[v],
               sum[x] - sumdist[x][mx] + (cnt[x] - cnt[v])*ch[x][mx].second.second);
        x = v;
    }
}
int main() {
    int n, Q;
    read(n), read(Q);
    for (register int i = 1, u, v, w; i < n; i++)
        read(u), read(v), read(w), addEdge(u, v, w);
    f[0] = size = n;
    dfs(1, root = 0);
    realroot = root;
    work(root);
    for (register int i = 1; i <= n; i++) sumdist[i] = std::vector<ll>(ch[i].size(), 0);
    while (Q--) {
        register int x, y;
        read(x), read(y);
        update(x, y, 0);
        std::cout << query() << "\n";
    }
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=26260757&auto=1&height=66"></iframe>