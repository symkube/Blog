---
title: 「POJ-3580」SuperMemo-非旋转式Treap
date: 2017-01-11 09:43:51
tags:
  - 平衡树
  - 数据结构
categories:
  - OI
  - 数据结构
  - 平衡树
---
Your friend, Jackson is invited to a TV show called SuperMemo in which the participant is told to play a memorizing game. At first, the host tells the participant a sequence of numbers, {A1, A2, ... An}. Then the host performs a series of operations and queries on the sequence which consists:
<!-- more -->
### 链接
[POJ-3580](http://poj.org/problem?id=3580)
### 题解
非旋转式 $Treap$ 直接水就好了，比上道维护集合多了个区间循环位移操作，我们只需要拆成三个区间，然后并回去就没有了....
### 代码
``` cpp
/*
 * created by xehoth on 11-01-2017
 */
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <algorithm>
#include <cmath>
#include <cctype>
#include <climits>
#include <iostream>

const int MAXN = 200010;

struct Node *null;

struct Node {
    Node *lc, *rc;
    int key, rank, size;
    int min, tag;
    bool rev;

    Node(int key = 0) : key(key), rank(rand()), lc(null), rc(null), size(1), rev(false), tag(0), min(key) {}

    inline void maintain() {
        size = lc->size + rc->size + 1;
        min = std::min(std::min(key, lc->min), rc->min);
    }

    inline void cover(int v) {
        tag += v, min += v, key += v;
    }

    inline void pushDown() {
        if (rev) {
            if (lc != null) lc->rev ^= 1;
            if (rc != null) rc->rev ^= 1;
            rev ^= 1;
            std::swap(lc, rc);
        }
        if (tag) {
            if (lc != null) lc->cover(tag);
            if (rc != null) rc->cover(tag);
            tag = 0;
        }
    }
} data[MAXN], *pool[MAXN], *root;


int dataTop, poolTop;
typedef std::pair<Node *, Node *> Pair;

inline Node *newNode(int key) {
    Node *u;
    if (poolTop) u = pool[poolTop--];
    else u = &data[dataTop++];
    *u = Node(key);
    return u;
}

int a[MAXN];
inline void build(Node *&rt, int l, int r) {
    if (l > r) return;
    register int mid = l + r >> 1;
    rt = newNode(a[mid]);
    build(rt->lc, l, mid - 1), build(rt->rc, mid + 1, r);
    rt->maintain();
}

inline Node *merge(Node *u, Node *v) {
    if (u == null) return v;
    if (v == null) return u;
    if (u->rank < v->rank) {
        u->pushDown();
        u->rc = merge(u->rc, v);
        u->maintain();
        return u;
    } else {
        v->pushDown();
        v->lc = merge(u, v->lc);
        v->maintain();
        return v;
    }
}

inline Pair split(Node *u, int k) {
    if (u == null) return Pair(null, null);
    Pair t;
    u->pushDown();
    if (u->lc->size >= k) {
        t = split(u->lc, k);
        u->lc = t.second, t.second = u;
    } else {
        t = split(u->rc, k - u->lc->size - 1);
        u->rc = t.first, t.first = u;
    }
    u->maintain();
    return t;
}

inline void add(int l, int r, int v) {
    Pair t2 = split(root, r), t1 = split(t2.first, l - 1);
    t1.second->cover(v);
    root = merge(merge(t1.first, t1.second), t2.second);
}

inline void insert(int x, int v) {
    Pair t = split(root, x);
    Node *tmp = newNode(v);
    root = merge(merge(t.first, tmp), t.second);
}

inline void erase(int x) {
    Pair t2 = split(root, x), t1 = split(t2.first, x - 1);
    root = merge(t1.first, t2.second);
}

inline void query(int l, int r) {
    Pair t2 = split(root, r), t1 = split(t2.first, l - 1);
    std::cout << t1.second->min << "\n";
    root = merge(merge(t1.first, t1.second), t2.second);
}

inline void reverse(int l, int r) {
    Pair t2 = split(root, r), t1 = split(t2.first, l - 1);
    t1.second->rev ^= 1;
    root = merge(merge(t1.first, t1.second), t2.second);
}

inline void revolve(int l, int r, int v) {
    Pair t2 = split(root, r), t1 = split(t2.first, l - 1);
    Pair t3 = split(t1.second, v);
    root = merge(merge(merge(t1.first, t3.second), t3.first), t2.second);
}

inline int read() {
    int x = 0;
    bool iosig = false;
    char c = getchar();
    for (; !isdigit(c); c = getchar()) if (c == '-') iosig = 1;
    for (; isdigit(c); c = getchar()) x = (x << 1) + (x << 3) + (c ^ '0');
    return iosig ? -x : x;
}

int main() {
    char s[9];
    int n = read();

    for (int i = 1; i <= n; i++) a[i] = read();
    null = newNode(INT_MAX);
    null->size = 0;
    build(root, 1, n);
    int m = read();
    for (int i = 1, l, r, v; i <= m; i++) {
        scanf("%s", s);
        if (s[0] == 'A') {
            l = read(), r = read(), v = read();
            add(l, r, v);
        } else if (s[0] == 'I') {
            l = read();
            insert(l, read());
        } else if (s[0] == 'D') {
            l = read();
            erase(l);
        } else if (s[0] == 'M') {
            l = read(), r = read();
            query(l, r);
        } else if (s[3] == 'E') {
            l = read(), r = read();
            reverse(l, r);
        } else {
            l = read(), r = read(), v = read();
            v = (v % (r - l + 1) + (r - l + 1)) % (r - l + 1);
            v = (r - l + 1) - v;
            revolve(l, r, v);
        }
    }
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=4165168&auto=1&height=66"></iframe>