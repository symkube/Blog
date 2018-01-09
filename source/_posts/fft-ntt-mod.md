---
title: 三模数 NTT 与拆系数 FFT
date: 2018-01-09 21:13:43
tags:
  - FFT
categories:
  - OI
  - FFT
---
## 三模数 NTT 与拆系数 FFT
两个长度为 $10 ^ 5$ 级别的多项式相乘，对 $10 ^ 9$ 级别任意模数取模。

<!-- more -->

### 三模数 NTT
注意到卷积之后每个数可以达到 $10 ^ {23}$ 的级别，一种方法是利用 `__int128` 类型或高精度，但前者很多地方无法使用，后者效率太低。

另一种方法是利用中国剩余定理来合并（需要一些实现上的技巧来避免高精度），我们可以选三个满足 NTT 性质并且乘起来 $\gt 10 ^ {23}$，设模数分别为 $m_1, m_2, m_3$，真正要模的模数为 $m$ 我们可以得到
{% raw %}$$\begin{aligned}\mathrm{ans} \equiv a_1 \pmod {m_1}\\
\mathrm{ans} \equiv a_2 \pmod {m_2}\\
\mathrm{ans} \equiv a_3 \pmod {m_3}\end{aligned}$${% endraw %}
先用中国剩余定理合并前两个模数，令 $M = m_1 \times m_2$，则
{% raw %}$$\begin{aligned}\mathrm{ans}& \equiv A \pmod {M}\\
\mathrm{ans} &\equiv a_3 \pmod {m_3}\end{aligned}$${% endraw %}

令
$$\mathrm{ans} = kM + A = xm_3 + a_3$$

于是我们可以在 $\bmod m_3$ 的意义下求解 $k$ 的值，那么有
$$kM \equiv a_3 - A \pmod {m_3}$$
$xm_3$ 在 $\bmod m_3$ 的意义下被消掉了，于是我们得到
$$k \equiv (a_3 - A)M ^ {-1} \pmod {m_3}$$

于是我们只要求出 $k$ 后代入 $\mathrm{ans} = kM + A$ 并 $\bmod m$ 就得出答案了，可以发现这个过程都可以在 $64$ 位整数范围内完成。

### 拆系数 FFT
对于 FFT 来说，取模的一种方法是使用 `long double / __float128` 强行算完后 `fmod`，但是实践证明其精度是达不到要求的（即使使用黑科技 `std::decimal::decimal64/decimal128`，前者同样爆精，后者答案正确却常数过大，不过在时间不够的时候也可以考虑）。

设模数为 $M$，$M_0 = \lceil \sqrt{M} \rceil$，那么一个数 $x$ 可以被表示为 $kM_0 + b$，现在我们要对多项式 $A(x), B(x)$（系数分别为 $a_i, b_i$）做笛卡尔积。

那么可以讲 $A(x)$ 分成 $k[a_i], b[a_i]$，$B(x)$ 分成 $k[b_i], b[b_i]$。

那么一个很暴力的想法就是，对上面得到的四个多项式两两之间进行卷积，然后合并，但是这样常数过大，会有 $7$ 次 FFT（慢于三模数 NTT）。

我们知道多项式乘法是可以合并做到 $2$ 次 FFT 的，于是我们可以多拆除的系数合并做 $2$ 次 DFT，计算完成后再做 $2$ 次 IDFT，这样计算次数就减少至 $4$ 次（略快于三模数 NTT，$10 ^ 6$ 时反而略慢于 NTT）。

### 「COGS 2294」释迦
给出两个长度为 $n$ 的多项式，求这两个多项式的乘积。
输出前 $0$ 次项到 $n - 1$ 次项的系数 $\bmod 23333333$

#### 链接
[COGS 2294](http://cogs.pro:8080/cogs/problem/problem.php?pid=2294)

#### 题解
按照上面的做就好了。
##### 三模数 NTT
关于 NTT 的一点技巧，由于有三个模数，我们如果每次传入模数会导致 $\mathrm{O2}$ 优化没有太大作用，我们可以考虑用模板来传模数（因为模数是我们定义的常量），这个过程会在编译的时候确定，从而使 $\mathrm{O2}$ 对常量的取模优化达到预期效果，同时由于使用 C++98，我们对于模数间两两逆元的定义应该直接写出固定值，而非表达式~~（如果能用 `constexpr` 当然好啊）~~。

``` cpp
/**
 * Copyright (c) 2017-2018, xehoth
 * All rights reserved.
 * 「COGS 2294」释迦 08-01-2018
 * 三模数 NTT
 * @author xehoth
 */
#include <bits/stdc++.h>

namespace {

inline char read() {
    static const int IN_LEN = 1 << 18 | 1;
    static char buf[IN_LEN], *s, *t;
    return (s == t) && (t = (s = buf) + fread(buf, 1, IN_LEN, stdin)),
            s == t ? -1 : *s++;
}

const int OUT_LEN = 1 << 18 | 1;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    (oh == obuf + OUT_LEN) && (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf);
    *oh++ = c;
}

template <typename T>
inline void print(T x) {
    static int buf[21], cnt;
    if (x != 0) {
        x < 0 ? (print('-'), x = -x) : 0;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
        while (cnt) print((char)buf[cnt--]);
    } else {
        print('0');
    }
}

struct InputOutputStream {
    ~InputOutputStream() {
        fwrite(obuf, 1, oh - obuf, stdout);
    }

    template <typename T>
    inline InputOutputStream &operator>>(T &x) {
        static char c;
        static bool iosig;
        for (c = read(), iosig = false; !isdigit(c); c = read()) {
            if (c == -1) return *this;
            iosig |= c == '-';
        }
        for (x = 0; isdigit(c); c = read()) x = x * 10 + (c ^ '0');
        iosig && (x = -x);
        return *this;
    }

    template <typename T>
    inline InputOutputStream &operator<<(const T &x) {
        print(x);
        return *this;
    }
} io;

const int MOD = 23333333;
const int MOD1 = 998244353;
const int MOD2 = 1004535809;
const int MOD3 = 469762049;
const int G = 3;
const int MAXN = 1 << 18 | 1;

typedef unsigned long long ulong;

int w[MAXN], a[MAXN], b[MAXN], ans1[MAXN], ans2[MAXN], *ans3 = a, tmp[MAXN];

template <int mod>
inline int modPow(register int a, register int b) {
    register int ret = 1;
    for (; b; b >>= 1, a = (ulong)a * a % mod)
        if (b & 1) ret = (ulong)ret * a % mod;
    return ret;
}

const ulong MOD1_MOD2 = 1002772198720536577ull;
const int MOD1_INV_MOD2 = 669690699/*modPow<MOD2>(MOD1, MOD2 - 2)*/;
const int MOD2_INV_MOD1 = 332747959/*modPow<MOD1>(MOD2, MOD1 - 2)*/;
const int MOD1_MOD2_INV_MOD3 = 354521948;
/*modPow<MOD3>(MOD1_MOD2 % MOD3, MOD3 - 2);*/
const int MOD1_MOD2_MOD = 15853906/*MOD1_MOD2 % MOD*/;

template <int mod>
inline void ntt(int *a, int n, int f) {
    for (register int i = 0, j = 0; i < n; i++) {
        if (i > j) std::swap(a[i], a[j]);
        for (register int k = n >> 1; (j ^= k) < k; k >>= 1)
            ;
    }
    for (register int i = 1; i < n; i <<= 1) {
        for (register int j = 0; j < n; j += i << 1) {
            register int *x = a + j, *y = a + i + j, *w = ::w + i;
            for (register int k = 0, t; k < i; k++) {
                t = (ulong)w[k] * y[k] % mod;
                y[k] = (x[k] - t <= 0 ? x[k] - t + mod : x[k] - t);
                x[k] = (x[k] + t >= mod ? x[k] + t - mod : x[k] + t);
            }
        }
    }
    
    if (f == -1) {
        std::reverse(a + 1, a + n);
        register const int inv = modPow<mod>(n, mod - 2);
        for (register int i = 0; i < n; i++) a[i] = (ulong)a[i] * inv % mod;
    }
}

template <int mod>
inline void init(const int k, int *w) {
    register int n = k >> 1;
    w[n] = 1;
    w[n + 1] = modPow<mod>(G, (mod - 1) / k);
    for (register int i = 2; i < n; i++)
        w[n + i] = (ulong)w[n + i - 1] * w[n + 1] % mod;
    for (register int i = n - 1; i > 0; i--) w[i] = w[i << 1];
}

template <int mod>
inline void mul(int *a, int *b, const int k) {
    init<mod>(k, w);
    ntt<mod>(a, k, 1);
    ntt<mod>(b, k, 1);
    for (register int i = 0; i < k; i++) a[i] = (ulong)a[i] * b[i] % mod;
    ntt<mod>(a, k, -1);
}

inline int crt(register int a1, register int a2, register int a3) {

    register ulong a = ((ulong)MOD2 * ((ulong)a1 * MOD2_INV_MOD1 % MOD1) + 
               (ulong)MOD1 * ((ulong)a2 * MOD1_INV_MOD2 % MOD2)) % MOD1_MOD2;
	return (a + (MOD3 + a3 - a % MOD3) % MOD3 * 
            MOD1_MOD2_INV_MOD3 % MOD3 * MOD1_MOD2_MOD % MOD) % MOD;
}

inline void solve() {
    register int n, k = 1;
    io >> n;
    for (register int i = 0; i < n; i++) io >> a[i];
    for (register int i = 0; i < n; i++) io >> b[i];
    for (; k < n + n;) k <<= 1;
    memcpy(ans1, a, sizeof(int) * n);
    memcpy(tmp, b, sizeof(int) * k);
    mul<MOD1>(ans1, tmp, k);
    memcpy(ans2, a, sizeof(int) * n);
    memcpy(tmp, b, sizeof(int) * k);
    mul<MOD2>(ans2, tmp, k);
    mul<MOD3>(a, b, k);
    for (register int i = 0; i < n; i++)
        io << crt(ans1[i], ans2[i], ans3[i]) << ' ';
}
}

int main() {
    freopen("annona_squamosa.in", "r", stdin);
    freopen("annona_squamosa.out", "w", stdout);
    solve();
    return 0;
}
```

##### 拆系数 FFT（朴素）
直接拆系数成四个，然后暴力 FFT，精度较好
``` cpp
/**
 * Copyright (c) 2017-2018, xehoth
 * All rights reserved.
 * 「COGS 2294」释迦 08-01-2018
 * 拆系数 FFT (朴素)
 * @author xehoth
 */
#include <bits/stdc++.h>
 
namespace {
 
inline char read() {
    static const int IN_LEN = 1 << 18 | 1;
    static char buf[IN_LEN], *s, *t;
    return (s == t) && (t = (s = buf) + fread(buf, 1, IN_LEN, stdin)),
            s == t ? -1 : *s++;
}
 
const int OUT_LEN = 1 << 18 | 1;
 
char obuf[OUT_LEN], *oh = obuf;
 
inline void print(char c) {
    (oh == obuf + OUT_LEN) && (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf);
    *oh++ = c;
}
 
template <typename T>
inline void print(T x) {
    static int buf[21], cnt;
    if (x != 0) {
        x < 0 ? (print('-'), x = -x) : 0;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
        while (cnt) print((char)buf[cnt--]);
    } else {
        print('0');
    }
}
 
struct InputOutputStream {
    ~InputOutputStream() {
        fwrite(obuf, 1, oh - obuf, stdout);
    }
 
    template <typename T>
    inline InputOutputStream &operator>>(T &x) {
        static char c;
        static bool iosig;
        for (c = read(), iosig = false; !isdigit(c); c = read()) {
            if (c == -1) return *this;
            iosig |= c == '-';
        }
        for (x = 0; isdigit(c); c = read()) x = x * 10 + (c ^ '0');
        iosig && (x = -x);
        return *this;
    }
 
    template <typename T>
    inline InputOutputStream &operator<<(const T &x) {
        print(x);
        return *this;
    }
} io;
 
const int MOD = 23333333;
const int MAXN = 1 << 18 | 1;
#define double long double
const double PI = 3.1415926535897932384626;
 
typedef unsigned long long ulong;
 
struct Complex {
    double r, i;
 
    inline Complex operator*(const Complex &x) const {
        return (Complex) {r * x.r - i * x.i, r * x.i + i * x.r};
    } 
 
    inline Complex operator+(const Complex &x) const {
        return (Complex) {r + x.r, i + x.i};
    }
 
    inline Complex operator-(const Complex &x) const {
        return (Complex) {r - x.r, i - x.i};
    }
 
    inline void operator+=(const Complex &x) {
        r += x.r;
        i += x.i;
    }
 
    inline Complex conj() const {
        return (Complex) {r, -i};
    }
} w[MAXN], a[MAXN], b[MAXN], c[MAXN], d[MAXN];
  
inline void fft(Complex *a, const int n, const int f) {
    for (register int i = 0, j = 0; i < n; i++) {
        (i > j) && (std::swap(a[i], a[j]), 0);
        for (register int k = n >> 1; (j ^= k) < k; k >>= 1)
            ;
    }
    for (register int i = 1; i < n; i <<= 1) {
        const register Complex *w = ::w + i;
        for (register int j = 0; j < n; j += i << 1) {
            register Complex *x = a + j, *y = a + i + j, t;
            for (register int k = 0; k < i; k++) {
                t = w[k] * y[k];
                y[k] = x[k] - t;
                x[k] += t;
            }
        }
    }
    if (f == -1) {
        std::reverse(a + 1, a + n);
        for (register int i = 0; i < n; i++) a[i].r /= n;
    }
}
 
inline void init(const int k) {
    register int n = k >> 1;
    w[n] = (Complex) {1, 0};
    for (register int i = 1; i < n; i++)
        w[n + i] = (Complex) {cos(2 * PI * i / k), sin(2 * PI * i / k)};
    for (register int i = n - 1; i > 0; i--) w[i] = w[i << 1];
}
 
inline void solve() {
    register int n, k = 1;
    io >> n;
    for (register int i = 0, x; i < n; i++) {
        io >> x;
        a[i].r = x >> 15;
        b[i].r = x & 32767;
    }
    for (register int i = 0, x; i < n; i++) {
        io >> x;
        c[i].r = x >> 15;
        d[i].r = x & 32767;
    }
    for (; k < n + n;) k <<= 1;
    init(k);
    fft(a, k, 1);
    fft(b, k, 1);
    fft(c, k, 1);
    fft(d, k, 1);
    for (register int i = 0; i < k; i++) {
        Complex ta = a[i], tb = b[i];
        a[i] = a[i] * c[i];
        b[i] = ta * d[i] + b[i] * c[i];
        c[i] = tb * d[i];
    }
    fft(a, k, -1);
    fft(b, k, -1);
    fft(c, k, -1);
    for (register int i = 0; i < n; i++) {
        register ulong ta = (ulong)floor(a[i].r + 0.5) % MOD, 
                       tb = (ulong)floor(b[i].r + 0.5) % MOD, 
                       tc = (ulong)floor(c[i].r + 0.5) % MOD;
        io << ((ta << 30) % MOD + (tb << 15) % MOD + tc) % MOD << ' ';
    }
}
}
 
int main() {
    freopen("annona_squamosa.in", "r", stdin);
    freopen("annona_squamosa.out", "w", stdout);
    solve();
    return 0;
}
```

##### 拆系数 FFT（合并）
容易爆精，最好使用不预处理或 FFT 过程中预处理单位跟的方法，若要预处理，不要使用递推，而应该全部通过 `cos/sin` 计算。
``` cpp
/**
 * Copyright (c) 2017-2018, xehoth
 * All rights reserved.
 * 「COGS 2294」释迦 08-01-2018
 * 拆系数 FFT (合并)
 * @author xehoth
 */
#include <bits/stdc++.h>
 
namespace {
 
inline char read() {
    static const int IN_LEN = 1 << 18 | 1;
    static char buf[IN_LEN], *s, *t;
    return (s == t) && (t = (s = buf) + fread(buf, 1, IN_LEN, stdin)),
            s == t ? -1 : *s++;
}
 
const int OUT_LEN = 1 << 18 | 1;
 
char obuf[OUT_LEN], *oh = obuf;
 
inline void print(char c) {
    (oh == obuf + OUT_LEN) && (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf);
    *oh++ = c;
}
 
template <typename T>
inline void print(T x) {
    static int buf[21], cnt;
    if (x != 0) {
        x < 0 ? (print('-'), x = -x) : 0;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
        while (cnt) print((char)buf[cnt--]);
    } else {
        print('0');
    }
}
 
struct InputOutputStream {
    ~InputOutputStream() {
        fwrite(obuf, 1, oh - obuf, stdout);
    }
 
    template <typename T>
    inline InputOutputStream &operator>>(T &x) {
        static char c;
        static bool iosig;
        for (c = read(), iosig = false; !isdigit(c); c = read()) {
            if (c == -1) return *this;
            iosig |= c == '-';
        }
        for (x = 0; isdigit(c); c = read()) x = x * 10 + (c ^ '0');
        iosig && (x = -x);
        return *this;
    }
 
    template <typename T>
    inline InputOutputStream &operator<<(const T &x) {
        print(x);
        return *this;
    }
} io;
 
const int MOD = 23333333;
const int MAXN = 1 << 18 | 1;
#define double long double
const double PI = 3.1415926535897932384626;
 
typedef unsigned long long ulong;
 
struct Complex {
    double r, i;
 
    inline Complex operator*(const Complex &x) const {
        return (Complex) {r * x.r - i * x.i, r * x.i + i * x.r};
    } 
 
    inline Complex operator+(const Complex &x) const {
        return (Complex) {r + x.r, i + x.i};
    }
 
    inline Complex operator-(const Complex &x) const {
        return (Complex) {r - x.r, i - x.i};
    }
 
    inline void operator+=(const Complex &x) {
        r += x.r;
        i += x.i;
    }
 
    inline Complex conj() const {
        return (Complex) {r, -i};
    }
} w[MAXN], a[MAXN], b[MAXN], c[MAXN], d[MAXN];
 
int ans[MAXN];
 
inline void fft(Complex *a, const int n, const int f) {
    for (register int i = 0, j = 0; i < n; i++) {
        (i > j) && (std::swap(a[i], a[j]), 0);
        for (register int k = n >> 1; (j ^= k) < k; k >>= 1)
            ;
    }
    for (register int i = 1; i < n; i <<= 1) {
        const register Complex *w = ::w + i;
        for (register int j = 0; j < n; j += i << 1) {
            register Complex *x = a + j, *y = a + i + j, t;
            for (register int k = 0; k < i; k++) {
                t = w[k] * y[k];
                y[k] = x[k] - t;
                x[k] += t;
            }
        }
    }
    if (f == -1) {
        std::reverse(a + 1, a + n);
        for (register int i = 0; i < n; i++) {
            a[i].r /= n;
            a[i].i /= n;
        }
    }
}
 
inline void init(const int k) {
    register int n = k >> 1;
    w[n] = (Complex) {1, 0};
    for (register int i = 1; i < n; i++)
        w[n + i] = (Complex) {cos(2 * PI * i / k), sin(2 * PI * i / k)};
    for (register int i = n - 1; i > 0; i--) w[i] = w[i << 1];
}
 
inline void solve() {
    register int n, k = 1;
    io >> n;
    for (register int i = 0, x; i < n; i++) {
        io >> x;
        a[i].r = x >> 13;
        a[i].i = x & 8191;
    }
    for (register int i = 0, x; i < n; i++) {
        io >> x;
        b[i].r = x >> 13;
        b[i].i = x & 8191;
    }
    for (; k < n + n;) k <<= 1;
    init(k);
    fft(a, k, 1);
    fft(b, k, 1);
    Complex t1, t2, t3, t4;
    const Complex o1 = (Complex) {0.5, 0}, o2 = (Complex) {0, -0.5};
    const Complex o = (Complex) {0, 1};
    for (register int i = 0, j; i < k; i++) {
        j = (k - i) & (k - 1);
        t1 = (a[i] + a[j].conj()) * o1;
        t2 = (a[i] - a[j].conj()) * o2;
        t3 = (b[i] + b[j].conj()) * o1;
        t4 = (b[i] - b[j].conj()) * o2;
        c[i] = (t1 * t3) + o * (t2 * t4);
        d[i] = (t1 * t4) + o * (t2 * t3);
    }
    fft(c, k, -1);
    fft(d, k, -1);
  
    for (register int i = 0, v1, v2, v3, v4; i < k; i++) {
        v1 = (ulong)round(c[i].r) % MOD;
        v2 = (ulong)round(c[i].i) % MOD;
        v3 = (ulong)round(d[i].r) % MOD;
        v4 = (ulong)round(d[i].i) % MOD;
        ans[i] = (v2 + ((ulong)v1 << 26) + (((ulong)v3 + v4) << 13)) % MOD;
    }
    for (register int i = 0; i < n; i++) io << ans[i] << '\n';
}
}
 
int main() {
    freopen("annona_squamosa.in", "r", stdin);
    freopen("annona_squamosa.out", "w", stdout);
    solve();
    return 0;
}
```