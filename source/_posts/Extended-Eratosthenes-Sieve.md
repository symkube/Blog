---
title: Extended Eratosthenes Sieve
date: 2018-01-23 22:05:08
tags:
  - 黑科技
  - 学习笔记
  - 数学
  - 数论
  - 扩展埃拉托色尼筛法
categories:
  - OI
  - 学习笔记
---
扩展埃拉托色尼筛法可以在大约 $O(n ^ {\frac {2} {3}})$ （这里以实际运行效果估计，实际复杂度据说和洲阁筛一样）求出一般积性函数的前缀和，**消耗 $O(\sqrt{n})$ 的空间**。

<!-- more -->

### 大致思路

设积性函数 $f(n)$ 满足
{% raw %}$$f(n) = \begin{cases}1 & n = 1\\ g(p, e) & n = p ^ e, e > 0 \\ f(x)f(y) & n = xy, \gcd(x, y) = 1\end{cases}$${% endraw %}

并且要满足 $f(p) = g(p, 1)$ 是关于 $p$ 的一个低阶多项式或可以快速求出。

令 {% raw %}$S(n) = \sum\limits_{i = 1} ^ nf(i), L = \sqrt{n}${% endraw %}

令 {% raw %}$M = \prod\limits_{i = 1} ^ kp_i ^ {e_i}, M' = M / p_k${% endraw %}

我们枚举每个没有大于 $L$ 的质因子的 $M'$
{% raw %}$$S += f(M') \sum_{F \lt p \lt n / M'}f(p)$${% endraw %}
$F$ 为 $M'$ 中最大的质因子，$p$ 为质数。

同时对于 $p ^ e$ 的答案枚举并递归。

下面就是如何快速计算 {% raw %}$$\sum_{F \lt p \lt n / M'}f(p)$${% endraw %} 的问题了，其可以看做 $S'(n / M') - S'(F)$

其中 {% raw %}$S'(n) = \sum\limits_{p}p^d${% endraw %} 或再进行少许变化。

我们只要能快速计算 $p ^ d$ 的前缀和即可，类似倒着的洲阁筛，从 $2$ 开始为不考虑质数的前缀和赋值，这一步可以通过公式法 $O(L)$ 算出。

然后倒序枚举 $1, 2, 3, \cdots, L, n / 1, n / 2, \cdots, n / (n / L))$ 中的数，并在外层枚举 $\leq L$ 的质数，若当前数大于等于质数的平方 $s(i) -= s(i / p) - s(p - 1)$。

实际运行效果相当好，明显快于洲阁筛，更有许多题目快于杜教筛，~~原文中也提到了这种筛法似乎可以替代洲阁筛（无论从代码复杂度还是运行速度）~~。

**同时由于空间复杂度小，可以进行各种常数优化，以下代码均为朴素实现，请自行优化常数**

下面附筛两个常见积性函数前缀和的代码，其他的应用见后面的博客吧....

#### 莫比乌斯函数前缀和
由于只用求 $p ^ 0$，导致不用枚举指数，使得运行速度大幅快于杜教筛，目前 rk1。
``` cpp
/**
 * Copyright (c) 2017-2018, xehoth
 * All rights reserved.
 * 「51 NOD 1244」莫比乌斯函数之和 23-01-2018
 * Extended Eratosthenes Sieve
 * @author xehoth
 */
#include <bits/stdc++.h>

long long n;
int M;
std::vector<long long> pre, suc;
std::vector<int> primes;

inline long long rec(long long res, int last, long long mul) {
    long long t = (res > M ? suc[n / res] : pre[res]) - pre[primes[last] - 1];
    long long ret = mul * -t;
    for (int i = last, p; i < (int)primes.size(); i++) {
        p = primes[i];
        if ((long long)p * p > res) break;
        ret += rec(res / p, i + 1, -mul);
    }
    return ret;
}

inline long long solve(const long long n) {
    pre.clear();
    suc.clear();
    primes.clear();
    M = sqrt(n);
    pre.resize(M + 1);
    suc.resize(M + 1);
    for (int i = 1; i <= M; i++) {
        pre[i] = i - 1;
        suc[i] = n / i - 1;
    }
    for (int p = 2, end; p <= M; p++) {
        if (pre[p] == pre[p - 1]) continue;
        primes.push_back(p);
        const long long pcnt = pre[p - 1], q = (long long)p * p, m = n / p;
        end = std::min<long long>(M, n / q);
        for (int i = 1, w = M / p; i <= w; i++) suc[i] -= suc[i * p] - pcnt;
        for (int i = M / p + 1; i <= end; i++) suc[i] -= pre[m / i] - pcnt;
        for (int i = M; i >= q; i--) pre[i] -= pre[i / p] - pcnt;
    }
    primes.push_back(M + 1);
    return n > 1 ? 1 + rec(n, 0, 1) : 1;
}

int main() {
    std::cin >> n;
    n--;
    long long ans = n >= 1 ? solve(n) : 0;
    std::cin >> n;
    std::cout << solve(n) - ans;
}
```

#### 欧拉函数前缀和
~~这个比 divcnt3 还麻烦（逃）~~
比我的杜教筛快（我杜教筛向来跑的慢）

``` cpp
/**
 * Copyright (c) 2017-2018, xehoth
 * All rights reserved.
 * 「51 NOD 1239」欧拉函数之和 23-01-2018
 * Extended Eratosthenes Sieve
 * @author xehoth
 */
#include <bits/stdc++.h>

const int MOD = 1000000007;

long long n;
int M;
std::vector<int> pre[2], suc[2], primes;

inline int dec(const int x, const int v) {
    return x - v < 0 ? x - v + MOD : x - v;
}
inline int add(const int x, const int v) {
    return x + v >= MOD ? x + v - MOD : x + v;
}

inline int rec(long long res, int last, int mul) {
    int t = dec((res > M ? suc[1][n / res] : pre[1][res]),
                pre[1][primes[last] - 1]);
    int ret = (long long)mul * t % MOD;
    for (int i = last, p; i < (int)primes.size(); i++) {
        p = primes[i];
        if ((long long)p * p > res) break;
        for (long long q = p, nres = res, nmul = mul * (p - 1ll) % MOD;
             p * q <= res; q *= p) {
            ret = add(ret, rec(nres /= p, i + 1, nmul));
            nmul = nmul * p % MOD;
            ret = add(ret, nmul);
        }
    }
    return ret;
}

inline int solve(const long long n) {
    M = sqrt(n);
    pre[0].clear();
    pre[1].clear();
    suc[0].clear();
    suc[1].clear();
    primes.clear();
    pre[0].resize(M + 1);
    pre[1].resize(M + 1);
    suc[0].resize(M + 1);
    suc[1].resize(M + 1);
    for (int i = 1, t; i <= M; i++) {
        pre[0][i] = i - 1;
        pre[1][i] = ((i * (i + 1ll)) / 2 - 1 + MOD) % MOD;
        t = (n / i) % MOD;
        suc[0][i] = t - 1;
        suc[1][i] = ((t * (t + 1ll)) / 2 - 1 + MOD) % MOD;
    }
    for (int p = 2, end; p <= M; p++) {
        if (pre[0][p] == pre[0][p - 1]) continue;
        primes.push_back(p);
        const long long q = (long long)p * p, m = n / p;
        const int pcnt = pre[0][p - 1], psum = pre[1][p - 1];
        end = std::min<long long>(M, n / q);
        for (int i = 1, w = M / p; i <= w; i++) {
            suc[0][i] = dec(suc[0][i], dec(suc[0][i * p], pcnt));
            suc[1][i] =
                dec(suc[1][i], dec(suc[1][i * p], psum) * (long long)p % MOD);
        }
        for (int i = M / p + 1; i <= end; i++) {
            suc[0][i] = dec(suc[0][i], dec(pre[0][m / i], pcnt));
            suc[1][i] =
                dec(suc[1][i], dec(pre[1][m / i], psum) * (long long)p % MOD);
        }
        for (int i = M; i >= q; i--) {
            pre[0][i] = dec(pre[0][i], dec(pre[0][i / p], pcnt));
            pre[1][i] =
                dec(pre[1][i], dec(pre[1][i / p], psum) * (long long)p % MOD);
        }
    }
    primes.push_back(M + 1);
    for (int i = 1; i <= M; i++) {
        pre[1][i] = dec(pre[1][i], pre[0][i]);
        suc[1][i] = dec(suc[1][i], suc[0][i]);
    }
    return n > 1 ? add(1, rec(n, 0, 1)) : 1;
}

int main() {
    // freopen("sample/1.in", "r", stdin);
    std::cin >> n;
    std::cout << solve(n);
    return 0;
}
```