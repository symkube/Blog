---
title: 数论函数及积性函数总结
date: 2017-01-13 13:17:14
tags:
  - 数论
  - 学习笔记
categories:
  - OI
  - 学习笔记
---
> **数论函数**：定义域为正整数的函数。

## 积性函数
### 定义
> **积性函数**：对于任意两个互质的正整数 $a,b$ ，均满足 $f(ab)=f(a)f(b)$ 的函数 $f$

> **完全积性函数**：对于所有正整数 $a,b$ ，均满足 $f (ab) =  f (a) f (b)$ 的函数 $f$

> **定义逐点加法**： $(f + g)(x) = f(x) + g(x)$，$(f \cdot g)(x) = f(x)g(x)$

<!-- more -->
### 一些性质
1. 对于任意积性函数，$f(1) = 1$。
2. 对于一个大于 $1$ 的整数 $n = \prod p_i^{a_i}$，其中 $p_i$ 为互不相同的素数。那么对于一个积性函数 $f$，$f(n) = f(\prod p_i^{a_i}) = \prod f(p_i^{a_i})$;对于一个完全积性函数 $f$，$f(n) = \prod f(p_i)^{a_i}$。
3. 若 $f$,$g$ 为积性函数，则 $f \cdot g$ 也为积性函数。

## 常见积性函数
### 欧拉函数
#### 定义
> 欧拉函数 $\varphi (n)$: $\varphi (n)$ 表示 $\left [1, n \right ]$ 中与 $n$ 互质的整数的个数。

> 通式: {% raw %}$\varphi (x) = \sum_{i = 1}^{n} \left [ gcd(i, n) == 1 \right ] = x \prod_{i = 1}^n \left ( 1 - \frac{1} {p_i} \right )${% endraw %}，其中 $p_i$ 为 $x$ 的所有质因数，$x$ 为不是 $0$ 的整数。

#### 一些性质
> $\varphi (1) = 1$。

> 若 $n$ 是质数 $p$ 的 $k$ 次幂，则 {% raw %}$\varphi (n) = p^k - p^{k - 1} = (p - 1)p^{k - 1}${% endraw %}

**证明：**
考虑容斥，全集为 $p^k$，由于除了 $p$ 的倍数外，其他数都跟 $n$ 互质，故应减去 $p^k / p = p^{k - 1}$个数。

> 欧拉函数是积性函数，但不是完全积性函数

**证明：**
带入通式化简即可得到若 $m, n$ 互质，$\varphi (mn) = \varphi(m) \varphi(n)$

> 当 $n > 1$ 时，{% raw %}$\sum_{i = 1}^{n} i \cdot \left [ gcd(i, n) == 1 \right ] = \frac{n \cdot \varphi(n)} {2}${% endraw %}

**证明：**
若 $x$ 满足 $gcd(x, n) == 1$，则 $gcd(n - x, n) == 1$，故只需除以 $2$ 即可。

### 莫比乌斯函数
#### 定义
莫比乌斯函数 $\mu (n)$：
{% raw %}$$
\mu(n) =
\left\{\begin{matrix}
1 & n = 1 \\
(-1)^k & n = p_1p_2 \cdots p_k \\
0 & else
\end{matrix}\right.
$${% endraw %}
$p_i$ 为不同的质数。

### 除数函数
#### 定义
除数函数 $\sigma(n)$ 表示 $n$ 的所有正因子之和，即 {% raw %}$\sigma(n) = \sum_{d | n \text{ and } d > 0} d${% endraw %}

$d(n)$ 表示 $n$ 的正因子个数，即 $d(n) = \sum_{d | n}1$。

### 恒等函数
#### 定义
恒等函数 $id(n) = n$。

### 单位函数
#### 定义
单位函数 {% raw %}$\epsilon (n) = \left [ n == 1 \right ]${% endraw %}。

### 常函数
#### 定义
常函数 $1(n) = 1$

## 狄利克雷（Dirichlet）卷积
### 定义
定义两个数论函数 $f$, $g$ 的 $Dirichlet$ 卷积：
{% raw %}$(f * g)(n) = \sum_{d | n} f(d) g(\frac{n} {d})${% endraw %}。
### 一些性质
1. 交换律：{% raw %}$f * g = g * f${% endraw %}
2. 结合律：{% raw %}$f * g * h = f * (g * h)${% endraw %}
3. 分配率：{% raw %}$f * (g + h) = f * g + f * h${% endraw %}
4. 单位元：{% raw %}$f * \epsilon = \epsilon * f${% endraw %}

**重要性质**：若 $f, g$ 均为积性函数，则 $f * g$ 也是积性函数。（展开式子即可证明）

### 常见卷积
1. {% raw %}$d(n) = \sum_{d | n}1 = \sum_{d | n}1(d)1( \frac{n} {d} ) = 1 * 1${% endraw %}
2. {% raw %}$\sigma (n) = \sum_{d | n}d = \sum_{d | n}d(d)1( \frac{n} {d} ) = d * 1${% endraw %}
3. {% raw %}$\varphi (n) = \sum_{d | n} \mu (d) \frac{n} {d} = \sum_{d | n} \mu (d)id( \frac{n} {d}) = \mu * id${% endraw %}
4. {% raw %}$\epsilon (n) = \sum_{d | n} \mu (d) = \sum_{d | n} \mu (d)1( \frac{n} {d}) = \mu * 1${% endraw %}

**一些变换**：
1. 由于 {% raw %}$\varphi = \mu * id$，$\epsilon = \mu * 1${% endraw %}，所以 {% raw %}$1 * \varphi = 1 * \mu * id${% endraw %}，所以 {% raw %}$1 * varphi = \epsilon * id = id${% endraw %}，即 {% raw %}$\sum_{d | n} \varphi (d) = n${% endraw %}。
2. 由于 {% raw %}$\epsilon  = \mu * 1${% endraw %}，{% raw %}$\sum_{d | n} \mu (d) = \left [ n == 1 \right ]${% endraw %}

**证明**：
设 $n$ 有 $k (k > 0)$ 个不同的质因子，则 $n$ 所有的质因子中 $\mu != 0$ 的只有所有质因子次数都为 $1$ 的因子，质因子个数为 $1$ 的因子有 $\binom{k}{i}$ 个，再利用二项式定理可以得到

{% raw %}$\sum_{d | n} \mu (d) = \sum_{i = 0}^{k}(-1)^i \cdot \binom{k}{i} = (1 - 1)^k = 0${% endraw %}
当 $n = 1$ 时原式为 $1$，因此 {% raw %}$\sum_{d | n} \mu (d) = \left [ n == 1 \right ]${% endraw %}

### 预处理
若已知数论函数 $f, g$ ，可以用 $O(n \log n)$ 的时间预处理出 $f * g$。
``` cpp
/*
 * created by xehoth on 13-01-2017
 */
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
### 莫比乌斯反演
若有两个函数 $f,g$ 满足：
{% raw %}$f(n) = \sum_{d | n}g(d)$，即 $f = g * 1${% endraw %}
则他们也满足：
{% raw %}$g(n) = \sum_{d | n}\mu (d)f( \frac{n} {d})$，即 $g = \mu * f${% endraw %}

#### 证明
若 $f = g * 1$， 则 {% raw %}$f * \mu = g (*1 * \mu) = g * \epsilon = g${% endraw %}

若 $g = \mu * f$，则 {% raw %}$g * 1 = \mu * f * 1 = \mu * 1 * f = \epsilon * f = f${% endraw %}

### 快速线性筛选法
``` cpp
/*
 * created by xehoth on 13-01-2017
 */
const int MAXN = 100000;
int phi[MAXN + 10], prime[MAXN + 10], mu[MAXN + 10], tot;
bool vis[MAXN + 10];
inline void fastLinearSieveMethod() {
    mu[1] = phi[1] = 1;
    for (register int i = 2; i <= MAXN; i++) {
        if (!vis[i]) prime[++tot] = i, phi[i] = i - 1, mu[i] = -1;
        for (register int j = 1; j <= tot && i * prime[j] <= MAXN; j++) {
            vis[i * prime[j]] = 1;
            if (i % prime[j] == 0) {
                phi[i * prime[j]] = phi[i] * prime[j], mu[i * prime[j]] = 0;
                break;
            } else {
                phi[i * prime[j]] = phi[i] * (prime[j] - 1);
                mu[i * prime[j]] = -mu[i];
            }
        }
    }
}
```
### 线性递推逆元
``` cpp
inv[1] = 1;
for (register int i = 2; i <= MAXN; i++)
    inv[i] = ((-(MOD / i) * inv[MOD % i]) % MOD + MOD) % MOD;
```

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=730852&auto=1&height=66"></iframe>
