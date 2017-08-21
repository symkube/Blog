---
title: 「ARC 070E」NarrowRectangles-斜率优化
date: 2017-08-20 20:30:55
tags:
  - 斜率优化
  - DP
categories:
  - oi
  - DP
---
二维坐标系中有 $n$ 个矩形，第 $i$ 个矩形在水平方向上覆盖 $[l_i, r_i]$，在竖直方向上覆盖 $[i - 1, i]$，我们要水平移动这些矩形使得它们全部连通，水平移动的花费是移动的距离，求最小费用。

<!-- more -->
### 链接
[ARC 070E NarrowRectangles](http://arc070.contest.atcoder.jp/tasks/arc070_c)

### 题解
令 $f[i][x]$ 表示前 $i$ 个矩形，第 $i$ 个矩形的左端点为 $x$ 的最小费用，于是我们有一个 $O(nx ^ 2)$ 的暴力转移：
$$f[i][x] = |x - l_i| + \min_{x - (R_{i - 1} - L_{i - 1} \leq x' \leq x + (R_i - L_i))} f[i - 1][x']$$
我们把 $f[i]$ 当作一个函数，对于 $x$ 它返回 $f[i][x]$，其图像是一个由 $2i + 3$ 个部分组成的折线，从左到右的斜率分别为 $-i - 1, -i, \cdots, i, i + 1$，因此这个折线可以用 $l_0, l_1, \cdots, l_i, r_0, r_1, \cdots, r_i, c$ 来表示。

- 对于区间 $(- \infty, l_i]$，斜率为 $i - 1$
- 对于区间 $[l_i, l_{i - 1}]$，斜率为 $i$
- $\cdots$
- 对于区间 $[l_1, l_0]$，斜率为 $-1$
- 对于区间 $[l_0, r_0]$，折线为常数 $c$
- 对于区间 $[r_0, r_1]$，斜率为 $1$
- $\cdots$
- 对于区间 $[r_{i - 1}, r_i]$，斜率为 $i$
- 对于区间 $[l_i, \infty)$，斜率为 $i + 1$

我们用两个 `set` 来维护即可，时间复杂度 $O(n \log n)$

### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「ARC 070E」NarrowRectangles 20-08-2017
 * dp + 斜率优化
 * @author xehoth
 */
#include <bits/stdc++.h>

namespace Task {

const int MAXN = 100000;
#define long long long

std::multiset<long> setL, setR;
int a[MAXN + 1], b[MAXN + 1];
long f[MAXN + 1];

inline void solve() {
    std::ios::sync_with_stdio(false), std::cin.tie(NULL), std::cout.tie(NULL);
    register int n;
    std::cin >> n;
    for (register int i = 1; i <= n; i++) std::cin >> a[i] >> b[i];
    setL.insert(a[1]), setR.insert(a[1]);
    register long tl = 0, tr = 0, ans = 0, nl, nr;
    for (register int i = 2; i <= n; i++) {
        tl += b[i] - a[i], tr += b[i - 1] - a[i - 1];
        nl = *setL.rbegin(), nr = *setR.begin();
        if (nl - tl > a[i]) {
            ans += std::abs(nl - tl - a[i]), setL.erase(--setL.end());
            setL.insert(setL.insert(a[i] + tl), a[i] + tl);
            setR.insert(nl - tl - tr);
        } else if (a[i] > nr + tr) {
            ans += std::abs(nr + tr - a[i]), setR.erase(setR.begin());
            setR.insert(setR.insert(a[i] - tr), a[i] - tr);
            setL.insert(nr + tr + tl);
        } else {
            setL.insert(a[i] + tl), setR.insert(a[i] - tr);
        }
    }
    std::cout << ans;
}

#undef long
}

int main() {
    Task::solve();
    return 0;
}
```

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=498286387&auto=1&height=66"></iframe>