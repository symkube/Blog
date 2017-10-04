---
title: 「BZOJ 1251」序列终结者 - Splay
date: 2016-12-19 21:33:02
tags:
  - 数据结构
  - 平衡树
categories:
  - OI
  - 数据结构
  - 平衡树
---
给定一个长度为 N 的序列，每个序列的元素是一个整数。要支持以下三种操作：
1. 将 `[L,R]` 这个区间内的所有数加上 `V`。
2. 将 `[L,R]` 这个区间翻转，比如 `1 2 3 4` 变成 `4 3 2 1`。
3. 求 `[L,R]` 这个区间中的最大值。 最开始所有元素都是 `0`。

<!-- more -->
### 链接
[CodeVS 4655](http://codevs.cn/problem/4655/)

[BZOJ 1251](http://www.lydsy.com/JudgeOnline/problem.php?id=1251)
### 题解
区间修改：和翻转一样，维护一个 `lazy-tag`，然后 `pushDown()` 的时候下放即可。

区间查询：维护一个子树值的和，查询的时候直接选择区间然后返回这个和。需要在 `maintain()` 中维护。
### 代码
``` cpp
#include <bits/stdc++.h>
#define null NULL
const int MAXN = 50000;
const int MAXM = 100000;
template<class T, size_t size>
struct MemoryPool {
    T buf[size], *tail, *st[size];
    int top;
    inline T *alloc() { return top ? st[--top] : tail++; }
    inline void recycle(T *x) { st[top++] = x; }
    MemoryPool() : top(0), tail(buf) {}
};
template <typename T>
struct Splay {
    enum Relation { L = 0, R = 1 };
    struct Node {
        Node *child[2], *parent, **root;
        T value, max, lazy;
        int size;
        bool reversed, bound;
        inline void init(Node *parent, const T &value, Node **root, bool bound = false) { this->parent = parent, this->value = value, this->lazy = 0, this->max = value, this->reversed = false, this->root = root, this->bound = bound, this->size = 1, child[L] = child[R] = null; }
        inline Relation relation() { return this == parent->child[L] ? L : R; }
        inline void maintain() {
            pushDown(), size = 1 + (child[L] ? child[L]->size : 0) + (child[R] ? child[R]->size : 0);
            max = value;
            if (child[L]) max = std::max(max, child[L]->max);
            if (child[R]) max = std::max(max, child[R]->max);
        }
        inline void pushDown() {
            if (reversed) {
                if (child[L]) child[L]->reversed ^= 1;
                if (child[R]) child[R]->reversed ^= 1;
                std::swap(child[L], child[R]);
                reversed = false;
            }
            if (lazy) {
                if (child[L]) child[L]->lazy += lazy, child[L]->value += lazy, child[L]->max += lazy;
                if (child[R]) child[R]->lazy += lazy, child[R]->value += lazy, child[R]->max += lazy;
                lazy = 0;
            }
        }
        inline void rotate() {
            if (parent->parent) parent->parent->pushDown();
            parent->pushDown(), pushDown();
            Relation x = relation();
            Node *oldParent = parent;
            if (oldParent->parent) oldParent->parent->child[oldParent->relation()] = this;
            parent = oldParent->parent, oldParent->child[x] = child[x ^ 1];
            if (child[x ^ 1]) child[x ^ 1]->parent = oldParent;
            child[x ^ 1] = oldParent, oldParent->parent = this, oldParent->maintain(), maintain();
            if (!parent) *root = this;
        }
        inline void splay(Node *targetParent = null) {
            while (parent != targetParent) {
                if (parent->parent == targetParent) rotate();
                else {
                    parent->parent->pushDown(), parent->pushDown();
                    if (parent->relation() == relation()) parent->rotate(), rotate();
                    else rotate(), rotate();
                }
            }
        }
        inline int rank() { return child[L] ? child[L]->size : 0; }
    } *root;
    MemoryPool<Node, MAXN * 2> pool;
    Splay() : root(null) {}
    inline void build(const T *a, int n) { root = buildRange(a, 1, n, null), buildBound(L), buildBound(R); }
    inline Node *buildRange(const T *a, int l, int r, Node *parent) {
        if (l > r) return null;
        register int mid = l + r >> 1;
        Node *v = pool.alloc();
        v->init(parent, a[mid - 1], &root);
        if (l != r) v->child[L] = buildRange(a, l, mid - 1, v), v->child[R] = buildRange(a, mid + 1, r, v);
        return v->maintain(), v;
    }
    inline void buildBound(Relation x) {
        Node **v = &root, *parent = null;
        while (*v) parent = *v, parent->size++, v = &parent->child[x];
        *v = pool.alloc(), (*v)->init(parent, 0, &root, true), (*v)->maintain();
    }
    inline Node *select(int k) {
        k++;
        Node *v = root;
        while (v->pushDown(), k != v->rank() + 1) v = (k <= v->rank() ? v->child[L] : (k -= v->rank() + 1, v->child[R]));
        return v->splay(), v;
    }
    inline Node *select(int l, int r) {
        Node *lbound = select(l - 1), *rbound = select(r + 1);
        return lbound->splay(), rbound->splay(lbound), rbound->child[L];
    }
    inline void update(int l, int r, const T &addition) {
        Node *range = select(l, r);
        range->value += addition, range->lazy += addition, range->max += addition;
    }
    inline const T &queryMax(int l, int r) {
        Node *range = select(l, r);
        return range->max;
    }
    inline void reverse(int l, int r) {
        Node *range = select(l, r);
        range->reversed ^= 1;
    }
};
inline char read() {
    static const int iol = 1024 * 1024;
    static char buf[iol], *ioh, *iot;
    if (ioh == iot) {
        iot = (ioh = buf) + fread(buf, 1, iol, stdin);
        if (ioh == iot) return -1;
    }
    return *ioh++;
}
inline void read(int &x) {
    static char ioc;
    static bool iosig = 0;
    for (iosig = 0, ioc = read(); !isdigit(ioc); ioc = read()) if (ioc == '-') iosig = 1;
    for (x = 0; isdigit(ioc); ioc = read()) x = (x << 1) + (x << 3) + (ioc ^ '0');
    if (iosig) x = -x;
}
int n, m, a[MAXN];
Splay<int> splay;
int main() {
    read(n), read(m);
    splay.build(a, n);
    for (register int i = 0, command; i < m; i++) {
        read(command);
        if (command == 1) {
            register int l, r, addition;
            read(l), read(r), read(addition), splay.update(l, r, addition);
        } else if (command == 2) {
            register int l, r;
            read(l), read(r), splay.reverse(l, r);
        } else if (command == 3) {
            register int l, r;
            read(l), read(r);
            std::cout << splay.queryMax(l, r) << "\n";
        } else throw;
    }
    return 0;
}
```

