---
title: 「补档计划」数论
date: 2017-06-30 10:26:56
updateDate: 2017-07-14 15:08:06
tags:
  - 补档计划
  - 数论
categories:
  - oi
  - 补档计划
---
关于数论的总结和专题练习....
<!-- more -->
### Todo
- [x] 快速幂
- [x] gcd
- [x] exgcd
- [x] 逆元
- [x] 中国剩余定理
- [x] 类欧几里德
- [ ] Miller-Rabin
- [ ] Pollard-Rho
- [ ] 数论函数
- [x] 线性筛
- [ ] 反演
- [x] BSGS
- [ ] 斯特林数
- [ ] 原根
- [ ] Fast Fourier Transformation
- [ ] Fast Number-Theoretic Transform
- [ ] 杜教筛
- [ ] 洲阁筛

### 扩展欧几里得算法
对于不完全为 $0$ 的非负整数 $a, b$，$gcd(a, b)$ 表示 $a, b$ 的最大公约数，必然存在整数对 $x, y$，使得 $gcd(a, b) = ax + by$。
#### 证明
不妨设 $a > b$，显然当 $b = 0$, $gcd(a, b) = a$。此时 $x = 1, y = 0$。

当 $ab \neq 0$ 时，设 $ax_1 + by_1 = gcd(a, b)$，$bx_2 + (a \text{ mod } b)y_2 = gcd(b, a \text{ mod } b)$。

根据欧几里得原理有 $gcd(a, b) = gcd(b, a \text{ mod } b)$。

则 $ax_1 + by_1 = bx_2 + (a \text{ mod } b)y_2 = bx_2 + (a - \lfloor \frac {a} {b} \rfloor \cdot b)y_2 = ay_2 + bx_2 - \lfloor \frac {a} {b} \rfloor \cdot by_2$。

所以 $x_1 = y_2, y_1 = x_2 - \lfloor \frac {a} {b} \rfloor \cdot y_2$，接下来不断递归就好了。
#### 代码
``` cpp
inline void exgcd(long a, long b, long &g, long &x, long &y) {
    !b ? (x = 1, y = 0, g = a) : (exgcd(b, a % b, g, y, x), y -= (a / b) * x);
}
```
### 逆元
#### 费马小定理
$$a^{p - 1} \equiv \text{ (mod p)}$$

要求 $p$ 为素数，上述公式可变为

$$a \times a^{p - 2} \equiv \text{ (mod p)}$$

由乘法逆元的定义，$a^{p - 2}$ 为 $a$ 的乘法逆元。

用快速幂计算 $a^{p - 2}$，总时间复杂度为 $O(\text{log }a)$

#### 扩展欧几里得
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

#### 递推式
``` cpp
inv[1] = 1;
for (register int i = 2; i <= n; i++)
    inv[i] = (long)(mod - mod / i) * inv[mod % i] % mod;
```
### 中国剩余定理
#### 基本形式
设正整数 $m_1, m_2, \cdots, m_n$ 两两互质，则同余方程组
$$x \equiv a_1 \  (\text{mod } m_1)$$
$$x \equiv a_2 \  (\text{mod } m_2)$$
$$\cdots$$
$$x \equiv a_n \  (\text{mod } m_n)$$
有整数解，并且在模 $M = m_1 \cdot m_2 \cdot _\cdots \cdot m_n$ 解是唯一的，$x = \sum_{i = 1} ^ n a_iM_iM_i ^ {-1} \text{ mod M}$，其中 $M_i = M \ / \ m_i$，$M_i ^ {-1}$ 为 $M_i$ 模 $m_i$ 的逆元。
#### 扩展形式
基本形式中的 $m_i$ 不再要求互质，此时只能两两求解，$x \equiv a_1 \ (\text{mod } m_1), x \equiv a_2 \ (\text{mod } m_2)$。
#### 代码
``` cpp
template <typename T>
inline void exgcd(T a, T b, T &g, T &x, T &y) {
    !b ? (x = 1, y = 0, g = a) : (exgcd(b, a % b, g, y, x), y -= (a / b) * x);
}

template <typename T>
inline T getInv(const T num, const T mod) {
    register T g, x, y;
    exgcd(num, mod, g, x, y);
    return (x % mod + mod) % mod;
}

template <typename T>
inline T crt(T *a, T *m, const int n) {
    register T M = m[0], ans = 0, mi;
    for (register int i = 1; i < n; i++) M *= m[i];
    for (register int i = 0; i < n; i++)
        mi = M / m[i], ans = (ans + a[i] * mi * getInv(mi, m[i])) % M;
    return ans < 0 ? ans + M : ans;
}

template <typename T>
inline T excrt(T *a, T *m, int n) {
    register T M = m[0], ans = a[0], g, x, y;
    for (register int i = 1; i < n; i++) {
        exgcd(M, m[i], g, x, y);
        if ((a[i] - ans) % g) return -1;
        x = (a[i] - ans) / g * x % (m[i] / g);
        ans = (ans + x * M) % (M = M / g * m[i]);
    }
    return ans > 0 ? ans : ans + M;
}
```
### BSGS
求解方程 $A ^ x \equiv B(\text{mod }C)$。
#### 代码
``` cpp
inline int bsgs(int a, int b, int c) {
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
        map[(long long)p * b % c] = i, p = (long long)p * a % c;
    }
    register int q = p;
    for (register int i = s; i - s + 1 <= c - 1; i += s) {
        Map::iterator it = map.find(q);
        if (it != map.end()) return i - it->second + cnt;
        q = (long long)q * p % c;
    }
    return -1;
}
```
### 类欧几里得
求解形如 $\sum_{x = 0} ^ n \lfloor \frac {ax + b} {c} \rfloor$。

我们令 $S_d(n) = \sum_{x = 0} ^ n x ^ d$。  
1. 若 $a \geq c$，则令 $d = \lfloor \frac {a} {c} \rfloor$，有
$$\sum ^ {n}_{x = 0} \lfloor \frac{ax + b}{c} \rfloor = \sum ^ {n}_{x = 0}(\lfloor \frac {(a \% c)x + b}{c}\rfloor + d * x) = d * S_1(n) + \sum_{x = 0} ^ n\lfloor \frac{(a \% c)x + b}{c} \rfloor$$
2. 若 $b \geq c$，则令 $d = \lfloor \frac {b} {c} \rfloor$，有
$$\sum ^ {n}_{x = 0} \lfloor \frac{ax + b}{c} \rfloor = \sum ^ {n}_{x = 0}(\lfloor \frac{ax + (b \% c)}{c}\rfloor + d) = d * S_0(n) + \sum ^ {n}_{x = 0} \lfloor \frac{ax + (b \% c)}{c} \rfloor$$
3. 若 $a < c, b < c$ 时，令 $M = \lfloor \frac {an + b} {c} \rfloor$，有
$$\sum ^ {n}_{x = 0} \lfloor \frac{ax + b}{c} \rfloor = \sum ^ {n}_{x = 0} \sum ^ {M}_{y = 1}[y \leq \lfloor \frac{ax + b}{c} \rfloor]$$
即
$$\sum ^ {n}_{x = 0} \sum ^ {M - 1}_{y = 0}[y + 1 \leq \lfloor \frac{ax + b}{c} \rfloor]$$
接下来化简 $y + 1 \leq \lfloor \frac {ax + b} {c} \rfloor$，有
$$c * y + c - b \leq a * x$$
$$c * y + c - b - 1 < a * x$$
$$x > \lfloor \frac {c * y + c - b - 1} {a} \rfloor$$
故原式
$$\begin {matrix}
= &\sum ^ {M - 1}_{y = 0}\sum ^ {n}_{x = 0}[x > \lfloor \frac{c * y + c - b - 1}{a} \rfloor]&\\
= &\sum ^ {M - 1}_{y = 0}(n - \lfloor \frac{c * y + c - b - 1}{a}\rfloor) &\\
= &n * M - \sum ^ {M - 1}_{y = 0} \lfloor \frac{c * y + c - b - 1}{a}\rfloor &\\
\end {matrix}$$

由于 $a < c$ 时 $\lfloor \frac {a} {c} \rfloor = 0$，$b < c$ 时 $\lfloor \frac {b} {c} \rfloor = 0$，所以我们可以将 1, 2 两种情况合并，即令
$$f(a, b, c, n) = \sum_{x = 0} ^ n \lfloor \frac {ax + b} {c} \rfloor$$
那么 $a \geq c$ 或 $b \geq c$ 时，有
$$f(a, b, c, n) = \lfloor \frac {a} {c} \rfloor * S_1(n) + \lfloor \frac {b} {c} \rfloor * S_0(n) + f(a \% c, b \% c, c, n)$$
将 $S_d(n)$ 代入，得
$$f(a, b, c, n) = \lfloor \frac {a} {c} \rfloor * \frac {n * (n + 1)} {2} + \lfloor \frac {b} {c} \rfloor * (n + 1) + f(a \% c, b \% c, c, n)$$
当 $a < c$ 且 $b < c$ 时，有
$$f(a, b, c, n) = n * M - f(c, c - b - 1, a, M - 1)$$
把 $M$ 代入，得
$$f(a, b, c, n) = n * \lfloor \frac {an + b} {c} \rfloor - f(c, c - b - 1, a, \lfloor \frac {an + b} {c} \rfloor - 1)$$
当 $a = 0$ 时，即为该算法的边界，此时
$f(a, b, c, n) = \lfloor \frac {b} {c} \rfloor * (n + 1)$

我们可以发现 $(a, c)$ 会变化为 $(c, a \% c)$，故这个算法被称为类欧几里德算法。
#### 代码
``` cpp
#define long long long

inline long classEuclid(long a, long b, long c, long n) {
    if (a == 0) {
        return (b / c) * (n + 1);
    } else if (a >= c || b >= c) {
        return (a / c) * (n * (n + 1) >> 1) + (b / c) * (n + 1) +
               classEuclid(a % c, b % c, c, n);
    } else {
        return (n * ((a * n + b) / c)) -
               classEuclid(c, c - b - 1, a, (a * n + b) / c - 1);
    }
}
```
### 欧拉函数
欧拉函数 $\varphi (n)$: $\varphi (n)$ 表示 $\left [1, n \right ]$ 中与 $n$ 互质的整数的个数。

> 通式: $\varphi (n) = \sum_{i = 1}^{n} \left [ gcd(i, n) = 1 \right ] = n \prod_{i = 1}^n \left ( 1 - \frac{1} {p_i} \right )$，其中 $p_i$ 为 $n$ 的所有质因数，$n$ 为不是 $0$ 的整数。

#### 一些性质
1. $\varphi (1) = 1$。
2. 若 $n$ 是质数 $p$ 的 $k$ 次幂，则 $\varphi (n) = p^k - p^{k - 1} = (p - 1)p^{k - 1}$。
3. 欧拉函数是积性函数，但不是完全积性函数。
4. 当 $n > 1$ 时，$\sum_{i = 1}^{n} i \cdot \left [ gcd(i, n) = 1 \right ] = \frac{n \cdot \varphi(n)} {2}$。
5. 欧拉定理：对于互质的整数 $a, n$，有 $a ^ {\varphi(n)} \equiv 1 \ (\text{mod n})$，那么 $a ^ x \equiv a ^ {x \text{ mod } \varphi(n)} \ (\text{mod n})$。
6. 扩展欧拉定理：对于不互质的整数 $a, n$，$a ^ x \equiv a ^ {x \text{ mod } \varphi(n) + \varphi(n)} \ (\text{mod }n)(x \geq \varphi(n))$。
7. 若 $p \ | \ i$，$p$ 是质数，那么 $\varphi(i * p) = p * \varphi(i)$，否则 $\varphi(p * i) = (p - 1) * \varphi(i)$
8. $\sum_{d | n}\varphi(d) = n$

#### 求 phi
根据通式暴力求解即可，复杂度 $O(\sqrt{n})$，可以使用 Pollard-Rho 将复杂度降为 $O(\sqrt[4]{n})$。
``` cpp
inline int getPhi(int p) {
    register int ret = p;
    for (register int i = 2; i * i <= p; i++) {
        (p % i == 0) ? ret = ret / i * (i - 1) : 0;
        while (p % i == 0) p /= i;
    }
    return (p != 1) ? ret / p * (p - 1) : ret;
}
```
#### 筛 phi
根据性质 1，7 即可线筛 phi。

### 狄利克雷（Dirichlet）卷积
#### 定义
定义两个数论函数 $f$, $g$ 的 $Dirichlet$ 卷积：
$$(f * g)(n) = \sum_{d | n} f(d) g(\frac{n} {d})$$

#### 一些常见积性函数
1. 除数函数 $\sigma(n)$ 表示 $n$ 的所有正因子之和，即 $\sigma(n) = \sum_{d | n \text{ and } d > 0} d$，$d(n)$ 表示 $n$ 的正因子个数，即 $d(n) = \sum_{d | n}1$。
2. 恒等函数 $id(n) = n$。
3. 单位函数 $\epsilon (n) = \left [ n = 1 \right ]$。
4. 常函数 $1(n) = 1$。

#### 一些性质
1. 交换律：$f * g = g * f$
2. 结合律：$f * g * h = f * (g * h)$
3. 分配率：$f * (g + h) = f * g + f * h$
4. 单位元：$f * \epsilon = \epsilon * f$

#### 常见卷积
1. $d(n) = \sum_{d | n}1 = \sum_{d | n}1(d)1( \frac{n} {d} ) = 1 * 1$
2. $\sigma (n) = \sum_{d | n}d = \sum_{d | n}d(d)1( \frac{n} {d} ) = d * 1$
3. $\varphi (n) = \sum_{d | n} \mu (d) \frac{n} {d} = \sum_{d | n} \mu (d)id( \frac{n} {d}) = \mu * id$
4. $\epsilon (n) = \sum_{d | n} \mu (d) = \sum_{d | n} \mu (d)1( \frac{n} {d}) = \mu * 1$

#### 一些变换
1. 由于 $\varphi = \mu * id$，$\epsilon = \mu * 1$，所以 $1 * \varphi = 1 * \mu * id$，所以 $1 * \varphi = \epsilon * id = id$，即 $\sum_{d | n} \varphi (d) = n$。
2. 由于 $\epsilon  = \mu * 1$，$\sum_{d | n} \mu (d) = \left [ n = 1 \right ]$

#### 预处理 Dirichlet 卷积
若已知数论函数 $f, g$ ，可以用 $O(n \log n)$ 的时间预处理出 $f * g$。
``` cpp
int f[MAXN], g[MAXN], h[MAXN];
inline void calculateDirichletProduct(int n) {
    for (register int i = 1; i * i <= n; i++) {
        for (register int j = i; i * j <= n; j++) {
            if (j == i) h[i * j] += f[i] * g[i];
            else h[i * j] += f[i] * g[j] + f[j] * g[i];
        }
    }
}
```

### 莫比乌斯函数
#### 定义
$$
\mu(n) =
\left\{\begin{matrix}
1 & n = 1 \\
(-1)^k & n = p_1p_2 \cdots p_k \\
0 & otherwise
\end{matrix}\right.
$$
#### 性质
**性质一：**莫比乌斯函数是积性函数。
$$\mu(a) \mu(b) = \mu(a \cdot b)$$

**性质二：**
$$\sum_{d\mid n}\mu(d) = [n = 1]$$
**证明**：
设 $n$ 有 $k (k > 0)$ 个不同的质因子，则 $n$ 所有的质因子中 $\mu \neq 0$ 的只有所有质因子次数都为 $1$ 的因子，质因子个数为 $1$ 的因子有 $\binom{k}{i}$ 个，再利用二项式定理可以得到
$$\sum_{d | n} \mu (d) = \sum_{i = 0}^{k}(-1)^i \cdot \binom{k}{i} = (1 - 1)^k = 0$$
当 $n = 1$ 时原式为 $1$，因此 $\sum_{d | n} \mu (d) = \left [ n = 1 \right ]$

> 一个结论：$\sum_{d|n}\frac{\mu(d)}{d} = \frac{\varphi(n)}{n}$

### 莫比乌斯反演
如果 $f(n),\ g(n)$ 是数论函数，且满足：
$$f(n) = \sum_{d\mid n}g(d)$$
则有莫比乌斯反演：
$$g(n) = \sum_{d\mid n}\mu(\frac n d)f(d) = \sum_{d\mid n}\mu(d)f(\frac n d)$$
即 $f = g * 1 \Leftrightarrow g = \mu * f$。  
**证明：**  
若 $f = g * 1$， 则 $f * \mu = g * (1 * \mu) = g * \epsilon = g$  
若 $g = \mu * f$，则 $g * 1 = \mu * f * 1 = \mu * 1 * f = \epsilon * f = f$

#### 变形
$$f(x)=\sum_{x|d}g(d) \Leftrightarrow g(x)=\sum_{x|d}\mu(\frac{d}{x})f(d)$$

$$f(i) = \sum_{d = 1}^{\left\lfloor\frac n i\right\rfloor}g(d\cdot i)\Rightarrow g(i) = \sum_{d = 1}^{\left\lfloor\frac n i\right\rfloor}f(d\cdot i)\mu(d)$$

### 杜教筛
#### 前置技能
##### 一
设正整数 $x, y, a, b$，其中 $a, b \leq x, y = \lfloor \frac x a \rfloor$，那么有 $\lfloor \frac y b \rfloor = \lfloor \frac {x} {ab} \rfloor$。

**证明：**  
令 $x = kab + c$，$k, c$ 为非负整数且 $c < ab$，即 $k = \lfloor \frac {x} {ab} \rfloor$。  
则 $y = \lfloor \frac x a \rfloor = kb + \lfloor \frac c a \rfloor$，由于 $\lfloor \frac c a \rfloor < b$，所以 $\lfloor \frac y b \rfloor = k$。

##### 二
设 $f, g$ 为两个数论函数，$t$ 为一个完全积性函数，且 $t(1) = 1$，有
$$f(n) = \sum_{k = 1} ^ {n}t(k)g(\lfloor \frac n k \rfloor) \Leftrightarrow g(n) = \sum_{k = 1} ^ n \mu(k)t(k)f(\lfloor \frac n k \rfloor)$$

**证明：**
考虑将原式代入，根据结论一得
$$\begin{aligned}\sum_{k = 1} ^ n \mu(k)t(k)f(\lfloor \frac n k \rfloor) &= \sum_{k = 1} ^ n\mu(k)t(k)\sum_{i = 1} ^ {\lfloor \frac n k \rfloor}t(i)g(\lfloor \frac {n} {ki} \rfloor) \\
&= \sum_{j = 1} ^ n g(\lfloor \frac n j \rfloor)\sum_{i | j}\mu(i)t(i)t(\frac j i) \\
&= \sum_{j = 1} ^ n g(\lfloor \frac n j \rfloor)t(j)\sum_{i | j}\mu(i)
\end{aligned}$$
由莫比乌斯反演的卷积形式得
$$\begin{aligned}\sum_{k = 1} ^ n\mu(k)t(k)f(\lfloor n k \rfloor) &= \sum_{j = 1} ^ ng(\lfloor \frac n j \rfloor)t(j)\epsilon(j) \\
&= g(n)g(1) \\
&= g(n)
\end{aligned}$$
反之亦然。

#### 主要形式
设 $f(n)$ 为一个数论函数，求
$$S(n) = \sum_{i = 1} ^ n f(i)$$

根据函数 $f(n)$ 的性质，构造一个 $S(n)$ 关于 $S(\lfloor \frac n i \rfloor)$ 的递推式，如：  
找到一个合适的数论函数 $g(n)$
$$\sum_{i = 1} ^ n \sum_{d | i}f(d)g(\frac i d) = \sum_{T = 1} ^ ng(T)\sum_{i = 1} ^ {\lfloor \frac n T \rfloor}f(i) = \sum_{i = 1} ^ ng(i)S(\lfloor \frac n i \rfloor)$$
可以得到递推式
$$g(1)S(n) = \sum_{i = 1} ^ n(f * g)(i) - \sum_{i = 2} ^ ng(i)S(\lfloor \frac n i \rfloor)$$

### 「HDU 3579」Hello Kiki
#### 链接
[HDU 3579](http://acm.hdu.edu.cn/showproblem.php?pid=3579)
#### 题解
裸的中国剩余定理，只是不一定互质。
#### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「HDU 3579」Hello Kiki 30-06-2017
 * 中国剩余定理
 * @author xehoth
 */
#include <bits/stdc++.h>

class InputOutputStream {
   private:
    static const int BUFFER_SIZE = 1024 * 1024;
    char ibuf[BUFFER_SIZE], obuf[BUFFER_SIZE], *s, *t, *oh;
    bool isEof;
    std::streambuf *cinBuf, *coutBuf;

   public:
    InputOutputStream(char *in = NULL, char *out = NULL)
        : s(ibuf), oh(obuf), isEof(false) {
        std::ios::sync_with_stdio(false);
        std::cin.tie(NULL);
        std::cout.tie(NULL);
        in ? freopen(in, "r", stdin) : 0;
        out ? freopen(out, "w", stdout) : 0;
        cinBuf = std::cin.rdbuf(), coutBuf = std::cout.rdbuf();
        t = ibuf + cinBuf->sgetn(ibuf, BUFFER_SIZE);
    }

    ~InputOutputStream() { coutBuf->sputn(obuf, oh - obuf); }

    inline char read();
    template <typename T>
    inline void read(T &);
    inline int read(char *);
    inline void print(char);
    inline void print(const char *);
    template <typename T>
    inline void print(T);
    template <typename T>
    inline InputOutputStream &operator>>(T &);
    template <typename T>
    inline InputOutputStream &operator<<(T);
    inline bool hasNext() const { return !isEof; }
} io;

#define long long long

template <typename T>
inline void exgcd(T a, T b, T &g, T &x, T &y) {
    !b ? (x = 1, y = 0, g = a) : (exgcd(b, a % b, g, y, x), y -= (a / b) * x);
}

template <typename T>
inline T excrt(T *a, T *m, int n) {
    register T M = m[0], ans = a[0], g, x, y;
    for (register int i = 1; i < n; i++) {
        exgcd(M, m[i], g, x, y);
        if ((a[i] - ans) % g) return -1;
        x = (a[i] - ans) / g * x % (m[i] / g);
        ans = (ans + x * M) % (M = M / g * m[i]);
    }
    return ans > 0 ? ans : ans + M;
}

const int MAXN = 100005;

int main() {
    register int t, n, cas = 1;
    for (io >> t; t--; cas++) {
        io >> n;
        static long a[MAXN], m[MAXN];
        for (register int i = 0; i < n; i++) io >> m[i];
        for (register int i = 0; i < n; i++) io >> a[i];
        io << "Case " << cas << ": " << excrt(a, m, n) << '\n';
    }
    return 0;
}

inline char InputOutputStream::read() {
    s == t ? t = (s = ibuf) + cinBuf->sgetn(ibuf, BUFFER_SIZE) : 0;
    return (char)(s == t ? -1 : *s++);
}

template <typename T>
inline void InputOutputStream::read(T &x) {
    register char c;
    register bool iosig = false;
    for (c = read(); !isdigit(c); c = read()) {
        if (c == -1) return (void)(isEof = true);
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read()) x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

inline int InputOutputStream::read(char *buf) {
    register int s = 0;
    register char c;
    while (c = read(), isspace(c) && c != -1)
        ;
    if (c == -1) {
        *buf = 0, isEof = true;
        return -1;
    }
    do
        buf[s++] = c;
    while (c = read(), !isspace(c) && c != -1);
    c == -1 ? isEof = true : 0;
    buf[s] = 0;
    return s;
}

inline void InputOutputStream::print(char c) {
    oh == obuf + BUFFER_SIZE ? (coutBuf->sputn(obuf, BUFFER_SIZE), oh = obuf)
                             : 0;
    *oh++ = c;
}

inline void InputOutputStream::print(const char *s) {
    for (; *s; s++) print(*s);
}

template <typename T>
inline void InputOutputStream::print(T x) {
    static int buf[30], cnt;
    if (x == 0) {
        print('0');
    } else {
        x < 0 ? (print('-'), x = -x) : 0;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

template <typename T>
inline InputOutputStream &InputOutputStream::operator>>(T &x) {
    read(x);
    return *this;
}

template <typename T>
inline InputOutputStream &InputOutputStream::operator<<(T x) {
    print(x);
    return *this;
}
```
### 「BZOJ 1101」Zap
#### 链接
[BZOJ 1101](http://www.lydsy.com/JudgeOnline/problem.php?id=1101)
#### 题解
此题就是求
$$\sum_{i = 1} ^ n \sum_{j = 1} ^ m [\gcd(i, j) = k]$$
令 $f(k)$ 为 $\gcd(i, j) = k$ 的个数，$g(k)$ 为 $k \ | \ \gcd(i, j)$ 的对数，则
$$g(k) = \sum_{x = 1} ^ {\lfloor \frac n k \rfloor}f(k \cdot x)$$
若 $i, j$ 能被 $k$ 整除，那么它们可以写成 $i = k * x_1, j = k * x_2$，的形式，我们只需要求有多少对 $x_1, x_2$ 即可，则
$$g(k) = \lfloor \frac n k \rfloor \lfloor \frac m k \rfloor$$
根据莫比乌斯反演的变形可得
$$\begin{aligned}f(k) &= \sum_{x = 1}^{\left\lfloor\frac n k\right\rfloor}\mu(x)g(k\cdot x)\\&=\sum_{x = 1}^{\left\lfloor\frac n k\right\rfloor}\mu(x)\left\lfloor\frac n {kx}\right\rfloor\left\lfloor\frac m {kx}\right\rfloor\end{aligned}$$
由于 $\lfloor \frac n d \rfloor $ 只有 $O(\sqrt{n})$ 种取值，且取值是连续的，所以 $\lfloor \frac {n} {kx} \rfloor, \lfloor \frac {m} {kx} \rfloor$，同时不变的段数有 $O(\sqrt{n} + \sqrt{m})$ 个。  
对于相等的段，我们求取 $\mu$ 的前缀和，即可批量计算这个段的答案。

对于位置 $i$，找到下一个相等的位置的代码为 `min(n / (n / i), m / (m / i))`。对于 $n$，我们要找到最大的 $j$，满足：
$$\lfloor \frac n j \rfloor \geq \lfloor \frac n i \rfloor$$
可以拆掉左边的底：
$$\frac n j \geq \lfloor \frac n i \rfloor$$
化简可得：
$$j \leq \lfloor \frac {n} {\lfloor \frac n i \rfloor} \rfloor$$
所以 $j = \lfloor \frac {n} {\lfloor \frac n i \rfloor} \rfloor$，对于 $m$ 同理，这个复杂度就是 $O(\sqrt{n} + \sqrt{m})$。
#### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「BZOJ 1101」 18-07-2017
 * 莫比乌斯反演
 * @author xehoth
 */
#include <bits/stdc++.h>

namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template <typename T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read()) x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

inline int read(char *buf) {
    register int s = 0;
    register char c;
    while (c = read(), isspace(c) && c != -1)
        ;
    if (c == -1) {
        *buf = 0;
        return -1;
    }
    do
        buf[s++] = c;
    while (c = read(), !isspace(c) && c != -1);
    buf[s] = 0;
    return s;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, oh - obuf, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template <typename T>
inline void print(T x) {
    static int buf[30], cnt;
    if (x == 0) {
        print('0');
    } else {
        x < 0 ? (print('-'), x = -x) : 0;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void flush() { fwrite(obuf, 1, oh - obuf, stdout); }
}

namespace Task {

const int MAXN = 50010;

int prime[MAXN], mu[MAXN], cnt, sum[MAXN];
bool vis[MAXN];

inline void fastLinearSieveMethod(const int n) {
    mu[1] = 1;
    for (register int i = 2; i <= n; i++) {
        if (!vis[i]) prime[cnt++] = i, mu[i] = -1;
        for (register int j = 0, tmp; j < cnt && (tmp = i * prime[j]) <= n;
             j++) {
            vis[tmp] = true;
            if (i % prime[j] == 0) {
                mu[tmp] = 0;
                break;
            } else {
                mu[tmp] = -mu[i];
            }
        }
    }
    for (register int i = 1; i <= n; i++) sum[i] = sum[i - 1] + mu[i];
}

inline int solve(int n, int m) {
    if (n > m) std::swap(n, m);
    register int ans = 0, pos;
    for (register int i = 1; i <= n; i = pos + 1) {
        pos = std::min(n / (n / i), m / (m / i));
        ans += (sum[pos] - sum[i - 1]) * (n / i) * (m / i);
    }
    return ans;
}

inline void solve() {
    using namespace IO;
    register int t;
    fastLinearSieveMethod(50000);
    read(t);
    for (register int i = 0, a, b, c; i < t; i++) {
        read(a), read(b), read(c);
        print(solve(a / c, b / c)), print('\n');
    }
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    Task::solve();
    IO::flush();
    return 0;
}
```
### 「BZOJ 2820」YY的GCD
#### 链接
[BZOJ 2820](http://www.lydsy.com/JudgeOnline/problem.php?id=2820)
#### 题解
这道题就是求
$$\sum_{p}\sum_{i = 1} ^ n\sum_{j = 1} ^ m[\gcd(i, j) = p]$$
其中 $p$ 为质数，令
$$f(k) = \sum_{i = 1} ^ n\sum_{j = 1} ^ m[\gcd(i, j) = k]$$
根据上题的推导我们知道：
$$f(k) = \sum_{x = 1}^{\left\lfloor\frac n k\right\rfloor}\mu(x)\left\lfloor\frac n {kx}\right\rfloor\left\lfloor\frac m {kx}\right\rfloor$$
于是
$$\sum_{p}\sum_{i = 1} ^ n\sum_{j = 1} ^ m[\gcd(i, j) = p] = \sum_p \sum_{x = 1}^{\left\lfloor\frac n p\right\rfloor}\mu(x)\left\lfloor\frac n {px}\right\rfloor\left\lfloor\frac m {px}\right\rfloor$$
令 $T = px$，我们在外层枚举 $T$ 然后对每个质因子计算 $\mu$
$$\sum_{T = 1} ^ n\lfloor \frac n T \rfloor \lfloor \frac m T \rfloor\sum_{k | T}\mu(\frac T k)$$
令
$$f(T) = \sum\limits_{k \mid T} \mu(\frac{T}{k})$$
$$T = p_1 ^ {x_1} \times p_2 ^ {x_2} \times \cdots \times p_n ^ {x_n}$$
$$T' = p_1 ^ {x_1 - 1} \times p_2 ^ {x_2} \times \cdots \times p_n ^ {x_n}$$
考虑线性筛 $\mu$ 的过程，当 $T' \text{ mod } p_1 = 0$ 时
$$f(T') = \sum_{i = 2} ^ k \mu(\frac {T'} {p_i})$$
$$\begin{aligned}f(T) &= \sum_{i = 1} ^ k \mu(\frac {T} {p_i}) \\
&= \mu(\frac {T} {p_1}) + \sum_{i = 2} ^ k \mu(\frac {T} {p_i}) \\
&= \mu(T') + \sum_{i = 2} ^ k \mu(\frac {T'} {p_i} \times p_1) \\
&= \mu(T') + \sum_{i = 2} ^ k \mu(\frac {T'} {p_i}) \times \mu(p_1) 
\end{aligned}$$
由于 $\mu(p_1) = -1$，那么
$$f(T) = \mu(T') - f(T')$$

当 $x_1 > 1$ 时，$\mu(p_1 ^ {x_1}) = 0$，则
$$\begin{aligned}f(T) &= \sum_{i = 1} ^ k \mu(\frac {T} {p_i}) \\
&= \mu(\frac {T} {p_1}) + \sum_{i = 2} ^ k \mu(\frac {T} {p_i}) \\
&= \mu(T') + \sum_{i = 2} ^ k \mu(\frac {T} {p_i \times p_1 ^ {x_1}} \times p_1 ^ {x_1}) \\
&= \mu(T') + \sum_{i = 2} ^ k \mu(\frac {T} {p_i \times p_1 ^ {x_1}}) \times \mu(p_1 ^ {x_1}) \\
&= \mu(T')
\end{aligned}$$
所以我们线筛预处理后分块回答询问即可。
#### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「BZOJ 2820」 18-07-2017
 * 莫比乌斯反演
 * @author xehoth
 */
#include <bits/stdc++.h>

namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template <typename T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read()) x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template <typename T>
inline void print(T x) {
    static int buf[30], cnt;
    if (x == 0) {
        print('0');
    } else {
        x < 0 ? (print('-'), x = -x) : 0;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void flush() { fwrite(obuf, 1, oh - obuf, stdout); }
}

namespace Task {

const int MAXN = 10000001;

int prime[MAXN], mu[MAXN], f[MAXN], cnt, sum[MAXN];
bool vis[MAXN];

#define long long long

inline void fastLinearSieveMethod(const int n) {
    mu[1] = 1;
    for (register int i = 2; i <= n; i++) {
        if (!vis[i]) prime[cnt++] = i, mu[i] = -1, f[i] = 1;
        for (register int j = 0, tmp; j < cnt && (tmp = i * prime[j]) <= n;
             j++) {
            vis[tmp] = true;
            if (i % prime[j] == 0) {
                mu[tmp] = 0, f[tmp] = mu[i];
                break;
            } else {
                mu[tmp] = -mu[i], f[tmp] = mu[i] - f[i];
            }
        }
    }
    for (register int i = 1; i <= n; i++) sum[i] = sum[i - 1] + f[i];
}

inline long solve(int n, int m) {
    n > m ? std::swap(n, m) : (void)0;
    register long ans = 0;
    for (register int i = 1, pos; i <= n; i = pos + 1) {
        pos = std::min(n / (n / i), m / (m / i));
        ans += (sum[pos] - sum[i - 1]) * (long)(n / i) * (long)(m / i);
    }
    return ans;
}

inline void solve() {
    using namespace IO;
    fastLinearSieveMethod(10000000);
    register int t;
    read(t);
    while (t--) {
        register int n, m;
        read(n), read(m);
        print(solve(n, m)), print('\n');
    }
}

#undef long
}

int main() {
    Task::solve();
    IO::flush();
    return 0;
}
```
### 「SDOI 2014」数表
#### 链接
[BZOJ 3529](http://www.lydsy.com/JudgeOnline/problem.php?id=3529)
#### 题解
令 $\sigma(n)$ 表示 $n$ 的约数和，则第 $i$ 行第 $j$ 列的数为 $\sigma(\gcd(i, j))$，令 $f(k)$ 为 $\gcd(i, j) = k$ 的个数，我们考虑分开枚举每一个 $d = \gcd(i, j)$，它对答案的贡献为 $\sigma(d) \times f(d)$，由 `「BZOJ 1101」Zap` 的式子我们知道
$$f(k) = \sum_{x = 1}^{\left\lfloor\frac n k\right\rfloor}\mu(x)\left\lfloor\frac n {kx}\right\rfloor\left\lfloor\frac m {kx}\right\rfloor$$
与上题相同，我们令 $T = kx$，我们在外层枚举 $T$ 然后然后对每个质因子计算 $\mu$
$$\sum_{T = 1} ^ n\lfloor \frac n T \rfloor \lfloor \frac m T \rfloor\sum_{k | T}\mu(\frac T k)$$
故答案
$$\begin{aligned}\sum_{i = 1, i \leq a} ^ n\sigma(i)f(i) &= \sum_{i = 1, i \leq a} ^ n\sigma(i)\sum_{T = 1} ^ n\lfloor \frac n T \rfloor \lfloor \frac m T \rfloor\sum_{i | T}\mu(\frac T i) \\
&= \sum_{T = 1} ^ n\lfloor \frac n T \rfloor \lfloor \frac m T \rfloor \sum_{i | T, i \leq a}\sigma(i)\mu(\frac T i)\end{aligned}$$

由于有 $a$ 的限制，我们不能直接线筛，我们可以把所有的询问按 $a$ 从小到大排序，然后把 $\sigma(x)$ 依次加进去，用树状数组维护前缀和，依次处理询问，时间复杂度为 $O(Q\sqrt{n}\log n + n \log ^ 2n)$。

#### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「SDOI 2014」数表 19-07-2017
 * 莫比乌斯反演
 * @author xehoth
 */
#include <bits/stdc++.h>

namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template <typename T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read()) x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template <typename T>
inline void print(T x) {
    static int buf[30], cnt;
    if (x == 0) {
        print('0');
    } else {
        x < 0 ? (print('-'), x = -x) : 0;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void flush() { fwrite(obuf, 1, oh - obuf, stdout); }
}

namespace Task {

typedef unsigned int uint;
const int MAXN = 100000;

int prime[MAXN + 10], tot, n, m, max;
bool vis[MAXN + 10];
int t, id[MAXN + 10], sigma[MAXN + 10], mul[MAXN + 10], cnt[MAXN + 10];
uint mu[MAXN + 10], ans[MAXN + 10];

inline void fastLinearSieveMethod(const int n) {
    sigma[1] = mu[1] = 1;
    for (register int i = 2; i <= n; i++) {
        if (!vis[i]) {
            prime[tot++] = i, mu[i] = -1, cnt[i] = 1;
            mul[i] = i + 1, sigma[i] = i + 1;
        }
        for (register int j = 0, tmp; j < tot && (tmp = i * prime[j]) <= n;
             j++) {
            vis[tmp] = true;
            if (i % prime[j] == 0) {
                mu[tmp] = 0, cnt[tmp]++, mul[tmp] = mul[i] * prime[j] + 1;
                sigma[tmp] = sigma[i] / mul[i] * mul[tmp];
                break;
            } else {
                mu[tmp] = -mu[i], cnt[tmp] = 1, mul[tmp] = prime[j] + 1;
                sigma[tmp] = (prime[j] + 1) * sigma[i];
            }
        }
    }
}

struct BinaryIndexedTree {
    uint d[MAXN + 10];

    inline void modify(int x, uint v) {
        for (; x <= max; x += x & -x) d[x] += v;
    }

    inline uint query(int x) {
        register uint ret = 0;
        for (; x; x ^= x & -x) ret += d[x];
        return ret;
    }
} bit;

struct Query {
    int l, n, m, id;

    inline bool operator<(const Query &b) const { return l < b.l; }
} que[MAXN + 10];

inline bool cmp(const int x, const int y) { return sigma[x] < sigma[y]; }

inline void solve() {
    using namespace IO;
    read(t);
    for (register int i = 1; i <= t; i++) {
        read(que[i].n), read(que[i].m), read(que[i].l), que[i].id = i;
        max = std::max(max, std::max(que[i].n, que[i].m));
    }
    fastLinearSieveMethod(max);
    for (register int i = 1; i <= max; i++) id[i] = i;
    std::sort(id + 1, id + max, cmp);

    std::sort(que + 1, que + t + 1);
    for (register int i = 1, p = 1; i <= t; i++) {
        while (p <= max && sigma[id[p]] <= que[i].l) {
            for (register int x = id[p]; x <= max; x += id[p])
                bit.modify(x, sigma[id[p]] * mu[x / id[p]]);
            p++;
        }
        n = que[i].n, m = que[i].m, n > m ? std::swap(n, m) : (void)0;
        for (register int p = 1, q; p <= n; p = q + 1) {
            q = std::min(n / (n / p), m / (m / p));
            ans[que[i].id] += (uint)(n / p) * (uint)(m / p) *
                              (bit.query(q) - bit.query(p - 1));
        }
    }
    for (register int i = 1; i <= t; i++)
        print(ans[i] & ((uint)(1 << 31) - 1)), print('\n');
}
}

int main() {
    Task::solve();
    IO::flush();
    return 0;
}
```
### 「51 NOD 1244」莫比乌斯函数之和
#### 链接
[51 NOD 1244](http://www.51nod.com/onlineJudge/questionCode.html#!problemId=1244)
#### 题解
裸的杜教筛，根据上面所说的杜教筛的主要形式有
$$g(1)S(n) = \sum_{i = 1} ^ n(f * g)(i) - \sum_{i = 2} ^ ng(i)S(\lfloor \frac n i \rfloor)$$
所以我们只需要找到一个合适的数论函数 $g(n)$ 使得我们可以快速计算 $f * g$ 和 $\sum_{i = 2} ^ ng(i)$。  
注意到
$$\mu * 1 = \epsilon$$
我们令 $g$ 为常函数 $1$，那么
$$S(n) = \sum_{i = 1} ^ n\epsilon(i) - \sum_{i = 2} ^ nS(\lfloor \frac n i \rfloor) = 1 - \sum_{i = 2} ^ nS(\lfloor \frac n i \rfloor)$$
#### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「51 NOD 1244」莫比乌斯函数之和 20-07-2017
 * 杜教筛
 * @author xehoth
 */
#include <bits/stdc++.h>

namespace Task {

#define long long long
const int MAXN = 4641588 + 100;

int prime[MAXN], mu[MAXN], cnt;
long sum[MAXN];
bool vis[MAXN];

long blockSize, bound, sieveBlockSize;
const int MAX_BLOCK_SIZE = 100000 + 10;
long buc1[MAX_BLOCK_SIZE], buc2[MAX_BLOCK_SIZE];

inline void fastLinearSieveMethod(const int n) {
    mu[1] = 1;
    for (register int i = 2; i <= n; i++) {
        if (!vis[i]) prime[cnt++] = i, mu[i] = -1;
        for (register int j = 0, tmp; j < cnt && (tmp = i * prime[j]) <= n;
             j++) {
            vis[tmp] = true;
            if (i % prime[j] == 0) {
                mu[tmp] = 0;
                break;
            } else {
                mu[tmp] = -mu[i];
            }
        }
    }
    for (register int i = 1; i <= n; i++) sum[i] = sum[i - 1] + mu[i];
}

inline long &get(long x) { return x < blockSize ? buc1[x] : buc2[bound / x]; }

inline long sieveMain(long x) {
    if (x <= sieveBlockSize) return sum[x];
    register long &cur = get(x);
    if (cur != LLONG_MAX) return cur;
    register long ret = 1;
    for (register long i = 2, pos; i <= x; i = pos + 1)
        pos = x / (x / i), ret -= (pos - i + 1) * sieveMain(x / i);
    return cur = ret;
}

inline long sieve(long x) {
    blockSize = sqrt(x) + 1, bound = x;
    std::fill(buc1, buc1 + blockSize + 1, LLONG_MAX);
    std::fill(buc2, buc2 + blockSize + 1, LLONG_MAX);
    return sieveMain(x);
}

inline void solve() {
    std::ios::sync_with_stdio(false), std::cin.tie(NULL), std::cout.tie(NULL);
    register long l, r;
    std::cin >> l >> r;
    sieveBlockSize = pow(r, 2.0 / 3.0) + 1;
    fastLinearSieveMethod(sieveBlockSize);
    std::cout << sieve(r) - sieve(l - 1);
}
}

int main() {
    Task::solve();
    return 0;
}
```
### 「51 NOD 1239」欧拉函数之和
#### 链接
[51 NOD 1239](http://www.51nod.com/onlineJudge/questionCode.html#!problemId=1239)
#### 题解
杜教筛，同上有
$$g(1)S(n) = \sum_{i = 1} ^ n(f * g)(i) - \sum_{i = 2} ^ ng(i)S(\lfloor \frac n i \rfloor)$$
由于
$$\varphi = \mu * id, \epsilon = \mu * 1$$
故
$$\varphi * 1 = \epsilon * id = id$$
所以令 $g$ 为常函数 $1$，则
$$S(n) = \sum_{i = 1} ^ nid(i) - \sum_{i = 2} ^ nS(\lfloor \frac n i \rfloor) = \frac {n \times (n + 1)} {2} - \sum_{i = 2} ^ nS(\lfloor \frac n i \rfloor)$$
#### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「51 NOD 1239」欧拉函数之和 20-07-2017
 * 杜教筛
 * @author xehoth
 */
#include <bits/stdc++.h>

namespace Task {

#define long long long
const int MAXN = 4641588 + 100;
const int MOD = 1000000007;

int prime[MAXN], phi[MAXN], cnt, sum[MAXN];
bool vis[MAXN];

inline void fastLinearSieveMethod(const int n) {
    phi[1] = 1;
    for (register int i = 2; i <= n; i++) {
        if (!vis[i]) prime[cnt++] = i, phi[i] = i - 1;
        for (register int j = 0, tmp; j < cnt && (tmp = i * prime[j]) <= n;
             j++) {
            vis[tmp] = true;
            if (i % prime[j] == 0) {
                phi[tmp] = phi[i] * prime[j];
                break;
            } else {
                phi[tmp] = phi[i] * (prime[j] - 1);
            }
        }
    }
    for (register int i = 1; i <= n; i++) sum[i] = (sum[i - 1] + phi[i]) % MOD;
}

const int MAX_BLOCK_SIZE = 100000 + 10;

long blockSize, sieveBlockSize, bound;

int buc1[MAX_BLOCK_SIZE], buc2[MAX_BLOCK_SIZE];
const int INV_TWO = 500000004;

inline int &get(long x) { return x < blockSize ? buc1[x] : buc2[bound / x]; }

inline int sieveMain(long x) {
    if (x <= sieveBlockSize) return sum[x];
    register int &cur = get(x);
    if (cur != INT_MAX) return cur;
    register int ret = ((x % MOD) * ((x + 1) % MOD) % MOD) * INV_TWO % MOD;
    for (register long i = 2, pos; i <= x; i = pos + 1)
        pos = x / (x / i),
        ret = (ret - (pos - i + 1) * (long)sieveMain(x / i) % MOD + MOD) % MOD;
    ret = (ret % MOD + MOD) % MOD;
    return cur = ret;
}

inline int sieve(long x) {
    blockSize = sqrt(x) + 1, bound = x;
    std::fill(buc1, buc1 + blockSize + 1, INT_MAX);
    std::fill(buc2, buc2 + blockSize + 1, INT_MAX);
    return sieveMain(x);
}

inline void solve() {
    std::ios::sync_with_stdio(false), std::cin.tie(NULL), std::cout.tie(NULL);
    register long n;
    std::cin >> n;
    sieveBlockSize = pow(n, 2.0 / 3.0) + 1;
    fastLinearSieveMethod(sieveBlockSize);
    std::cout << sieve(n) << "\n";
}
#undef long
}

int main() {
    Task::solve();
    return 0;
}
```
### 「BZOJ 3944」Sum
#### 链接
[BZOJ 3944](http://www.lydsy.com/JudgeOnline/problem.php?id=3944)
#### 题解
把上面两题合在一起就完了...
#### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「BZOJ 3944」Sum 21-07-2017
 * 杜教筛
 * @author xehoth
 */
#include <bits/stdc++.h>

namespace Task {

#define long long long
const int MAXN = 2000000 + 100;

int prime[MAXN], mu[MAXN], phi[MAXN], cnt;
long muSum[MAXN], phiSum[MAXN];
bool vis[MAXN];

long blockSize, bound, sieveBlockSize;
const int MAX_BLOCK_SIZE = 46341 + 10;
long buc1[MAX_BLOCK_SIZE], buc2[MAX_BLOCK_SIZE];

inline void fastLinearSieveMethod(const int n) {
    mu[1] = 1, phi[1] = 1;
    for (register int i = 2; i <= n; i++) {
        if (!vis[i]) prime[cnt++] = i, mu[i] = -1, phi[i] = i - 1;
        for (register int j = 0, tmp; j < cnt && (tmp = i * prime[j]) <= n;
             j++) {
            vis[tmp] = true;
            if (i % prime[j] == 0) {
                mu[tmp] = 0, phi[tmp] = phi[i] * prime[j];
                break;
            } else {
                mu[tmp] = -mu[i], phi[tmp] = phi[i] * (prime[j] - 1);
            }
        }
    }
    for (register int i = 1; i <= n; i++) muSum[i] = muSum[i - 1] + mu[i];
    for (register int i = 1; i <= n; i++) phiSum[i] = phiSum[i - 1] + phi[i];
}

inline long &get(long x) { return x < blockSize ? buc1[x] : buc2[bound / x]; }

inline long sieveMuMain(long x) {
    if (x <= sieveBlockSize) return muSum[x];
    register long &cur = get(x);
    if (cur != LLONG_MAX) return cur;
    register long ret = 1;
    for (register long i = 2, pos; i <= x; i = pos + 1)
        pos = x / (x / i), ret -= (pos - i + 1) * sieveMuMain(x / i);
    return cur = ret;
}

inline long sievePhiMain(long x) {
    if (x <= sieveBlockSize) return phiSum[x];
    register long &cur = get(x);
    if (cur != LLONG_MAX) return cur;
    register long ret = x * (x + 1) >> 1;
    for (register long i = 2, pos; i <= x; i = pos + 1)
        pos = x / (x / i), ret -= (pos - i + 1) * sievePhiMain(x / i);
    return cur = ret;
}

inline void initSieve(int x) {
    blockSize = sqrt(x) + 1, bound = x;
    std::fill(buc1, buc1 + blockSize + 1, LLONG_MAX);
    std::fill(buc2, buc2 + blockSize + 1, LLONG_MAX);
}

inline void solve() {
    std::ios::sync_with_stdio(false), std::cin.tie(NULL), std::cout.tie(NULL);
    sieveBlockSize = 2000000 + 1;
    fastLinearSieveMethod(sieveBlockSize);
    register int T;
    std::cin >> T;
    while (T--) {
        register long n;
        std::cin >> n;
        initSieve(n);
        std::cout << sievePhiMain(n) << ' ';
        initSieve(n);
        std::cout << sieveMuMain(n) << '\n';
    }
}
}

int main() {
    Task::solve();
    return 0;
}
```
### 「HDU 5608」function
#### 链接
[HDU 5608](http://acm.hdu.edu.cn/showproblem.php?pid=5608)
#### 题解
题意就是
$$\sum_{d | n}f(d) = n ^ 2 - 3n + 2$$
求
$$\sum_{i = 1} ^ nf(i) \text{ mod }10 ^ 9 + 7$$

这题显然是杜教筛，考虑通式
$$g(1)S(n) = \sum_{i = 1} ^ n(f * g)(i) - \sum_{i = 2} ^ ng(i)S(\lfloor \frac n i \rfloor)$$
由于
$$f * 1 = \sum_{d | n}f(d) = n ^ 2 - 3n + 2$$
令 $g$ 为常函数 $1$，则
$$\begin{aligned}S(n) &= \sum_{i = 1} ^ n i ^ 2 - 3i + 2 - \sum_{i = 2} ^ nS(\lfloor \frac n i \rfloor) \\
&= \sum_{i = 1} ^ n i ^ 2 - 3\sum_{i = 1} ^ ni + 2n - \sum_{i = 2} ^ nS(\lfloor \frac n i \rfloor) \\
&= \frac {n * (n + 1) * (2n + 1)} {6} - \frac {3n * (n + 1)} {2} + 2n - \sum_{i = 2} ^ nS(\lfloor \frac n i \rfloor) \\
&= \frac {n * (2n ^ 2 + 3n + 1 - 9n - 9 + 12)} {6} - \sum_{i = 2} ^ nS(\lfloor \frac n i \rfloor) \\
&= \frac {n * (n - 1) * (n - 2)} {3} - \sum_{i = 2} ^ nS(\lfloor \frac n i \rfloor)
\end{aligned}$$
接下来我们只需要预处理前 $n ^ {\frac 2 3}$ 的 $S$ 就可以了，令
$$h(n) = \sum_{d | n}f(d) = f * 1$$
由莫比乌斯反演，有
$$f = \mu * h$$
故
$$\begin{aligned}S(n) &= \sum_{i = 1} ^ nf(i) \\
&= \sum_{i = 1} ^ n\sum_{d | i}h(i)\mu(\frac i d) \\
&= \sum_{i = 1} ^ n\sum_{d | i}(i ^ 2 - 3i + 2)\mu(\frac i d) \\
&= \sum_{i = 1} ^ n\sum_{d | i}(i - 1)(i - 2)\mu(\frac i d)
\end{aligned}$$
然后我们就可以 $O(n \log n)$ 预处理前 $n ^ {\frac 2 3}$ 的 $S$ 了，故时间复杂度为 $O(\frac 2 3n ^ {\frac 2 3}\log n + Tn ^ {\frac 2 3})$
#### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「HDU 5608」function 22-07-2017
 * 莫比乌斯反演 + 杜教筛
 * @author xehoth
 */
#include <bits/stdc++.h>

namespace Task {

#define long long long

const int MOD = 1e9 + 7;
const int MAXN = 1000000 + 10;
const int INV_THREE = 333333336;

int sieveBlockSize, blockSize, bound;
int buc1[MAXN], buc2[MAXN], f[MAXN], mu[MAXN], cnt, prime[MAXN];
bool vis[MAXN];

inline int &get(int x) { return x < blockSize ? buc1[x] : buc2[bound / x]; }

inline int g(int x) { return (long)(x - 1) * (x - 2) % MOD; }

inline void fastLinearSieveMathod(const int n) {
    mu[1] = 1;
    for (register int i = 2; i <= n; i++) {
        if (!vis[i]) prime[cnt++] = i, mu[i] = -1;
        for (register int j = 0, tmp; j < cnt && (tmp = i * prime[j]) <= n;
             j++) {
            vis[tmp] = true;
            if (i % prime[j] == 0) {
                mu[tmp] = 0;
                break;
            } else {
                mu[tmp] = -mu[i];
            }
        }
    }
    for (register int i = 1; i <= n; i++)
        for (register int j = i; j <= n; j += i)
            f[j] = (f[j] + (long)g(i) * mu[j / i] % MOD + MOD) % MOD;
    for (register int i = 1; i <= n; i++) f[i] = (f[i] + f[i - 1]) % MOD;
}

inline int sieveMain(int x) {
    if (x <= sieveBlockSize) return f[x];
    register int &cur = get(x);
    if (cur != INT_MAX) return cur;
    register int ret =
        (long)x * (x - 1) % MOD * (long)(x - 2) % MOD * INV_THREE % MOD;
    for (register int i = 2, pos; i <= x; i = pos + 1)
        pos = x / (x / i),
        ret = (ret - (long)(pos - i + 1) * sieveMain(x / i) % MOD + MOD) % MOD;
    return cur = ret;
}

inline int sieve(int x) {
    blockSize = sqrt(x) + 1, bound = x;
    std::fill(buc1, buc1 + blockSize + 1, INT_MAX);
    std::fill(buc2, buc2 + blockSize + 1, INT_MAX);
    return sieveMain(x);
}

inline void solve() {
    std::ios::sync_with_stdio(false), std::cin.tie(NULL), std::cout.tie(NULL);
    sieveBlockSize = 1000000, fastLinearSieveMathod(sieveBlockSize);
    register int T, n;
    std::cin >> T;
    while (T--) std::cin >> n, std::cout << sieve(n) << '\n';
}

#undef long
}

int main() {
    Task::solve();
    return 0;
}
```

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=786262&auto=1&height=66"></iframe>