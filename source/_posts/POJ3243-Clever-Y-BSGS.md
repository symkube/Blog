---
title: 「POJ-3243」Clever Y-BSGS
date: 2017-01-03 17:23:27
tags:
  - 数学
  - BSGS
categories:
  - oi
  - 数学
---
Little Y finds there is a very interesting formula in mathematics:

$X^Y$ mod $Z = K$

Given X, Y, Z, we all know how to figure out K fast. However, given X, Z, K, could you figure out Y fast?
<!-- more -->
### 链接
[POJ-3243](http://poj.org/problem?id=3243)
### 题解
模板题..
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
#include <iomanip>
inline int gcd(int a, int b) { return !b ? a : gcd(b, a % b); }
inline void exgcd(int a, int b, int &x, int &y) {
    if (!b) x = 1, y = 0;
    else exgcd(b, a % b, y, x), y -= (long long)(a / b) * x;
}
inline int inv(int a, int mod) {
    register int x, y;
    return exgcd(a, mod, x, y), (x % mod + mod) % mod;
}
template<class T = int, size_t HASH_SIZE = 999979, size_t MAXN = 50000>
struct HashMap {
    struct Edge {
        T key, val;
        Edge *next;
        inline Edge *init(const T &key, const T &val, Edge *next) { return this->key = key, this->val = val, this->next = next, this; }
    } *head[HASH_SIZE], edge[MAXN], *cur;
    HashMap() : cur(edge) {}
    inline void clear() { cur = edge, memset(head, 0, sizeof(head)); }
    inline void put(const T &key, const T &val) {
        register int index = key % HASH_SIZE;
        Edge *p = get(key);
        if (p) p->val = val;
        else head[index] = (++cur)->init(key, val, head[index]);
    }
    inline Edge *get(const T &key) {
        for (Edge *p = head[key % HASH_SIZE]; p; p = p->next) if (p->key == key) return p;
        return NULL;
    }
};
HashMap<> map;
inline int BSGS(int a, int b, int c) {
    register int cnt = 0, g, d = 1;
    while ((g = gcd(a, c)) != 1) {
        if (b % g) return -1;
        cnt++, b /= g, c /= g, d = (long long)d * (a / g) % c;
    }
    b = (long long)b * inv(d, c) % c;
    map.clear();
    register int s = sqrt(c), p = 1;
    for (register int i = 0; i < s; i++) {
        if (p == b) return i + cnt;
        map.put((long long)p * b % c, i), p = (long long)p * a % c;
    }
    register int q = p;
    for (int i = s; i - s + 1 <= c - 1; i += s) {
        HashMap<>::Edge *t = map.get(q);
        if (t) return i - t->val + cnt;
        q = (long long)q * p % c;
    }
    return -1;
}
int X, Z, K;
bool check() {
    for (int i = 0, j = 1; i <= 10; ++i) {
        if (j == K) {
            printf("%d\n", i);
            return true;
        }
        j = (long long)j * X % Z;
    }
    if (X == 0) {
        puts("No Solution");
        return true;
    }
    return false;
}
int main() {
    while (scanf("%d%d%d", &X, &Z, &K), (long long)X + Z + K > 0) {
        X %= Z, K %= Z;
        if (check()) continue;
        int ans = BSGS(X, K, Z);
        if (ans == -1) puts("No Solution");
        else printf("%d\n", ans);
    }
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=784835&auto=1&height=66"></iframe>
