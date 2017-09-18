---
title: 「补档计划」十进制快速幂与 O(1) 乘
date: 2017-04-14 07:57:53
tags:
  - 补档计划
  - 数学
categories:
  - OI
  - 补档计划
---
普通快速幂在面对大量数据或单个够大数据时效率很低，这个时候我们就需要十进制快速幂，而如果模数是 `long long` 以内的数，我们可以用快速幂思想 $O(\text{log n})$ 完成快速乘，但我们其实可以 $O(1)$ 完成。
<!-- more -->
### 快速乘
这里直接说 $O(1)$ 的快速乘，利用 `long double`，而 `long double` 的精度其实只有 $19$ 位，直接乘是不行的，我们可以先除再乘，这样就不会出现精度问题，而前面直接计算 $a \times b$，再减去后面的部分，即使前面 $a \times b$ 爆负，它还会再爆一遍变为正的，保证了答案的正确。

``` cpp
typedef long double ld;
#define long long long

inline long mul(long a, long b) {
    return (a * b - (long)((ld)a / MOD * b) * MOD + MOD) % MOD;
}
```

### 二进制快速幂
大家都会...

#### 基础写法
``` cpp
inline long modPow(long a, long b) {
    register long ret = 1;
    for (; b; b >>= 1, a = mul(a, a))
        (b & 1) ? ret = mul(a, ret) : 0;
    return ret;
}
```
#### 库函数
其实还可以用 `power` 函数，`power` 函数先处理了二进制中的后缀 `0`，从而提高二进制快速幂的效率。
``` cpp
#include <ext/numeric>

int main() {
    std::cout << __gnu_cxx::power(3, 2);
}
```
#### 优化
就是上面的库函数里的优化...
``` cpp
inline long optimizedModPow(long a, long b) {
    if (b == 0) return 1;
    for (; ~b & 1; b >>= 1, a = mul(a, a));
    register long ret = a;
    for (b >>= 1; b; b >>= 1)
        a = mul(a, a), (b & 1) ? ret = mul(a, ret) : 0;
    return ret;
}
```

### 十进制快速幂
说白了就是拆成十进制数，每次用 `base` 来算，渐进复杂度一样，实际效率你说呢?

#### 例题
[THOJ-42](http://thoj.xehoth.cc/problem/42)

``` cpp
/*
 * created by xehoth on 14-04-2017
 */
#include <bits/stdc++.h>

typedef long double ld;
#define long long long

const long MOD = 999999999999999999ll;
const int MAXN = 1000005;

inline long mul(long a, long b) {
    return (a * b - (long)((ld)a / MOD * b) * MOD + MOD) % MOD;
}

inline long modPow(long a, long b) {
    register long ret = 1;
    for (; b; b >>= 1, a = mul(a, a))
        (b & 1) ? ret = mul(a, ret) : 0;
    return ret;
}

inline long optimizedModPow(long a, long b) {
    if (b == 0) return 1;
    for (; ~b & 1; b >>= 1, a = mul(a, a));
    register long ret = a;
    for (b >>= 1; b; b >>= 1)
        a = mul(a, a), (b & 1) ? ret = mul(a, ret) : 0;
    return ret;
}

inline long quickPow(long a, char *b) {
    register long ret = 1;
    register int n = strlen(b);
    for (register int i = n - 1; i >= 0; i--)
        ret = mul(ret, optimizedModPow(a, b[i] - '0')), a = optimizedModPow(a, 10);
    return ret;
}

char b[MAXN];

int main() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(NULL);
    std::cout.tie(NULL);
    register long a;
    std::cin >> a >> b;
    std::cout << quickPow(a, b);
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=453176289&auto=1&height=66"></iframe>