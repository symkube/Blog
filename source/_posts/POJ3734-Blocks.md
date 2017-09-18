---
title: 「POJ 3734」Blocks-生成函数
date: 2017-07-29 11:20:34
tags:
  - 组合数学
  - 生成函数
categories:
  - OI
  - 组合数学
  - 生成函数
---
### 链接
[POJ 3734](http://poj.org/problem?id=3734)
### 题意
有一排砖，数量为 $n$，有红蓝绿黄 $4$ 种颜色，其中染成红和绿颜色的砖块的数量必须为偶数个，求可有多少种染色方案。
<!-- more -->

### 题解
构造指数型生成函数
{% raw %}$$Y(x) = B(x) = \sum_{i = 0} ^ {\infty} \frac {x ^ i} {i!}$${% endraw %}
{% raw %}$$R(x) = G(x) = \sum_{i = 0} ^ {\infty} \frac {x ^ {2i}} {(2i)!}$${% endraw %}
根据泰勒展开有
{% raw %}$$e ^ x = \sum_{i = 0} ^ {\infty} \frac {x ^ i} {i!}$$
$$e ^ {-x} = \sum_{i = 0} ^ {\infty} \frac {(-x) ^ i} {i!}$${% endraw %}
故
{% raw %}$$R(x) = G(x) = \frac {e ^ x + e ^ {-x}} {2}$${% endraw %}
答案为
{% raw %}$$\begin{aligned}Y(x)B(x)R(x)G(x) &= (e ^ x) ^ 2(\frac {e ^ x + e ^ {-x}} {2}) ^ 2 \\
&= \frac {e ^ {4x} + 2e ^ {2x} + 1} {4} \\
&= \sum_{i = 0} ^ {\infty} \frac {4 ^ i + 2 * 2 ^ i} {4} \frac {x ^ i} {i!} \\
&= 4 ^ {n - 1} + 2 ^ {n - 1}
\end{aligned}$${% endraw %}

### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「POJ 3734」Blocks 29-07-2017
 * 生成函数
 * @author xehoth
 */
#include <iostream>

const int MOD = 10007;

inline int modPow(int a, int b, int c) {
    register int ret = 1;
    for (; b; b >>= 1, a = a * a % c) (b & 1) ? ret = ret * a % c : 0;
    return ret;
}

int main() {
    std::ios::sync_with_stdio(false), std::cin.tie(NULL), std::cout.tie(NULL);
    register int t, n;
    for (std::cin >> t; t--;) {
        std::cin >> n;
        std::cout << (modPow(4, n - 1, MOD) + modPow(2, n - 1, MOD)) % MOD
                  << '\n';
    }
    return 0;
}
```

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=28534501&auto=1&height=66"></iframe>