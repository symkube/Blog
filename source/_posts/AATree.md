---
title: AA树学习笔记
date: 2016-12-30 19:32:14
tags:
  - 平衡树
  - 学习笔记
categories:
  - OI
  - 学习笔记
---
$AA$ 树是 $Arne Andersson$ 教授在他的论文 $"Balanced search trees made simple"$ 中介绍的一个红黑树变种，设计的目的是减少 $RB$ 树考虑的 $cases$。
<!-- more -->
### 基本操作
$AA$ 树是一颗红黑树，但是规定红色结点不能作为任何结点的左孩子，也就是说红色结点只能作为右孩子。这样本质上跟 $2-3$ 树类似（虽然后者属于 $B$ 树）。另外 $AA$ 树为实现方便，不再使用红黑两种颜色，而是用 $level$ 标记结点。$level$ 实际上就相当于 $RB$ 树中的 $black height$，叶子结点的 $level$ 等于 $1$（反过来，$level$ 等于 $1$ 的不一定是叶子结点，因为等于1的结点可能有一个红色的右孩子），红色结点使用它的父结点的 $level$，黑色结点比它的父结点的 $level$ 小 $1$。另外，下面两种情况是禁止出现的：

1. 连续两个水平方向链 $(horizontal link)$，所谓 $horizontal link$ 是指一个结点跟它的右孩子结点的 $level$ 相同（左孩子结点永远比它的父结点 $level$ 小 $1$）。这个规定其实相当于 $RB$ 树中不能出现两个连续的红色结点。
2. 向左的水平方向链（$left horizontal link$），也就是说一个结点最多只能出现一次向右的水平方向链。这是因为 $left horizontal link$ 相当于左孩子能为红色结点，这在 $AA$ 树的定义中是不允许的。

#### skew与split
在插入和删除操作中，可能会出现上面两个禁止发生的情况，这时候就需要通过树的旋转操作来纠正。$AA$ 树中只有两个基本操作：$skew(rightRotate)$ 和 $split(leftRotate)$。前者用于纠正出现向左的水平方向链，后者用于纠正出现连续两个水平方向链的情况。$skew$ 就是一个右旋转，$split$ 是一个左旋转，但两者不是互逆的。$skew$ 操作之后可能引起 $1$）的发生（当 $skew$ 之前已经有一个右孩子的 $level$ 跟当前结点的 $level$ 相同），这时需要配合使用 $split$ 操作。$split$ 操作的特点是新的子树的根节点 $level$ 增加 $1$, 从而会在它的父结点中出现 $1$）(当它作为父结点的左孩子)或者在它的父结点中出现 $2$）（当它作为父结点的右孩子而且父结点跟祖父结点的 $level$ 相同），这时需要通过 $skew$ 和 $split$ 操作纠正这两种情况。
### 代码
**注意:** 在查找前驱后继时没找到，我返回的是当前节点的 $value$。
``` cpp
template<class T, size_t size>
struct MemoryPool {
    T buf[size], *st[size], *tail, *end;
    int top;
    MemoryPool() : top(0), tail(buf), end(buf + size) {}
    inline T *alloc() {
        if (top) return st[--top];
        if (tail != end) return tail++;
        return new T;
    }
    inline void recycle(T *x) {
        if (top > size) delete x;
        else st[top++] = x;
    }
};
#ifndef ARNE_ANDERSSON_TREE
#define ARNE_ANDERSSON_TREE
template<class T, size_t MAXN>
struct AATree {
    struct Node {
        Node *ch[2];
        int size, level;
        T data;
        inline Node *init(const T &data) { return size = level = 1, this->data = data, this; }
        Node(): size(0), level(0) { ch[0] = ch[1] = this; }
    } *null, *root;
    MemoryPool<Node, MAXN> pool;
    inline void rotate(Node *&p, bool x) {
        if (p->level == p->ch[x]->ch[x]->level) {
            Node *o = p;
            p = p->ch[x], o->ch[x] = p->ch[!x], p->ch[!x] = o;
            if (x)p->level++;
            p->size = o->size, o->size = o->ch[0]->size + o->ch[1]->size + 1;
        }
    }
    inline void eraseFix(Node *&o) {
        if (o ->ch[0]->level < o->level - 1 || o->ch[1]->level < o->level - 1) {
            if (o->ch[1]->level > --o->level)o->ch[1]->level = o->level;
            rotate(o, 0);
            if (o->ch[1]->size) rotate(o->ch[1], 0);
            if (o->ch[1]->ch[1]->size) rotate(o->ch[1]->ch[1], 0);
            rotate(o, 1);
            if (o->ch[1]->size) rotate(o->ch[1], 1);
        }
    }
    inline void insert(Node *&o, const T&data) {
        if (!o->size) o = pool.alloc()->init(data), o->ch[0] = o->ch[1] = null;
        else o->size++, insert(o->ch[o->data < data], data), rotate(o, 0), rotate(o, 1);
    }
    inline bool erase(Node *&o, const T &data) {
        if (!o->size)return 0;
        if (o->data == data) {
            if (!o->ch[0]->size || !o->ch[1]->size) {
                Node *t = o;
                o = o->ch[0]->size ? o->ch[0] : o->ch[1], pool.recycle(t);
            } else {
                o->size--;
                Node *t = o->ch[1];
                while (t->ch[0]->size) t = t->ch[0];
                o->data = t->data, erase(o->ch[1], t->data), eraseFix(o);
            }
            return 1;
        } else if (erase(o->ch[o->data < data], data)) {
            return o->size--, eraseFix(o), 1;
        } else return 0;
    }
    inline void clear(Node *&o) { if (o->size) clear(o->ch[0]), clear(o->ch[1]), pool.recycle(o); }
    AATree(): null(pool.alloc()) { root = null->ch[0] = null->ch[1] = null; }
    inline void clear() {clear(root), root = null;}
    inline void insert(const T&data) { insert(root, data); }
    inline bool erase(const T&data) { return erase(root, data); }
    inline bool find(const T &data) {
        Node *o = root;
        while (o->size && o->data != data)o = o->ch[o->data < data];
        return o->size ? 1 : 0;
    }
    inline int rank(const T &data) {
        register int cnt = 0;
        for (Node *o = root; o->size;) {
            if (o->data < data) cnt += o->ch[0]->size + 1, o = o->ch[1];
            else o = o->ch[0];
        }
        return cnt;
    }
    inline const T &select(int k) {
        for (Node *o = root;;) {
            if (k <= o->ch[0]->size)o = o->ch[0];
            else if (k == o->ch[0]->size + 1) return o->data;
            else k -= o->ch[0]->size + 1, o = o->ch[1];
        }
    }
    inline const T &operator [] (int k) { return select(k); }
    inline const T &precursor(const T &data) {
        Node *x = root, *y = 0;
        while (x->size) {
            if (x->data < data) y = x, x = x->ch[1];
            else x = x->ch[0];
        }
        if (y) return y->data;
        return data;
    }
    inline const T &successor(const T &data) {
        Node *x = root, *y = 0;
        while (x->size) {
            if (data < x->data) y = x, x = x->ch[0];
            else x = x->ch[1];
        }
        if (y) return y->data;
        return data;
    }
    inline int size() { return root->size; }
};
#endif
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=869190&auto=1&height=66"></iframe>
