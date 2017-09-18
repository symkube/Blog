---
title: 「POJ-3180」The Cow Prom-tarjan
date: 2017-01-01 18:20:23
tags:
  - 图论
  - Tarjan
categories:
  - OI
  - 图论
  - Tarjan
---
The $N (2 <= N <= 10,000)$ cows are so excited: it's prom night! They are dressed in their finest gowns, complete with corsages and new shoes. They know that tonight they will each try to perform the Round Dance.

Only cows can perform the Round Dance which requires a set of ropes and a circular stock tank. To begin, the cows line up around a circular stock tank and number themselves in clockwise order consecutively from 1..N. Each cow faces the tank so she can see the other dancers.
<!-- more -->
They then acquire a total of $M (2 <= M <= 50,000)$ ropes all of which are distributed to the cows who hold them in their hooves. Each cow hopes to be given one or more ropes to hold in both her left and right hooves; some cows might be disappointed.

For the Round Dance to succeed for any given cow (say, Bessie), the ropes that she holds must be configured just right. To know if Bessie's dance is successful, one must examine the set of cows holding the other ends of her ropes (if she has any), along with the cows holding the other ends of any ropes they hold, etc. When Bessie dances clockwise around the tank, she must instantly pull all the other cows in her group around clockwise, too. Likewise,
if she dances the other way, she must instantly pull the entire group counterclockwise (anti-clockwise in British English).

Of course, if the ropes are not properly distributed then a set of cows might not form a proper dance group and thus can not succeed at the Round Dance. One way this happens is when only one rope connects two cows. One cow could pull the other in one direction, but could not pull the other direction (since pushing ropes is well-known to be fruitless). Note that the cows must Dance in lock-step: a dangling cow (perhaps with just one rope) that is eventually pulled along disqualifies a group from properly performing the Round Dance since she is not immediately pulled into lockstep with the rest.

Given the ropes and their distribution to cows, how many groups of cows can properly perform the Round Dance? Note that a set of ropes and cows might wrap many times around the stock tank.
### 链接
[POJ-3180](http://poj.org/problem?id=3180)
### 题解
水题一道，就是求强连通分量节点数 $>=2$ 的个数...
### 代码
``` cpp
#include <iostream>
#include <cstdio>
#include <cstring>
#include <algorithm>
#include <cmath>
#include <queue>
#include <stack>
#include <string>
#include <vector>
#include <cstdlib>
#include <map>
#include <set>
using namespace std;
const int MAXN = 10024;
const int MAXM = 50048;
int sum[MAXN];
int head[MAXN], dfn[MAXN], low[MAXN], ins[MAXN], belong[MAXN];
stack<int> s;
struct Edge {
    int v, next;
} edge[MAXM];
int n, m, e, t, cnt;

void tarjan(int u) {
    dfn[u] = low[u] = ++t;
    s.push(u);
    ins[u] = 1;
    for (int i = head[u]; i != -1; i = edge[i].next) {
        int v = edge[i].v;
        if (dfn[v] == 0) {
            tarjan(v);
            low[u] = min(low[u], low[v]);
        } else if (ins[v] == 1)
            low[u] = min(low[u], dfn[v]);
    }
    int k;
    if (low[u] == dfn[u]) {
        ++cnt;
        do {
            k = s.top();
            s.pop();
            ins[k] = 0;
            belong[k] = cnt;
        } while (low[k] != dfn[k]);
    }
    return;
}

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    e = 0;
    memset(head, -1, sizeof(head));
    memset(dfn, 0, sizeof(dfn));
    memset(ins, 0, sizeof(ins));
    while (m--) {
        int a, b;
        scanf("%d%d", &a, &b);
        edge[e].v = b; edge[e].next = head[a]; head[a] = e++;
    }
    t = cnt = 0;
    for (int i = 0; i < n; ++i)
        if (!dfn[i])
            tarjan(i);
    memset(sum, 0, sizeof(sum));
    for (int i = 0; i < n; ++i)
        ++sum[belong[i]];
    int ans = 0;
    for (int i = 1; i <= cnt; ++i)
        if (sum[i] > 1)
            ++ans;
    printf("%d", ans);
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=29922939&auto=1&height=66"></iframe>
