---
title: Link-Cut Tree学习笔记
date: 2017-03-21 16:19:19
tags:
  - 数据结构
  - LCT
  - 学习笔记
categories:
  - OI
  - 学习笔记
---
## Link-Cut Tree学习总结
在数据结构中有一类问题叫做动态树问题（**DynamicTree**），它会要求你对一颗树进行切割和拼接，然后再在上面维护传统的数据结构能维护的值，为了完成这一类问题，就有了很多相应的算法来解决这类问题，**Link-Cut Tree** 就是其中一种比较方便实用的算法。
<!-- more -->
**Link-Cut Tree** 是一种用来维护动态森林连通性的数据结构，适用于动态树问题。它采用类似树链剖分的轻重边路径剖分，把树边分为实边和虚边，并用 **Splay** 来维护每一条实路径。**Link-Cut Tree **的基本操作复杂度为均摊 $O({\log}n)$，但常数因子较大，一般效率会低于树链剖分。

### 定义
这里引用一下[Menci](https://oi.men.ci/link-cut-tree-notes/)博客里的定义。

一棵 **Link-Cut Tree** 上的边分为两种：实边和虚边。每一种边都是有向的，由子节点指向父节点。首尾相连的实边组成的不可延伸的链叫做路径。路径中**深度最大**的节点称为路径头部，**深度最小**的节点称为路径尾部。

将每一条路径上的节点按照深度排序，得到一个序列，用 **Splay** 来维护这个序列。

每一条链对应着一棵 **Splay**，每棵 **Splay** 的根节点有一个成员 `Path Parent`(我一般将其称为 `top`)，表示该 **Splay** 维护的路径的尾部的节点的父节点，整棵树的根节点所对应的 **Splay** 节点的 `Path Parent` 为空；其他节点（不是其所在 **Splay** 的根节点的节点）的 `Path Parent` 也为空。

`rev` 表示以该节点为根的 **Splay** 有没有被翻转。

### 节点定义
为了方便实现一种常数较小的 **Link-Cut Tree**，我们采用虚拟空节点和空节点相结合的方法来实现。
``` cpp
struct Node *null;

struct Node {
    Node *c[2], *fa;
    bool rev;
    Node *top;
}
```

### 操作
#### expose
将当前节点置为其所在路径的头部节点，即切断自该节点向下的部分路径。
``` cpp
inline void expose(Node *p = null) {
    splay();
    if (c[1] != null)
        c[1]->top = this, c[1]->fa = null;
    (c[1] = p)->fa = this;
    maintain();
}
```
#### access
访问某个节点 `u`，被访问过的节点会与根节点之间以路径相连，并且该节点为路径头部（最下端），即打通 `u` 到根节点的路径。

我们先 `expose`，然后将当前节点所在的路径与其尾部节点的父节点所在的路径合并，即将路径向上延长(这里其实就是 `splice` 操作)，这里的 `top` 的空节点为 `NULL`，注意区分 `Node` 的空节点；同时这里也是常数优化的关键。
``` cpp
inline Node *access() {
    Node *x = this;
    for (x->expose(); x->top; x = x->top)
        x->top->expose(x);
    return x;
}
```
#### evert
将某个节点 `u` 置为其所在树的根节点，该操作等价于把该节点到根节点所经过的所有边方向取反
``` cpp
inline void reverse() {
    rev ^= 1, std::swap(c[0], c[1]);
}

inline void evert() {
    access(), splay(), reverse();
}
```
#### link
将某两个节点 `u` 和 `v` 连接，执行操作后 `u` 成为 `v` 的父节点
``` cpp
inline void link(Node *f) {
    Node *x = access();
    x->reverse(), x->top = f;
}
```
#### cut
将某两个节点 `u` 和 `v` 分离，执行操作后 `v` 及其子节点组成单独的一棵树，有了 `expose` 和 `NULL` 我们就可以轻松实现 `cut` 操作，同时大量减少常数。
``` cpp
inline void cut(Node *y) {
    Node *x = this;
    x->expose(), y->expose();
    if (x->top == y) x->top = NULL;
    if (y->top == x) y->top = NULL;
}
```
#### split
在询问和修改时使用，对于节点 `u, v`，节点 `u` 对节点 `v` 执行 `split` 操作后，我们就可以通过节点 `u` 得到 `u ~ v` 的信息。 
``` cpp
inline void split(Node *v) {
    v->evert(), access(), splay();
}
```
#### update
如果只需要修改点权，则直接 `Splay`，将其置为其所在 `Splay` 的根节点，然后直接修改即可，这样可以避免修改时标记的向上传递。
``` cpp
inline void update(int u, const int value) {
    (pool + u)->splay();
    (pool + u)->val = value;
    (pool + u)->maintain();
}
```

### 例题
[BZOJ-1036](http://www.lydsy.com/JudgeOnline/problem.php?id=1036)树的统计

速度还是~~挺正常~~的，我的链剖 $760ms$，**Link-Cut Tree** $2264ms$。
``` cpp
/*
 * created by xehoth on 21-03-2017
 */
#include <bits/stdc++.h>

const int MAXN = 30010;

struct Node *null;

struct Node {
    Node *c[2], *fa;
    bool rev;
    Node *top;
    int sum, max, val;

    Node() : sum(0), val(0), max(INT_MIN), fa(null) {
        c[0] = c[1] = null;
    }

    inline void maintain() {
        sum = c[0]->sum + c[1]->sum + val;
        max = std::max(val, std::max(c[0]->max, c[1]->max));
    }
    inline void reverse() {
        rev ^= 1, std::swap(c[0], c[1]);
    }

    inline void pushDown() {
        rev ? c[0]->reverse(), c[1]->reverse(), rev = false : 0;
    }


    inline bool relation() {
        return this == fa->c[1];
    }

    inline void rotate(bool f) {
        Node *o = fa;
        top = o->top;
        o->pushDown(), pushDown();
        (fa = o->fa)->c[o->relation()] = this;
        (o->c[f] = c[!f])->fa = o;
        (c[!f] = o)->fa = this;
        o->maintain();
    }

    inline void splay() {
        Node *o = fa;
        bool f;
        for (pushDown(); o != null; o = fa) {
            o->fa == null ? rotate(o->c[1] == this) :
            ((f = o->c[1] == this) == (o->fa->c[1] == o)
             ? (o->rotate(f), rotate(f)) : (rotate(f), rotate(!f)));
        }
        maintain();
    }

    inline void expose(Node *p = null) {
        splay();
        if (c[1] != null)
            c[1]->top = this, c[1]->fa = null;
        (c[1] = p)->fa = this;
        maintain();
    }

    inline Node *access() {
        Node *x = this;
        for (x->expose(); x->top; x = x->top)
            x->top->expose(x);
        return x;
    }

    inline void evert() {
        access(), splay(), reverse();
    }

    inline void link(Node *f) {
        Node *x = access();
        x->reverse(), x->top = f;
    }

    inline void cut(Node *y) {
        Node *x = this;
        x->expose(), y->expose();
        if (x->top == y) x->top = NULL;
        if (y->top == x) y->top = NULL;
    }

    inline Node *findRoot() {
        Node *f = this;
        f->access(), f->splay();
        while (f->pushDown(), f->c[0] != null) f = f->c[0];
        return f;
    }

    inline void split(Node *v) {
        v->evert(), access(), splay();
    }

    inline void init(int val) {
        this->val = max = sum = val;
    }
} pool[MAXN];

inline void init() {
    null = pool, null->fa = null;
    null->sum = 0;
    null->val = null->max = INT_MIN;
}

inline const int querySum(int u, int v) {
    (pool + u)->split(pool + v);
    return (pool + u)->sum;
}

inline const int queryMax(int u, int v) {
    (pool + u)->split(pool + v);
    return (pool + u)->max;
}

inline void update(int u, const int value) {
    (pool + u)->splay();
    (pool + u)->val = value;
    (pool + u)->maintain();
}

inline char nextChar() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    if (s == t) {
        t = (s = buf) + fread(buf, 1, IN_LEN, stdin);
        if (s == t) return -1;
    }
    return *s++;
}

inline int read() {
    static int x = 0;
    static char c;
    static bool iosig;
    for (iosig = false, x = 0, c = nextChar(); !isdigit(c); c = nextChar()) {
        if (c == '-') iosig = true;
    }
    for (; isdigit(c); c = nextChar()) 
        x = (x + (4 * x) << 1) + (c ^ '0');
    return iosig ? -x : x;
}

const int OUT_LEN = 10000000;
char obuf[OUT_LEN], *oh = obuf;

template<class T>
inline void print(T x) {
    static int buf[30], cnt;
    if (x == 0) {
        *oh++ = '0';
    } else {
        if (x < 0) *oh++ = '-', x = -x;
        register int cnt = 0;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 + 48;
        while (cnt) *oh++ = buf[cnt--];
    }
}

template<class T>
inline void println(T x) {
    print(x), *oh++ = '\n';
}

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}

int n, q;

struct Edge {
    int u, v;
    inline void read() {
        u = ::read(), v = ::read();
    }
} edge[MAXN];

int main() {
#ifndef ONLINE_JUDGE
    freopen("in.in", "r", stdin);
#endif
    n = read();
    init();
    for (register int i = 1; i <= n; i++) pool[i] = Node();
    for (register int i = 0, u, v; i < n - 1; i++) edge[i].read();
    for (register int i = 1; i <= n; i++) {
        (pool + i)->init(read());
    }
    for (register int i = 0; i < n - 1; i++) {
        (pool + edge[i].u)->link(pool + edge[i].v);
    }
    q = read();

    for (register int i = 0; i < q; i++) {
        nextChar();
        register char str = nextChar();
        if (str == 'H') {
            register int u = read(), t = read();
            update(u, t);
        } else if (str == 'M') {
            register int u = read(), v = read();
            println(queryMax(u, v));
        } else if (str == 'S') {
            register int u = read(), v = read();
            println(querySum(u, v));
        }
    }
    flush();
    return 0;
}
```
