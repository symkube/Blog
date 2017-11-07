---
title: 「模拟测试」小店购物-块状链表
date: 2017-11-07 19:02:48
tags:
  - 数据结构
  - 块状链表
categories:
  - OI
  - 数据结构
  - 块状链表
---
有 $n$ 种物品，个数无限，价值为 $w$，价格为 $p$，要求支持单点修改，询问 $k$ 元能买的最大价值，要求优先购买能买的物品中价值最大的，相同价值选择价格小的。

<!-- more -->

### 题解
由题意，若我们选择的物品为 $(w, p)$，那么我们会购买 $\lfloor \frac k p \rfloor$ 个，依次进行下去，我们只会进行 $O(\log k)$ 次。

考虑如何维护，我们需要快速在价格 $\leq k$ 的物品中找到价值最大的，并且要支持单点修改，我们可以用平衡树/块状链表来维护。

先按照 $p$ 排序，然后建块状链表，每次修改时找到对应块，然后二分修改，再维护一个排序数组，按照 $w$ 排序，这样我们就可以快速得到每一块价值最大的物品，并且可以方便的二分修改，查询时，对于整块直接查询，对于剩余的元素暴力即可。

时间复杂度 $O(n \sqrt{n \log n} \log k)$，实际上速度和平衡树差不多。

### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「SuperOJ 2046」小店购物 07-11-2017
 * 块状链表
 * @author xehoth
 */
#include <bits/stdc++.h>

namespace IO {

inline char read() {
    static const int IN_LEN = 100000;
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
    for (x = 0; isdigit(c); c = read()) x = x * 10 + (c ^ '0');
    iosig ? x = -x : 0;
}

const int OUT_LEN = 100000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
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

struct InputOutputStream {
    ~InputOutputStream() { flush(); }

    template <typename T>
    inline InputOutputStream &operator>>(T &x) {
        read(x);
        return *this;
    }

    template <typename T>
    inline InputOutputStream &operator<<(const T &x) {
        print(x);
        return *this;
    }
} io;
}

namespace {

using IO::io;

const int MAXN = 100010;
const int INF = 0x3f3f3f3f;

struct Node {
    int p, w;

    inline bool operator<(const Node &x) const {
        return w < x.w || (w == x.w && p > x.p);
    }

    inline bool operator==(const Node &x) const { return p == x.p && w == x.w; }

} data[MAXN + 1], tmp[MAXN + 1];

typedef std::vector<Node> Vector;

struct Block {
    Vector num;
    Vector sorted;
};

typedef std::list<Block> BlockList;
typedef BlockList::iterator Iterator;

int blockSize, blockCount;

int n, m;

BlockList d;

inline bool cmp(const Node &a, const Node &b) {
    return a.p < b.p || (a.p == b.p && a.w < b.w);
}

inline void build() {
    blockSize = std::max((sqrt(n) + 1) * 2.5, 1.0);
    blockCount = ceil((double)n / blockSize);
    d.resize(blockCount);
    register Iterator it = d.begin();
    for (register int i = 0, j = 0; i < blockCount; i++, it++) {
        j += blockSize;
        it->num.assign(tmp + j - blockSize, tmp + std::min(j, n));
        it->sorted.assign(tmp + j - blockSize, tmp + std::min(j, n));
        std::sort(it->sorted.begin(), it->sorted.end());
    }
}

inline void split(Iterator cur, int pos) {
    if (pos == cur->num.size()) return;
    Iterator it = cur;
    it = d.insert(++it, Block());
    it->num.assign(cur->num.begin() + pos, cur->num.end());
    cur->num.erase(cur->num.begin() + pos, cur->num.end());
    cur->sorted.erase(cur->sorted.begin() + pos, cur->sorted.end());
    it->sorted.assign(it->num.begin(), it->num.end());
    cur->sorted.assign(cur->num.begin(), cur->num.end());
    std::sort(it->sorted.begin(), it->sorted.end());
    std::sort(cur->sorted.begin(), cur->sorted.end());
}

inline void merge(Iterator cur, Iterator suc) {
    cur->num.insert(cur->num.end(), suc->num.begin(), suc->num.end());
    cur->sorted.insert(cur->sorted.end(), suc->sorted.begin(),
                       suc->sorted.end());
    std::sort(cur->sorted.begin(), cur->sorted.end());
    d.erase(suc);
}

inline void maintain(Iterator cur) {
    for (register Iterator tmp; cur != d.end(); cur++) {
        if (cur->num.size() > blockSize * 2) {
            split(cur, cur->num.size() / 2);
        } else if (cur->num.size() < blockSize / 2) {
            tmp = cur, tmp++;
            if (tmp == d.end())
                break;
            else if (tmp->num.size() + cur->num.size() <= blockSize * 2)
                merge(cur, tmp);
        }
    }
}

inline void modify(int x, int w, int p) {
    Node old = data[x];
    data[x].w = w, data[x].p = p;
    register Iterator it = d.begin(), next;
    for (; it != d.end();) {
        if (cmp(old, it->num.back()) || old == it->num.back()) {
            break;
        }
        ++it;
    }
    it->num.erase(std::lower_bound(it->num.begin(), it->num.end(), old, cmp));
    it->sorted.erase(
        std::lower_bound(it->sorted.begin(), it->sorted.end(), old));
    maintain(it);
    old = data[x];
    it = d.begin();
    for (; it != d.end();) {
        if (cmp(old, it->num.back()) || old == it->num.back()) {
            break;
        }
        ++it;
    }
    if (it == d.end()) --it;
    it->num.insert(std::lower_bound(it->num.begin(), it->num.end(), old, cmp),
                   old);
    it->sorted.insert(
        std::lower_bound(it->sorted.begin(), it->sorted.end(), old), old);
    maintain(it);
}

inline void query(int k) {
    register long long ans = 0;
    register Iterator it;
    register Node ret;
    for (;;) {
        ret.w = 0, ret.p = INF;
        for (it = d.begin(); it != d.end(); ++it) {
            if (k >= it->num.back().p) {
                ret < it->sorted.back() ? (void)(ret = it->sorted.back())
                                        : (void)0;
            } else {
                break;
            }
        }
        if (it != d.end() && k < it->num.back().p) {
            for (Vector::reverse_iterator v = it->sorted.rbegin();
                 v != it->sorted.rend(); v++) {
                if (v->p <= k) {
                    ret < *v ? (void)(ret = *v) : (void)0;
                    break;
                }
            }
        }
        if (ret.p == INF) break;
        ans += (long long)(k / ret.p) * ret.w, k %= ret.p;
    }
    io << ans << '\n';
}

inline void solve() {
    io >> n >> m;
    for (register int i = 1; i <= n; i++) io >> data[i].w >> data[i].p;
    memcpy(tmp, data + 1, sizeof(Node) * n);
    std::sort(tmp, tmp + n, cmp);
    build();
    for (register int cmd, x, w, p, k; m--;) {
        io >> cmd;
        switch (cmd) {
            case 1: {
                io >> x >> w >> p;
                modify(x, w, p);
                break;
            }
            case 2: {
                io >> k;
                query(k);
                break;
            }
        }
    }
}
}

int main() {
    // freopen("sample/1.in", "r", stdin);
    solve();
    return 0;
}
```