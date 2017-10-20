---
title: 「SuperOJ 1998」「模拟测试」矩阵-DP
date: 2017-10-20 18:30:47
tags:
  - DP
  - 模拟测试
categories:
  - OI
  - DP
---
有一个 $n \times m$ 的矩阵，请你选出其中 $k$ 个子矩阵，使得这个 $k$ 个子矩阵分值之和最大。注意：选出的 $k$ 个子矩阵不能相互重叠。

<!-- more -->

### 题解
首先对于 $m = 1$ 的情况，做一个最大 $m$ 子段和，对于 $m = 2$ 的情况，我们有一个简单 $O(k n ^ 3)$ 的做法。

$f[i][j][k]$ 表示第一列为前 $i$ 行，第二列前 $j$ 行，且矩阵数为 $k$ 的最大值，$s$ 为前缀和

{% raw %}$$f[i][j][k] = \begin{cases}\max\{f[i - 1][j][k], f[i][j - 1][k]\} & \\ 
\max\{f[t][j][k] + s[1][i] - s[1][t]\} & 0 \leq t \lt i \\ 
\max\{f[i][t][k] + s[2][j] - s[2][t]\} & 0 \leq t \lt j \\ 
\max\{f[t][t][k - 1] + s[1][i] - s[1][t] + s[2][j] - s[2][t]\} & 0 \leq t \lt i, i = j \end{cases}$${% endraw %}

当然此题也可以用轮廓线 DP 做到 $O(nk)$ 的复杂度。

### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「SuperOJ 1998」矩阵 20-10-2017
 * DP
 * @author xehoth
 */
#include <bits/stdc++.h>

const int MAXN = 100;
int s[3][MAXN + 1], f[MAXN + 1][MAXN + 1][11];

int main() {
    std::ios::sync_with_stdio(false), std::cin.tie(NULL), std::cout.tie(NULL);
    register int n, m, K;
    std::cin >> n >> m >> K;
    for (register int i = 1, x; i <= n; i++)
        for (register int j = 1; j <= m; j++)
            std::cin >> x, s[j][i] = s[j][i - 1] + x;
    memset(f, -10, sizeof(f));
    if (m == 1) {
        register int(*g)[11] = f[0];
        for (register int i = 0; i <= n; i++) g[i][0] = 0;
        for (register int i = 1; i <= n; i++) {
            for (register int j = 1; j <= K; j++) {
                g[i][j] = g[i - 1][j];
                for (register int t = 0; t < i; t++)
                    g[i][j] =
                        std::max(g[i][j], g[t][j - 1] + s[1][i] - s[1][t]);
            }
        }
        std::cout << g[n][K];
        return 0;
    }
    for (register int i = 0; i <= n; i++)
        for (register int j = 0; j <= n; j++) f[i][j][0] = 0;
    for (register int i = 1; i <= n; i++) {
        for (register int j = 1; j <= n; j++) {
            for (register int k = 0; k <= K; k++) {
                f[i][j][k] = std::max(f[i - 1][j][k], f[i][j - 1][k]);
                if (k) {
                    for (register int t = 0; t < i; t++)
                        f[i][j][k] = std::max(
                            f[i][j][k], f[t][j][k - 1] + s[1][i] - s[1][t]);
                    for (register int t = 0; t < j; t++)
                        f[i][j][k] = std::max(
                            f[i][j][k], f[i][t][k - 1] + s[2][j] - s[2][t]);
                    if (i != j) continue;
                    for (register int t = 0; t < i; t++)
                        f[i][j][k] = std::max(f[i][j][k],
                                              f[t][t][k - 1] + s[1][i] -
                                                  s[1][t] + s[2][j] - s[2][t]);
                }
            }
        }
    }
    std::cout << f[n][n][K];
}
```