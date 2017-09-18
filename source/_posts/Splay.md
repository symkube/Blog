---
title: Splay 学习笔记
date: 2016-12-17 16:13:07
tags:
  - 平衡树
  - 数据结构
  - 学习笔记
categories:
  - OI
  - 学习笔记
---
Splay Tree（伸展树）是一种自平衡二叉排序树，可以在均摊 $O({\log} n)$ 的时间内完成基于 Splay（伸展）操作的修改与查询。
<!-- more -->
### 实现
#### 动态内存静态化
同前面的[替罪羊树](http://oi.xehoth.cc/2016/11/26/%E6%9B%BF%E7%BD%AA%E7%BE%8A%E6%A0%91%E5%AD%A6%E4%B9%A0%E6%80%BB%E7%BB%93-%E6%A8%A1%E6%9D%BF/)动态内存静态化。
``` cpp
template<class T, size_t size>
struct MemoryPool {
    T buf[size], *tail, *st[size];
    int top;
    MemoryPool() : top(0), tail(buf) {}
    inline T *alloc() { return top ? st[--top] : tail++; }
    inline void recycle(T *p) { st[top++] = p; }
};
```
#### 节点定义
``` cpp
struct Node {
    Node *child[2], *parent, **root;
    T value;
    int size, count;
}
```
`size` 表示以当前节点为根的 Splay 共有多少个节点（包括自身），引入 `count` 成员，表示这个值共出现了几次，不再重复插入相同的值，效率可以得到提高，特别是求前趋后继，实现起来也会变得更加简单。
#### 儿子节点的获取
利用枚举类可以轻松获取孩子，使编写代码效率提高。
``` cpp
enum Relation {
    L = 0, R = 1
};
```
#### Splay 操作
1. 将祖父节点与自身连接；
2. 将自己的右孩子接到自己的父节点的左孩子的位置（替代自己）；
3. 将父节点接到自己的右孩子的位置；
4. 检查如果此时自身节点为根，则更新 `root`

``` cpp
inline void splay(Node *targetParent = NULL) {
    while (parent != targetParent) {
        if (parent->parent == targetParent) rotate();
        else if (parent->relation() == relation()) parent->rotate(), rotate();
        else rotate(), rotate();
    }
}
```
#### 节点的前趋 / 后继
直接 Splay 后求即可。
``` cpp
inline Node *precursor() {
    splay();
    Node *v = child[L];
    while (v->child[R]) v = v->child[R];
    return v;
}
inline Node *successor() {
    splay();
    Node *v = child[R];
    while (v->child[L]) v = v->child[L];
    return v;
}
```
#### 选择
选择第 $k$ 小的元素时，循环的条件为$k$ 是否在 $[rank + 1, rank + count]$ 的范围内。
``` cpp
inline Node *select(int k) {
    k++;
    Node *v = root;
    while (!(v->rank() < k && v->rank() + v->count >= k)) v = (k <= v->rank() ? v->child[L] : (k -= v->rank() + v->count, v->child[R]));
    return v->splay(), v;
}
```
### 删除
1. 将左端点的前趋 `Splay` 到根；
2. 将右端点的后继 `Splay` 到根的右子树；
3. 删除右端点的后继的左子树；
4. 分别重新计算右端点的后继,左端点的前趋的 `size`。

``` cpp
inline void erase(Node *l, Node *r) {
    Node *pre = l->precursor(), *suc = r->successor();
    pre->splay(), suc->splay(pre), suc->child[L]->recycle(pool);
    pool.recycle(suc->child[L]), suc->child[L] = null, suc->maintain(), pre->maintain();
}
```
### 代码
**维护集合Ⅰ[superoj 420]**
``` cpp
#include <bits/stdc++.h>
template<class T, size_t size>
struct MemoryPool {
    T buf[size], *tail, *st[size];
    int top;
    MemoryPool() : top(0), tail(buf) {}
    inline T *alloc() { return top ? st[--top] : tail++; }
    inline void recycle(T *p) { st[top++] = p; }
};
#define null NULL
using std::cout;
const int MAXN = 1000000;
template <typename T, T INF>
struct Splay {
    enum Relation { L = 0, R = 1 };
    struct Node {
        Node *child[2], *parent, **root;
        T value;
        int size, count;
        inline void init(Node *parent, const T &value, Node **root) { this->parent = parent, this->value = value, this->root = root, this->count = 1, child[L] = child[R] = null; }
        inline void recycle(MemoryPool<Node, MAXN> &pool) {
            if (child[L]) pool.recycle(child[L]);
            if (child[R]) pool.recycle(child[R]);
        }
        inline Relation relation() { return this == parent->child[L] ? L : R; }
        inline void maintain() { size = (child[L] ? child[L]->size : 0) + (child[R] ? child[R]->size : 0) + count; }
        inline void rotate() {
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
                else if (parent->relation() == relation()) parent->rotate(), rotate();
                else rotate(), rotate();
            }
        }
        inline Node *precursor() {
            splay();
            Node *v = child[L];
            while (v->child[R]) v = v->child[R];
            return v;
        }
        inline Node *successor() {
            splay();
            Node *v = child[R];
            while (v->child[L]) v = v->child[L];
            return v;
        }
        inline int rank() { return !child[L] ? 0 : child[L]->size; }
    } *root;
    MemoryPool<struct Node, MAXN> pool;
    Splay() : root(null) { insert(INF), insert(-INF); }
    inline Node *find(const T &value) {
        Node *v = root;
        while (v && value != v->value) v = (value < v->value ? v->child[L] : v->child[R]);
        return !v ? null : (v->splay(), v);
    }
    inline Node *insert(const T &value) {
        Node *v = find(value);
        if (v) return v->count++, v->maintain(), v;
        Node **target = &root, *parent = NULL;
        while (*target) parent = *target, parent->size++, target = (value < parent->value ? &parent->child[L] : &parent->child[R]);
        return *target = pool.alloc(), (*target)->init(parent, value, &root), (*target)->splay(), root;
    }
    inline void erase(const T &value) { erase(find(value)); }
    inline void erase(Node *v) {
        if (v->count != 1) return v->splay(), v->count--, v->maintain();
        Node *precursor = v->precursor(), *successor = v->successor();
        precursor->splay(), successor->splay(precursor), successor->child[L]->recycle(pool);
        pool.recycle(successor->child[L]),successor->child[L] = null, successor->maintain(), precursor->maintain();
    }
    inline int rank(const T &value) {
        Node *v = find(value);
        if (v) return v->rank();
        else {
            v = insert(value);
            register int ans = v->rank();
            return erase(v), ans;
        }
    }
    inline Node *select(int k) {
        k++;
        Node *v = root;
        while (!(v->rank() < k && v->rank() + v->count >= k)) v = (k <= v->rank() ? v->child[L] : (k -= v->rank() + v->count, v->child[R]));
        return v->splay(), v;
    }
    inline const T &precursor(const T &value) {
        Node *v = find(value);
        if (v) return v->precursor()->value;
        else {
            v = insert(value);
            const T &ans = v->precursor()->value;
            return erase(v), ans;
        }
    }
    inline const T &successor(const T &value) {
        Node *v = find(value);
        if (v) return v->successor()->value;
        else {
            v = insert(value);
            const T &ans = v->successor()->value;
            return erase(v), ans;
        }
    }
};
Splay<int, INT_MAX> tree;
const int INF = INT_MAX;
inline char read() {
    static char buf[100000], *p1 = buf, *p2 = buf;
    if (p1 == p2) {
        p2 = (p1 = buf) + fread(buf, 1, 100000, stdin);
        if (p1 == p2) return EOF;
    }
    return *p1++;
}
inline void read(int &x) {
    static char c; c = read(); int b = 1;
    for (x = 0; !isdigit(c); c = read()) if (c == '-') b = -b;
    for (; isdigit(c); x = (x << 1) + (x << 3) + (c ^ '0'), c = read()); x *= b;
}
Splay<int, INT_MAX> splay;
int n;
int main() {
#ifndef ONLINE_JUDGE
    freopen("in.in", "r", stdin);
#endif
    read(n);
    while (n--) {
        int ctrl, x, result;
        read(ctrl), read(x);
        switch(ctrl) {
            case 0:
                splay.insert(x);
                break;
            case 1:
                splay.erase(x);
                break;
            case 2:
                std::cout << splay.select(x)->value << "\n";
                break;
            case 3:
                std::cout << splay.rank(x) - 1 << "\n";
                break;
            case 4:
                result = splay.precursor(x);
                std::cout<<(result == -INF ? -1 : result) << "\n";
                break;
            case 5:
                result = splay.successor(x);
                std::cout<<(result == INF ? -1 : result) << "\n";
                break;
        }
    }
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=413077069&auto=1&height=66"></iframe>
