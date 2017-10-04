---
title: 「ARC 071E」TrBBnsformBBtion
date: 2017-08-21 00:39:17
tags:
  - Hash
  - 字符串
  - 构造
categories:
  - OI
  - 字符串
  - Hash
---
给定两个由 `A`，`B` 组成的字符串 $S, T$，其中字符 `A` 可以变为 `BB`，`B` 可以变为 `AA`，`AAA` 和 `BBB` 可以被删掉，询问 $S$ 中的一个给定子串能否变为 $T$ 中的一个给定子串。

<!-- more -->
### 链接
[ARC 071E TrBBnsformBBtion](http://arc071.contest.atcoder.jp/tasks/arc071_c)

### 题解
把 `A` 看成 $1$，`B` 看成 $2$，一个串 $S$ 可以将其 Hash 为数值和，接下来考虑每个变化：

- 对于 `A` 变为 `BB`，即 $1 \rightarrow 4$
- 对于 `B` 变为 `AA`，即 $2 \rightarrow 2$
- 对于删掉 `AAA`，即 $3 \rightarrow 0$
- 对于删掉 `BBB`，即 $6 \rightarrow 0$

接下来我们考虑这个 Hash值对于 $3$ 取模，我们发现恰好符合上述变化，于是我们预处理前缀和，对于每个询问我们比较对应 Hash值模 $3$ 是否相等即可。

时间复杂度 $O(n + q)$
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「ARC 071E」TrBBnsformBBtion 20-08-2017
 *
 * @author xehoth
 */
#include <bits/stdc++.h>

namespace Task {

#define long long long

const int MAXN = 1000000;

char s[MAXN + 1], t[MAXN + 1];

const int MOD = 1e9 + 7;
int qa[MAXN], qb[MAXN], n, x, y, X, Y;
char a[MAXN], b[MAXN];

inline void solve() {
    std::ios::sync_with_stdio(false), std::cin.tie(NULL), std::cout.tie(NULL);
    std::cin >> a + 1 >> b + 1;
    for (int i = 1; a[i]; i++) qa[i] = qa[i - 1] + a[i] - 'A' + 1;
    for (int i = 1; b[i]; i++) qb[i] = qb[i - 1] + b[i] - 'A' + 1;
    for (std::cin >> n; n--;) {
        std::cin >> x >> y >> X >> Y;
        puts((qa[y] - qa[x - 1]) % 3 == (qb[Y] - qb[X - 1]) % 3 ? "YES" : "NO");
    }
}

#undef long
}

int main() {
    Task::solve();
    return 0;
}
```

