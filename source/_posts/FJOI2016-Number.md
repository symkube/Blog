---
title: 「FJOI2016」神秘数-主席树
date: 2016-12-21 21:58:17
tags:
  - 数据结构
  - 可持久化线段树
categories:
  - OI
  - 数据结构
  - 可持久化线段树
---
一个可重复数字集合 $S$ 的神秘数定义为最小的不能被 $S$ 的子集的和表示的正整数。
求由 $a[l]$，$a[l+1]$，… ，$a[r]$ 所构成的可重复数字集合的神秘数。
<!-- more -->
### 链接
[bzoj4408](http://www.lydsy.com/JudgeOnline/problem.php?id=4408)
### 输入格式
第一行一个整数 $n$ ，表示数字个数。
第二行 $n$ 个整数，从 $1$ 编号。
第三行一个整数 $m$ ，表示询问个数。
以下 $m$ 行，每行一对整数 $l$，$r$，表示一个询问。
### 输出格式
对于每个询问，输出一行对应的答案。
### 样例数据 1
#### 输入
``` bash
5
1 2 4 9 10
5
1 1
1 2
1 3
1 4
1 5
```
#### 输出
``` bash
2
4
8
8
8
```
### 题解
此题做法比较神，对于当前区间扩展可达到 $[0,max]$ 则一定可以扩展到 $[0,sum(i)(i<=max+1)]$ ，然后就是用可持久化线段树跑暴力，初始 $max=0$ 然后一直到不能扩展是 $max+1$ 即为答案。
**注意:**MemoryPool不能开太大，否则bzoj上会编译超时....
### 代码
``` cpp
#include <bits/stdc++.h>
inline char read() {
    static const int IO_LEN = 1024 * 1024;
    static char buf[IO_LEN], *ioh, *iot;
    if (iot == ioh) {
        iot = (ioh = buf) + fread(buf, 1, IO_LEN, stdin);
        if (iot == ioh) return -1;
    }
    return *ioh++;
}
template<class T>
inline void read(T &x) {
    static char ioc;
    static bool iosig = 0;
    for (iosig = 0, ioc = read(); !isdigit(ioc); ioc = read()) if (ioc == '-') iosig = 1;
    for (x = 0; isdigit(ioc); ioc = read()) x = (x << 1) + (x << 3) + (ioc ^ '0');
    if (iosig) x = -x;
}
const int MAXN = 1000001;
struct Node {
    int l, r, data;
    Node *lc, *rc;
    Node() : lc(NULL), rc(NULL) {}
} *root[MAXN], *null;
template<class T, size_t size>
struct MemoryPool {
    T buf[size], *tail, *end;
    MemoryPool() : tail(buf), end(buf + size) {}
    inline T *alloc() { return tail != end ? tail++ : new T; }
};
MemoryPool<Node, MAXN * 10> pool;
inline Node *newNode() {
    Node *p = pool.alloc();
    return p->lc = null = p->rc = null, p->data = 0, p;
}
inline Node *build(const Node *p, const int l, const int r, const int v) {
    Node *res;
    if (l != r) {
        if (p == null) {
            res = newNode(), res->l = l, res->r = r, res->data += v;
            register int mid = l + r >> 1;
            if (mid < v) res->rc = build(null, mid + 1, r, v);
            else res->lc = build(null, l, mid, v);
            return res;
        } else {
            res = newNode(), *res = *p, res->data += v;
            register int mid = l + r >> 1;
            if (mid < v) res->rc = build(p->rc, mid + 1, r, v);
            else res->lc = build(p->lc, l, mid, v);
            return res;
        }
    } else {
        res = newNode();
        if (p != null) *res = *p;
        return res->l = l, res->r = r, res->data += v, res;
    }
}
inline int query(const Node *p, Node *cur, int r) {
    if (cur->r <= r) return cur->data - p->data;
    register int mid = cur->l + cur->r >> 1, res = 0;
    if (mid < r) if (cur->rc != null) res += query(p->rc, cur->rc, r);
    if (cur->lc != null) res += query(p->lc, cur->lc, r);
    return res;
}
int main() {
    null = pool.alloc(), null->lc = null->rc = null, null->data = 0, root[0] = newNode(), root[0]->l = 0, root[0]->r = 1000000001, root[0]->data = 0;
    register int n, m, tmp = 0, last = 1;
    read(n);
    for (register int i = 1, j; i <= n; i++) read(j), root[i] = build(root[i - 1], 0, root[i - 1]->r, j);
    read(m);
    for (register int i = 1, j, k; i <= m; i++) {
        read(j), read(k);
        if (j > k) std::swap(j, k);
        tmp = 0, last = 1;
        while (tmp ^ last) {
            last = tmp;
            tmp = query(root[j - 1], root[k], tmp + 1);
        }
        std::cout << tmp + 1 << "\n";
    }
    return 0;
}
```
