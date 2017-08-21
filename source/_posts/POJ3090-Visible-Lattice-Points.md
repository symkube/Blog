---
title: 「POJ-3090」Visible Lattice Points-欧拉函数
date: 2017-01-03 16:45:54
tags:
  - 数学
  - 欧拉函数
  - 线筛
categories:
  - oi
  - 数学
---
A lattice point (x, y) in the first quadrant (x and y are integers greater than or equal to 0), other than the origin, is visible from the origin if the line from (0, 0) to (x, y) does not pass through any other lattice point. For example, the point (4, 2) is not visible since the line from the origin passes through (2, 1). The figure below shows the points (x, y) with 0  \leq  x, y  \leq  5 with lines from the origin to the visible points.
<!-- more -->
### 链接
[POJ-3090](http://poj.org/problem?id=3090)
### 题解
线筛欧拉函数，预处理，然后就没有了...
### 代码
``` cpp
#include <cstdio>
#include <cstring>
#include <cstdlib>
#include <algorithm>
#include <cmath>
#include <cctype>
#include <iostream>
const int MAXN = 1000;
int phi[MAXN + 10], prime[MAXN + 10], tot, f[MAXN + 10];
bool vis[MAXN + 10];
inline void getPhi() {
    phi[1] = 1;
    for (register int i = 2; i <= MAXN; i++) {
        if (!vis[i]) prime[++tot] = i, phi[i] = i - 1;
        for (register int j = 1; j <= tot; j++) {
            if (i * prime[j] > MAXN)  break;
            vis[i * prime[j]] = 1;
            if (i % prime[j] == 0) {
                phi[i * prime[j]] = phi[i] * prime[j];
                break;
            } else phi[i * prime[j]] = phi[i] * (prime[j] - 1);
        }
    }
}
int main() {
    getPhi();
    int c, n;
    scanf("%d", &c);
    f[1] = 1;
    for (register int i = 2; i <= MAXN; i++) f[i] = f[i - 1] + phi[i];
    for (register int i = 1; i <= c; i++) scanf("%d", &n), printf("%d %d %d\n", i, n, f[n] << 1 | 1);
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=832877&auto=1&height=66"></iframe>
