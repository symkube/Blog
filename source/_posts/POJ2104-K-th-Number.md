---
title: 「POJ-2104」K-th Number-主席树
date: 2016-12-20 22:03:13
tags:
  - 数据结构
  - 可持久化线段树
categories:
  - OI
  - 数据结构
  - 可持久化线段树
---
You are working for Macrohard company in data structures department. After failing your previous task about key insertion you were asked to write a new data structure that would be able to return quickly k-th order statistics in the array segment. 
That is, given an array $a[1...n]$ of different integer numbers, your program must answer a series of questions $Q(i, j, k)$ in the form: "What would be the k-th number in $a[i...j]$ segment, if this segment was sorted?" 
For example, consider the array $a = (1, 5, 2, 6, 3, 7, 4)$. Let the question be $Q(2, 5, 3)$. The segment $a[2...5]$ is $(5, 2, 6, 3)$. If we sort this segment, we get $(2, 3, 5, 6)$, the third number is $5$, and therefore the answer to the question is $5$.
题意：就是求区间第 $k$ 大。
<!-- more -->
### 链接
[poj2104](http://poj.org/problem?id=2104)
### 题解
裸的主席树模板题，注意 poj 评测机较慢，不停地 $new$ 会TLE，要静态开内存。
### 代码
``` cpp
#include <cstdio>
#include <climits>
#include <algorithm>
#include <new>
#include <cctype>
#include <cstring>
#include <iostream>
inline char read() {
    static const int IO_LEN = 1024 * 1024;
    static char buf[IO_LEN], *ioh, *iot;
    if (ioh == iot) {
        iot = (ioh = buf) + fread(buf, 1, IO_LEN, stdin);
        if (ioh == iot) return -1;
    }
    return *ioh++;
}
template<class T>
inline void read(T &x) {
    static bool iosig = 0;
    static char ioc;
    for (iosig = 0, ioc = read(); !isdigit(ioc); ioc = read()) if (ioc == '-') iosig = 1;
    for (x = 0; isdigit(ioc); ioc = read()) x = (x << 1) + (x << 3) + (ioc ^ '0');
    if (iosig) x = -x;
}
template<class T, size_t size>
struct MemoryPool {
    T buf[size], *tail, *st[size];
    int top;
    MemoryPool() : top(0), tail(buf) {}
    inline T *alloc() { return top ? st[--top] : tail++; }
    inline void recycle(T *x) { st[top++] = x;} 
};
const int MAXN = 3000000;
struct ChairmanTree {
    struct Node {
        int l, r;
        Node *lc, *rc;
        int cnt;
        static inline Node *newNode(MemoryPool<Node, MAXN> &pool, const int l, const int r, Node *lc = NULL, Node *rc = NULL) {
            Node *tmp = pool.alloc();
            tmp->l = l, tmp->r = r, tmp->lc = lc, tmp->rc = rc, tmp->cnt = (lc ? lc->cnt : 0) + (rc ? rc->cnt : 0);
            return tmp;
        }
        static inline Node *newNode(MemoryPool<Node, MAXN> &pool, const int l, const int r, const int cnt) {
            Node *tmp = pool.alloc();
            tmp->l = l, tmp->r = r, tmp->cnt = cnt, tmp->lc = NULL, tmp->rc = NULL;
            return tmp;
        }
        inline void pushDown(MemoryPool<Node, MAXN> &pool) {
            if (lc && rc) return;
            register int mid = l + r >> 1;
            if (!lc) lc = newNode(pool, l, mid);
            if (!rc) rc = newNode(pool, mid + 1, r);
        }
        inline Node *insert(MemoryPool<Node, MAXN> &pool, const int num) {
            if (num < l || num > r) return this;
            else if (num == l && num == r) return newNode(pool, l, r, this->cnt + 1);
            else {
                register int mid = l + r >> 1;
                pushDown(pool);
                if (num <= mid) return newNode(pool, l, r, lc->insert(pool, num), rc);
                else return newNode(pool, l, r, lc, rc->insert(pool, num));
            }
        }
        inline int rank() const { return lc ? lc->cnt : 0; }
    } *root[MAXN + 1];
    MemoryPool<Node, MAXN> pool;
    int n;
    inline void build(const int *a, const int n) {
        this->n = n;
        root[0] = Node::newNode(pool, 0, n - 1);
        for (register int i = 1; i <= n; i++)
            root[i] = root[i - 1]->insert(pool, a[i - 1]);
    }
    inline int query(const int l, const int r, int k) {
        Node *L = root[l - 1], *R = root[r];
        register int min = 0, max = n - 1;
        while (min != max) {
            L->pushDown(pool), R->pushDown(pool);
            register int mid = min + max >> 1, t = R->rank() - L->rank();
            if (k <= t) L = L->lc, R = R->lc, max = mid;
            else k -= t, L = L->rc, R = R->rc, min = mid + 1;
        }
        return min;
    }
} t;
int n, m, a[MAXN];
int main() {
    read(n), read(m);
    for (register int i = 0; i < n; i++) read(a[i]);
    static int set[MAXN];
    memcpy(set, a, sizeof(a));
    std::sort(set, set + n);
    int *end = std::unique(set, set + n);
    for (register int i = 0; i < n; i++) a[i] = std::lower_bound(set, end, a[i]) - set;
    t.build(a, n);
    for (register int i = 0, l, r, k; i < m; i++) {
        read(l), read(r), read(k);
        register int ans = t.query(l, r, k);
        std::cout << set[ans] << "\n";
    }
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=32166159&auto=1&height=66"></iframe>