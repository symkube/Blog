---
title: 「CC JUMP」Jump mission-DP + 动态凸包 + 树状数组
date: 2018-04-29 11:23:42
tags:
  - 数据结构
  - DP
categories:
  - OI
  - 数据结构
---
有 $N$ 座山排成一排，每座山都有一个 $1 \sim N$ 的唯一编号。第 $i$ 座山的编号为 $P_i$，高度为 $H_i$。
大厨从第一座山出发，目标是到达第 $N$ 座山。他可以从第 $i$ 座山跳到第 $j$ 座山上（$i < j, P_i < P_j$），并花费 $(H_i - H_j) ^ 2$ 的能量，当大厨处于第 $i$ 座山时，他还会花费 $A_i$ 的能量（$A_i$ 可以为负）。

求最小能量花费。

<!-- more -->

### 链接
[CC JUMP](https://www.codechef.com/problems/JUMP)

### 题解
首先有一个很显然的 $O(n ^ 2)$ 的 DP。$f[i]$ 表示在第 $i$ 座山上的最小花费，那么

{% raw %}$$f[i] = \min\{f[j] + (h[i] - h[j]) ^ 2\} + a[i]\} \ \ \ \ (j \lt i, P_j \lt P_i)$${% endraw %}

这个式子显然是可以斜率优化的，令 $k = -2h[j], b = f[j] + h[j] ^ 2$，即最小化 $y = kx + b$，其中 $x = h[i]$，那么 
{% raw %}$$f[i] = \min\{ kx + b \} + h[i] ^ 2 + a[i]$${% endraw %}

由于有 $P$ 的限制，我们在外层用个树状数组，就变成了单点修改，前缀询问了，里层直接用 `std::multiset` 维护凸包即可。

时间复杂度 $O(n \log ^ 2 n)$。

### 代码
``` cpp
/**
 * Copyright (c) 2016-2018, xehoth
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * 「CC JUMP」Jump mission 29-04-2018
 * DP + 动态凸包 + 树状数组
 * @author xehoth
 */
#include <bits/stdc++.h>

char pool[1024 * 1024 * 199];

inline void *operator new(size_t size) {
    static char *s = pool;
    char *t = s;
    s += size;
    return t;
}

inline void operator delete(void *) {}

inline void operator delete(void *, size_t) {}

struct InputStream {
    enum { SIZE = 1024 * 1024 };
    char ibuf[SIZE], *s, *t;

    inline char read() {
        if (s == t) t = (s = ibuf) + fread(ibuf, 1, SIZE, stdin);
        return s == t ? -1 : *s++;
    }

    template <typename T>
    inline InputStream &operator>>(T &x) {
        static char c;
        static bool iosig;
        for (c = read(), iosig = false; !isdigit(c); c = read()) {
            if (c == -1) return *this;
            iosig |= c == '-';
        }
        for (x = 0; isdigit(c); c = read()) x = x * 10 + (c ^ '0');
        if (iosig) x = -x;
        return *this;
    }
} io;

const long long INF = 0x3f3f3f3f3f3f3f3fll;

struct Point;

bool (*cmp)(const Point &, const Point &);

struct Point {
    long long x, y;

    mutable double s;

    inline bool operator<(const Point &p) const { return cmp(*this, p); }

    inline Point operator-(const Point &p) const {
        return {x - p.x, y - p.y, 0};
    }

    inline double operator*(const Point &p) const {
        return (double)x * p.y - (double)y * p.x;
    }
};

inline bool cmpX(const Point &a, const Point &b) {
    return a.x < b.x || (a.x == b.x && a.y < b.y);
}

inline bool cmpS(const Point &a, const Point &b) { return a.s < b.s; }

inline double getSlope(const Point &a, const Point &b) {
    return (a.y - b.y) / (double)(b.x - a.x);
}

struct ConvexHull : std::multiset<Point> {
    using super = std::multiset<Point>;

    bool check(iterator it) {
        iterator suc = std::next(it), pre;
        if (it == begin())
            return suc != end() && it->x == suc->x && it->y <= suc->y;
        pre = std::prev(it);
        if (suc == end()) return it->x == pre->x && it->y <= pre->y;
        return (*pre - *it) * (*it - *suc) >= 0;
    }

    void insert(const Point &p) {
        cmp = cmpX;
        iterator it = super::insert(p), suc, pre;
        if (check(it)) {
            erase(it);
            return;
        }
        for (suc = std::next(it); suc != end() && check(suc);
             suc = std::next(it)) {
            erase(suc);
        }
        for (pre = std::prev(it); pre != end() && check(pre);
             pre = std::prev(it)) {
            erase(pre);
        }
        if ((suc = std::next(it)) != end()) {
            suc->s = getSlope(*it, *suc);
        }
        if (it != begin()) {
            pre = std::prev(it);
            it->s = getSlope(*it, *pre);
        }
    }

    long long eval(long long x) const {
        if (empty()) return -INF;
        cmp = cmpS;
        iterator it = --lower_bound({0, 0, (double)x});
        return it->x * x + it->y;
    }
};

const int MAXN = 300000 + 9;

ConvexHull d[MAXN];

int p[MAXN], n;
long long a[MAXN], h[MAXN], f[MAXN];

inline void insert(int k, long long x, long long y) {
    Point pts = {-x, -y, (double)-INF};
    for (; k <= n; k += k & -k) {
        d[k].insert(pts);
    }
}

inline long long query(int k, long long x) {
    long long ret = -INF;
    for (; k; k ^= k & -k) {
        ret = std::max(ret, d[k].eval(x));
    }
    return ret;
}

int main() {
    // freopen("1.in", "r", stdin);
    io >> n;
    for (int i = 1; i <= n; i++) io >> p[i];
    for (int i = 1; i <= n; i++) io >> a[i];
    for (int i = 1; i <= n; i++) io >> h[i];
    f[1] = a[1];
    insert(p[1], -2ll * h[1], f[1] + h[1] * h[1]);
    for (int i = 2; i <= n; i++) {
        f[i] = -query(p[i], h[i]) + h[i] * h[i] + a[i];
        insert(p[i], -2ll * h[i], f[i] + h[i] * h[i]);
    }
    std::cout << f[n];
    return 0;
}
```