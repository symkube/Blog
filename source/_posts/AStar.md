---
title: 'A*算法学习笔记'
date: 2016-11-03 22:51:51
tags:
  - A*
  - 学习笔记
categories:
  - OI
  - 学习笔记
---
## A\*算法学习总结
### 引入
假设有人想从A点移动到一墙之隔的B点，如下图，绿色的是起点A，红色是终点B，蓝色方块是中间的墙。
![A*算法](http://oeicis1qk.bkt.clouddn.com/astar1.png)
### 简化搜索区域
如上图，搜索区域已经划分成了方格，像这样简化搜索区域，是寻路的第一步。这一方法将搜索区域简化成了二位数组(基本的图论模型)，数组的每一个元素是是网格的一个方块，方块被标记为可通过的和不可通过的。路径被描述为从`s`到`t`我们经过的方块的集合。一旦路径被找到，我们的人就从一个方格的中心走向另一个，直到到达目的地。
<!-- more -->
### 节点
这些方格的中心被称为节点，**但节点完全可能是其他的结构**。节点能够被放置在形状的任意位置-可以在中心，或者沿着边界，或其他什么地方。我们使用这种系统，无论如何，因为它是**最简单**的。
### 开始搜索
具体搜索的原理和过程可以参考[这篇文章](http://zhyt710.iteye.com/blog/739803)。
### 启发式搜索
有一种贪心策略，即每一步转移都选择当前的最优解生成新的状态，一直到达目标状态为止。这样做的时间效率虽然较高，但是贪心的策略只是用到了**局部的最优解**，**并不能**保证最后到达目标状态得到的是全局最优解。但在能保证全局最优解的范围内，贪心算法还是很有用的。
而A\*算法并不会盲目地去搜寻每一种状态，也不会直接贪心，它可以像人一样区分尽量短的路径，以便**高效地**找到最优解。
### 估价函数
A\*算法定义初始状态 $s$ ，目标状态 $t$，$g(s)$ 是由初始状态转移到当前状态 $s$ 所经过的路径长度，$h(s)'$是当前状态 $s$ 距离目标状态 $t$ 的实际长度，但是一般情况下我们是不知道$h(s)'$的值的，所以还要定义一个估价函数$h(s)$，是对$h(s)'$函数值的下界的估计，也就是有$h(s) \leqslant h(s)'$，这样需要一个条件，使得由 $s_1$ 生成的每状态 $s_2$，都有$h(s1) \leqslant h(s2)$，这是一个相容的估价函数。再定义$f(s) = g(s) + h(s)$为启发函数，因为 $h(s)$ 是单调递增的，所以 $f(s)$ 也是单调递增的。这样 $f(s)$ 就估计出了由初始状态的总体代价。A\*算法就通过构造这样一个启发函数，将所有的待扩展状态加入到队列里，每次从队列里选择 $f(s)$ 值最小的状态进行扩展。由于启发函数的作用，使得计算机在进行状态转移的时候尽量避开了不可能产生最优解的分支，而选择相对较接近最优解的路径进行搜索，提高了搜索效率。
### 常见估价函数
#### 曼哈顿距离
标准的启发式函数是[曼哈顿距离（Manhattan distance）](https://en.wikipedia.org/wiki/Taxicab_geometry)。考虑你的代价函数并找到从一个位置移动到邻近位置的最小代价$D$。因此，启发式函数应该是曼哈顿距离的$D$倍：$ f(n) = D \times (abs ( n.x - goal.x ) + abs ( n.y - goal.y ) )$
#### 对角线距离
如果在你的地图中你允许对角运动，那么你需要一个不同的启发函数，所以启发函数应该是$4 \times D$。这个函数使用对角线，假设直线和对角线的代价都是$D$：$f(n) = D \times max(abs(n.x - goal.x), abs(n.y - goal.y))$
#### 欧几里得距离
如果你的单位可以沿着任意角度移动（而不是网格方向），那么你也许应该使用直线距离：$f(n) = D \times \sqrt{(n.x-goal.x)^2 + (n.y-goal.y)^2}$
然而，如果是这样的话，直接使用A\*时将会遇到麻烦，因为估计函数 $h$ 不会match启发函数 $f$。因为欧几里得距离比曼哈顿距离和对角线距离都短，你仍可以得到最短路径，不过A\*将**运行得更久**一些。
## 例题
### Remmarguts' Date【poj2449】
[Remmarguts' Date【poj2449】](http://poj.org/problem?id=2449)
#### 分析
这个题就是求第 $k$ 短路，我们考虑将**dijkstra**求最短路扩展。
首先确定以下两个个搜索策略：
1. 用优先队列保存节点进行搜索
2. 放开每个节点的入队次数，求k短路，每个节点可以入队k次。

- 首先看第一个策略，在A\*算法中用优先队列就是要用到启发函数 $f(s)$ 确定状态在优先队列里面的优先级。其实**dijkstra**用到的优先队列实际上就是估价函数值为 $0$，启发函数 $f(s)=g(s)$，即是选取到源点距离最近的点进行扩展。因为$ h(s)=0$ 满足了估价函数相容这个条件。这题求k短路就不能单纯的使用 $h(s)=0$ 这个估价函数。解决这道题的时候选取 $h(x)=dt(x)$ , $dt(x)$是 $x$ 节点到目标节点的最短距离。最短距离可以开始由**dijkstra**直接求得。
- 再看第二个策略，控制每个节点的入队（或出队）次数为 $k$ 次，可以找到第 $k$ 短路径。可能这样想有点主观的套用，那么我就先来证明这样一个结论：如果 $x$ 是 $s$ 到 $t$ 的第 $k$ 短路径上的一个节点，那么由这条路径 $s$ 到 $x$ 是 $s$ 到 $x$ 的第 $m$ 短路径，则不可能有 $m>k$ 。用反证法很容易得出：如果这条路径是 $s$ 到 $x$ 的第 $m$短 路径，如果 $m>k$ ，那么经过 $x$ 到 $t$ 的路径就有 $m-1$ 条比当前路径要短，不符合当前路径是 $s$ 到 $t$ 的第 $k$ 短路径。

**注意：**
1. A\*求第K短路的是**非严格最短路**，即一个点可以在路径中出现多次。
2. 另外本题是有向边，因此在用**dijkstra**的时候需要存下反向边。

``` cpp
#include <bits/stdc++.h>
using namespace std;
const int MAXN = 1020;
int dis[MAXN];
struct Node {
    int v, w;
    Node(int v, int w) : v(v), w(w) {}
    Node() {}
    /*这里是对估价函数的使用，使得路径最短的先出队（小根堆）*/
    inline bool operator < (const Node &a) const {
        return w + dis[v] > a.w + dis[a.v];
    }
};
/*-----------正图--------反图-----*/
vector<Node> edge[MAXN], rev[MAXN];
/*求所有点到终点（t）的最短路径(即反向求t到各点的最短路)*/
/**dijkstra
 *@param s 反向图起点，即要求的第k短路的终点
 *@param n 点数
 */
inline void dijkstra(int s, int n) {
    fill(dis + 1, dis + n + 1, INT_MAX);
    static bool vis[MAXN];
    memset(vis, 0, sizeof(vis));
    priority_queue<Node> q;
    dis[s] = 0;
    q.push(Node(s, dis[s]));
    while (!q.empty()) {
        register int now = q.top().v;
        q.pop();
        if (vis[now]) continue;
        vis[now] = true;
        /*注意这里是枚举反向图，其他同普通dijkstra*/
        for (register int i = 0; i < rev[now].size(); i++) {
            Node *x = &rev[now][i];
            if (dis[now] + x->w < dis[x->v])
                dis[x->v] = dis[now] + x->w, q.push(Node(x->v, dis[x->v]));
        }
    }
}
/**A*搜索
 *@param s 起点
 *@param t 终点
 *@param k 求的第k短路
 *@param n 点数
 */
inline int AStar(int s, int t, int k, int n) {
    if (dis[s] == INT_MAX) return -1;/*终点t到起点s不通，则返回-1*/
    priority_queue<Node> q;/*定义了一个优先队列（小根堆）*/
    static int cnt[MAXN];/*cnt[i]存储第i条边第几次出队*/
    memset(cnt, 0, sizeof(cnt));
    q.push(Node(s, 0));
    while (!q.empty()) {/*如果队列不空 ，循环*/
        const Node now = q.top();/*与起点距离最短的点出队*/
        q.pop();/*删除队首*/
        cnt[now.v]++;/*记录u出队次数*/
        if (cnt[t] == k) return now.w;/*如果终点第k次出队，则找到"s到t的第k短路"*/
        /*出队超过k次, 说明已经把前k短路都用于更新其它点了,
         *而一个点的前k短路只可能由其它点的前k短路更新而来,
         * 所以点u的第k+1短路已经失去了更新其它点的意义, 
         *可以直接出队*/
        if (cnt[now.v] > k) continue;
        /*枚举所有从u出发的正向边i*/
        for (register int i = 0; i < edge[now.v].size(); i++)
            q.push(Node(edge[now.v][i].v, now.w + edge[now.v][i].w));
        /*把边u~v加入优先队列，自动按到起点的距离形成小根堆*/
    }
    return -1;
}
/**
 *@param s 起点
 *@param t 终点
 *@param k 求的第k短路
 *@param n 点数
 */
inline int getKthDis(int s, int t, int k, int n) {
    /*如果 s==t ，那么就是求 k+1 短路*/
    if (s == t) k++;
    dijkstra(t, n);
    return AStar(s, t, k, n);
}
inline void addEdge(int u, int v, int w) {
    edge[u].push_back(Node(v, w));
    /*建反图*/
    rev[v].push_back(Node(u, w));
}
int main() {
    int n, m, s, t, k;
    while (~scanf("%d %d", &n, &m)) {
        for (register int i = 0, u, v, w; i < m; i++)
            scanf("%d %d %d", &u, &v, &w), addEdge(u, v, w);
        scanf("%d %d %d", &s, &t, &k);
        printf("%d\n", getKthDis(s, t, k, n));
    }
    return 0;
}
```
### Knight Moves【poj2243】
题目的意思大概是说：在国际象棋的棋盘上，一匹马共有`8`个可能的跳跃方向，求从起点到目标点之间的最少跳跃次数。
#### 分析
此题是A\*算法的模板题，以曼哈顿距离为估价函数，直接A\*搜索就好了。
``` cpp
#include <queue>
#include <iostream>
#include <cstdio>
#include <cstring>
using namespace std;
struct Knight {
    int x, y, step;
    int g, h, f;
    /*启发式函数*/
    inline bool operator < (const Knight &b) const {
        return f > b.f;
    }
} k;
/*已访问标记(关闭列表)*/
bool vis[8][8];
/*起点(x1,y1),终点(x2,y2),最少移动次数ans*/
int x1, x2, y1, y2, ans;
/*8个移动方向*/
int dirs[8][2] = {
    {-2, -1}, {-2, 1}, {2, -1}, {2, 1}, 
    {-1, -2}, {-1, 2}, {1, -2}, {1, 2}
};
/*最小优先级队列(开启列表)*/
priority_queue<Knight> que;
/*判断是否在棋盘内*/
inline bool check(const Knight &a) {
    if (a.x < 0 || a.y < 0 || a.x >= 8 || a.y >= 8)
        return false;
    return true;
}
inline int abs(int a) {
    return a < 0 ? -a : a;
} 
/*manhattan距离估价函数*/
inline int heuristic(const Knight &a) {
    return (abs(a.x - x2) + abs(a.y - y2)) * 10;
}
inline void AStar() {
    Knight t, s;
    while (!que.empty()) {
        t = que.top(), que.pop(), vis[t.x][t.y] = true;
        if (t.x == x2 && t.y == y2) {
            ans = t.step;
            break;
        }
        for (int i = 0; i < 8; i++) {
            s.x = t.x + dirs[i][0], s.y = t.y + dirs[i][1];
            if (check(s) && !vis[s.x][s.y]) {
                /*23 = Math.ceil(Math.sqrt(5) * 10)*/
                s.g = t.g + 23;
                s.h = heuristic(s);
                s.f = s.g + s.h;
                s.step = t.step + 1;
                que.push(s);
            }
        }
    }
}
int main() {
    char line[5];
    while (cin.getline(line, 6)) {
        x1 = line[0] - 'a', y1 = line[1] - '1', x2 = line[3] - 'a', y2 = line[4] - '1';
        memset(vis, 0, sizeof(vis));
        k.x = x1, k.y = y1, k.g = k.step = 0, k.h = heuristic(k), k.f = k.g + k.h;
        while (!que.empty()) que.pop();
        que.push(k);
        AStar();
        printf("To get from %c%c to %c%c takes %d knight moves.\n", line[0], line[1], line[3], line[4], ans);
    }
    return 0;
}
```

