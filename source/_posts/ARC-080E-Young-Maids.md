---
title: 「ARC 080E」Young Maids-线段树 + 堆
date: 2017-08-26 11:08:17
tags:
  - 堆
  - 线段树
categories:
  - OI
  - 数据结构
  - 线段树
---
给出一个 $1 \sim n$ 的排列，{% raw %}$p_0, p_2, \cdots, p_{n - 1}${% endraw %}，每次从中选相邻两数删去，加入 $q$ 的前面，求最小字典序的 $q$。

<!-- more -->
### 链接
[ARC 080E](http://arc080.contest.atcoder.jp/tasks/arc080_c)

### 题解
首先 $q_0$ 显然必须是最小的，并且它一定在 $p$ 中的偶数位置，我们直接在 $p$ 中的偶数位置找到最小的 $p_i$ 作为 $q_0$，对于 $q_1$，只能是 $p$ 中的奇数位置且在 $p_i$ 后，设其为 $p_j$。

那么 $p$ 现在最多可以被分成三段 $[0, i), [i + 1, j), [j + 1, n)$，对于 $q_2$，它一定在这三段中，并且它所在位置的奇偶性与第一个元素相同，同理 $q_3$ 也像 $q_1$ 一样找，这样我们就有了一个 $O(n ^ 2)$ 的做法。

考虑用线段树做 rmq，用堆来维护区间 $[l, r), l, \leq i < r, i \equiv l \ \ (\text{mod 2})$ 中最小的 $p_i$。

时间复杂度 $O(n \log n)$。

### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「ARC 080E」Young Maids 26-08-2017
 * 线段树 + 堆
 * @author xehoth
 */
#include <bits/stdc++.h>

namespace Task {

const int MAXN = 200000;

int M;

inline void init(const int n) {
    for (M = 1; M < n + 2; M <<= 1)
        ;
}

struct SegmentTree {
    int d[MAXN * 4];

    inline void maintain(int k) { d[k] = std::min(d[k << 1], d[k << 1 | 1]); }

    inline void build() {
        for (register int i = M - 1; i; i--) maintain(i);
    }

    inline int query(int s, int t) const {
        register int ret = INT_MAX;
        for (s = s + M - 1, t = t + M + 1; s ^ t ^ 1; s >>= 1, t >>= 1) {
            (~s & 1) ? ret = std::min(ret, d[s ^ 1]) : 0;
            (t & 1) ? ret = std::min(ret, d[t ^ 1]) : 0;
        }
        return ret;
    }
};

SegmentTree even, odd;

int a[MAXN + 1], pos[MAXN + 1];

struct Node {
    int l, r, x;

    Node(int l, int r, int x) : l(l), r(r), x(x) {}

    inline bool operator<(const Node &b) const { return x > b.x; }
};

template <typename T>
class PriorityQueue : public std::priority_queue<T> {
   private:
#define super std::priority_queue<T>
   public:
    inline void reserve(const int n) { super::c.reserve(n); }
#undef super
};

inline void initRmq(const int n, const int *a) {
    init(n);
    for (register int i = 1; i <= n; i++) {
        if (i & 1) {
            odd.d[M + i] = a[i], even.d[M + i] = INT_MAX;
        } else {
            even.d[M + i] = a[i], odd.d[M + i] = INT_MAX;
        }
    }
    even.build(), odd.build();
}

inline void solve() {
    std::ios::sync_with_stdio(false), std::cin.tie(NULL), std::cout.tie(NULL);
    register int n;
    std::cin >> n;
    for (register int i = 1; i <= n; i++) std::cin >> a[i], pos[a[i]] = i;
    initRmq(n, a);
    static PriorityQueue<Node> q;
    q.reserve(n * 2);
    q.push(Node(1, n, odd.query(1, n)));
    const SegmentTree *t[2] = {&even, &odd};
    while (!q.empty()) {
        Node d = q.top();
        q.pop();
        register int l = d.l, r = d.r;
        register int p1 = pos[d.x], p2 = pos[t[~p1 & 1]->query(p1 + 1, r)];
        std::cout << a[p1] << ' ' << a[p2] << ' ';
        if (l < p1) q.push(Node(l, p1 - 1, t[l & 1]->query(l, p1 - 1)));
        if (p1 < p2 - 1)
            q.push(Node(p1 + 1, p2 - 1, t[~p1 & 1]->query(p1 + 1, p2 - 1)));
        if (p2 < r) q.push(Node(p2 + 1, r, t[~p2 & 1]->query(p2 + 1, r)));
    }
}
}

int main() {
    Task::solve();
    return 0;
}
```

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=501133528&auto=1&height=66"></iframe>