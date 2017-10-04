---
title: 「补档计划」并查集
date: 2017-04-19 08:52:56
tags:
  - 补档计划
  - 并查集
categories:
  - OI
  - 补档计划
toc: true
---
并查集 (Union-Find Set) 是一种非常精巧而实用的数据结构，它主要用于处理一些不相交集合的合并问题。一些常见的用途有求连通子图,求最小生成树的 `Kruskal` 算法和求最近公共祖先（Least Common Ancestors, LCA）等。
<!-- more -->
### 操作
基本的操作相信大家都会，这里先给出只有路径压缩的版本(如果要卡是可以被卡掉的)，下面再给出按秩合并 + 路径压缩 + 非递归....
#### get
``` cpp
inline int get(int x) {
    return x == fa[x] ? x : fa[x] = get(fa[x]);
}
```
#### put
``` cpp
inline void put(int x, int y) {
    fa[get(x)] = get(y);
}
```
### 优化
路径压缩不说了，大家都知道....
#### 按秩合并
初始 `rank` 为 $1$。
``` cpp
inline void put(int x, int y) {
    if ((x = get(x)) != (y = get(y))) {
        rank[x] > rank[y] ? (std::swap(x, y), 0) : 0;
        fa[x] = y, rank[x] == rank[y] ? rank[y]++ : 0;
    }
}
```
#### 非递归
``` cpp
inline int get(int x) {
    register int p = x, i;
    while (p != fa[p]) p = fa[p];
    while (p != x) i = fa[x], fa[x] = p, x = i;
    return p;
}
```
一种更好写的。
``` cpp
inline int get(int x) {
    while (x != fa[x]) x = fa[x] = fa[fa[x]];
    return x;
}
```
#### 带权
``` cpp
inline int get(int x) {
    if (x == fa[x]) return x;
    register int tmp = fa[x];
    fa[x] = get(fa[x]);
    /* 修改 */
    val[x] = val[tmp] + 1;
    return fa[x];
}
```
### 例题
#### [USACO2011 Open] Learning Languages
[BZOJ-3296](http://www.lydsy.com/JudgeOnline/problem.php?id=3296)

并查集维护连通块大小，答案显然为大小 - 1。

为什么这种题随手一写也能rk1....
``` cpp
/*
 * created by xehoth on 19-04-2017
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
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        if (c == '-') iosig = true;
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

namespace UnionFindSet {

const int MAXN = 10000 + 30000 + 50;

int fa[MAXN];

inline int get(int x) {
    return x == fa[x] ? x : fa[x] = get(fa[x]);
}

inline void put(int x, int y) {
    fa[get(x)] = get(y);
}

inline void solve() {
    register int n, m;
    read(n), read(m);
    for (register int i = 1; i <= n + m; i++) fa[i] = i;
    for (register int i = 1, k, l; i <= n; i++) {
        read(k);
        for (register int j = 1; j <= k; j++)
            read(l), put(i, l + n);
    }
    register int ans = 0;
    static bool vis[MAXN];
    for (register int i = 1, t; i <= n; i++) {
        !vis[t = get(i)] ? (ans++, vis[t] = true) : 0;
    }
    print(ans - 1);
}
}

int main() {
    UnionFindSet::solve();
    flush();
    return 0;
}
```
#### [POI2008]CLO
[BZOJ-3296](http://www.lydsy.com/JudgeOnline/problem.php?id=3296)

如果某个连通块里存在环那么一定会达到目标状态，然后打标记找环就好了...
``` cpp
/*
 * created by xehoth on 19-04-2017
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
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        if (c == '-') iosig = true;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    if (iosig) x = -x;
}

const int OUT_LEN = 1000;

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

namespace UnionFindSet {

const int MAXN = 100005;

int fa[MAXN];
bool vis[MAXN];

inline int get(int x) {
    return x == fa[x] ? x : fa[x] = get(fa[x]);
}

inline void put(int x, int y) {
    (x = get(x)) != (y = get(y)) ? (fa[x] = y, vis[y] |= vis[x]) : vis[y] = 1;
}

inline void solve() {
    register int n, m;
    read(n), read(m);
    for (register int i = 1; i <= n; i++) fa[i] = i;
    for (register int i = 1, x, y; i <= m; i++) read(x), read(y), put(x, y);
    for (register int i = 1; i <= n; i++)
        !vis[get(i)] ? (print('N'), print('I'), print('E'), flush(), exit(0), 0) : 0;
    print('T'), print('A'), print('K');
}
}

int main() {
    UnionFindSet::solve();
    flush();
    return 0;
}
```
#### [Baltic2003]Gang团伙
拆点，若 $a, b$ 为朋友，将 $a$ 与 $b$ 所在集合合并，这样符合我朋友的朋友是我的朋友

若为敌人，则将 $a$ 与 $b', a'$ 与 $b$ 合并，这样符合我敌人的敌人是我的朋友

即 $a$ 与 $b$ 为敌，$b$ 与 $c$ 为敌，会将 $a$ 与 $c$ 所在集合合并

最后统计 $1-n$ 属于的集合个数即可。
``` cpp
/*
 * created by xehoth on 20-04-2017
 */
#include <bits/stdc++.h>

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template<class T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

const int OUT_LEN = 100;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
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

namespace UnionFindSet {

const int MAXN = 2005;

int fa[MAXN];

inline int get(int x) {
    return x == fa[x] ? x : fa[x] = get(fa[x]);
}

inline void put(int x, int y) {
    fa[get(x)] = get(y);
}

inline void solve() {
    register int n, m;
    read(n), read(m);
    for (register int i = 1; i <= n << 1; i++) fa[i] = i;
    for (register int i = 1, x, y; i <= m; i++) {
        switch (read()) {
            case 'F':
                read(x), read(y), put(x, y);
                break;
            case 'E':
                read(x), read(y), put(x, y + n), put(y, x + n);
                break;
        }
    }
    static int a[MAXN];
    for (register int i = 1; i <= n; i++) a[i] = get(i);
    std::sort(a + 1, a + n + 1);
    print(std::unique(a + 1, a + n + 1) - (a + 1));
}
}

int main() {
    UnionFindSet::solve();
    flush();
    return 0;
}
```
#### 冷战
[BZOJ-4668](http://www.lydsy.com/JudgeOnline/problem.php?id=4668)

一眼 LCT，但其实这题有个特殊的性质就是加入的边权就是递增的，所以连接两个连通块之前两个连通块里的边权都小于这个边的边权，这样的话其实只要把这两个连通块连起来，连哪两个点对答案是没影响的，所以写按秩合并的并查集，其树高为 $O(logn)$，然后就做完了。
``` cpp
/*
 * created by xehoth on 20-04-2017
 */
#include <bits/stdc++.h>

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template<class T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
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

namespace UnionFindSet {

const int MAXN = 500005;

int fa[MAXN], f[MAXN], rank[MAXN], dep[MAXN];
int cnt = 0;

inline int get(int x) {
    static int st[100], top;
    while (x != fa[x]) st[++top] = x, x = fa[x];
    while (top) dep[st[top]] = dep[fa[st[top--]]] + 1;
    return x;
}

inline void put(int x,int y) {
    if ((x = get(x)) != (y = get(y))) {
        rank[x] > rank[y] ? (std::swap(x, y), 0) : 0;
        fa[x] = y, f[x] = ++cnt, rank[y] += rank[x];
    } else {
        cnt++;
    }
}

inline int ask(int x,int y) {
    register int fx = get(x), fy = get(y);
    if (fx ^ fy) return 0;
    register int rtn = 0;
    while (x ^ y) {
        dep[x] > dep[y] ? (rtn = std::max(rtn, f[x]), x = fa[x])
                : (rtn = std::max(rtn, f[y]), y = fa[y]);
    }
    return rtn;
}

int opt, lastans, tmp;

inline void solve() {
    register int n, m;
    read(n), read(m);

    for (register int i = 1; i <= n; i++) fa[i] = i, rank[i] = 1;

    for (register int i = 1, x, y; i <= m; i++) {
        read(opt), read(x), read(y);
        if (opt) print(tmp = ask(x ^ lastans, y ^ lastans)), print('\n'), lastans = tmp;
        else put(x ^ lastans, y ^ lastans);
    }
}

}

int main() {
    UnionFindSet::solve();
    flush();
    return 0;
}
```
