---
title: 「POJ-2689」Prime Distance-线筛
date: 2017-01-03 16:17:45
tags:
  - 数学
  - 线筛
categories:
  - OI
  - 数学
---
The branch of mathematics called number theory is about properties of numbers. One of the areas that has captured the interest of number theoreticians for thousands of years is the question of primality. A prime number is a number that is has no proper factors (it is only evenly divisible by 1 and itself). The first prime numbers are 2,3,5,7 but they quickly become less frequent. One of the interesting questions is how dense they are in various ranges. Adjacent primes are two numbers that are both primes, but there are no other prime numbers between the adjacent primes. For example, 2,3 are the only adjacent primes that are also adjacent numbers.
Your program is given 2 numbers: L and U (1<=L< U<=2,147,483,647), and you are to find the two adjacent primes C1 and C2 (L<=C1< C2<=U) that are closest (i.e. C2-C1 is the minimum). If there are other pairs that are the same distance apart, use the first pair. You are also to find the two adjacent primes D1 and D2 (L<=D1< D2<=U) where D1 and D2 are as distant from each other as possible (again choosing the first pair if there is a tie).
<!-- more -->
### 链接
[POJ-2689](http://poj.org/problem?id=2689)
### 题解
线筛两遍，然后就没有了...
### 代码
``` cpp
#include <cstdio>
#include <cstring>
#include <cstdlib>
#include <vector>
#include <algorithm>
#include <cmath>
#include <cctype>
#include <iostream>
const int MAXN = 100010;
int prime[MAXN + 1];
inline void getPrime() {
    memset(prime, 0, sizeof(prime));
    for (register int i = 2; i <= MAXN; i++) {
        if (!prime[i]) prime[++prime[0]] = i;
        for (register int j = 1; j <= prime[0] && prime[j] <= MAXN / i; j++) {
            prime[prime[j] * i] = 1;
            if (i % prime[j] == 0) break;
        }
    }
}
bool notprime[MAXN * 10];
int intervalPrime[MAXN * 10];
inline void getIntervalPrime(int L, int R) {
    memset(notprime, false, sizeof(notprime));
    if (L < 2) L = 2;
    for (register int i = 1; i <= prime[0] && (long long)prime[i] * prime[i] <= R; i++) {
        int s = L / prime[i] + (L % prime[i] > 0);
        if (s == 1) s = 2;
        for (register int j = s; (long long)j * prime[i] <= R; j++)
            if ((long long)j * prime[i] >= L)
                notprime[j * prime[i] - L] = true;
    }
    intervalPrime[0] = 0;
    for (register int i = 0; i <= R - L; i++)
        if (!notprime[i])
            intervalPrime[++intervalPrime[0]] = i + L;
}
int main() {
    getPrime();
    int L, U;
    while (scanf("%d%d", &L, &U) == 2) {
        getIntervalPrime(L, U);
        if (intervalPrime[0] < 2) printf("There are no adjacent primes.\n");
        else {
            register int x1 = 0, x2 = 100000000, y1 = 0, y2 = 0;
            for (register int i = 1; i < intervalPrime[0]; i++) {
                if (intervalPrime[i + 1] - intervalPrime[i] < x2 - x1)
                    x1 = intervalPrime[i], x2 = intervalPrime[i + 1];
                if (intervalPrime[i + 1] - intervalPrime[i] > y2 - y1)
                    y1 = intervalPrime[i], y2 = intervalPrime[i + 1];
            }
            printf("%d,%d are closest, %d,%d are most distant.\n", x1, x2, y1, y2);
        }
    }
}
```

