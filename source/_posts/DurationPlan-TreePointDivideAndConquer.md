---
title: 「补档计划」点分治
date: 2017-06-26 17:24:17
tags:
  - 补档计划
  - 点分治
categories:
  - OI
  - 补档计划
fancybox: false
---
点分治专题。
<!-- more -->
### 「BZOJ 1468」Tree
#### 链接
[BZOJ 1468](http://www.lydsy.com/JudgeOnline/problem.php?id=1468)
#### 题解
这题就是模板....
#### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「BZOJ 1468」Tree 26-06-2017
 * 点分治
 * @author xehoth
 */
#include <bits/stdc++.h>

namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template <typename T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read()) x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template <typename T>
inline void print(T x) {
    static int buf[30], cnt;
    if (x == 0) {
        print('0');
    } else {
        x < 0 ? (print('-'), x = -x) : 0;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void flush() { fwrite(obuf, 1, oh - obuf, stdout); }
}

namespace Task {

const int MAXN = 40010;

struct Node {
    int v, w;

    Node(int v, int w) : v(v), w(w) {}
};

std::vector<Node> edge[MAXN];

inline void addEdge(const int u, const int v, const int w) {
    edge[u].push_back(Node(v, w));
    edge[v].push_back(Node(u, w));
}

int sz[MAXN], k, dis[MAXN], ans;
bool vis[MAXN];
std::vector<int> dep;

inline void dfsSize(int u, int fa) {
    sz[u] = 1;
    for (register int i = 0, v; i < edge[u].size(); i++)
        if (!vis[v = edge[u][i].v] && v != fa) dfsSize(v, u), sz[u] += sz[v];
}

inline int getCenter(int u, int fa, int n) {
    register int s = n - sz[u];
    for (register int i = 0, v; i < edge[u].size(); i++) {
        if (!vis[v = edge[u][i].v] && v != fa) {
            if (int ret = getCenter(v, u, n)) return ret;
            s = std::max(s, sz[v]);
        }
    }
    return (s << 1) <= n ? u : 0;
}

inline void getDeep(int u, int father) {
    dep.push_back(dis[u]);
    for (register int i = 0, v; i < edge[u].size(); i++)
        if ((v = edge[u][i].v) != father && !vis[v])
            dis[v] = dis[u] + edge[u][i].w, getDeep(v, u);
}

inline int calc(int u, int init) {
    dep.clear(), dis[u] = init, getDeep(u, 0);
    std::sort(dep.begin(), dep.end());
    register int ret = 0;
    for (register int l = 0, r = dep.size() - 1; l < r;) {
        if (dep[l] + dep[r] <= k)
            ret += r - l++;
        else
            r--;
    }
    return ret;
}

inline void solve(int u) {
    dfsSize(u, 0), vis[u = getCenter(u, 0, sz[u])] = true, ans += calc(u, 0);
    for (register int i = 0, v; i < edge[u].size(); i++)
        if (!vis[v = edge[u][i].v]) ans -= calc(v, edge[u][i].w), solve(v);
}

inline void solve() {
    using namespace IO;
    register int n;
    read(n);
    for (register int i = 1, u, v, w; i < n; i++)
        read(u), read(v), read(w), addEdge(u, v, w);
    read(k), solve(1);
    print(ans);
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    Task::solve();
    IO::flush();
    return 0;
}
```
### 「BZOJ 3697」采药人的路径
#### 链接
[BZOJ 3697](http://www.lydsy.com/JudgeOnline/problem.php?id=3697)  
[BZOJ 3127](http://www.lydsy.com/JudgeOnline/problem.php?id=3127)
#### 题解
将边权 $0$ 改为 $-1$，对树遍历时记录路径上的前缀和，点分治，考虑经过根的路径中合法的路径数量。  
对根的所有子树 DFS，设 $f(i, 0)$ 表示当前子树前缀和为 $i$ 且 $i$ 在路径上仅出现过一次的路径数，$f(i, 1)$ 表示当前子树前缀和为 $i$ 且 $i$ 在路径上出现过至少两次的路径数。

如果一个前缀和 $i$ 在一棵子树内出现过两次，那么在根的另一棵子树选一条前缀和为 $-i$ 的路径与其相接，即可组成一条合法的路径 —— 休息站可以被选择在前一条路径上另一个前缀和为 $i$ 的点上。

对树进行 DFS 遍历时，记录当前路径前缀和为 $i$ 的节点数量，根据情况将当前节点累加在 $f(i, 0)$ 或 $f(i, 1)$ 中。

记录 $g(i, 0)$、$g(i, 1)$ 为之前的所有子树中对应的路径数量，每次更新答案，统计不以根节点为休息站的路径数量
$$\sum_i f(i, 0) g(-i, 1) + f(i, 1) g(-i, 0) + f(i, 1) g(-i, 1)$$
令 $g(0, 0)$ 的初始值为 $1$，表示根节点单独组成一条路径，统计以根节点为休息站的的路径数量
$$(g(0, 0) - 1) \times f(0, 0)$$

#### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「BZOJ 3697」采药人的路径 27-06-2017
 * 点分治
 * @author xehoth
 */
#include <bits/stdc++.h>

namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template <typename T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read()) x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template <typename T>
inline void print(T x) {
    static int buf[30], cnt;
    if (x == 0) {
        print('0');
    } else {
        x < 0 ? (print('-'), x = -x) : 0;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void flush() { fwrite(obuf, 1, oh - obuf, stdout); }
}

namespace Task {

const int MAXN = 200010;

struct Node {
    int v, w;

    Node(int v, int w) : v(v), w(w) {}
};

std::vector<Node> edge[MAXN];

inline void addEdge(const int u, const int v, const int w) {
    edge[u].push_back(Node(v, w));
    edge[v].push_back(Node(u, w));
}

#define long long long

int sz[MAXN], mark[MAXN], dep[MAXN], maxDep, n, dis[MAXN];
bool vis[MAXN];
long f[MAXN * 2][2], g[MAXN * 2][2], ans;

inline void dfsSize(int u, int fa) {
    sz[u] = 1;
    for (register int i = 0, v; i < edge[u].size(); i++)
        if (!vis[v = edge[u][i].v] && v != fa) dfsSize(v, u), sz[u] += sz[v];
}

inline int getCenter(int u, int fa, int n) {
    register int s = n - sz[u];
    for (register int i = 0, v; i < edge[u].size(); i++) {
        if (!vis[v = edge[u][i].v] && v != fa) {
            if (int ret = getCenter(v, u, n)) return ret;
            s = std::max(s, sz[v]);
        }
    }
    return (s << 1) <= n ? u : 0;
}

inline void getDep(int u, int fa) {
    maxDep = std::max(maxDep, dep[u]);
    mark[dis[u]] ? f[dis[u]][1]++ : f[dis[u]][0]++;
    mark[dis[u]]++;
    for (register int i = 0, v; i < edge[u].size(); i++)
        if (!vis[v = edge[u][i].v] && v != fa)
            dep[v] = dep[u] + 1, dis[v] = dis[u] + edge[u][i].w, getDep(v, u);
    mark[dis[u]]--;
}

inline void calc(int u) {
    register int max = 0;
    g[n][0] = 1;
    for (register int i = 0, v; i < edge[u].size(); i++) {
        if (!vis[v = edge[u][i].v]) {
            dis[v] = n + edge[u][i].w, dep[v] = 1, maxDep = 1, getDep(v, 0);
            max = std::max(max, maxDep), ans += (g[n][0] - 1) * f[n][0];
            for (register int j = -maxDep; j <= maxDep; j++) {
                ans += g[n - j][1] * f[n + j][1] + g[n - j][0] * f[n + j][1] +
                       g[n - j][1] * f[n + j][0];
            }
            for (register int j = n - maxDep; j <= n + maxDep; j++)
                g[j][0] += f[j][0], g[j][1] += f[j][1], f[j][0] = f[j][1] = 0;
        }
    }
    for (register int i = n - max; i <= n + max; i++) g[i][0] = g[i][1] = 0;
}

inline void solve(int u) {
    dfsSize(u, 0), vis[u = getCenter(u, 0, sz[u])] = true, calc(u);
    for (register int i = 0, v; i < edge[u].size(); i++)
        if (!vis[v = edge[u][i].v]) solve(v);
}

struct Edge {
    int u, v, w;
} e[MAXN];

int in[MAXN];

inline void solve() {
    using namespace IO;
    read(n);
    for (register int i = 1; i < n; i++)
        read(e[i].u), read(e[i].v), read(e[i].w), in[e[i].u]++, in[e[i].v]++;
    for (register int i = 1; i <= n; i++) edge[i].reserve(in[i]);
    for (register int i = 1; i < n; i++)
        addEdge(e[i].u, e[i].v, e[i].w ? 1 : -1);
    solve(1);
    print(ans);
}

#undef long
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    Task::solve();
    IO::flush();
    return 0;
}
```
### 「IOI 2011」Race
#### 链接
[BZOJ 2599](http://www.lydsy.com/JudgeOnline/problem.php?id=2599)
#### 题解
还是用 「BZOJ 1468」Tree 的方法，但是区间 $min$ 不支持减法，所以记录每种边数出现的次数，就可以减了。
#### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「IOI 2011」Race 27-06-2017
 * 点分治
 * @author xehoth
 */
#include <bits/stdc++.h>

namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template <typename T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read()) x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template <typename T>
inline void print(T x) {
    static int buf[30], cnt;
    if (x == 0) {
        print('0');
    } else {
        x < 0 ? (print('-'), x = -x) : 0;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void flush() { fwrite(obuf, 1, oh - obuf, stdout); }
}
namespace Task {

const int MAXN = 200010;

struct Node {
    int v, w;
    Node(int v, int w) : v(v), w(w) {}
};

std::vector<Node> edge[MAXN];

inline void addEdge(const int u, const int v, const int w) {
    edge[u].push_back(Node(v, w));
    edge[v].push_back(Node(u, w));
}

struct Data {
    int dep, cnt;

    Data(int dep = 0, int cnt = 0) : dep(dep), cnt(cnt) {}

    inline bool operator<(const Data &b) const { return dep < b.dep; }
};

int sz[MAXN], k, dis[MAXN], ans[MAXN], cnt[MAXN];
bool vis[MAXN];
std::vector<Data> dep;

inline void dfsSize(int u, int fa) {
    sz[u] = 1;
    for (register int i = 0, v; i < edge[u].size(); i++)
        if (!vis[v = edge[u][i].v] && v != fa) dfsSize(v, u), sz[u] += sz[v];
}

inline int getCenter(int u, int fa, int n) {
    register int s = n - sz[u];
    for (register int i = 0, v; i < edge[u].size(); i++) {
        if (!vis[v = edge[u][i].v] && v != fa) {
            if (int ret = getCenter(v, u, n)) return ret;
            s = std::max(s, sz[v]);
        }
    }
    return (s << 1) <= n ? u : 0;
}

inline void getDeep(int u, int father) {
    dep.push_back(Data(dis[u], cnt[u]));
    for (register int i = 0, v; i < edge[u].size(); i++)
        if ((v = edge[u][i].v) != father && !vis[v])
            dis[v] = dis[u] + edge[u][i].w, cnt[v] = cnt[u] + 1, getDeep(v, u);
}

inline void calc(int u, int init, int c, int v) {
    dep.clear(), dis[u] = init, cnt[u] = c, getDeep(u, 0);
    std::sort(dep.begin(), dep.end());
    for (register int l = 0, r = dep.size() - 1, i; l <= r;) {
        while (l < r && dep[l].dep + dep[r].dep > k) r--;
        i = r;
        while (dep[l].dep + dep[i].dep == k)
            ans[dep[l].cnt + dep[i].cnt] += v, i--;
        l++;
    }
}

inline void solve(int u) {
    dfsSize(u, 0), vis[u = getCenter(u, 0, sz[u])] = true, calc(u, 0, 0, 1);
    for (register int i = 0, v; i < edge[u].size(); i++)
        if (!vis[v = edge[u][i].v]) calc(v, edge[u][i].w, 1, -1), solve(v);
}

inline void solve() {
    using namespace IO;
    register int n;
    read(n), read(k), dep.reserve(n);
    for (register int i = 1, u, v, w; i < n; i++)
        read(u), read(v), read(w), addEdge(u + 1, v + 1, w);
    solve(1);
    for (register int i = 1; i <= n; i++) {
        if (ans[i]) {
            print(i);
            return;
        }
    }
    print(-1);
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    Task::solve();
    IO::flush();
    return 0;
}
```
### 「CF 716E」Digit Tree
#### 链接
[CF 716E](http://codeforces.com/contest/716/problem/E)
#### 题意
给一棵树，每一条边上有一个 $[1, 9]$ 内的数字，求有多少有序点对 $(u, v)$ 满足，将 $u$ 到 $v$ 的最短路上所有边上的数字连接成一个数，这个数是 $m$ 的倍数。其中 $\gcd(m, 10) = 1$。
#### 题解
这个题显然不好 dp，那么我们就考虑点分治。  
先考虑一颗子树内满足条件的点对，记录 $a_i$ 为从根到 $i$ 节点路径上所有边上的数字按倒序连接成的数；$b_i$ 为对应按正序连接成的数；$d_i$ 为节点 $i$ 的深度，等于 $a_i$ 和 $b_i$ 十进制位数。如
<center>
![CF 716E Digit Tree](/images/CF-716E-Digit-Tree.svg)
</center>
{% raw %}$$\begin{cases} a_u = 321 & a_v = 54 \\ b_u = 123 & b_v = 45 \\ d_u = 3 & d_v = 2 \end{cases}$${% endraw %}
从 $u$ 到 $v$ 的路径组成的数可以表示为
$$a_u \times 10 ^ {d_v} + b_v$$
题目要求的条件即为
$$a_u \times 10 ^ {d_v} + b_v \equiv 0 \  (\text{mod m})$$
因为这是一个同余式，所以 $a_i$ 和 $b_i$ 可以是模意义下的。  
整理，得
$$a_u \equiv -b_v \times \frac {1} {10 ^ {d_v}} \  (\text{mod m})$$
将式子右边存入 `map` 中，对于每个节点 $u$，对答案的贡献即为 `map` 中 $a_u$ 出现的次数。

但这题还需要考虑如何去掉两段都在同一子树的非法情况，像往常直接调用 `calc` 容斥的方法似乎是不行的，于是我们可以先 dfs 一遍，统计所有信息然后再处理每一个子树的时候，先 dfs一遍，把该子树的信息给去掉，查询完成之后，再 dfs 一遍把信息给加回去。
#### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「CF 716E」Digit Tree 28-06-2017
 * 点分治
 * @author xehoth
 */
#include <bits/stdc++.h>

namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template <typename T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read()) x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template <typename T>
inline void print(T x) {
    static int buf[30], cnt;
    if (x == 0) {
        print('0');
    } else {
        x < 0 ? (print('-'), x = -x) : 0;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void flush() { fwrite(obuf, 1, oh - obuf, stdout); }
}

namespace Task {

#define long long long

int n, mod;

inline void exgcd(long a, long b, long &g, long &x, long &y) {
    !b ? (x = 1, y = 0, g = a) : (exgcd(b, a % b, g, y, x), y -= (a / b) * x);
}

inline long getInv(const long x) {
    static long tmp1, res, tmp2;
    exgcd(x, mod, tmp1, res, tmp2);
    return (res % mod + mod) % mod;
}

const int MAXN = 100010;

struct Node {
    int v, w;

    Node(int v, int w) : v(v), w(w) {}
};

std::vector<Node> edge[MAXN];

inline void addEdge(const int u, const int v, const int w) {
    edge[u].push_back(Node(v, w));
    edge[v].push_back(Node(u, w));
}

int sz[MAXN], pow[MAXN], inv[MAXN];
bool vis[MAXN];
long ans;

std::map<int, int> cnt;

inline void dfsSize(int u, int fa) {
    sz[u] = 1;
    for (register int i = 0, v; i < edge[u].size(); i++)
        if (!vis[v = edge[u][i].v] && v != fa) dfsSize(v, u), sz[u] += sz[v];
}

inline int getCenter(int u, int fa, int n) {
    register int s = n - sz[u];
    for (register int i = 0, v; i < edge[u].size(); i++) {
        if (!vis[v = edge[u][i].v] && v != fa) {
            if (int ret = getCenter(v, u, n)) return ret;
            s = std::max(s, sz[v]);
        }
    }
    return (s << 1) <= n ? u : 0;
}

inline void dfs(int u, int fa, int delta, long p, int val) {
    cnt[val] += delta;
    for (register int i = 0, v; i < edge[u].size(); i++)
        if (!vis[v = edge[u][i].v] && v != fa)
            dfs(v, u, delta, p * 10 % mod, (val + edge[u][i].w * p) % mod);
}

inline void calc(int u, int fa, int num, long val) {
    ans += cnt[(-val * inv[num] % mod + mod) % mod];
    for (register int i = 0, v; i < edge[u].size(); i++)
        if (!vis[v = edge[u][i].v] && v != fa)
            calc(v, u, num + 1, (val * 10 + edge[u][i].w) % mod);
}

inline void solve(int u) {
    dfsSize(u, 0), vis[u = getCenter(u, 0, sz[u])] = true, cnt.clear();
    for (register int i = 0, v; i < edge[u].size(); i++)
        if (!vis[v = edge[u][i].v]) dfs(v, u, 1, 10 % mod, edge[u][i].w);
    ans += cnt[0], cnt[0]++;
    for (register int i = 0, v; i < edge[u].size(); i++) {
        if (!vis[v = edge[u][i].v]) {
            dfs(v, u, -1, 10 % mod, edge[u][i].w);
            calc(v, u, 1, edge[u][i].w);
            dfs(v, u, 1, 10 % mod, edge[u][i].w);
        }
    }
    for (register int i = 0, v; i < edge[u].size(); i++)
        if (!vis[v = edge[u][i].v]) solve(v);
}

inline void solve() {
    using namespace IO;
    read(n), read(mod);
    for (register int i = 1, u, v, w; i < n; i++)
        read(u), read(v), read(w), addEdge(u + 1, v + 1, w % mod);
    pow[0] = inv[0] = 1;
    for (int i = 1; i <= n; i++)
        pow[i] = (long)pow[i - 1] * 10 % mod, inv[i] = getInv(pow[i]);
    solve(1);
    print(ans);
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    Task::solve();
    IO::flush();
    return 0;
}
```

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=28838338&auto=1&height=66"></iframe>