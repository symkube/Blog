---
title: 「补档计划」ZKW 线段树
date: 2017-04-14 23:17:14
tags:
  - 补档计划
categories:
  - OI
  - 补档计划
---
听说此题又卡线段树，没事我们还有 ZKW 线段树......
ZKW 线段树在代码长度(不打标记时)和时间上较普通线段树都有较大优势，在 `RMQ` 甚至会出现~~喜闻乐见~~的 $O(\text{ log }n)$ 踩 $O(\text{ log log }n)$ 甚至 $O(1)$ 算法。
这里记录 ZKW 线段树的基本操作以及较为通用的区间操作(非差分而是标记下传)
<!-- more -->
### 定义
ZKW 线段树的存储方式为堆式存储。
```
        1
   2         3  
4     5   6     7
```
写成二进制
```
        1
   10       11  
100  101 110  111
```
一眼看去 Trie 树? 

ZKW 线段树的每个节点存的是以这个节点为前缀的所有节点和。

例：$1$ 中存的是所有四个以 $1$ 开头的和。

从 $100$ 到 $111$ 就正好是原数组。
### 一些性质
- 一个节点的父节点是这个数左移 $1$，这个位运算就是低位舍弃，所有数字左移一位
- 一个节点的子节点是这个数右移 $1$，是左节点，右移 $1 + 1$ 是右节点
- 同一层的节点是依次递增的，第 $n$ 层有 $2^{n} - 1$ 个节点
- 最后一层有多少节点，值域就是多少

### build
由于在将闭区间转化成开区间的时候可能越界 $1$

理论上能放 $[0, 2^n)$ 的树

其实只能查询 $[1, 2^{n} - 2]$ 的范围

假设空间允许，为了代码方便直接开大一倍就好了....

倒叙访问，每个节点访问的时候它的子节点已经处理过了。
``` cpp
inline void build(const int n, const int *a) {
    for (M = 1; M < n + 2; M <<= 1);
    for (register int i = 1; i <= n; i++) d[M + i].sum = a[i];
    for (register int i = M - 1; i; i--) maintain(i);
}
```
### 单点修改
``` cpp
inline void modify(int k, int v) {
    d[k += M] = v;
    while (k) maintain(k >>= 1);
}
```
其实并不需要每个父亲都由左右儿子更新，我们记录两个指针，沿着一条链往上更新就好了。

为了方便编码，直接由左右儿子更新显然是更好写的。
### 查询
以区间和为例。
``` cpp
inline int query(int s, int t) {
    register int ret = 0;
    /*先转化为开区间，s ^ t ^ 1 其实就是两个节点的 fa 不同，这是边界*/
    for (s = s + M - 1, t = t + M + 1; s ^ t ^ 1; s >>= 1, t >>= 1) {
        (~s & 1) ? ret += d[s ^ 1].sum : 0;
        (t & 1) ? ret += d[t ^ 1].sum : 0;
    }
    return ret;
}
```
既然清楚了边界和更新方法，所以我们其实是可以用指针动态开点写 ZKW 线段树的。
### 区间修改
ZKW 所说的标记永久化并不能很好的处理许多其他问题，这里使用标记永久化。
#### 朴素方法
``` cpp
/*更新一条链*/
inline void update(int k) {
    static int st[25], top;
    for (top = 0; k; k >>= 1) st[++top] = k;
    while (top--) pushDown(st[top]);
}

inline void cover(int k, int v) {
    d[k].sum += v, d[k].add += v;
}

inline void modify(int s, int t, int v) {
    register int l = 0, r = 0;
    /*修改前把标记一次性下传*/
    for (update(s = s + M - 1), update(t = t + M + 1); s ^ t ^ 1; s >>= 1, t >>= 1) {
        if (~s & 1) {
            cover(s ^ 1, v);
        }
        if (t & 1) {
            cover(t ^ 1, v);
        }
    }
    /*一次性更新回去*/
    for (l >>= 1; l; l >>= 1) maintain(l);
    for (r >>= 1; r; r >>= 1) maintain(r);
}

inline int query(int s, int t) {
    register int ret = 0;
    /*仍然把标记一次性下传*/
    for (update(s = s + M - 1), update(t = t + M + 1); s ^ t ^ 1; s >>= 1, t >>= 1) {
        (~s & 1) ? ret += d[s ^ 1].sum : 0;
        (t & 1) ? ret += d[t ^ 1].sum : 0;
    }
    return ret;
}
```
#### 常数优化
我们发现其实并不需要一次性把标记下传，用到的时候再下传
``` cpp
inline int query(int s, int t) {
    register int l = 0, r = 0, ret = 0;
    for (s = s + M - 1, t = t + M + 1; s ^ t ^ 1; s >>= 1, t >>= 1) {
        if (~s & 1) {
            /* 找到左侧第一个被询问的点进行 update 操作 */
            l ? 0 : (update(l = s ^ 1), 0);
            ret += d[s ^ 1].sum;
        }
        if (t & 1) {
            /* 找到右侧第一个被询问的点进行 update 操作 */
            r ? 0 : (update(r = t ^ 1), 0);
            ret += d[t ^ 1].sum;
        }
    }
    return ret;
}

inline void modify(int s, int t, int v) {
    register int l = 0, r = 0;
    for (s = s + M - 1, t = t + M + 1; s ^ t ^ 1; s >>= 1, t >>= 1) {
        if (~s & 1) {
            /* 找到左侧第一个被询问的点进行 update 操作 */
            l ? 0 : (update(l = s ^ 1), 0);
            cover(s ^ 1, v);
        }
        if (t & 1) {
            /* 找到右侧第一个被询问的点进行 update 操作 */
            r ? 0 : (update(r = t ^ 1), 0);
            cover(t ^ 1, v);
        }
    }
    for (l >>= 1; l; l >>= 1) maintain(l);
    for (r >>= 1; r; r >>= 1) maintain(r);
}
```
### 标记上传
#### 扫描线
扫描线就需要标记上传了。

我们使用 ZKW 线段树维护扫描线。
``` cpp
/* 我们直接跳 fa 更新不就好了... */
inline void update(int k) {
    for (; k; k >>= 1) pushUp(k);
}
```
#### 例题
给出 $n$ 个矩形左下角和右上角的坐标，求它们并的面积。
``` cpp
/*
 * created by xehoth on 15-04-2017
 */
#include <bits/stdc++.h>
#include <tr1/unordered_map>

inline char read() {
    static const int IN_LEN = 10000000;
    static char buf[IN_LEN], *s, *t;
    if (s == t) {
        t = (s = buf) + fread(buf, 1, IN_LEN, stdin);
        if (s == t) return -1;
    }
    return *s++;
}

template<class T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        if (c == '-') iosig = true;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    if (iosig) x = -x;
}

namespace SegmentTree {

const int MAXN = 200010;

#define long long long

int x[MAXN], size;
std::tr1::unordered_map<int, int> pos;

struct Segment {
    int x1, x2, h;
    int type;
    Segment() {}
    Segment(int x1, int x2, int h, int type): x1(x1), x2(x2), h(h), type(type) {}
    inline friend bool operator<(const Segment &a, const Segment &b) {
        return a.h < b.h;
    }
} a[MAXN];

struct Node {
    int cnt, sum, len;
} d[MAXN << 2];

int M;

inline void build(const int n) {
    for (M = 1; M < n + 2; M <<= 1);
    for (register int i = 1; i <= n; i++) d[i + M].len = x[i] - x[i - 1];
    for (register int i = M - 1; i; i--) d[i].len = d[i << 1].len + d[i << 1 | 1].len;
}

inline void pushUp(int k) {
    d[k].sum = d[k].cnt ? d[k].len : (k >= M ? 0 : d[k << 1].sum + d[k << 1 | 1].sum);
}

inline void update(int k) {
    for (; k; k >>= 1) pushUp(k);
}

inline void insert(int s, int t, int v) {
    register int l = 0, r = 0;
    for (l = s = s + M - 1, r = t = t + M + 1; s ^ t ^ 1; s >>= 1, t >>= 1) {
        (~s & 1) ? (d[s ^ 1].cnt += v, pushUp(s ^ 1), 0) : 0;
        (t & 1) ? (d[t ^ 1].cnt += v, pushUp(t ^ 1), 0) : 0; 
    }
    for (; l; l >>= 1) pushUp(l);
    for (; r; r >>= 1) pushUp(r);
}

inline void solve() {
    register int n;
    read(n);
    for (register int i = 1, x1, x2, y1, y2; i <= 2 * n; i += 2) {
        read(x1), read(y1), read(x2), read(y2);
        x[i] = x1, x[i + 1] = x2;
        a[i] = Segment(x1, x2, y1, 1);
        a[i + 1] = Segment(x1, x2, y2, -1);
    }
    std::sort(a + 1, a + 2 * n + 1);
    std::sort(x + 1, x + 2 * n + 1);
    size = std::unique(x + 1, x + 2 * n + 1) - (x + 1);
    for (register int i = 1; i <= size; i++) pos[x[i]] = i;
    build(size);
    long ans = 0;
    a[0].h = a[1].h;
    for (register int i = 1; i <= 2 * n; i++) {
        ans += ((long)a[i].h - a[i - 1].h) * d[1].sum;
        insert(pos[a[i].x1] + 1, pos[a[i].x2], a[i].type);
    }
    std::cout << ans;
}
}

int main() {
    SegmentTree::solve();   
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=744376&auto=1&height=66"></iframe>