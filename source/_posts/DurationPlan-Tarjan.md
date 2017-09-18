---
title: 「补档计划」Tarjan
date: 2017-04-25 10:10:40
tags:
  - 补档计划
  - 图论
  - Tarjan
categories:
  - OI
  - 补档计划
---
复习 Tarjan 算法以及一些常见的应用。
<!-- more -->
### 一些定义
- 树枝边：DFS 时经过的边，即 DFS 搜索树上的边
- 前向边：与 DFS 方向一致，从某个结点指向其某个子孙的边
- 后向边：与 DFS 方向相反，从某个结点指向其某个祖先的边
- 横叉边：从某个结点指向搜索树中另一子树中的某结点的边

### 强连通分量
#### 定义
在有向图 $G$ 中， 如果两个顶点 `u, v` 间存在一条路径 `u` 到 `v` 的路径且也存在一条 `v` 到 `u` 的路径，则称这两个顶点 `u, v` 是强连通的(strongly connected)。如果有向图 $G$ 的每两个顶点都强连通， 称 $G$ 是一个强连通图。 有向非强连通图的极大强连通子图， 称为强连通分量(strongly connected components)。若将有向图中的强连通分量都缩为一个点，则原图会形成一个 DAG（有向无环图）。

极大强连通子图： $G$ 是一个极大强连通子图当且仅当 $G$ 是一个强连通子图且不存在另一个强连通子图 $G'$ 使得 $G$ 是 $G'$ 的真子集。
#### 实现
``` cpp
std::vector <int> edge[MAXN];

int size[MAXN], dfn[MAXN], low[MAXN], id[MAXN], idx, cnt;
bool vis[MAXN];

inline void tarjan(const int u) {
    static std::stack<int> st;
    register int v;
    vis[u] = true, st.push(u), low[u] = dfn[u] = ++idx;
    for (register int i = 0, v; i < edge[u].size(); i++) {
        if (!dfn[v = edge[u][i]]) tarjan(v), low[u] = std::min(low[u], low[v]);
        else if (vis[v]) low[u] = std::min(low[u], dfn[v]);
    }
    if (dfn[u] == low[u]) {
        cnt++;
        do vis[v = st.top()] = false, st.pop(), size[id[v] = cnt]++;
        while (u != v);
    }
}

inline void tarjan() {
    for (register int i = 1; i <= n; i++)
        if (!dfn[i]) tarjan(i);
}
```

### 割点
#### 定义
无向连通图中，如果删除某点后，图变成不连通，则称该点为割点。
#### 实现
``` cpp
std::vector <int> edge[MAXN];

int idx, fa[MAXN], dfn[MAXN], low[MAXN], cut[MAXN];

inline void tarjan(const int u) {
    dfn[u] = low[u] = ++idx;
    for (register int i = 0, v; i < edge[u].size(); i++) {
        if (!dfn[v = edge[u][i]])
            fa[v] = u, tarjan(v), low[u] = std::min(low[u], low[v]);
        else if (u != fa[u]) low[u] = std::min(low[u], dfn[v]);
    }
}

inline void findCut(const int n) {
    register int son = 0;
    tarjan(1);
    for (register int i = 2, v; i <= n; i++) {
        if (low[i] >= dfn[v = fa[i]])
            v == 1 ? son++ : cut[v]++;
    }
    if (son > 1) cut[1] = son - 1;
}
```


### 割边/桥
#### 定义
存在于无向图中的这样的一条边，如果去掉这一条边，那么整张无向图会分为两部分，这样的一条边称为桥无向连通图中，如果删除某边后，图变成不连通，则称该边为桥。
#### 实现
``` cpp
std::vector <int> edge[MAXN];

int dfn[MAXN], low[MAXN], idx, fa[MAXN];

inline void tarjan(const int u) {
    dfn[u] = low[u] = ++idx;
    for (register int i = 0, v; i < edge[u].size(); i++) {
        if (!dfn[v = edge[u][i]]) 
            fa[v] = u, tarjan(v), low[u] = std::min(low[u], low[v]);
        else if (u != fa[u]) low[u] = std::min(low[u], dfn[v]);
    }
}

inline std::vector<std::pair<int, int> > findBridge(const int n) {
    tarjan(1);
    std::vector<std::pair<int, int> > bridge;
    for (register int i = 1, v; i <= n; i++)
        if ((v = fa[i]) && low[i] > dfn[v]) 
            bridge.push_back(std::make_pair(v, i));
    return bridge;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=32405990&auto=1&height=66"></iframe>