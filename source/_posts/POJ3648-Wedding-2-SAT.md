---
title: 「POJ-3648」Wedding-2-SAT
date: 2017-01-01 18:43:25
tags:
  - 图论
  - Tarjan
  - 2-SAT
categories:
  - oi
  - 图论
  - Tarjan
---
Up to thirty couples will attend a wedding feast, at which they will be seated on either side of a long table. The bride and groom sit at one end, opposite each other, and the bride wears an elaborate headdress that keeps her from seeing people on the same side as her. It is considered bad luck to have a husband and wife seated on the same side of the table. Additionally, there are several pairs of people conducting adulterous relationships (both different-sex and same-sex relationships are possible), and it is bad luck for the bride to see both members of such a pair. Your job is to arrange people at the table so as to avoid any bad luck.
<!-- more -->
### 链接
[POJ-3648](http://poj.org/problem?id=3648)
### 题解
这个题的实质就是一种 $a \vee b$ 的限制，对于一对关系 $(a, b)$，$a$ 向 $b'$，$b$ 向 $a'$ 各连一条边，表示若 $a$ 与新郎同侧，那么 $b$ 不能与新郎同侧，也就是 $b'$ 一定要与新郎同侧。反之亦然。输出时反过来，即若与新郎同侧的是妻子，那么与新娘同侧的（也就是需要输出的人）就是丈夫。
### 代码
``` cpp
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
#include <cstdlib>
#include <stack>
#include <cstring>
const int MAXN = 400005;
std::vector<int> edge[MAXN];
inline void addEdge(const int u, const int v) { edge[u].push_back(v); }
std::stack<int> st;
int dfn[MAXN], low[MAXN], inComponent[MAXN], idx, cnt, n, m;
bool vis[MAXN];
inline void tarjan(const int u) {
	vis[u] = true, st.push(u), low[u] = dfn[u] = ++idx;
	for (register int i = 0, v; i < edge[u].size(); i++) {
		if (!dfn[v = edge[u][i]]) tarjan(v), low[u] = std::min(low[u], low[v]);
		else if (vis[v]) low[u] = std::min(low[u], dfn[v]);
	}
	if (dfn[u] == low[u]) {
		register int v;
		inComponent[u] = ++cnt, vis[u] = false;
		while (v = st.top(), st.pop(), v != u) inComponent[v] = cnt, vis[v] = false;
	}
}
inline int neg(int x) {
    if (x <= n) return x + n;
    return x - n;
}
inline void init() {
    cnt = idx = 0;
    memset(edge, 0, sizeof(edge));
    memset(dfn, 0, sizeof(dfn));
}
inline void build() {
    register int u, v;
    char a, b;
    for (register int i = 1; i <= m; i++) {
        scanf("%d%c %d%c", &u, &a, &v, &b);
        u++, v++;
        if (a == 'h') u += n;
        if (b == 'h') v += n;
        addEdge(u, neg(v)), addEdge(v, neg(u));
    }
    addEdge(1, 1 + n);
}
int main() {
    while (scanf("%d%d", &n, &m), n > 0 || m > 0) {
        init();
        build();
        for (register int i = 1; i <= n << 1; i++)
            if (!dfn[i])
                tarjan(i);
        bool flag = true;
        for (register int i = 1; i <= n && flag; i++)
            if (inComponent[i] == inComponent[i + n])
                flag = false;
        if (!flag) {
            puts("bad luck");
            continue;
        }
        for (register int i = 2; i <= n; i++) printf("%d%c%c", i - 1, (inComponent[i] > inComponent[i + n]) ? 'w' : 'h', " \n"[i == n]);
        if (n < 2) printf("\n");
    }
	return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=27580519&auto=1&height=66"></iframe>
