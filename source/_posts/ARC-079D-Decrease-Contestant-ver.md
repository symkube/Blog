---
title: 「ARC 079D」Decrease (Contestant ver.)-构造
date: 2017-08-26 14:06:33
tags:
  - 构造
categories:
  - oi
  - 构造
---
给定一个数 $k$，要求构造一个非负整数序列，使得操作 $k$ 次后，最大数 $\leq n - 1$，每次操作选序列中最大值，将其 $-n$，其余数 $+1$。

<!-- more -->
### 链接
[ARC 079D](http://arc079.contest.atcoder.jp/tasks/arc079_b)

### 题解
考虑反向操作，对于序列 $0, 1, \cdots, n - 1$，我们对依次对每个数 $+n$，其余数 $-1$，那么显然对于每个数我们可以这样操作 $steps = \lfloor \frac k n \rfloor$ 次，此时
$$a_i = a_i + steps \times n - (n - 1) \times steps = i + steps$$

对于剩下的次数，我们依次暴力修改就可以了。

### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「ARC 079D」Decrease (Contestant ver.) 26-08-2017
 * 构造
 * @author xehoth
 */
#include <bits/stdc++.h>

namespace {

typedef unsigned long long ulong;

const int MAXN = 50;
ulong a[MAXN];

inline void solve() {
    std::ios::sync_with_stdio(false), std::cin.tie(NULL), std::cout.tie(NULL);
    register ulong n;
    std::cin >> n;
    register ulong steps = n / MAXN, remain = n % MAXN;
    for (register int i = 0; i < MAXN; i++) a[i] = i + steps;
    for (register int i = 0; i < remain; i++) {
        a[i] += MAXN;
        for (register int j = 0; j < i; j++) a[j]--;
        for (register int j = i + 1; j < MAXN; j++) a[j]--;
    }
    std::cout << "50\n";
    for (register int i = 0; i < MAXN; i++) std::cout << a[i] << ' ';
}
}

int main() {
    solve();
    return 0;
}
```

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=500665885&auto=1&height=66"></iframe>