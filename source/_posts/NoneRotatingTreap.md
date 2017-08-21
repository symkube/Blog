---
title: 非旋转式 Treap 学习笔记
date: 2017-01-10 18:16:10
tags:
  - 平衡树
  - treap
  - 数据结构
  - 学习笔记
categories:
  - oi
  - 学习笔记
---
树堆，在数据结构中也称 $Treap$，是指有一个随机附加域满足堆的性质的二叉搜索树，其结构相当于以随机数据插入的二叉搜索树。其基本操作的期望时间复杂度为 $O( \log n )$。

相对于 $AVL$ 和红黑树，其实现简单，相对于 $Splay$，其效率更高，相对于替罪羊和 $SBT$，其适用范围更广(尤其是非旋转式Treap)。
<!-- more -->
### 定义
旋转版Treap就忽略了~~(虽然并没有什么用)~~，这里主要是非旋转式Treap

$Treap=Tree+Heap$

$Treap$ 是一颗同时拥有二叉搜索树和堆性质的一颗二叉树
#### 节点定义
``` cpp
struct Node {
    Node *lc, *rc;
    int key, rank;
};
```
$key$ 即为键，满足二叉搜索树性质，即中序遍历按照 $key$ 值有序。

$rank$，满足堆性质，即对于任何一颗以 $x$ 为根的子树，$x$ 的 $rank$ 值为该子树的最值。
### 操作
#### 基本操作
- $build$ $O(n)$建好一颗 $Treap$
- $merge$ $O(\log n)$ 合并
- $split$ $O(\log n)$ 拆分

#### 可支持的操作
听说有人说旋转式 $Treap$ 不能完成许多区间操作，非旋转式 $Treap$ 不能完成区间反转，事实上 $Splay$ 能做的，非旋转式 $Treap$ 几乎都能做，而且写起来更简单。
- $insert$ $(merge)$ $O(\log n)$
- $delete$ $(split+split+merge)$ $O(\log n)$
- $kth$ $(split+split)$ $O(\log n)$
- $......$

### 实现
#### 基本定义
``` cpp
struct Node *null;

struct Node {
    Node *lc, *rc;
    int key, rank, size;
    Node(int key = 0) : key(key), rank(rand()), lc(null), rc(null), size(1) {}
};
```
我们定义空节点 $null$，这样可以避免过于复杂的判定空节点，$key$ 和 $rank$ 刚才已经提到，$size$ 就不用多说了，附加信息就自行添上就好了。
#### 新建节点
内存池就不用多说了...
``` cpp
Node data[MAXN], *pool[MAXN];
int dataTop, poolTop;

inline Node *newNode(int key) {
    Node *u;
    if (poolTop) u = pool[poolTop--];
    else u = &data[dataTop++];
    *u = Node(key);
    return u;
}
```
#### 空节点的初始化
由于我们自己定义了一个空节点，我们需要将其置于边界，且其左右儿子指向自己。
``` cpp
null = newNode(-INF);
null->size = 0;
```
#### maintain
维护节点的信息，由于自己定义了 $null$ 节点，所以不用再判断了。
``` cpp
inline void maintain() {
    size = lc->size + rc->size + 1;
}
```
#### build
先让我们看一下笛卡尔树，具体原理可以参考[Memphis's Blog](http://memphis.is-programmer.com/posts/46317.html)，顺便一提利用笛卡尔树还可以在线 $O(n)$ 求 $LCA$。

笛卡尔树构造时用栈维护了整棵树最右的一条链，每次在右下角处加入一个元素然后维护笛卡尔树的性质。
时间复杂度为 $O(n)$
``` cpp
inline Node *build(int *a, int n) {
    static Node *stack[MAXN], *u, *pre;
    int top = 0;
    for (register int i = 1; i <= n; i++) {
        u = newNode(a[i]);
        pre = null;
        while (top && stack[top]->rank > u->rank) {
            stack[top]->maintain();
            pre = stack[top];
            stack[top--] = null;
        }
        if (top) stack[top]->rc = u;
        u->lc = pre;
        stack[++top] = u;
    }
    while (top) stack[top--]->maintain();
    return stack[1];
}
```
#### merge
对于两个相对有序的 $Treap$【若中序遍历为递增，即 $TreapA$ 的最右下角也就是最大值小于 $TreapB$ 的最左下角也就是最小值】，那么 $merge$ 的复杂度是 $O(\log n)$ 的；对于两个相对无序的 $Treap$，那么 $merge$ 只能启发式合并了。

与斜堆的合并类似，只是需要注意满足中序遍历，因此不能交换左右子树。
``` cpp
inline Node *merge(Node *u, Node *v) {
    if (u == null) return v;
    if (v == null) return u;
    if (u->rank < v->rank) {
        u->rc = merge(u->rc, v);
        u->maintain();
        return u;
    } else {
        v->lc = merge(u, v->lc);
        v->maintain();
        return v;
    }
}
```
#### split
我们定义一个 $pair$ 用来返回两颗子树。
``` cpp
typedef std::pair<Node *, Node *> Pair;
```
对于一个 $Treap$，我们需要把它按照第 $K$ 位拆分，就像在寻找第 $K$ 位一样走下去，一边走一边拆树，每次返回的时候拼接就可以了，由于树高是 $O(\log n)$ 的，所以复杂度当然也是 $O(\log n)$ 的，这样 $Treap$ 有了 $split$ 和 $merge$ 操作，我们可以做到提取区间，也因此可以区间覆盖，也可以区间求和等等，除此之外因为没有了旋转操作，我们还可以进行可持久化**(这才是真正强于Splay的一点)**。
``` cpp
inline Pair split(Node *u, int k) {
    if (u == null) return Pair(null, null);
    Pair t;
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
```
#### rank
``` cpp
inline int rank(Node *u, int k) {
    if (u == null) return 0;
    return k < u->key ? rank(u->lc, k) : rank(u->rc, k) + u->lc->size + 1;
}
```
现在我们有了 $merge$，$split$ 和 $rank$ 其他操作就相当简单了。
#### insert
求出 $rank$，$split$ 成 $[1,k - 1]$ 和 $[k,n]$ 两部分，依次合并就完了。
``` cpp
inline void insert(int v) {
    register int k = rank(root, v);
    Pair t = split(root, k);
    Node *p = newNode(v);
    root = merge(merge(t.first, p), t.second);
}
```
#### select
查找第 $k$ 大也很简单，还是先拆，再把区间 $[k, n]$ 拆开一个元素就好了，记得合并。
``` cpp
inline Node *select(int k) {
    Pair t1 = split(root, k - 1), t2 = split(t1.second, 1);
    Node *ret = t2.first;
    root = merge(merge(t1.first, ret), t2.second);
    return ret;
}
```
#### erase
删除不也是拆吗...将树拆分为 $[1,k-1]$,$[k+1,n]$ 和被删除的节点三部分，然后只将左右合并即可。
``` cpp
inline void erase(int k) {
    Pair t1 = split(root, k - 1), t2 = split(t1.second, 1);
    root = merge(t1.first, t2.second);
}
```
#### clear
内存池回收
``` cpp
inline void recycle(Node *u) {
    pool[++poolTop] = u;
}

inline void clear(Node *u) {
    if (u == null) return;
    clear(u->lc), clear(u->rc);
    recycle(u);
}
```
### 区间操作
#### 提取区间
有了 $split$ 想怎么玩怎么玩....
``` cpp
inline Node *select(int l, int r) {
    Pair t1 = split(root, l - 1), t2 = split(t1.second, r - l + 1);
    /* 区间为 t2.first */
    Node *ret = t2.first;
    root = merge(merge(t1.first, ret), t2.second);
    return ret;
}
```
还可以这么玩.....
``` cpp
inline Node *select(int l, int r) {
    Pair t1 = split(root, l + r - 1), t2 = split(t1.first, l - 1);
    Node *ret = t2.second;
    root = merge(merge(t2.first, t2.second), t1.second);
    return ret;
}
```
#### 标记
$merge$ 和 $split$ 需要 $pushDown$
``` cpp
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
```
**修改**就提取出区间直接改，再打上标记就好了。
### 可持久化
由于只有父亲指向儿子的关系，所以我们可以在线段树进入修改的时候把沿途所有节点都 $copy$ 一遍，然后把需要修改的指向儿子的指针修改一遍就好了，因为每次都是在原途上覆盖，不会修改前一次的信息，由于每次只会 $copy$ 一条路径，而我们知道线段树的树高是 $log$ 的，所以时空复杂度都是 $O(n \log n)$
### 例题
[\[BZOJ-1500\]\[NOI2005\]维修数列](http://www.lydsy.com/JudgeOnline/problem.php?id=1500)

这不就是 $Splay$ 典型题目吗，非旋转式 $Treap$ 也能轻松完成。
``` cpp
/*
 * created by xehoth on 10-01-2017
 */
#include <bits/stdc++.h>

const int MAXN = 500010;
const int INIT_VAL = 1001;
const int INF = 2000000000;
const int OUT_LEN = 10000000;

inline int read() {
    char c = getchar();
    while (!isdigit(c) && c != '-') c = getchar();
    int x = 0, f = 1;
    if (c == '-') f = -1;
    else x = c - '0';
    while (isdigit(c = getchar())) x = (x << 1) + (x << 3) + (c ^ '0');
    return x * f;
}

char obuf[OUT_LEN], *oh = obuf;

inline void writeChar(const char c) {
    if (oh == obuf + OUT_LEN) fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf;
    *oh++ = c;
}

template<class T>
inline void write(T x) {
    static int buf[30], cnt;
    if (x == 0) {
        writeChar(48);
    } else {
        if (x < 0) writeChar('-'), x = -x;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 + 48;
        while (cnt) writeChar(buf[cnt--]);
    }
}

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}

struct Node *null;

struct Node {
    Node *lc, *rc;
    int key, rank, rev, tag, size;
    int sum, lSum, rSum, maxSum;

    Node(int key = 0) : key(key), rank(rand()), lc(null), rc(null), rev(0), tag(INIT_VAL),
                        size(1) { sum = lSum = rSum = maxSum = key; }

    inline void maintain() {
        size = lc->size + rc->size + 1;
        sum = lc->sum + rc->sum + key;
        lSum = std::max(lc->lSum, lc->sum + key + std::max(0, rc->lSum));
        rSum = std::max(rc->rSum, rc->sum + key + std::max(0, lc->rSum));
        maxSum = std::max(0, lc->rSum) + key + std::max(0, rc->lSum);
        maxSum = std::max(maxSum, std::max(lc->maxSum, rc->maxSum));
    }

    inline void cover(int v) {
        if (this == null) return;
        key = v, sum = v * size;
        lSum = rSum = maxSum = std::max(sum, v);
        tag = v;
    }

    inline void reverse() {
        if (this == null) return;
        std::swap(lc, rc);
        std::swap(lSum, rSum);
        rev ^= 1;
    }

    inline void pushDown() {
        if (this == null) return;
        if (tag != INIT_VAL) {
            lc->cover(tag), rc->cover(tag);
            tag = INIT_VAL;
        }
        if (rev) {
            lc->reverse(), rc->reverse();
            rev = 0;
        }
    }
} data[MAXN], *pool[MAXN], *rt;

int poolTop, dataTop;

typedef std::pair<Node *, Node *> Pair;

inline Node *newNode(int key) {
    Node *u;
    if (poolTop) u = pool[poolTop--];
    else u = &data[dataTop++];
    *u = Node(key);
    return u;
}

inline void remove(Node *u) {
    pool[++poolTop] = u;
}

inline Node *build(int *a, int n) {
    static Node *stack[MAXN], *u, *pre;
    int top = 0;
    for (register int i = 1; i <= n; i++) {
        u = newNode(a[i]);
        pre = null;
        while (top && stack[top]->rank > u->rank) {
            stack[top]->maintain();
            pre = stack[top];
            stack[top--] = null;
        }
        if (top) stack[top]->rc = u;
        u->lc = pre;
        stack[++top] = u;
    }
    while (top) stack[top--]->maintain();
    return stack[1];
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

inline void recycle(Node *u) {
    if (u == null) return;
    recycle(u->lc), recycle(u->rc);
    remove(u);
}


int pos, cnt;

inline void insert(int *a) {
    for (register int i = 1; i <= cnt; i++) a[i] = read();
    Node *nr = build(a, cnt);
    Pair t = split(rt, pos);
    rt = merge(merge(t.first, nr), t.second);
}

inline void remove() {
    Pair t1 = split(rt, pos + cnt - 1), t2 = split(t1.first, pos - 1);
    recycle(t2.second);
    rt = merge(t2.first, t1.second);
}

inline void reverse() {
    Pair t1 = split(rt, pos + cnt - 1), t2 = split(t1.first, pos - 1);
    t2.second->reverse();
    rt = merge(merge(t2.first, t2.second), t1.second);
}

inline void makeSame() {
    int v = read();
    Pair t1 = split(rt, pos + cnt - 1), t2 = split(t1.first, pos - 1);
    t2.second->cover(v);
    rt = merge(merge(t2.first, t2.second), t1.second);
}

inline void querySum() {
    Pair t1 = split(rt, pos + cnt - 1), t2 = split(t1.first, pos - 1);
    write(t2.second->sum), writeChar('\n');
    rt = merge(merge(t2.first, t2.second), t1.second);
}

inline void queryMaxSum() {
    write(rt->maxSum), writeChar('\n');
}

void solve() {
    static int n, m, a[MAXN];

    n = read(), m = read();
    for (register int i = 1; i <= n; i++) a[i] = read();
    null = newNode(-INF);
    null->size = null->sum = 0;
    rt = build(a, n);
    char cmd[20];
    for (register int i = 1; i <= m; i++) {
        scanf("%s", cmd);
        if (cmd[2] != 'X') pos = read(), cnt = read();
        switch (cmd[2]) {
            case 'S' :
                insert(a);
                break;
            case 'L' :
                remove();
                break;
            case 'V' :
                reverse();
                break;
            case 'T' :
                querySum();
                break;
            case 'X' :
                queryMaxSum();
                break;
            case 'K' :
                makeSame();
                break;
        }
    }
}

int main() {
    srand(495);
    solve();
    flush();
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=788276&auto=1&height=66"></iframe>