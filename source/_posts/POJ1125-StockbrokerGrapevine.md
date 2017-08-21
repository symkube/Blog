---
title: 「POJ 1125」传递消息
date: 2016-07-04 22:31:27
tags:
  - 最短路
categories:
  - oi
  - 图论
  - 最短路
---
## 传递消息
### 题目背景
[POJ 1125](http://poj.org/problem?id=1125)
### 题目描述
股票经纪人以对传闻的准确判断而闻名。你已签定一个合同，就是研究一种方法，在股票经纪人中间传播假情报，以便雇主在股票市场中赢得先机。为了得到最大效益，你必须尽可能快地散布传闻。

不幸的是，股票经纪人只信任来自他们“可靠来源”的消息。这意味着，在散播传闻时，你必须考虑他们所接触的人际关系。某个股票经纪人需要花一些时间把传闻传递给他的每一位同事。你的任务是写一个程序，确定从哪个证券经纪人开始散播传闻最快，以及传闻传递到整个证券界时所需要最少时间。这个时间是指最后一个人收到传闻的时间。
每个股票经纪人从1开始编号，一直到股票经纪人的总数。
<!-- more -->
### 输入格式
开始的一行，是股票经纪人的数目 $N(1 \leq N \leq 100)$。

接下来每个股票经纪人一行：第一个整数是这个股票经纪人的联系人个数 $M(0 \leq M \leq 100)$，接着是 $M$ 对整数，每对整数对应一位联系人。每对数的第一个是联系人编号，然后是此人传递消息的时间 $T(1 \leq T \leq 10)$。

注意：假如某一对股票经纪人之间可以互相传递消息，那么从 $A$ 传给 $B$ 的时间并不一定等于从 $B$ 传给 $A$ 的时间。
### 输出格式
输出一行，包含两个整数，第一个是消息传递最快的人的编号（如果传递速度最快的有多个相同，则输出编号最小的）；第二个整数是最后一个人得知消息所需要的时间（分钟）。

程序很可能会接收到一个不完整的人际关系网络，也就是某些人不能收到消息。如果程序检测到一个不完整的网络，只需输出 `disjoint`。
### 样例数据 1
输入
``` bash 
3
2 2 4 3 5
2 1 2 3 6
2 1 2 2 2
```
输出
``` bash
3 2
```
### 样例数据 2
输入
``` bash
5
3 4 4 2 8 5 3
1 5 8
4 1 6 4 10 2 7 5 2
0
2 2 5 1 5
```
输出
``` bash
3 10
```
### Floyd
#### 分析
注意数据范围,$1 \leq N \leq 100, 0 \leq M \leq 100, 1 \leq T \leq 10$,并且这是多源最短路径问题,所以这道题直接用 Floyd 算法就可以了。
#### 源码
``` cpp
#include <cstdio>
#include <iostream>
using namespace std;
char ch_buffer;
bool signum;
inline void readInt(int &l) {
    l = 0;
    do
        ch_buffer = getchar();
    while ((ch_buffer < '0' || ch_buffer > '9') && ch_buffer != '0' &&
           ch_buffer != '-');
    if (ch_buffer == '-') ch_buffer = getchar(), signum = true;
    while (ch_buffer <= '9' && ch_buffer >= '0')
        l = (l << 3) + (l << 1) + ch_buffer - '0', ch_buffer = getchar();
    if (signum) l = -l, signum = false;
}
int num, tra_num, end, peo, len;
int dis[101][101], maxl, minl = 99999999;
bool bj;
int main(int argc, char const *argv[]) {
    readInt(num);
    for (int i = 1; i <= num; i++)
        for (int j = 1; j <= num; j++) dis[i][j] = 9999999;
    for (int i = 1; i <= num; i++) {
        readInt(tra_num);
        for (int j = 1; j <= tra_num; j++)
            readInt(end), readInt(len), dis[i][end] = len;
    }
    for (int i = 1; i <= num; i++) dis[i][i] = 0;
    for (int i = 1; i <= num; i++)
        for (int j = 1; j <= num; j++)
            for (int k = 1; k <= num; k++)
                if (dis[j][i] + dis[i][k] < dis[j][k])
                    dis[j][k] = dis[j][i] + dis[i][k];
    for (int o = 1; o <= num; o++) {
        maxl = 0;
        bj = false;
        for (int j = 1; j <= num; j++) {
            if (dis[o][j] > maxl) {
                maxl = dis[o][j];
                bj = true;
            }
        }
        if (maxl < minl && bj) {
            minl = maxl;
            peo = o;
        }
    }
    cout << peo << " " << minl;
    return 0;
}
```
### Dijkstra
#### 分析
由于这里是多源,所以应将每一个点都当作源枚举一遍。
#### 源码
``` cpp
#include <algorithm>
#include <cstdio>
#include <cstring>
#include <iostream>
#include <queue>
#include <vector>
#define pair_int std::pair<int, int>
char ch_buffer;
bool signum;
inline void readInt(int &l) {
    l = 0;
    do
        ch_buffer = getchar();
    while ((ch_buffer < '0' || ch_buffer > '9') && ch_buffer != '0' &&
           ch_buffer != '-');
    if (ch_buffer == '-') ch_buffer = getchar(), signum = true;
    while (ch_buffer <= '9' && ch_buffer >= '0')
        l = (l << 3) + (l << 1) + ch_buffer - '0', ch_buffer = getchar();
    if (signum) l = -l, signum = false;
}
using namespace std;
#define DIJKSTRA_MAX 10010
/*节点*/
struct node {
    /*v编号 w权值*/
    int v, w;
    node() {}
    node(int v0, int w0) : v(v0), w(w0) {}
    bool operator<(const node &b) const { return w < b.w; }
};
bool vis[DIJKSTRA_MAX];
int dis[DIJKSTRA_MAX];
/*利用vector可以很轻松地实现邻接表*/
vector<node> son[DIJKSTRA_MAX];
inline int dijkstra(int s, int t) {
    priority_queue<pair_int, vector<pair_int>, greater<pair_int> > q;
    memset(dis, 127, sizeof(dis));
    memset(vis, false, sizeof(vis));
    dis[s] = 0;
    q.push(make_pair(dis[s], s));
    while (!q.empty()) {
        int now = q.top().second;
        q.pop();
        if (vis[now]) continue;
        vis[now] = true;
        for (int i = 0; i < son[now].size(); i++) {
            node x = son[now][i];
            if (dis[now] + x.w < dis[x.v]) {
                dis[x.v] = dis[now] + x.w;
                q.push(make_pair(dis[x.v], x.v));
            }
        }
    }
    return dis[t];
}
inline void insert(int a, int b, int w) { son[a].push_back(node(b, w)); }
inline void insert_multi(int a, int b, int w) {
    son[a].push_back(node(b, w));
    son[b].push_back(node(a, w));
}
int n, m;
int p, t;
struct tot {
    int pos;
    int val;
    tot() : val(0) {}
    inline bool operator<(const tot &_t) const {
        if (val != _t.val) return val < _t.val;
        return pos < _t.pos;
    }
};
tot total[105];
int min_pos;
bool found[105];
#define NOT_FOUND 2139062143
int main(int argc, char const *argv[]) {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    memset(found, true, sizeof(found));
    readInt(n);
    for (int i = 1; i <= n; i++) {
        readInt(m);
        for (int j = 0; j < m; j++) readInt(p), readInt(t), insert(i, p, t);
    }
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            if (i != j) {
                total[i].pos = i;
                int tmp = dijkstra(i, j);
                if (tmp != NOT_FOUND)
                    total[i].val = max(total[i].val, tmp);
                else
                    found[i] = false, total[i].val = NOT_FOUND;
            }
        }
    }
    for (int i = 1; i <= n; i++)
        if (found[i]) goto can;
    goto notfound;
can : {
    min_pos = min_element(total + 1, total + n + 1)->pos;
    cout << min_pos << " " << total[min_pos].val;
    exit(0);
}
notfound:
    cout << "disjoint";
    return 0;
}
```
### SPFA
#### 分析
同Dijkstra,要枚举一遍。
#### 源码
``` cpp
#include <algorithm>
#include <cstdio>
#include <cstring>
#include <iostream>
#include <queue>
#include <vector>
#define pair_int std::pair<int, int>
char ch_buffer;
bool signum;
inline void readInt(int &l) {
    l = 0;
    do
        ch_buffer = getchar();
    while ((ch_buffer < '0' || ch_buffer > '9') && ch_buffer != '0' &&
           ch_buffer != '-');
    if (ch_buffer == '-') ch_buffer = getchar(), signum = true;
    while (ch_buffer <= '9' && ch_buffer >= '0')
        l = (l << 3) + (l << 1) + ch_buffer - '0', ch_buffer = getchar();
    if (signum) l = -l, signum = false;
}
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
int n, m;
int p, t;
struct tot {
    int pos;
    int val;
    tot() : val(0) {}
    inline bool operator<(const tot &_t) const {
        if (val != _t.val) return val < _t.val;
        return pos < _t.pos;
    }
};
tot total[105];
int min_pos;
bool found[105];
#define NOT_FOUND 2139062143
int main(int argc, char const *argv[]) {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    memset(found, true, sizeof(found));
    readInt(n);
    for (int i = 1; i <= n; i++) {
        readInt(m);
        for (int j = 0; j < m; j++) readInt(p), readInt(t), insert(i, p, t);
    }
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            if (i != j) {
                total[i].pos = i;
                int tmp = spfa(i, j);
                if (tmp != NOT_FOUND)
                    total[i].val = max(total[i].val, tmp);
                else
                    found[i] = false, total[i].val = NOT_FOUND;
            }
        }
    }
    for (int i = 1; i <= n; i++)
        if (found[i]) goto can;
    goto notfound;
can : {
    min_pos = min_element(total + 1, total + n + 1)->pos;
    cout << min_pos << " " << total[min_pos].val;
    exit(0);
}
notfound:
    cout << "disjoint";
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=730631&auto=1&height=66"></iframe>