---
title: 树上操作总结
date: 2016-11-14 22:46:18
tags:
  - 树
  - 学习笔记
categories:
  - oi
  - 学习笔记
---
## 树上操作学习总结
### 储存
用邻接表储存。
``` cpp
const int MAXN = 10010;
struct Node {
    int v, w;
    Node(int v, int w) : v(v), w(w) {}
};
vector<Node> edge[MAXN];
inline void addEdge(int u, int v, int w) {
    edge[u].push_back(Node(v, w));
    edge[v].push_back(Node(u, v));
}
```
<!-- more -->
### dfs
#### 模板
``` cpp
inline void dfs(int u) {
    cout << u << " ";
    for (register int i = 0; i < edge[u].size(); i++)
        dfs(edge[u][i].v);
}
```
#### 获取节点的父亲
``` cpp
inline void getFather(int u) {
    for (register int i = 0; i < edge[u].size(); i++) {
        father[edge[u][i].v] = u;
        getFather(edge[u][i].v);
    }
}
```
#### 获取树的深度
``` cpp
int dep[MAXN];
inline void getDepth(int u) {
    for (register int i = 0; i < edge[u].size(); i++) {
        dep[edge[u][i].v] = dep[u] + 1;
        getDepth(edge[u][i].v);
    }
}
```
#### 获取树上距离
**dfs法**
``` cpp
inline int getDis(int u, int v) {
    if (u == v) return 0;
    if (dep[u] == dep[v]) return getDis(father[u], father[v]) + 2;
    if (dep[u] > dep[v]) return getDis(father[u], v) + 1;
    return getDis(u, father[v]) + 1;
}
```
**LCA公式法**
$dis(u, v)=dis(u,root)+dis(v,root)-2 \times dis(lca(u,v),root)$
### LCA
#### ST法
``` cpp
#define MAXN 100010
int rmq[MAXN * 2], F[MAXN * 2], P[MAXN * 2], cnt, dis[MAXN];
struct SparseTable {
    int LOG[2 * MAXN];
    int dp[2 * MAXN][20];
    inline void init(int n) {
        LOG[0] = -1;
        for (register int i = 1; i <= n; i++) LOG[i] = LOG[i >> 1] + 1, dp[i][0] = i;
        for (register int j = 1; j <= LOG[n]; j++)
            for (register int i = 1; i + (1 << j) - 1 <= n; i++)
                dp[i][j] = rmq[dp[i][j - 1]] < rmq[dp[i + (1 << (j - 1))][j - 1]] ? dp[i][j - 1] : dp[i + (1 << (j - 1))][j - 1];
    }
    inline int query(int a, int b) {
        if (a > b) swap(a, b);
        register int k = LOG[b - a + 1];
        return rmq[dp[a][k]] <= rmq[dp[b - (1 << k) + 1][k]] ? dp[a][k] : dp[b - (1 << k) + 1][k];
    }
};
struct Node {
    int v, w;
    Node() {}
    Node(int v, int w) : v(v), w(w) {}
};
vector<Node> e[MAXN << 1];
inline void addEdge(int u, int v, int w) {
    e[u].push_back(Node(v, w)), e[v].push_back(Node(u, w));
}
void dfs(int u, int pre, int dep) {
    F[++cnt] = u, rmq[cnt] = dep, P[u] = cnt;
    for (register int i = 0, v; i < e[u].size(); ++i) {
        v = e[u][i].v;
        if (v == pre) continue;
        dis[v] = dis[u] + e[u][i].w;
        dfs(v, u, dep + 1);
        F[++cnt] = u, rmq[cnt] = dep;
    }
}
SparseTable st;
inline void lcaInit(int root, int n) {
    cnt = 0;
    dfs(root, root, 0);
    st.init((n << 1) - 1);
}
inline int lcaQuery(int u, int v) {
    return F[st.query(P[u], P[v])];
}
```
#### 树链剖分法
详见[树链剖分](http://oi.xehoth.cc/2016/11/14/树链剖分学习总结/)
### 其他
待填坑...
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=22645087&auto=1&height=66"></iframe>