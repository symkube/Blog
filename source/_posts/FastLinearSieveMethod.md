---
title: 快速线性筛选法
date: 2017-01-03 18:37:41
tags:
  - 线筛
  - 数学
  - 学习笔记
categories:
  - OI
  - 学习笔记
---
质数,欧拉函数及莫比乌斯函数的快速线性筛选法，时间复杂度 $O(n)$
### 代码
``` cpp
const int MAXN = 100000;
int phi[MAXN + 10], prime[MAXN + 10], mu[MAXN + 10], tot;
bool vis[MAXN + 10];
inline void init() {
    mu[1] = phi[1] = 1;
    for (register int i = 2; i <= MAXN; i++) {
        if (!vis[i]) prime[++tot] = i, phi[i] = i - 1, mu[i] = -1;
        for (register int j = 1; j <= tot && i * prime[j] <= MAXN; j++) {
            vis[i * prime[j]] = 1;
            if (i % prime[j] == 0) {
                phi[i * prime[j]] = phi[i] * prime[j], mu[i * prime[j]] = 0;
                break;
            } else phi[i * prime[j]] = phi[i] * (prime[j] - 1), mu[i * prime[j]] = -mu[i];
        }
    }
}
```
<!-- more -->

