---
title: 「模拟测试」纸带-线段树/set/并查集
date: 2017-11-01 07:43:16
tags:
  - 数据结构
  - 线段树
  - STL
  - 并查集
categories:
  - OI
  - 数据结构
---
给出一个序列，每次操作将 $[l, r]$ 染上一种颜色 $i$，问最后有多少种颜色。

<!-- more -->

### 题解
$[l, r]$ 很大，我们离散化后就是线段树区间修改的裸题了，由于操作有 $10 ^ 6$ 次，时间复杂度 $O(n \log n)$，需要注意常数。

我们还可以考虑倒着加入，用并查集维护每次染色的最右端的位置，离散化很慢，时间复杂度 $O(n \log n)$。

前两种做法都会因为离散化而很慢（离散化的东西接近 $4 \times 10 ^ 6$），还是倒着加入，考虑直接用 `set` 维护，加入一个区间时，我们可以用 `set` 快速找到与其有交集的区间，然后比较更新，为了保证复杂度，将原有线段删除，自己覆盖的区间更新，然后插入进去并删除原有区间，显然如果没有交集，答案 $+ 1$，有交集且自己没有被覆盖完全，答案 $+ 1$，时间复杂度 $O(n \log n)$，由于没有离散化，这种做法是最快的。

### 代码
#### 线段树
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「SuperOJ 2025」纸带 1-11-2017
 * 线段树
 * @author xehoth
 */
#include <bits/stdc++.h>

namespace {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

struct InputOutputStream {
    template <typename T>
    inline InputOutputStream &operator>>(T &x) {
        static char c;
        for (c = read(); !isdigit(c); c = read())
            if (c == -1) return *this;
        for (x = 0; isdigit(c); c = read()) x = x * 10 + (c ^ '0');
        return *this;
    }
} io;

const int MAXN = 1000000;

int d[MAXN * 8 + 1], M, n, l[MAXN + 1], r[MAXN + 1];

#define pushDown(k) (d[k] ? d[k << 1] = d[k << 1 | 1] = d[k], d[k] = 0 : 0)
#define update(k)                                              \
    for (register int o = (k) >> 1; o; o >>= 1) st[++top] = o; \
    while (top--) pushDown(st[top]);

int st[25];

inline void modify(register int s, register int t, register int x) {
    register int top = 0;
    update(s = s + M - 1);
    top = 0;
    update(t = t + M + 1);
    for (; s ^ t ^ 1; s >>= 1, t >>= 1)
        (~s & 1) ? d[s ^ 1] = x : 0, (t & 1) ? d[t ^ 1] = x : 0;
}

inline void query(const int n) {
    for (register int i = 1; i < M; i++) pushDown(i);
    static bool vis[MAXN * 2 + 1];
    register int ans = 0;
    for (register int i = 1; i <= n; i++)
        (vis[d[i + M]] || !d[i + M]) ? 0 : (ans++, vis[d[i + M]] = true);
    std::cout << ans;
}

struct Data {
    int num, type, id;
    inline bool operator<(const Data &b) const { return num < b.num; }
} a[MAXN << 1 | 1];

inline void solve() {
    register int n, cnt = 0;
    io >> n;
    for (register int i = 1; i <= n; i++) {
        io >> a[++cnt].num, a[cnt].id = i, a[cnt].type = 0, a[cnt].num++;
        io >> a[++cnt].num, a[cnt].id = i, a[cnt].type = 1;
    }
    std::sort(a + 1, a + cnt + 1);
    register int i = 1, top = 0;
    for (register int j; i <= cnt; i++) {
        for (j = i; a[i].num == a[i + 1].num && i != cnt;) i++;
        top += (j != 1 && a[j - 1].num + 1 < a[i].num) ? 2 : 1;
        for (register int k = j; k <= i; k++)
            a[k].type ? (r[a[k].id] = top) : (l[a[k].id] = top);
    }
    for (M = 1; M < top + 2;) M <<= 1;
    for (register int i = 1; i <= n; i++) modify(l[i], r[i], i);
    query(top);
}
}

int main() {
    // freopen("sample/1.in", "r", stdin);
    solve();
    return 0;
}
```
#### Set
这份代码静态化了 `set` 的内存池。
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「SuperOJ 2025」纸带 1-11-2017
 * set
 * @author xehoth
 */
#include <bits/stdc++.h>

namespace {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

struct InputOutputStream {
    template <typename T>
    inline InputOutputStream &operator>>(T &x) {
        static char c;
        for (c = read(); !isdigit(c); c = read())
            if (c == -1) return *this;
        for (x = 0; isdigit(c); c = read()) x = x * 10 + (c ^ '0');
        return *this;
    }
} io;

const int MAXN = 1000000;

struct Node {
    int l, r;

    inline bool operator<(const Node &p) const { return r + 1 < p.l; }
} d[MAXN + 1];

Node pool[MAXN + 1], *cur = pool;

struct Allocator : public std::allocator<Node> {
    inline pointer allocate(size_type n, const void * = 0) { return cur++; }
    inline void deallocate(pointer, size_type) {}
};

std::set<Node, std::less<Node>, Allocator> set;

int n, cnt;

inline void solve() {
    io >> n;
    for (register int i = 1; i <= n; i++) io >> d[i].l >> d[i].r, d[i].l++;
    for (register int i = n; i >= 1; i--) {
        register std::set<Node>::iterator t = set.lower_bound(d[i]);
        if (t == set.end()) {
            cnt++, set.insert(set.end(), d[i]);
            continue;
        }
        if (t->l <= d[i].l && t->r >= d[i].r) continue;
        for (cnt++; t != set.end() && (t->l <= d[i].r + 1);
             t = set.lower_bound(d[i])) {
            d[i].l = std::min(d[i].l, t->l), d[i].r = std::max(d[i].r, t->r);
            set.erase(t);
        }
        set.insert(t, d[i]);
    }
    std::cout << cnt;
}
}

int main() {
    solve();
    return 0;
}
```