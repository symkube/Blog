---
title: 树链剖分学习总结
date: 2016-11-14 23:05:38
tags:
  - 树
  - 树链剖分
  - 学习笔记
categories:
  - OI
  - 学习笔记
---
## 树链剖分学习总结
如果要在一棵树上进行路径的修改,求极值,求和，似乎线段树即可完成，实际上只用线段树并不能很好的做到，只有用一种高级的东西——**树链剖分**。
### 概念
树链，就是树上的路径。剖分，就是把路径分类为**重链**和**轻链**。
记`size[v]`表示以`v`为根的子树的节点数，`depth[v]`表示`v`的深度(根深度为1)，`top[v]`表示v所在的链的顶端节点，`father[v]`表示`v`的父亲，`son[v]`表示与`v`在同一重链上的`v`的儿子节点（姑且称为重儿子），`w[v]`表示`v`与其父亲节点的连边（姑且称为`v`的父边）在线段树中的位置。只要把这些东西求出来，就能用$O(logn)$的时间完成原问题中的操作。
<!-- more -->
#### 重儿子
> `size[u]`为`v`的子节点中`size`值最大的，那么`u`就是`v`的重儿子。

#### 轻儿子
> `v`的其它子节点。

#### 重边
> 点`v`与其重儿子的连边。

#### 轻边
> 点`v`与其轻儿子的连边。

#### 重链
> 由重边连成的路径。

#### 轻链
> 轻边。

### 性质
> 性质1：如果`(v, u)`为**轻边**，则`size[u] * 2 < size[v]`；

> 性质2：从根到某一点的路径上**轻链**,**重链**的个数都不大于*O*(logn)。

### 实现
#### 基本思想
把整棵树划分成许多条**链**，使每个节点都在唯一的链上，对每一条链维护一棵**线段树**，把在树上的操作转移到**线段树**上。

具体剖分的话，这里采用**轻重边路径剖分**的方式，剖最大子树，这样可以保证整棵树上的**轻边**和**链**的数量都不超过*O*(logn)。
#### dfs1
把$father$,$dep$,$size$,$son$求出来。
#### dfs2
1. 对于 $v$，当$son[v]$存在（即 $v$ 不是叶子节点）时，显然有$top[son[v]] = top[v]$。线段树中，$v$的重边应当在$v$的父边的后面，记$w[son[v]] = totw+1$，$totw$表示最后加入的一条边在线段树中的位置。此时，为了使一条重链各边在线段树中连续分布，应当进行$dfs2(son[v])$； 
2. 对于v的各个轻儿子$u$，显然有$top[u] = u$，并且$w[u] = totw+1$，进行$dfs2$过程。 

这就求出了$top$和$w$

#### 修改操作
记$f1 = top[u]$，$f2 = top[v]$。 

当$f1 = f2$时：不妨设$dep[f1] >= dep[f2]$，那么就更新 $u$ 到 $f1$ 的父边的权值，并使$u = father[f1]$。 

当$f1 = f2$时：$u$与$v$在同一条重链上，若$u$与$v$不是同一点，就更新$u$到$v$路径上的边的权值，否则修改完成； 重复上述过程，直到修改完成。

#### 求LCA
``` cpp
inline int getLCA(int u, int v) {
    while (top[u] != top[v])
        dep[top[u]] < dep[top[v]] ? v = father[top[v]] : u = father[top[u]];
    return dep[u] < dep[v] ? u : v;
}
```
### 代码
[bzoj1036树的统计](http://www.lydsy.com/JudgeOnline/problem.php?id=1036)
``` cpp
#include <bits/stdc++.h>
using namespace std;
const int iol = 1024 * 1024;
char buf[iol], *ioh, *iot, ioc;
bool iosig;
inline char read() {
    if (ioh == iot) {
        iot = (ioh = buf) + fread(buf, 1, iol, stdin);
        if (ioh == iot) return -1;
    }
    return *ioh++;
}
template <class T>
inline bool read(T &x) {
    iosig = false;
    for (ioc = read(); !isdigit(ioc); ioc = read()) {
        if (ioc == -1) return false;
        if (ioc == '-') iosig = true;
    }
    x = 0;
    while (ioc == '0') ioc = read();
    for (; isdigit(ioc); ioc = read()) x = (x << 1) + (x << 3) + (ioc ^ '0');
    ioh--;
    if (iosig) x = -x;
    return true;
}
const int MAXN = 30010;
struct Node {
    int v, w;
    Node() {}
    Node(int v, int w) : v(v), w(w) {}
};
vector<Node> edge[MAXN];
int dep[MAXN];     /*当前节点的深度*/
int father[MAXN];  /*当前节点的父亲*/
int size[MAXN];    /*以当前节点为根的子树节点个树*/
int son[MAXN];     /*当前节点的重儿子*/
int top[MAXN];     /*当前节点所在链的顶端节点*/
int pos[MAXN];     /*当前节点在线段树中的编号*/
int idx;           /* dfs序*/
bool vis[MAXN];
void dfs1(int u) {
    dep[u] = dep[father[u]] + 1, size[u] = 1, vis[u] = true;
    for (register int i = 0; i < edge[u].size(); i++) {
        Node *x = &edge[u][i];
        if (!vis[x->v]) {
            register int pre = x->v;
            father[pre] = u;
            dfs1(pre);
            size[u] += size[pre];
            if (size[pre] > size[son[u]]) son[u] = pre;
        }
    }
}
void dfs2(int u) {
    vis[u] = false, pos[u] = idx++,
    top[u] = (u == son[father[u]] ? top[father[u]] : u);
    for (register int i = 0; i < edge[u].size(); i++)
        if (edge[u][i].v == son[u]) dfs2(edge[u][i].v);
    for (register int i = 0; i < edge[u].size(); i++)
        if (vis[edge[u][i].v]) dfs2(edge[u][i].v);
}
struct SegmentNode {
    int sum, max;
    SegmentNode() {}
    SegmentNode(int sum, int max) : sum(sum), max(max) {}
};
struct SegmentTree {
    int M, size;
    SegmentNode *data;
    SegmentTree(int n) {
        for (M = 1; M < n; M <<= 1)
            ;
        size = M << 1 | 1;
        data = new SegmentNode[size];
        for (register int i = n; i < M; i++)
            data[i + M] = SegmentNode(0, INT_MIN);
    }
    inline void build() {
        for (register int i = M - 1; i; i--) {
            data[i].sum = data[i << 1].sum + data[i << 1 | 1].sum;
            data[i].max = std::max(data[i << 1].max, data[i << 1 | 1].max);
        }
    }
    inline void modify(const int pos, const int val) {
        register int i = pos + M;
        for (data[i].sum = data[i].max = val, i >>= 1; i; i >>= 1) {
            data[i].sum = data[i << 1].sum + data[i << 1 | 1].sum;
            data[i].max = std::max(data[i << 1].max, data[i << 1 | 1].max);
        }
    }
    inline int getMax(int s, int t) {
        register int ans = INT_MIN;
        for (s = s + M - 1, t = t + M + 1; s ^ t ^ 1; s >>= 1, t >>= 1) {
            if (~s & 1) ans = std::max(ans, data[s ^ 1].max);
            if (t & 1) ans = std::max(ans, data[t ^ 1].max);
        }
        return ans;
    }
    inline int getSum(int s, int t) {
        register int ans = 0;
        for (s = s + M - 1, t = t + M + 1; s ^ t ^ 1; s >>= 1, t >>= 1) {
            if (~s & 1) ans += data[s ^ 1].sum;
            if (t & 1) ans += data[t ^ 1].sum;
        }
        return ans;
    }
} * tree;
inline int getLCA(int u, int v) {
    while (top[u] != top[v])
        dep[top[u]] < dep[top[v]] ? v = father[top[v]] : u = father[top[u]];
    return dep[u] < dep[v] ? u : v;
}
inline int getMax(int u, int v) {
    register int ans = INT_MIN;
    while (top[u] != top[v]) {
        ans = std::max(ans, tree->getMax(pos[top[u]], pos[u]));
        u = father[top[u]];
    }
    ans = std::max(ans, tree->getMax(pos[v], pos[u]));
    return ans;
}
inline int getSum(int u, int v) {
    register int ans = 0;
    while (top[u] != top[v]) {
        ans += tree->getSum(pos[top[u]], pos[u]);
        u = father[top[u]];
    }
    ans += tree->getSum(pos[v], pos[u]);
    return ans;
}
inline void cut(int root = 1) { dfs1(root), dfs2(root); }
inline void addEdge(int u, int v, int w = 0) {
    edge[u].push_back(Node(v, w));
    edge[v].push_back(Node(u, w));
}
int n, w[MAXN];
int main() {
    read(n);
    tree = new SegmentTree(n);
    for (register int i = 1, u, v; i < n; i++) read(u), read(v), addEdge(u, v);
    cut();
    for (register int i = 1; i <= n; i++)
        read(w[i]), tree->data[pos[i] + tree->M] = SegmentNode(w[i], w[i]);
    tree->build();
    int q, x, y;
    read(q);
    while (q--) {
        char opt = read();
        while (opt < 'A' || opt > 'Z') opt = read();
        if (opt == 'C') {
            read(x), read(y);
            tree->modify(pos[x], y);
            w[x] = y;
        } else {
            opt = read();
            read(x), read(y);
            register int lca = getLCA(x, y);
            if (opt == 'M')
                cout << max(getMax(x, lca), getMax(y, lca)) << "\n";
            else
                cout << getSum(x, lca) + getSum(y, lca) - w[lca] << "\n";
        }
    }
    return 0;
}
```
