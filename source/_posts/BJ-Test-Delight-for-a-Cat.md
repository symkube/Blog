---
title: 「BJ模拟」Delight for a Cat-费用流
date: 2017-03-06 11:18:23
tags:
  - 图论
  - 网络流
  - 费用流
categories:
  - OI
  - 图论
  - 网络流
  - 费用流
---
从前，有一只懒猫叫 $CJB$。每个小时，这只猫要么在睡觉，要么在吃东西，但不能一边睡觉一边吃东西，并且这只猫会在一整个小时干同一件事情。

对于接下来的 $n$ 个小时，$CJB$ 知道他在哪 $n$ 个小时睡觉和吃东西的快乐值。

为了健康地生活，在任意的连续 $k$ 个整小时内，$CJB$ 要有至少 $m_s$ 小时睡觉，至少 $m_e$ 个小时在吃东西。也就是说一共有 $n - k + 1$ 段的 $k$ 小时需要满足上述条件。

你的任务是告诉 $CJB$ 他接下来 $n$ 个小时能获得的最大快乐值是多少。
<!-- more -->

### 链接
[THOJ22](http://thoj.xehoth.cc:5283/problem/22)

### 题解
首先，假设这只猫在所有天数都是睡觉，我们稍后再决策将哪些天数改为吃东西。

我们用 $x_i = 0$ 表示这只猫在第 $i$ 天睡觉， $x_i = 1$ 表示吃东西。

则有下列不等式：
<center>
{% raw %}
$m_e \leq x_1 + x_2 + x_3 + \cdots + x_k \leq k - m_s$
{% endraw %}
<br>
{% raw %}
$m_e \leq x_2 + x_3 + x_4 + \cdots + x_{k + 1} \leq k - m_s$
{% endraw %}
<br>
$\cdots$
<br>
{% raw %}
$m_e \leq x_{n - k + 1} + x_{n - k + 2} + \cdots + x_n \leq k - m_s$
{% endraw %}
</center>

我们令 {% raw %}$0 \leq y_1 \leq k - m_s - m_e${% endraw %}，则上述不等式可以转化为以下的等式：

<center>
{% raw %}
$x_1 + x_2 + x_3 + \cdots + x_k + y_1 = k - m_s$
{% endraw %}
<br>
{% raw %}
$x_2 + x_3 + x_4 + \cdots + x_{k + 1} + y_2 = k - m_s$
{% endraw %}
<br>
$\cdots$
<br>
{% raw %}
$x_{n - k + 1} + x_{n - k + 2} + \cdots + x_n + y_{n - k + 1} = k - m_s$
{% endraw %}
</center>

将这些等式两两相减，得：

<center>
{% raw %}
$x_1 - x_{k + 1} + y_1 - y_2 = 0$
{% endraw %}
<br>
{% raw %}
$x_2 - x_{k + 2} + y_2 - y_3 = 0$
{% endraw %}
<br>
$\cdots$
<br>
{% raw %}
$x_{n - k} - x_n + y_{n - k} - y_{n - k + 1} = 0$
{% endraw %}
<br>
{% raw %}
$(k - m_s) - x_1 - x_2 - \cdots - x_k - y_1 = 0$
{% endraw %}
<br>
{% raw %}
$x_{n - k + 1} + x_{n - k + 2} + \cdots + x_n + y_{n - k + 1} - (k - m_s) = 0$
{% endraw %}
</center>

我们把等式左边加起来，发现恰好为 $0$，满足流量平衡。

把上述每个等式看成一个点，负的流出，正的流入（或反过来）。跑一次费用流即可。

### 代码
``` cpp
/* 
 * created by xehoth on 04-03-2017
 */
#include <bits/stdc++.h>

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    if (s == t) {
        t = (s = buf) + fread(buf, 1, IN_LEN, stdin);
        if (s == t) return -1;
    }
    return *s++;
}

template<class T>
inline void read(T &x) {
    static bool iosig;
    static char c;
    for (iosig = false, c = read(); !isdigit(c); c = read()) {
        if (c == '-') iosig = true;
        if (c == -1) return;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    if (iosig) x = -x;
}

const int OUT_LEN = 1000000;
char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    if (oh == obuf + OUT_LEN) fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf;
    *oh++ = c;
}

template<class T>
inline void print(T x) {
    static int buf[30], cnt;
    if (x == 0) {
        print('0');
    } else {
        if (x < 0) print('-'), x = -x;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 + 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}

#define long long long

const int MAXN = 1010;

struct Node {
    int v, f, w, index;
    Node(int v, int f, int w, int index) : v(v), f(f), w(w), index(index) {}
};

std::vector<Node> edge[MAXN];

inline void addEdge(int u, int v, int f, int w) {
    edge[u].push_back(Node(v, f, w, edge[v].size()));
    edge[v].push_back(Node(u, 0, -w, edge[u].size() - 1));
}

typedef std::pair<int, long> Pair;

const long INF = 9187201950435737471;

inline Pair minCostMaxFlow(int s, int t, int n) {
    Pair ans(0, 0);
    while (true) {
        static bool vis[MAXN];
        static long dis[MAXN];
        static int prev[MAXN], pree[MAXN];
        std::queue<int> q;
        
        memset(dis, 127, sizeof(long) * (n + 1));
        memset(vis, 0, sizeof(bool) * (n + 1));
        q.push(s), dis[s] = 0;
        while (!q.empty()) {
            register int u = q.front();
            q.pop();
            vis[u] = false;
            for (register int i = 0; i < edge[u].size(); i++) {
                Node *e = &edge[u][i];
                if (e->f && dis[u] + e->w < dis[e->v]) {
                    dis[e->v] = dis[u] + e->w;
                    prev[e->v] = u, pree[e->v] = i;
                    if (!vis[e->v]) q.push(e->v), vis[e->v] = true;
                }
            }
        }
        if (dis[t] == INF) break;
        register int flow = INT_MAX;
        for (register int i = t; i != s; i = prev[i]) 
            flow = std::min(flow, edge[prev[i]][pree[i]].f);
        ans.first += flow, ans.second += flow * dis[t];    
        for (register int i = t; i != s; i = prev[i]) {
            Node *e = &edge[prev[i]][pree[i]];
            e->f -= flow, edge[e->v][e->index].f += flow;
        }
    }
    return ans;
}

int main() {
#ifndef ONLINE_JUDGE
    freopen("in.in", "r", stdin);
#endif
    register int n, k, ms, me;
    read(n), read(k), read(ms), read(me);
    register int S = 0, T = n + 1;
    register long ans = 0;
    static int s[MAXN], e[MAXN];
    for (register int i = 1; i <= n; i++) read(s[i]), ans += s[i];
    for (register int i = 1; i <= n; i++) read(e[i]);
    addEdge(S, n - k + 2, k - ms, 0), addEdge(1, T, k - ms, 0);
    for (register int i = 2, r = n - k + 2; i <= r; i++) 
        addEdge(i, i - 1, k - ms - me, 0);
    for (register int i = 1; i <= n; i++) 
        addEdge(std::min(i + 1, n - k + 2), std::max(1, i - k + 1), 1, s[i] - e[i]);
    print(ans - minCostMaxFlow(S, T, T + 1).second);
    flush();
    return 0;
}
```
