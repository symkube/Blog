---
title: 「补档计划」求解乘法逆元的方法
date: 2017-04-14 10:48:59
tags:
  - 补档计划
  - 数学
categories:
  - OI
  - 补档计划
---
乘法逆元是数论中重要的内容，也是 OI 中常用到的数论算法之一。
### 定义
在 $\text{mod p}$ 意义下我们把 $x$ 的乘法逆元写作 $x^{-1}$
$$x \times x^{-1} \equiv 1 \text{ (mod p)}$$
<!-- more -->
### 费马小定理
$$a^{p - 1} \equiv \text{ (mod p)}$$

要求 $p$ 为素数，上述公式可变为

$$a \times a^{p - 2} \equiv \text{ (mod p)}$$

由乘法逆元的定义，$a^{p - 2}$ 为 $a$ 的乘法逆元。

用快速幂计算 $a^{p - 2}$，总时间复杂度为 $O(\text{log }a)$

### 扩展欧几里得
扩展欧几里得（EXGCD）算法可以在 $O(\text{log max(a, b)})$ 的时间内求出关于 $x$,$y$ 的方程

$$ax + by = gcd(a, b)$$

的一组整数解

当 $b$ 为素数时有 $gcd(a, b) = 1$，直接求解就好了。
``` cpp
inline long inv(const long num) {
    register long g, x, y;
    exgcd(num, MOD, g, x, y);
    return (x % MOD + MOD) % MOD;
}
```

### 递推式
``` cpp
inv[1] = 1;
for (register int i = 2; i <= n; i++) inv[i] = ((-(long)(mod / i) * inv[mod % i]) % mod + mod) % mod;
```
证明详见 [Menci](https://oi.men.ci/mul-inverse/)。

