---
title: 「POJ-3678」Katu Puzzle-2-SAT
date: 2017-01-01 18:53:57
tags:
  - 图论
  - Tarjan
  - 2-SAT
categories:
  - oi
  - 图论
  - Tarjan
---
Katu Puzzle is presented as a directed graph G(V, E) with each edge e(a, b) labeled by a boolean operator op (one of AND, OR, XOR) and an integer c (0  \leq  c  \leq  1). One Katu is solvable if one can find each vertex Vi a value Xi (0  \leq  Xi  \leq  1) such that for each edge e(a, b) labeled by op and c, the following formula holds:...
<!-- more -->
### 链接
[POJ-3678](http://poj.org/problem?id=3678)
### 题解
此题连边十分麻烦，wa了3次....
若给出节点 $a$，$b$，值 $c$ 以及判断方法 $op$，设 $a << 1$ 为 $1$，$a << 1 | 1$ 为 $0$，
1. 若 $op$ 为 $\&$:当 $c=1$ 时，那么只有 $a$ 与 $b$ 同时为 $1$ 时，$a \& b$ 才等于 $1$，并且有且只有当 $a$ 与 $b$ 都为 $1$ 时这个条件才成立，所以 $a$ 与 $b$ 一定要等于 $1$，所以连边 $< a << 1 | 1, a << 1 >$，$< b << 1 | 1,b << 1 >$，表示不管怎么样，$a$ 与 $b$ 的情况都等于 $1$，即：当 $a$ 等于 $0$ 时 $a$ 必等于 $1$，$b$ 等于 $0$ 时 $b$ 必等于 $1$。当 $c=0$ 时，那么当 $a$ 等于 $0$ 时，$b$ 可能为 $0$ 也可以为 $1$，所以是不确定关系，由上面说的一定是确定关系才能连边，所以 $a$ 为 $0$ 的情况就不能连边了；当 $a$ 等于 $1$ 时，$b$ 一定为 $0$ 才能使 $a \& b =0$，所以连边：$< a << 1,b << 1 | 1 >$，当然还有$< b << 1,a << 1 | 1 >$。
2. 当 $op$ 为 $|$ 时:当 $c=1$ 时，那么当 $a=1$ 时，$b=1$ 或者 $b=0$，所以当 $a=1$ 时出现了两种关系，就是不确定了，就不用连边了；当 $a=0$ 时，那么 $b$ 一定 $=1$,所以是确定关系，连边：$< a << 1 | 1,b << 1 >$，当然还有$< b << 1 | 1,a << 1 >$。当 $c=0$ 时，那么只有当 $a=b=0$ 这个关系，所以这个和上面情况就一样了，即连边$< a << 1,a << 1 | 1 >$,$< b << 1,b << 1 | 1 >$。
3. 当 $op$ 为 ^ 时:因为如果 $a=1$,那么 $b$ 必 $=0$；$a=0$，$b$ 必 $=1$；$b=1$，$a$ 必 $=0$；$b=0$，$a$ 必 $=1$。如此看，这四个关系都是确定的，所以都要连边，但是其实我们可以不连，一条边都不用连，因为出a=1的时候一定不会再出现 $a=0$ 了，这四条边是不会产生矛盾的，所以在异或这种情况中只能选择 $a=0$ 或者 $a=1$，所以不会出现矛盾 \cdots  \cdots 故不用连边了。

### 代码
``` cpp
#include <iostream>
#include <cstdio>
#include <fstream>
#include <algorithm>
#include <cmath>
#include <deque>
#include <vector>
#include <list>
#include <queue>
#include <string>
#include <cstring>
#include <map>
#include <stack>
#include <set>
const int MAXN = 2010;
int dfn[MAXN], vis[MAXN], low[MAXN], inComponent[MAXN], idx, cnt;
std::vector<int> edge[MAXN];
std::stack<int> st;
inline void tarjan(int u) {
    dfn[u] = low[u] = ++idx, vis[u] = true, st.push(u);
    register int v;
    for (register int i = 0; i < edge[u].size(); i++) {
        v = edge[u][i];
        if (!dfn[v]) tarjan(v), low[u] = std::min(low[u], low[v]);
        else if (vis[v]) low[u] = std::min(low[u], dfn[v]);
    }
    if (dfn[u] == low[u]) {
        cnt++;
        do v = st.top(), st.pop(), vis[v] = false, inComponent[v] = cnt; while (v != u);
    }
}
inline bool twoSAT(const int n) {
    for (register int i = 0; i < n << 1; i++) if (!dfn[i])  tarjan(i);
    for (register int i = 0; i < n; i++) if (inComponent[i << 1] == inComponent[i << 1 | 1]) return false;
    return true;
}
int main() {
#ifndef ONLINE_JUDGE
    freopen("in.in", "r", stdin);
#endif
    register int n, m, a, b, c;
    char s[5];
    scanf("%d%d", &n, &m);
    for (register int i = 0; i < m; i++) {
        scanf("%d%d%d%s", &a, &b, &c, s);
        if (s[0] == 'A') {
            if (c) edge[a << 1 | 1].push_back(a << 1), edge[b << 1 | 1].push_back(b << 1);
            else edge[a << 1].push_back(b << 1 | 1), edge[b << 1].push_back(a << 1 | 1);
        } else if (s[0] == 'O') {
            if (c) edge[a << 1 | 1].push_back(b << 1), edge[b << 1 | 1].push_back(a << 1);
            else edge[a << 1].push_back(a << 1 | 1), edge[b << 1].push_back(b << 1 | 1);
        }
    }
    std::cout << (twoSAT(n) ? "YES" : "NO");
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=869224&auto=1&height=66"></iframe>
