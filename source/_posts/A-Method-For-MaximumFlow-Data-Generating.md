---
title: 一种最大流数据生成方法
date: 2018-01-26 10:49:48
tags:
  - 图论
  - 网络流
  - 最大流
categories:
  - OI
  - 图论
  - 网络流
  - 最大流
---
一种构造方法，仅 $532$ 个点，$24115$ 条边的图，使得 Dinic, SAP, ISAP 运行时间均大于 $1s$，
$1198$ 个点，$120796$ 条边运行时间均超过 $1 \mathrm{min}$~~（当然也可能是我的最大流写得太菜）~~。

<!-- more -->

### 构造方法

![maxFlowRevisited](/images/maxFlowRevisited.png)

如图所示，所有点被分成四个集合 $S, T, U, V$，$S, T$ 分别有 $k$ 个节点，$U, V$ 分别有 $2p$ 个节点（$k, p$ 为定值）。

加粗的弧容量为 $1$，虚线容量为 $+\infty$，其他的弧容量为 $k$。

对于增广路算法，首先会花费 $O(k ^ 2)$ 的时间在 {% raw %}$\{s, S, T, t\}${% endraw %} 中增广，长度为 $3$。
然后沿反向弧 $\{T, S\}$，在 {% raw %}$\{s, u_1, u_2, T, S, v_2, v_1, t\}${% endraw %} 花费 $O(k ^ 2)$ 的时间，长度为 $7$。
然后在 {% raw %}$\{s, u_1, u_2, u_3, u_4, S, T, v_4, v_3, v_2, v_1, t\}${% endraw %} 长度为 $11$，不停进行下去...

#### 参数的选取
下面来确定 $k, p$ 的值，这个构造方法的点数为 $n = 2k + 4p + 2$，边数 $m = k ^ 2 + 2pk + 2k + 2p$，增广的数量为 $a = k ^ 2(p + 1)$。

令 $p = k - 1$，则 $n = 6k - 2, m = 3k ^ 2 + 4k - 4, a = k ^ 3$，即使会受到路径选择的影响，$a$ 也会是 $k ^ 3 / 216$ 的级别。

### 实现
``` cpp
#include <bits/stdc++.h>

struct Edge {
    int u, v, w;
    Edge(int u, int v, int w) : u(u), v(v), w(w) {}
};

// 6k - 2 顶点，3k ^ 2 + 4k - 4 边
inline void gen(int k) {
    const int INF = 2147483647;
    const int q = k - 1, n = 6 * k - 2;
    const int src = 0, dst = 1;
    int a = 2;
    const int sb = a, se = (a += k);
    const int tb = a, te = (a += k);
    const int ub = a, ue = (a += 2 * q);
    const int vb = a, ve = (a += 2 * q);
    std::vector<Edge> edges;
    for (int s = (sb); s < (se); s++) edges.push_back(Edge(src, s, k));
    for (int t = (tb); t < (te); t++) edges.push_back(Edge(t, dst, k));
    for (int s = (sb); s < (se); s++)
        for (int t = (tb); t < (te); t++) edges.push_back(Edge(s, t, 1));
    edges.push_back(Edge(src, ub, INF));
    edges.push_back(Edge(vb, dst, INF));
    for (int u = (ub); u < (ue - 1); u++) edges.push_back(Edge(u, u + 1, INF));
    for (int v = (vb); v < (ve - 1); v++) edges.push_back(Edge(v + 1, v, INF));
    for (int u = ub + 1; u < ue; u += 4)
        for (int t = (tb); t < (te); t++) edges.push_back(Edge(u, t, k));
    for (int u = ub + 3; u < ue; u += 4)
        for (int s = (sb); s < (se); s++) edges.push_back(Edge(u, s, k));
    for (int v = vb + 1; v < ve; v += 4)
        for (int s = (sb); s < (se); s++) edges.push_back(Edge(s, v, k));
    for (int v = vb + 3; v < ve; v += 4)
        for (int t = (tb); t < (te); t++) edges.push_back(Edge(t, v, k));
    std::cout << n << ' ' << edges.size() << ' ' << src + 1 << ' ' << dst + 1
              << '\n';
    srand(clock() * time(0));
    std::random_shuffle(edges.begin(), edges.end());
    for (int i = 0; i < (int)edges.size(); i++) {
        std::cout << edges[i].u + 1 << ' ' << edges[i].v + 1 << ' '
                  << edges[i].w << '\n';
    }
}

int main(const int argc, const char *argv[]) {
    if (argc < 2) {
        std::cerr << "invalid input!!!";
        return 0;
    }
    int k = atoi(argv[1]);
    gen(k);
    return 0;
}
```