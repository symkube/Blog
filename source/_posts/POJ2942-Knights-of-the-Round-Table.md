---
title: 「POJ-2942」Knights of the Round Table-点双连通分量+奇环判定
date: 2017-01-01 18:34:18
tags:
  - 图论
  - Tarjan
categories:
  - oi
  - 图论
  - Tarjan
---
Being a knight is a very attractive career: searching for the Holy Grail, saving damsels in distress, and drinking with the other knights are fun things to do. Therefore, it is not very surprising that in recent years the kingdom of King Arthur has experienced an unprecedented increase in the number of knights. There are so many knights now, that it is very rare that every Knight of the Round Table can come at the same time to Camelot and sit around the round table; usually only a small group of the knights isthere, while the rest are busy doing heroic deeds around the country.
<!-- more -->
Knights can easily get over-excited during discussions-especially after a couple of drinks. After some unfortunate accidents, King Arthur asked the famous wizard Merlin to make sure that in the future no fights break out between the knights. After studying the problem carefully, Merlin realized that the fights can only be prevented if the knights are seated according to the following two rules:
The knights should be seated such that two knights who hate each other should not be neighbors at the table. (Merlin has a list that says who hates whom.) The knights are sitting around a roundtable, thus every knight has exactly two neighbors.
An odd number of knights should sit around the table. This ensures that if the knights cannot agree on something, then they can settle the issue by voting. (If the number of knights is even, then itcan happen that `yes` and `no` have the same number of votes, and the argument goes on.)
Merlin will let the knights sit down only if these two rules are satisfied, otherwise he cancels the meeting. (If only one knight shows up, then the meeting is canceled as well, as one person cannot sit around a table.) Merlin realized that this means that there can be knights who cannot be part of any seating arrangements that respect these rules, and these knights will never be able to sit at the Round Table (one such case is if a knight hates every other knight, but there are many other possible reasons). If a knight cannot sit at the Round Table, then he cannot be a member of the Knights of the Round Table and must be expelled from the order. These knights have to be transferred to a less-prestigious order, such as the Knights of the Square Table, the Knights of the Octagonal Table, or the Knights of the Banana-Shaped Table. To help Merlin, you have to write a program that will determine the number of knights that must be expelled.
### 链接
[POJ-2942](http://poj.org/problem?id=2942)
### 题解
先向没有憎恨关系的骑士连边，这样此题就是问每个骑士是否能在一个奇环内，然后按照点双连通分量分块，如果 $i$ 骑士能分在一个奇环内，这个环一在 $i$ 骑士所在的块内.

所以问题就变为在块内找奇环，直接二分图染色，只要有一个点和它的相邻节点的颜色相同，就找到了奇环。
### 代码
``` cpp
#include <iostream>
#include <cstring>
#include <vector>
#include <algorithm>
#include <cmath>
#include <cstdio>
const int MAXN = 1004;
int n, m, g[MAXN][MAXN];
std::vector<int> edge[MAXN];
std::vector<int> block[MAXN];
int dfn[MAXN], low[MAXN], sta[MAXN], top, index, cnt;
int root;
bool instack[MAXN], iscut[MAXN];
inline void tarjan(int u, int fa) {
    dfn[u] = low[u] = ++index;
    sta[top++] = u;
    instack[u] = true;
    bool flag = false;
    for (int i = 0; i < edge[u].size(); i++)
        if (edge[u][i] == fa && !flag) flag = true;
        else if (!dfn[edge[u][i]]) {
            int to = edge[u][i];
            tarjan(to, u);
            if (low[to] < low[u]) low[u] = low[to];
            if (low[to] >= dfn[u]) {
                if (fa == -1) root++;
                else iscut[u] = true;
                int tmp;
                do {
                    tmp = sta[--top];
                    instack[tmp] = 0;
                    block[cnt].push_back(tmp);
                } while (tmp != to);
                block[cnt].push_back(u);
                cnt++;
            }
        } else if (instack[edge[u][i]] && dfn[edge[u][i]] < low[u]) low[u] = dfn[edge[u][i]];
}
inline void solve(int n) {
    memset(instack, 0, sizeof(instack));
    cnt = index = top = 0;
    memset(dfn, 0, sizeof(dfn));
    memset(iscut, 0, sizeof(iscut));
    for (int i = 0; i < n; i++) block[i].clear();
    for (int i = 1; i <= n; i++)
        if (!dfn[i]) {
            root = 0;
            tarjan(i, -1);
            if (root > 1) iscut[i] = true;
        }
}
int col[MAXN], vst[MAXN];
inline void color(int u, int co, int tar) {
    col[u] = co;
    vst[u] = 0;
    for (register int i = 0; i < edge[u].size(); i++) if (vst[edge[u][i]] == tar)
            color(edge[u][i], co ^ 1, tar);
}
int vis[MAXN];
inline int get() {
    int ans = 0;
    memset(vis, 0, sizeof(vis));
    for (int i = 0; i < cnt; i++) {
        for (int j = 0; j < block[i].size(); j++)
            vst[block[i][j]] = (-10 - i);
        color(block[i][0], 0, -10 - i);
        bool flag = false;
        for (int j = 0; j < block[i].size(); j++)
            vst[block[i][j]] = (-10 - i);
        for (int j = 0; j < block[i].size(); j++) {
            int u = block[i][j];
            for (int k = 0; k < edge[u].size(); k++)
                if (edge[u][k] != u && vst[edge[u][k]] == (-10 - i) && col[u] == col[edge[u][k]]) {
                    flag = true;
                    break;
                }
            if (flag) break;
        }
        if (flag)
            for (int j = 0; j < block[i].size(); j++)
                vis[block[i][j]] = 1;
    }
    for (int i = 1; i <= n; i++) if (!vis[i]) ans++;
    return ans;
}
int main() {
    while (scanf("%d%d", &n, &m) && (n || m)) {
        for (int i = 1; i <= n; i++) edge[i].clear();
        memset(g, 0, sizeof(g));
        for (int i = 0; i < m; i++) {
            int a, b;
            scanf("%d%d", &a, &b);
            g[a][b] = g[b][a] = 1;
        }
        for (int i = 1; i <= n; i++) for (int j = 1; j <= n; j++)
                if (!g[i][j]) edge[i].push_back(j);
        solve(n);
        printf("%d\n", get());
    }
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=28587958&auto=1&height=66"></iframe>
