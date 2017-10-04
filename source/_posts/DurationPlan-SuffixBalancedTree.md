---
title: 「补档计划」后缀平衡树
date: 2017-06-02 20:15:39
tags:
  - 补档计划
  - 后缀平衡树
categories:
  - OI
  - 补档计划
toc: true
---
后缀平衡树是一种基于重量平衡树的非常有价值的数据结构，它可以**在线**维护 $sa$。
<!-- more -->
### 重量平衡树
常见的重量平衡树有 `SkipList`，`ScapeGoatTree` 和 `Treap`，它们都**不采用**旋转机制，对于一些特殊标记可以很好的处理。
### 序列维护问题
在学习后缀平衡树之前，先来看这样一个题目:

给定一个节点序列，要求支持:
1. 在节点 $x$ 后面插入一个新节点 $y$
2. 询问节点 $a, b$ 的前后关系

#### 题解
##### 解法1
随便写个平衡树比较 $rank$ 就好了，复杂度 $O(m \log n)$。
##### 解法2
仍然使用平衡树来维护这个序列，但我们对每个节点维护一个标号 $v_i$，询问 $a, b$ 的前后关系时只用比较 $v_a, v_b$ 的大小就好了。

考虑如何维护这个标记，我们不妨令每个点对应一个实数区间，让根节点 ($root$) 对应实数区间 $(0, 1)$，对于实数区间 $(l, r)$ 的节点 $i$，它的 $v_i = \frac {l + r} {2}$，其左子树的区间为 $(l, v_i)$，右子树区间为 $O(v_i, r)$，这样比较就可以了。

**正确性:**

我们可以发现这里每个 $v_i$ 的分母是 $2^{depth_i + 1}$，$depth_i$ 表示 $i$ 的深度，所以只要树是平衡的，精度就有保证，用 `double` 即可实现。事实上我们也可以令根区间为 `(LLONG_MIN, LLONG_MAX)`，但使用 `long long` 这样做比 `double` 效率略低。

所以我们在插入的时候，可能要对一整个子树的 $v_i$ 重新计算，所以我们只能使用重量平衡树，否则在旋转时重新计算字数会使复杂度退化为 $O(size(SubTree))$，这样我们就做到了插入 $O(\log n)$，询问 $O(1)$ 的复杂度。

**这个做法也是后缀平衡树的基础**

### 后缀平衡树
#### 定义
给定一个长度为 $n$ 的字符串 $s$，定义 $suffix(i)$ 为其由 $s_i, s_{i + 1}, \cdots, s_n$ 组成的后缀，后缀之间的大小由字典序定义，后缀平衡树就是一个平衡树并维护这些后缀的顺序。
#### 构造
##### 离线
我们先用 `SA-IS` 算法求出 $s$ 的后缀数组，然后这个数组就是后缀平衡树的中序遍历，如果我们使用替罪羊树实现后缀平衡树，那么我们直接从根节点开始 `rebuild` 这个数组就好了，时间复杂度 $O(n)$。

代码见下面 「BZOJ 3682」Phorni 的离线构建初始串版本。
##### 在线
和后缀树与后缀自动机相同，后缀平衡树也支持一个一个添加字符的在线算法，也因此能解决一些单靠后缀数组无法解决的问题，但和后缀树与后缀自动机不同的是，后缀平衡树并不是往后添加字符，而是在字符串开头添加字符。

考虑字符串 $s$，我们在它的开头添加字符 $c$，那么这个操作等价于在后缀平衡树中插入了一个新的后缀 $cS$，如果我们能快速比较两个后缀的大小，那么直接套用平衡树的插入即可。

一种显然的做法是利用 `Hash`，通过二分在 $O(\log n)$ 的时间内求出两后缀的 $lcp$，而更好的比较方法就是上题的解法2，这样我们就可以 $O(1)$ 比较两个后缀的大小。
#### 可持久化
我们使用 `可持久化 Treap` 实现后缀平衡树就能可持久化，时间复杂度不变而空间复杂度变为 $O(n \log n)$。

**注意:**实现可持久化时应用概率进行平衡。
#### 实现
这里采用替罪羊树实现后缀平衡树，若采用 `Treap` 实现也类似。
##### 节点
``` cpp
const int MAXN = 10000;
const double ALPHA = 0.7;

struct Node *null;

struct Node {
    Node *c[2];
    double v;
    int size, id;

    Node(double v = 0, int id = 0) : v(v), size(1), id(id) {
        c[0] = c[1] = null;
    }

    inline void maintain() { size = c[0]->size + c[1]->size + 1; }

    inline bool check() {
        return std::max(c[0]->size, c[1]->size) > size * ALPHA;
    }

    inline void *operator new(size_t);
} pool[MAXN], *cur = pool, *pos[MAXN], *root;

inline void *Node::operator new(size_t) { return cur++; }

inline void init() {
    null = new Node(), null->size = 0;
    pos[0] = root = new Node(0.5);
}
```
##### 比较后缀
``` cpp
char *s;

inline bool cmpSuffix(int a, int b) {
    return s[a] < s[b] || (s[a] == s[b] && pos[a - 1]->v < pos[b - 1]->v);
}
```
##### 插入
通过 `cmp` 比较，其他套用普通替罪羊树插入，下面的 `insert` 是指插入 $s_{id}$。
``` cpp
inline Node **insert(Node *&p, double l, double r, int id) {
    if (p == null) {
        pos[id] = p = new Node((l + r) / 2, id);
        return &null;
    } else {
        p->size++;
        Node **res = cmpSuffix(id, p->id) ? insert(p->c[0], l, (l + r) / 2, id)
                                          : insert(p->c[1], (l + r) / 2, r, id);
        if (p->check()) res = &p, badL = l, badR = r;
        return res;
    }
}

inline void insert(int id) {
    Node **p = ScapeGoatTree::insert(ScapeGoatTree::root, 0, 1, id);
    if (*p != null) ScapeGoatTree::rebuild(*p);
}
```
##### 重构
重构时重新计算 $v_i$，其他无差别。
``` cpp
inline void travel(Node *p, std::vector<Node *> &v) {
    if (p == null) return;
    travel(p->c[0], v), v.push_back(p), travel(p->c[1], v);
}

inline Node *divide(std::vector<Node *> &v, int l, int r, double lv,
                    double rv) {
    if (l >= r) return null;
    register int mid = l + r >> 1;
    Node *p = v[mid];
    p->v = (lv + rv) / 2;
    p->c[0] = divide(v, l, mid, lv, (lv + rv) / 2);
    p->c[1] = divide(v, mid + 1, r, (lv + rv) / 2, rv);
    p->maintain();
    return p;
}

inline void rebuild(Node *&p) {
    static std::vector<Node *> v;
    v.clear(), travel(p, v), p = divide(v, 0, v.size(), badL, badR);
}
```
##### 查询 sa
查询 $sa$，其实就是求第 $k$ 大，由于平衡树中含有一个最小的 `0 串`，这里应求 $k + 1$ 大。

**注意:**这里已默认是往后加字符，默认初始串 $s$ 已反转。
``` cpp
inline int select(int k) {
    for (Node *p = root; p != null;) {
        if (p->c[0]->size + 1 == k)
            return p->id;
        else if (p->c[0]->size >= k)
            p = p->c[0];
        else
            k -= p->c[0]->size + 1, p = p->c[1];
    }
}

inline int getSuffix(int id) { return len - ScapeGoatTree::select(id + 1) + 1; }
```
##### 查询 rank
同理，询问 $rank$ 就是求平衡树的 $rank$，注意减去 `0 串` 的 `size = 2`。

**注意:**这里已默认是往后加字符，默认初始串 $s$ 已反转。
``` cpp
inline int rank(int id) {
    register int ans = 1;
    for (Node *p = root; p != null;) {
        if (cmpSuffix(id, p->id))
            p = p->c[0];
        else
            ans += p->c[0]->size + 1, p = p->c[1];
    }
    return ans;
}

inline int getRank(int id) { return ScapeGoatTree::rank(len - id + 1) - 2; }
```
##### 询问 lcp
求两个后缀的 $lcp$，可以利用 `Hash`，由于 `Hash` 值可以在线维护，我们可以利用二分在 $O(\log n)$ 的时间内实现。

- [ ] 询问 lcp，待填坑。

##### 删除
- [ ] 惰性删除，待填坑。

### 例题
#### 「BZOJ 3682」Phorni
##### 链接
[BZOJ 3682](http://www.lydsy.com/JudgeOnline/problem.php?id=3682)
##### 题解
此题题意如下:
给定一个有 $n$ 个元素的序列 $P$ 和一个初始长度为 $len$ 的字符串，要求支持 $m$ 次以下操作:
1. 在字符串前面加入一个字符
2. 修改 $P$ 中一个元素的值 
3. 询问对于所有 $i \in [l, r], S_{L - P[i] + 1} \cdots S_L$ 字典序最小的 $i$(有多个则输出最小的 $i$，$L$ 是当前字符串长度)

首先要考虑维护每个后缀的排名，支持在线插入，这个是后缀数组,后缀自动机难以实现的，所以考虑使用后缀平衡树，然后用线段树维护P数组区间最小的后缀，由于只有插入操作，刚刚执行插入一个新后缀的操作后，$P$ 数组没有一个元素和这个后缀对应，所以不需要修改线段树中的值，只需要对对应区间更新就好了。

时间复杂度 $O(m \log n)$
##### 源码
**在线构造**
``` cpp
/*******************************************************************************
 * Copyright (c) 2016-2017, xehoth
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name xehoth, nor the names of its contributors may be used
 *       to endorse or promote products derived from this software without
 *       specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY XEHOTH AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL XEHOTH AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 ******************************************************************************/
#include <bits/stdc++.h>
/**
 * 「BZOJ 3682」Phorni 02-06-2017
 * 后缀平衡树
 * @author xehoth
 */
namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template <typename T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read()) x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

inline int read(char *buf) {
    register int s = 0;
    register char c;
    while (c = read(), isspace(c) && c != -1)
        ;
    if (c == -1) {
        *buf = 0;
        return -1;
    }
    do
        buf[s++] = c;
    while (c = read(), !isspace(c) && c != -1);
    buf[s] = 0;
    return s;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, oh - obuf, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template <typename T>
inline void print(T x) {
    static int buf[30], cnt;
    if (x == 0) {
        print('0');
    } else {
        x < 0 ? (print('-'), x = -x) : 0;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void flush() { fwrite(obuf, 1, oh - obuf, stdout); }
}

namespace SuffixBalancedTree {

namespace ScapeGoatTree {

const int MAXN = 800005;
const double ALPHA = 0.7;

struct Node *null;

struct Node {
    Node *c[2];
    double v;
    int size, id;

    Node(double v = 0, int id = 0) : v(v), size(1), id(id) {
        c[0] = c[1] = null;
    }

    inline void maintain() { size = c[0]->size + c[1]->size + 1; }

    inline bool check() {
        return std::max(c[0]->size, c[1]->size) > size * ALPHA;
    }

    inline void *operator new(size_t);
} pool[MAXN], *cur = pool, *pos[MAXN], *root;

inline void *Node::operator new(size_t) { return cur++; }

inline void init() {
    null = new Node(), null->size = 0;
    pos[0] = root = new Node(0.5);
}

double badL, badR;
char *s;

inline Node **insert(Node *&p, double l, double r, int id) {
    if (p == null) {
        pos[id] = p = new Node((l + r) / 2, id);
        return &null;
    } else {
        p->size++;
        Node **res;
        if (s[id] < s[p->id] ||
            (s[id] == s[p->id] && pos[id - 1]->v < pos[p->id - 1]->v))
            res = insert(p->c[0], l, (l + r) / 2, id);
        else
            res = insert(p->c[1], (l + r) / 2, r, id);
        if (p->check()) res = &p, badL = l, badR = r;
        return res;
    }
}

inline void travel(Node *p, std::vector<Node *> &v) {
    if (p == null) return;
    travel(p->c[0], v);
    v.push_back(p);
    travel(p->c[1], v);
}

inline Node *divide(std::vector<Node *> &v, int l, int r, double lv,
                    double rv) {
    if (l >= r) return null;
    register int mid = l + r >> 1;
    Node *p = v[mid];
    p->v = (lv + rv) / 2;
    p->c[0] = divide(v, l, mid, lv, (lv + rv) / 2);
    p->c[1] = divide(v, mid + 1, r, (lv + rv) / 2, rv);
    p->maintain();
    return p;
}

inline void rebuild(Node *&p) {
    static std::vector<Node *> v;
    v.clear(), travel(p, v), p = divide(v, 0, v.size(), badL, badR);
}
}

inline void insert(int id) {
    using namespace ScapeGoatTree;
    Node **p = insert(root, 0, 1, id);
    if (*p != null) rebuild(*p);
}

inline void init(char *s) { ScapeGoatTree::s = s, ScapeGoatTree::init(); }
}

namespace SegmentTree {

using SuffixBalancedTree::ScapeGoatTree::pos;

const int MAXN = 800005;

int in[MAXN], d[MAXN * 8], M;

inline int min(int a, int b) {
    return pos[in[a]]->v != pos[in[b]]->v
               ? (pos[in[a]]->v > pos[in[b]]->v ? b : a)
               : std::min(a, b);
}

inline void maintain(int x) { d[x] = min(d[x << 1], d[x << 1 | 1]); }

inline void build(const int n) {
    for (M = 1; M < n + 4; M <<= 1)
        ;
    for (register int i = 1; i <= n; i++) d[i + M] = i;
    for (register int i = M - 1; i; i--) maintain(i);
}

inline void modify(int x) {
    for (x = x + M >> 1; x; x >>= 1) maintain(x);
}

inline int query(int s, int t) {
    register int ans = d[M + s];
    for (s = s + M - 1, t = t + M + 1; s ^ t ^ 1; s >>= 1, t >>= 1) {
        if (~s & 1) ans = min(ans, d[s ^ 1]);
        if (t & 1) ans = min(ans, d[t ^ 1]);
    }
    return ans;
}

inline void solve() {
    using namespace IO;
    register int n, m, len, code;
    static char s[MAXN];
    read(n), read(m), read(len), read(code), read(s + 1);
    std::reverse(s + 1, s + len + 1);
    SuffixBalancedTree::init(s);
    for (register int i = 1; i <= len; i++) SuffixBalancedTree::insert(i);
    for (register int i = 1; i <= n; i++) read(in[i]);
    build(n);
    static char opt[5];
    register int ans = 0;
    for (register int i = 1; i <= m; i++) {
        read(opt);
        if (opt[0] == 'I') {
            int c;
            read(c);
            code ? (c ^= ans) : 0;
            s[++len] = c + 'a';
            SuffixBalancedTree::insert(len);
        } else if (opt[0] == 'C') {
            register int x, to;
            read(x), read(to), in[x] = to;
            modify(x);
        } else {
            register int l, r;
            read(l), read(r);
            ans = query(l, r);
            print(ans), print('\n');
        }
    }
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
    freopen("out.out", "w", stdout);
#endif
    SegmentTree::solve();
    IO::flush();
    return 0;
}
```
**离线构造初始串**
``` cpp
/*******************************************************************************
 * Copyright (c) 2016-2017, xehoth
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name xehoth, nor the names of its contributors may be used
 *       to endorse or promote products derived from this software without
 *       specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY XEHOTH AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL XEHOTH AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 ******************************************************************************/
#include <bits/stdc++.h>
/**
 * 「BZOJ 3682」Phorni 02-06-2017
 * 后缀平衡树
 * @author xehoth
 */
namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template <typename T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read()) x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

inline int read(char *buf) {
    register int s = 0;
    register char c;
    while (c = read(), isspace(c) && c != -1)
        ;
    if (c == -1) {
        *buf = 0;
        return -1;
    }
    do
        buf[s++] = c;
    while (c = read(), !isspace(c) && c != -1);
    buf[s] = 0;
    return s;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, oh - obuf, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template <typename T>
inline void print(T x) {
    static int buf[30], cnt;
    if (x == 0) {
        print('0');
    } else {
        x < 0 ? (print('-'), x = -x) : 0;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void flush() { fwrite(obuf, 1, oh - obuf, stdout); }
}

namespace SuffixArray {

const int MAXN = 100100;

inline bool islms(const int i, const bool *t) {
    return i > 0 && t[i] && !t[i - 1];
}

template <typename T>
inline void sort(T s, int *sa, const int len, const int sz, const int sigma,
                 bool *t, int *b, int *cb, int *p) {
    memset(b, 0, sizeof(int) * sigma);
    memset(sa, -1, sizeof(int) * len);
    for (register int i = 0; i < len; i++) b[s[i]]++;
    cb[0] = b[0];
    for (register int i = 1; i < sigma; i++) cb[i] = cb[i - 1] + b[i];
    for (register int i = sz - 1; i >= 0; i--) sa[--cb[s[p[i]]]] = p[i];
    for (register int i = 1; i < sigma; i++) cb[i] = cb[i - 1] + b[i - 1];
    for (register int i = 0; i < len; i++)
        if (sa[i] > 0 && !t[sa[i] - 1]) sa[cb[s[sa[i] - 1]]++] = sa[i] - 1;
    cb[0] = b[0];
    for (register int i = 1; i < sigma; i++) cb[i] = cb[i - 1] + b[i];
    for (register int i = len - 1; i >= 0; i--)
        if (sa[i] > 0 && t[sa[i] - 1]) sa[--cb[s[sa[i] - 1]]] = sa[i] - 1;
}

template <typename T>
inline void sais(T s, int *sa, const int len, bool *t, int *b, int *b1,
                 const int sigma) {
    register int i, j, x, p = -1, sz = 0, cnt = 0, *cb = b + sigma;
    for (t[len - 1] = 1, i = len - 2; i >= 0; i--)
        t[i] = s[i] < s[i + 1] || (s[i] == s[i + 1] && t[i + 1]);
    for (i = 1; i < len; i++)
        if (t[i] && !t[i - 1]) b1[sz++] = i;
    sort(s, sa, len, sz, sigma, t, b, cb, b1);
    for (i = sz = 0; i < len; i++)
        if (islms(sa[i], t)) sa[sz++] = sa[i];
    for (i = sz; i < len; i++) sa[i] = -1;
    for (i = 0; i < sz; i++) {
        for (x = sa[i], j = 0; j < len; j++) {
            if (p == -1 || s[x + j] != s[p + j] || t[x + j] != t[p + j]) {
                p = x, cnt++;
                break;
            } else if (j > 0 && (islms(x + j, t) || islms(p + j, t))) {
                break;
            }
        }
        sa[sz + (x >>= 1)] = cnt - 1;
    }
    for (i = j = len - 1; i >= sz; i--)
        if (sa[i] >= 0) sa[j--] = sa[i];
    register int *s1 = sa + len - sz, *b2 = b1 + sz;
    if (cnt < sz)
        sais(s1, sa, sz, t + len, b, b1 + sz, cnt);
    else
        for (i = 0; i < sz; i++) sa[s1[i]] = i;
    for (i = 0; i < sz; i++) b2[i] = b1[sa[i]];
    sort(s, sa, len, sz, sigma, t, b, cb, b2);
}

struct SuffixArray {
    int sa[MAXN], rk[MAXN], ht[MAXN], n;
    bool t[MAXN << 1];
    char s[MAXN];

    inline void build(const int sigma) {
        s[n] = 0, sais(s, sa, n + 1, t, ht, rk, sigma);
    }

    inline char &operator[](const int i) { return s[i]; }
} suffixArray;
}

namespace SuffixBalancedTree {

namespace ScapeGoatTree {

const int MAXN = 800005;
const double ALPHA = 0.7;

struct Node *null;

struct Node {
    Node *c[2];
    double v;
    int size, id;

    Node(double v = 0, int id = 0) : v(v), size(1), id(id) {
        c[0] = c[1] = null;
    }

    inline void maintain() { size = c[0]->size + c[1]->size + 1; }

    inline bool check() {
        return std::max(c[0]->size, c[1]->size) > size * ALPHA;
    }

    inline void *operator new(size_t);
} pool[MAXN], *cur = pool, *pos[MAXN], *root;

inline void *Node::operator new(size_t) { return cur++; }

inline void init() {
    null = new Node(), null->size = 0;
    pos[0] = root = new Node(0.5);
}

double badL, badR;
char *s;

inline Node **insert(Node *&p, double l, double r, int id) {
    if (p == null) {
        pos[id] = p = new Node((l + r) / 2, id);
        return &null;
    } else {
        p->size++;
        Node **res;
        if (s[id] < s[p->id] ||
            (s[id] == s[p->id] && pos[id - 1]->v < pos[p->id - 1]->v))
            res = insert(p->c[0], l, (l + r) / 2, id);
        else
            res = insert(p->c[1], (l + r) / 2, r, id);
        if (p->check()) res = &p, badL = l, badR = r;
        return res;
    }
}

inline void travel(Node *p, std::vector<Node *> &v) {
    if (p == null) return;
    travel(p->c[0], v);
    v.push_back(p);
    travel(p->c[1], v);
}

inline Node *divide(std::vector<Node *> &v, int l, int r, double lv,
                    double rv) {
    if (l >= r) return null;
    register int mid = l + r >> 1;
    Node *p = v[mid];
    p->v = (lv + rv) / 2;
    p->c[0] = divide(v, l, mid, lv, (lv + rv) / 2);
    p->c[1] = divide(v, mid + 1, r, (lv + rv) / 2, rv);
    p->maintain();
    return p;
}

inline void rebuild(Node *&p) {
    static std::vector<Node *> v;
    v.clear(), travel(p, v), p = divide(v, 0, v.size(), badL, badR);
}
}

inline void insert(int id) {
    using namespace ScapeGoatTree;
    Node **p = insert(root, 0, 1, id);
    if (*p != null) rebuild(*p);
}

inline void init(char *s) { ScapeGoatTree::s = s, ScapeGoatTree::init(); }

inline void build(int *sa, const int n) {
    using namespace ScapeGoatTree;
    static std::vector<Node *> v;
    v.resize(n + 1);
    v[0] = root;
    for (register int i = 1; i <= n; i++)
        pos[n - sa[i]] = v[i] = new Node(0, n - sa[i]);
    root = divide(v, 0, v.size(), 0, 1);
}
}

namespace SegmentTree {

using SuffixBalancedTree::ScapeGoatTree::pos;

const int MAXN = 800005;

int in[MAXN], d[MAXN * 8], M;

inline int min(int a, int b) {
    return pos[in[a]]->v != pos[in[b]]->v
               ? (pos[in[a]]->v > pos[in[b]]->v ? b : a)
               : std::min(a, b);
}

inline void maintain(int x) { d[x] = min(d[x << 1], d[x << 1 | 1]); }

inline void build(const int n) {
    for (M = 1; M < n + 4; M <<= 1)
        ;
    for (register int i = 1; i <= n; i++) d[i + M] = i;
    for (register int i = M - 1; i; i--) maintain(i);
}

inline void modify(int x) {
    for (x = x + M >> 1; x; x >>= 1) maintain(x);
}

inline int query(int s, int t) {
    register int ans = d[M + s];
    for (s = s + M - 1, t = t + M + 1; s ^ t ^ 1; s >>= 1, t >>= 1) {
        if (~s & 1) ans = min(ans, d[s ^ 1]);
        if (t & 1) ans = min(ans, d[t ^ 1]);
    }
    return ans;
}

inline void solve() {
    using namespace IO;
    register int n, m, len, code;
    static char s[MAXN];
    read(n), read(m), read(len), read(code), read(s + 1);
    std::reverse(s + 1, s + len + 1);
    SuffixBalancedTree::init(s);
    std::reverse_copy(s + 1, s + len + 1, SuffixArray::suffixArray.s);
    SuffixArray::suffixArray.n = len;
    SuffixArray::suffixArray.build(128);
    SuffixBalancedTree::build(SuffixArray::suffixArray.sa, len);
    for (register int i = 1; i <= n; i++) read(in[i]);
    build(n);
    static char opt[5];
    register int ans = 0;
    for (register int i = 1; i <= m; i++) {
        read(opt);
        if (opt[0] == 'I') {
            int c;
            read(c);
            code ? (c ^= ans) : 0;
            s[++len] = c + 'a';
            SuffixBalancedTree::insert(len);
        } else if (opt[0] == 'C') {
            register int x, to;
            read(x), read(to), in[x] = to;
            modify(x);
        } else {
            register int l, r;
            read(l), read(r);
            ans = query(l, r);
            print(ans), print('\n');
        }
    }
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
    freopen("out.out", "w", stdout);
#endif
    SegmentTree::solve();
    IO::flush();
    return 0;
}
```
#### 后缀排序
##### 链接
[UOJ 35](http://uoj.ac/problem/35)
##### 题解
~~强行~~利用后缀平衡树~~在线算法~~求后缀数组。

将原串反转，插入后中序遍历就是后缀数组。
##### 源码
``` cpp
/*******************************************************************************
 * Copyright (c) 2016-2017, xehoth
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name xehoth, nor the names of its contributors may be used
 *       to endorse or promote products derived from this software without
 *       specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY XEHOTH AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL XEHOTH AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 ******************************************************************************/
#include <bits/stdc++.h>
/**
 * 后缀平衡树
 * @author xehoth
 */
namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template <typename T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read()) x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

inline int read(char *buf) {
    register int s = 0;
    register char c;
    while (c = read(), isspace(c) && c != -1)
        ;
    if (c == -1) {
        *buf = 0;
        return -1;
    }
    do
        buf[s++] = c;
    while (c = read(), !isspace(c) && c != -1);
    buf[s] = 0;
    return s;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, oh - obuf, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template <typename T>
inline void print(T x) {
    static int buf[30], cnt;
    if (x == 0) {
        print('0');
    } else {
        x < 0 ? (print('-'), x = -x) : 0;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void flush() { fwrite(obuf, 1, oh - obuf, stdout); }
}

namespace SuffixBalancedTree {

const int MAXN = 100010;

namespace ScapeGoatTree {

const double ALPHA = 0.7;

struct Node *null;

struct Node {
    Node *c[2];
    double v;
    int size, id;

    Node(double v = 0, int id = 0) : v(v), id(id), size(1) {
        c[0] = c[1] = null;
    }

    inline void maintain() { size = c[0]->size + c[1]->size + 1; }

    inline bool check() {
        return std::max(c[0]->size, c[1]->size) > size * ALPHA;
    }

    inline void *operator new(size_t);
} pool[MAXN], *cur = pool, *root, *pos[MAXN];

inline void *Node::operator new(size_t) { return cur++; }

inline void init() {
    null = new Node(), null->size = 0;
    pos[0] = root = new Node(0.5);
}

double badL, badR;
char *s;

inline bool cmpSuffix(int a, int b) {
    return s[a] < s[b] || (s[a] == s[b] && pos[a - 1]->v < pos[b - 1]->v);
}

inline Node **insert(Node *&p, double l, double r, int id) {
    if (p == null) {
        pos[id] = p = new Node((l + r) / 2, id);
        return &null;
    } else {
        p->size++;
        Node **res = cmpSuffix(id, p->id) ? insert(p->c[0], l, (l + r) / 2, id)
                                          : insert(p->c[1], (l + r) / 2, r, id);
        if (p->check()) res = &p, badL = l, badR = r;
        return res;
    }
}

inline void travel(Node *p, std::vector<Node *> &v) {
    if (p == null) return;
    travel(p->c[0], v), v.push_back(p), travel(p->c[1], v);
}

inline Node *divide(std::vector<Node *> &v, int l, int r, double lv,
                    double rv) {
    if (l >= r) return null;
    register int mid = l + r >> 1;
    Node *p = v[mid];
    p->v = (lv + rv) / 2;
    p->c[0] = divide(v, l, mid, lv, (lv + rv) / 2);
    p->c[1] = divide(v, mid + 1, r, (lv + rv) / 2, rv);
    p->maintain();
    return p;
}

inline void rebuild(Node *&p) {
    static std::vector<Node *> v;
    v.clear(), travel(p, v), p = divide(v, 0, v.size(), badL, badR);
}

inline int select(int k) {
    for (Node *p = root; p != null;) {
        if (p->c[0]->size + 1 == k)
            return p->id;
        else if (p->c[0]->size >= k)
            p = p->c[0];
        else
            k -= p->c[0]->size + 1, p = p->c[1];
    }
}

inline int rank(int id) {
    register int ans = 1;
    for (Node *p = root; p != null;) {
        if (cmpSuffix(id, p->id))
            p = p->c[0];
        else
            ans += p->c[0]->size + 1, p = p->c[1];
    }
    return ans;
}
}

using ScapeGoatTree::Node;
using ScapeGoatTree::pos;
using ScapeGoatTree::null;

inline void insert(int id) {
    Node **p = ScapeGoatTree::insert(ScapeGoatTree::root, 0, 1, id);
    if (*p != null) ScapeGoatTree::rebuild(*p);
}

inline void init(char *s) { ScapeGoatTree::s = s, ScapeGoatTree::init(); }

int len;

inline int getSuffix(int id) { return len - ScapeGoatTree::select(id + 1) + 1; }

inline int getRank(int id) { return ScapeGoatTree::rank(len - id + 1) - 2; }

inline void fetch(ScapeGoatTree::Node *p, std::vector<int> &sa) {
    if (p == null) return;
    fetch(p->c[0], sa), sa.push_back(len - p->id + 1), fetch(p->c[1], sa);
}

template <typename T>
inline void getHeight(T s, const int n, int *sa, int *rk, int *ht) {
    for (register int i = 1; i <= n; i++) rk[sa[i] - 1] = i;
    for (register int i = 0, j = 0, k = 0; i < n; ht[rk[i++]] = k)
        for (k ? k-- : 0, j = sa[rk[i] - 1] - 1; s[i + k] == s[j + k]; k++)
            ;
}

inline void solve() {
    using namespace IO;
    register int n;
    static char s[MAXN];
    len = n = read(s + 1), std::reverse(s + 1, s + n + 1), init(s);
    for (register int i = 1; i <= n; i++) insert(i);
    static std::vector<int> vc;
    vc.reserve(n + 1);
    static int ht[MAXN], rk[MAXN];
    fetch(ScapeGoatTree::root, vc);
    register int *sa = vc.data();
    static char tmp[MAXN];
    std::reverse_copy(s + 1, s + n + 1, tmp + 1);
    getHeight(tmp + 1, n, sa, rk, ht);
    for (register int i = 1; i <= n; i++) print(sa[i]), print(' ');
    print('\n');
    for (register int i = 2; i <= n; i++) print(ht[i]), print(' ');
    print('\n');
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    SuffixBalancedTree::solve();
    IO::flush();
    return 0;
}
```

