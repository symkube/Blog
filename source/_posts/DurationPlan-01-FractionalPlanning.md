---
title: 「补档计划」01-分数规划
date: 2017-05-03 10:41:29
tags:
  - 补档计划
  - 分数规划
categories:
  - OI
  - 补档计划
---
写二分被卡 T 了，赶紧来补一补 01-分数规划的 Dinkelbach 算法...
<!-- more -->
### 定义
01 分数规划通俗的说就是有 $n$ 个物体，它们的利益用 $v[i]$ 表示，代价用 $c[i]$ 表示。现在要在这 $n$ 个物体中选取 $k$ 个物体，使得选出来的这 $k$ 个物体的总利益除以总代价达到最大值。

即
$$ans = max(\frac {\sum v_ix_i} {\sum c_ix_i})$$

`x` 表示选或不选。
### 二分法
设当前的答案为 `r`，那么对式子简单处理可以得到：

$$r = \sum v_ix_i - ans \cdot \sum c_ix_i = 0$$
令
$$g(r) = \sum v_ix_i - ans \cdot \sum c_ix_i = 0$$

则 $g(r) < 0$ 时答案偏大，$g(r) > 0$ 时答案偏小，我们可以令 $d_i = v_i - rc_i$，贪心的选取最大的 $k$ 个元素就能求得 $g(r)$ 的最优值，然后二分就可以了。
#### 实现
``` cpp
inline bool check(const double mid) {
    static double d[MAXN];
    for (register int i = 0; i < n; i++)
        d[i] = v[i] - mid * c[i];
    std::partial_sort(d, d + mid, d + n, std::greater<double>());
    return std::accumulate(d, d + mid, 0) >= 0;
}

inline double solve() {
    double l = 0, r = MAX;
    while (r - l > EPS) {
        double mid = (l + r) / 2;
        check(mid) ? l = mid : r = mid;
    }
    return l;
}
```
### Dinkelbach
Dinkelbach 算法实质上是一种迭代，它并不会去二分答案，而是先随便给定一个答案，然后根据更优的解不断移动答案，逼近最优解。由于他对每次判定使用的更加充分，所以它比二分会快上很多。

在这个算法中，我们可以将r初始化为任意值，不过一般将 $r$ 初始化为 $0$。
#### 实现
``` cpp
struct Node {
    double v, w, d;

    inline bool operator<(const Node &p) const {
        return d > p.d;
    }
} q[MAXN];

inline double solve() {
    double l, ans = 0;
    while (true) {
        l = ans;
        for (register int i = 0; i < n; i++)
            q[i].d = q[i].v - l * q[i].w;
        std::partial_sort(q, q + k, q + n);
        double x = 0, y = 0;
        for (register int i = 0; i < k; i++)
            x += q[i].v, y += q[i].w;
        ans = x / y;
        if (std::abs(l - ans) < EPS) return l;
    }
}   
```
