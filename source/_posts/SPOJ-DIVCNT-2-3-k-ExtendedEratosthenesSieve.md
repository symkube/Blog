---
title: '「SPOJ DIVCNT[2/3/k]」-ExtendedEratosthenesSieve'
date: 2018-01-24 09:48:18
tags:
  - 数论
  - 扩展埃拉托色尼筛法
categories:
  - OI
  - 数论
  - 扩展埃拉托色尼筛法
---
求 {%raw %}$\sum\limits_{i = 1} ^ n \sigma_{0}(i ^ k)$，$n, k \leq 10 ^ {10}, T \leq 10000${% endraw %}。

<!-- more -->

### 链接
[SPOJ DIVCNT2](http://www.spoj.com/problems/DIVCNT2/)
[SPOJ DIVCNT3](http://www.spoj.com/problems/DIVCNT3/)
[SPOJ DIVCNTK](http://www.spoj.com/problems/DIVCNTK/)

### 题解
令 $f(n) = \sigma_0(n ^ k)$，那么 $f(1) = 1$
当 $n = p$，$p$ 为质数时，$f(p) = k + 1$
当 $n = p ^ e$ 时，$f(p ^ e) = ek + 1$

所以我们只需要 $p ^ 0$ 的前缀和，然后直接上扩展埃拉托色尼筛法就完了。

~~真的比 $\varphi$ 还好筛（逃）~~

#### DIVCNT2
``` cpp
/**
 * Copyright (c) 2017-2018, xehoth
 * All rights reserved.
 * 「SPOJ DIVCNT2」23-01-2018
 * Extended Eratosthenes Sieve
 * @author xehoth
 */
#include <bits/stdc++.h>

std::vector<long long> pre, suc;
std::vector<int> primes;
int M;
long long n;

long long rec(long long res, int last, long long mul) {
    long long t = (res > M ? suc[n / res] : pre[res]) - pre[primes[last] - 1];
    long long ret = mul * t * 3;
    for (int i = last, p; i < (int)primes.size(); i++) {
        p = primes[i];
        if ((long long)p * p > res) break;
        for (long long q = p, nrest = res, nmul = mul * 3; q * p <= res;
             q *= p) {
            ret += rec(nrest /= p, i + 1, nmul);
            nmul += mul * 2;
            ret += nmul;
        }
    }
    return ret;
}

inline long long extEratosthenesSieve(const long long n) {
    M = sqrt(n);
    pre.clear();
    suc.clear();
    primes.clear();
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
    std::ios::sync_with_stdio(false);
    std::cin.tie(NULL);
    std::cout.tie(NULL);
    int T;
    for (std::cin >> T; T--;) {
        std::cin >> n;
        std::cout << extEratosthenesSieve(n) << '\n';
    }
    return 0;
}
```

#### DIVCNT3
~~和上面只有几个数字的差别~~
``` cpp
/**
 * Copyright (c) 2017-2018, xehoth
 * All rights reserved.
 * 「SPOJ DIVCNT3」23-01-2018
 * Extended Eratosthenes Sieve
 * @author xehoth
 */
#include <bits/stdc++.h>

std::vector<long long> pre, suc;
std::vector<int> primes;
int M;
long long n;

long long rec(long long res, int last, long long mul) {
    long long t = (res > M ? suc[n / res] : pre[res]) - pre[primes[last] - 1];
    long long ret = mul * t * 4;
    for (int i = last, p; i < (int)primes.size(); i++) {
        p = primes[i];
        if ((long long)p * p > res) break;
        for (long long q = p, nrest = res, nmul = mul * 4; q * p <= res;
             q *= p) {
            ret += rec(nrest /= p, i + 1, nmul);
            nmul += mul * 3;
            ret += nmul;
        }
    }
    return ret;
}

inline long long extEratosthenesSieve(const long long n) {
    M = sqrt(n);
    pre.clear();
    suc.clear();
    primes.clear();
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
    std::ios::sync_with_stdio(false);
    std::cin.tie(NULL);
    std::cout.tie(NULL);
    int T;
    for (std::cin >> T; T--;) {
        std::cin >> n;
        std::cout << extEratosthenesSieve(n) << '\n';
    }
    return 0;
}
```

#### DIVCNTK
~~早知道先写这个~~
``` cpp
/**
 * Copyright (c) 2017-2018, xehoth
 * All rights reserved.
 * 「SPOJ DIVCNTK」23-01-2018
 * Extended Eratosthenes Sieve
 * @author xehoth
 */
#include <bits/stdc++.h>

std::vector<uint64_t> pre, suc;
std::vector<int> primes;
int M;
uint64_t n, k;

uint64_t rec(uint64_t res, int last, uint64_t mul) {
    uint64_t t = (res > M ? suc[n / res] : pre[res]) - pre[primes[last] - 1];
    uint64_t ret = mul * t * (k + 1);
    for (int i = last, p; i < (int)primes.size(); i++) {
        p = primes[i];
        if ((uint64_t)p * p > res) break;
        for (uint64_t q = p, nrest = res, nmul = mul * (k + 1); q * p <= res;
             q *= p) {
            ret += rec(nrest /= p, i + 1, nmul);
            nmul += mul * k;
            ret += nmul;
        }
    }
    return ret;
}

inline uint64_t extEratosthenesSieve(const uint64_t n) {
    M = sqrt(n);
    pre.clear();
    suc.clear();
    primes.clear();
    pre.resize(M + 1);
    suc.resize(M + 1);
    for (int i = 1; i <= M; i++) {
        pre[i] = i - 1;
        suc[i] = n / i - 1;
    }
    for (int p = 2, end; p <= M; p++) {
        if (pre[p] == pre[p - 1]) continue;
        primes.push_back(p);
        const uint64_t pcnt = pre[p - 1], q = (uint64_t)p * p, m = n / p;
        end = std::min<uint64_t>(M, n / q);
        for (int i = 1, w = M / p; i <= w; i++) suc[i] -= suc[i * p] - pcnt;
        for (int i = M / p + 1; i <= end; i++) suc[i] -= pre[m / i] - pcnt;
        for (int i = M; i >= q; i--) pre[i] -= pre[i / p] - pcnt;
    }
    primes.push_back(M + 1);
    return n > 1 ? 1 + rec(n, 0, 1) : 1;
}

int main() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(NULL);
    std::cout.tie(NULL);
    int T;
    for (std::cin >> T; T--;) {
        std::cin >> n >> k;
        std::cout << extEratosthenesSieve(n) << '\n';
    }
    return 0;
}
```