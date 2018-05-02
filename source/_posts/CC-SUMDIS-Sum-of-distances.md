---
title: 「CC SUMDIS」Sum of distances-分治 + 树状数组
date: 2018-05-02 09:30:43
tags:
  - 分治
  - 数据结构
categories:
  - OI
  - 分治
---
有一张 $n$ 个节点的**有向无环图**，节点编号为 $1 \sim n$。图的连边情况如下：
- $\forall 1 \leq i \leq n - 1$，存在一条节点 $i$ 连向节点 $i + 1$ 的边，权值为 $a_i$。
- $\forall 1 \leq i \leq n - 2$，存在一条节点 $i$ 连向节点 $i + 2$ 的边，权值为 $b_i$。
- $\forall 1 \leq i \leq n - 3$，存在一条节点 $i$ 连向节点 $i + 3$ 的边，权值为 $c_i$。

除此之外，图中不存在其它的边。
对于一对节点 $s$ 和 $t$ $(s \lt t)$，记 $d(s, t)$ 为从 $s$ 到 $t$ 的最短路径长度。请你求出所有的 $d(s, t)$ 之和，其中 $1 \leq s \lt t \leq n$。

<!-- more -->

### 链接
[CC SUMDIS](https://www.codechef.com/problems/SUMDIS)

### 题解
考虑分治，从 $m - 1, m, m + 1$ 左右将图分成两部分，现在考虑 $[l, r]$ 内的答案，答案可以分成两个部分：

1. $f(l, r, m) = \sum\limits_{l \leq i \lt m \lt j \leq r}d(i, j)$
2. {% raw %}$g = \sum\limits_{l \leq i \lt m - 1}d(i, m - 1) + \sum\limits_{l \leq i \lt m}d(i, m) + \sum\limits_{m \lt i \leq r}d(m, i) + \sum\limits_{m + 1 \lt i \leq r}d(m + 1, i)${% endraw %}

由于这是 $O(n)$ 级别的有向无环图，所以 $g$ 很容易就计算了。

现在考虑 $f$，$f$ 其实由三部分组成 
$d_1(i, j) = d(i, m - 1) + d(m - 1, j)$
$d_2(i, j) = d(i, m) + d(m, j)$
$d_3(i, j) = d(i, m + 1) + d(m + 1, j)$

现在只用统计每个部分的贡献就好了，如 $d_1$ 要满足 $d_1 \leq d_2, d_1 \leq d_3$

移向可以得到
$d(m - 1, j) - d(m, j) \leq d(i, m) - d(i, m - 1)$
$d(m - 1, j) - d(m + 1, j) \leq d(i, m + 1) - d(i, m - 1)$

令 
$x_0 = d(i, m) - d(i, m - 1), y_0 = d(i, m + 1) - d(i, m - 1)$
$x_j = d(m - 1, j) - d(m, j), y_j = d(m - 1, j) - d(m + 1, j)$

问题就变成了一个二维偏序，用树状数组就可以了。

时间复杂度 $O(n \log ^ 2n)$。

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
 * 「CC SUMDIS」Sum of distances 02-05-2018
 * 分治 + 树状数组
 * @author xehoth
 */
#include <bits/stdc++.h>

struct InputOutputStream {
    enum { SIZE = 1024 * 1024 };
    char ibuf[SIZE], *s, *t, obuf[SIZE], *oh;

    InputOutputStream() : s(), t(), oh(obuf) {}
    ~InputOutputStream() { fwrite(obuf, 1, oh - obuf, stdout); }

    inline char read() {
        if (s == t) t = (s = ibuf) + fread(ibuf, 1, SIZE, stdin);
        return s == t ? -1 : *s++;
    }

    template <typename T>
    inline InputOutputStream &operator>>(T &x) {
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

    inline void print(char c) {
        if (oh == obuf + SIZE) {
            fwrite(obuf, 1, SIZE, stdout);
            oh = obuf;
        }
        *oh++ = c;
    }

    template <typename T>
    inline void print(T x) {
        static int buf[21], cnt;
        if (x != 0) {
            if (x < 0) {
                print('-');
                x = -x;
            }
            for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
            while (cnt) print((char)buf[cnt--]);
        } else {
            print('0');
        }
    }

    template <typename T>
    inline InputOutputStream &operator<<(const T &x) {
        print(x);
        return *this;
    }
} io;

const int MAXN = 100000 + 9;
const int INF = 0x3f3f3f3f;

struct Point {
    int x, y, w;

    inline bool operator<(const Point &p) const {
        return x < p.x || (x == p.x && w < p.w);
    }
};

struct BinaryIndexedTree {
    int d[MAXN], n;

    void init(const int n) {
        this->n = n;
        memset(d + 1, 0, sizeof(int) * n);
    }

    void add(int k) {
        for (; k <= n; k += k & -k) d[k]++;
    }

    int query(int k) {
        int ret = 0;
        for (; k; k ^= k & -k) ret += d[k];
        return ret;
    }
} d;

int n, a[3][MAXN];
// m - 1, m, m + 1
int dt[3][MAXN], df[3][MAXN];

inline long long calcFrom(int l, int r, int *d) {
    long long ret = 0;
    memset(d + l, 0x3f, sizeof(int) * (r - l + 1));
    d[l] = 0;
    for (int i = l; i <= r; i++) {
        for (int j = 1; j <= 3; j++) {
            d[i + j] = std::min(d[i + j], d[i] + a[j - 1][i]);
        }
        ret += d[i];
    }
    return ret;
}

inline long long calcTo(int l, int r, int *d) {
    long long ret = 0;
    memset(d + l, 0x3f, sizeof(int) * (r - l));
    d[r] = 0;
    for (int i = r - 1; i >= l; i--) {
        for (int j = 1; j <= 3 && i + j <= r; j++) {
            d[i] = std::min(d[i], d[i + j] + a[j - 1][i]);
        }
        ret += d[i];
    }
    return ret;
}

inline long long force(int l, int r) {
    long long ret = 0;
    for (int i = l; i <= r; i++) ret += calcFrom(i, r, df[0]);
    return ret;
}

inline long long sweepLine(const std::vector<Point> &v1,
                           const std::vector<Point> &v2) {
    static std::vector<Point> v;
    static std::vector<int> val;
    v = v1;
    for (const auto &p : v2) v.push_back({p.x, p.y, -1});
    std::sort(v.begin(), v.end());
    val.clear();
    for (const auto &p : v) val.push_back(p.y);
    std::sort(val.begin(), val.end());
    val.erase(std::unique(val.begin(), val.end()), val.end());

    long long ret = 0;
    d.init(val.size());
    for (auto &p : v) {
        p.y = std::lower_bound(val.begin(), val.end(), p.y) - val.begin() + 1;
        if (p.w == -1) {
            d.add(p.y);
        } else {
            ret += (long long)d.query(p.y) * p.w;
        }
    }
    return ret;
}

const int DIR1[] = {1, 0, 0};
const int DIR2[] = {2, 2, 1};

long long solve(int l, int r) {
    if (r - l < 100) return force(l, r);
    int mid = (l + r) >> 1;
    long long ret = solve(l, mid - 2) + solve(mid + 2, r);
    long long g = calcTo(l, mid - 1, dt[0]) + calcTo(l, mid, dt[1]) +
                  calcFrom(mid, r, df[1]) + calcFrom(mid + 1, r, df[2]);
    calcFrom(mid - 1, r, df[0]);
    calcTo(l, mid + 1, dt[2]);
    long long f = 0;
    for (int m = 0, m1, m2; m < 3; m++) {
        m1 = DIR1[m];
        m2 = DIR2[m];
        static std::vector<Point> v1, v2;
        v1.clear();
        v2.clear();
        for (int i = l; i < mid; i++) {
            v1.push_back(
                {dt[m1][i] - dt[m][i], dt[m2][i] - dt[m][i], dt[m][i]});
        }
        for (int j = mid + 1; j <= r; j++) {
            v2.push_back(
                {df[m][j] - df[m1][j], df[m][j] - df[m2][j], df[m][j]});
        }
        f += sweepLine(v1, v2);

        for (auto &p : v1) {
            p.x = -p.x;
            p.y = -p.y;
        }
        for (auto &p : v2) {
            p.x = -p.x;
            p.y = -p.y;
        }
        f += sweepLine(v2, v1);
        for (int i = l; i < mid; i++) dt[m][i]--;
    }
    return ret + f + g;
}

int main() {
    int T;
    io >> T;
    while (T--) {
        io >> n;
        for (int i = 1; i < n; i++) io >> a[0][i];
        for (int i = 1; i < n - 1; i++) io >> a[1][i];
        for (int i = 1; i < n - 2; i++) io >> a[2][i];
        io << solve(1, n) << '\n';
    }
    return 0;
}
```