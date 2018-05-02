---
title: 优化 NTT 的性能
date: 2018-05-01 22:21:21
tags:
  - 黑科技
categories:
  - OI
---
优化 NTT 的速度。

<!-- more -->

### 常见 NTT
网上常见的 NTT 都是基于 Cooley-Tukey 的算法实现的。
这种做法在预处理 $\omega$ 及优化取模（使用蒙哥马利取模会直接 WA）后，除了 SIMD 指令集/并行没有优化的余地了。

#### 代码
``` cpp
typedef unsigned long long ulong;

const int MAXN = 1 << 18 | 1;
const int MOD = 998244353;
const int G = 3;

int k;

int n, m;
int a[MAXN], b[MAXN], w[MAXN];

inline int modPow(int a, int b) {
    int ret = 1;
    for (; b; b >>= 1, a = (ulong)a * a % MOD)
        if (b & 1) ret = (ulong)ret * a % MOD;
    return ret;
}

inline void init(int k) {
    int bn = k >> 1;
    w[bn + 0] = 1;
    w[bn + 1] = modPow(G, (MOD - 1) / k);
    for (int i = 2; i < bn; i++)
        w[bn + i] = (unsigned long long)w[bn + i - 1] * w[bn + 1] % MOD;
    for (int i = bn - 1; i > 0; i--) w[i] = w[i << 1];
}

inline void ntt(int *a, int n, int f) {
    for (int i = 0, j = 0; i < n; i++) {
        if (i > j) std::swap(a[i], a[j]);
        for (int k = n >> 1; (j ^= k) < k; k >>= 1)
            ;
    }
    for (int i = 1; i < n; i <<= 1) {
        for (int j = 0; j < n; j += i << 1) {
            int *x = a + j, *y = a + i + j, *w = ::w + i;
            for (int k = 0, t; k < i; k++) {
                t = (ulong)w[k] * y[k] % MOD;
                y[k] = (x[k] - t <= 0 ? x[k] - t + MOD : x[k] - t);
                x[k] = (x[k] + t >= MOD ? x[k] + t - MOD : x[k] + t);
            }
        }
    }
    if (f == -1) {
        std::reverse(a + 1, a + n);
        const int inv = modPow(n, MOD - 2);
        for (int i = 0; i < n; i++) a[i] = (ulong)a[i] * inv % MOD;
    }
}
```

在做 $n = 10 ^ 6$ 级别的多项式时，跑一下性能分析发现 NTT 的运算并不慢，而是位翻转的内存性能太低（预处理了位翻转数组在一定情况下反而更慢）。

### DIT 与 DIF
DIT（Decimation in Time），按时间抽取的 NTT 的一种实现就是 Cooley-Tukey 算法，即常见的实现，这里直接跳过。

DIF（Decimation in Frequency），按频率抽取的 NTT。

这里只介绍如何实现和使用 DIF，关于详细的式子推导及证明可以看[这里](http://en.dsplib.org/content/fft_dec_in_freq/fft_dec_in_freq.html)。

DIT 的实现中，其实是不含位翻转的。

DIT 的作用是输入一个正常顺序向量的 $a$，一个按位翻转后的向量 $\omega_{rev}$，输出按位翻转后的按时间抽取的信号。

DIF 的作用是输入一个按位翻转后的信号，一个按位翻转后的向量 $\omega ^ {-1}_{rev}$，输出正常顺序向量 $a$。

所以我们只需要将多项式先 DIT，做完运算后直接 DIF 就好了，这样就不需要位翻转（只需要在初始化的时候进行一次）。

#### 实现
**注意：**这里的 $\omega$ 是 Cooley-Tukey 算法中 $\omega$ 的平方根。
``` cpp
const int MOD = 998244353;
const int G = 3;
const int MAXN = 1 << 18 | 1;

int rt[MAXN], irt[MAXN];

inline int add(int x, int v) { return x + v >= MOD ? x + v - MOD : x + v; }
inline int dec(int x, int v) { return x - v < 0 ? x - v + MOD : x - v; }

inline int modPow(register int a, register int b) {
    register int ret = 1;
    for (; b; b >>= 1, a = (ulong)a * a % MOD)
        if (b & 1) ret = (ulong)ret * a % MOD;
    return ret;
}

inline void init(int k) {
    rt[0] = 1;
    rt[1] = modPow(G, (MOD - 1) / k / 2);
    for (int i = 2; i < k; i++) rt[i] = (ulong)rt[i - 1] * rt[1] % MOD;
    irt[0] = 1;
    irt[1] = modPow(rt[1], MOD - 2);
    for (int i = 2; i < k; i++) irt[i] = (ulong)irt[i - 1] * irt[1] % MOD;
    for (register int i = 0, j = 0; i < k; i++) {
        if (i > j) {
            std::swap(rt[i], rt[j]);
            std::swap(irt[i], irt[j]);
        }
        for (register int t = k >> 1; (j ^= t) < t; t >>= 1)
            ;
    }
}

inline void dit(int *a, int n) {
    for (int i = 1, l = n >> 1; i < n; i <<= 1, l >>= 1) {
        for (int j = 0, w, o = 0; j < i; j++, o += l << 1) {
            w = rt[i + j];
            for (int k = o, t; k < o + l; k++) {
                t = (ulong)a[k + l] * w % MOD;
                a[k + l] = dec(a[k], t);
                a[k] = add(a[k], t);
            }
        }
    }
}

inline void dif(int *a, int n) {
    for (int i = n >> 1, l = 1; i; i >>= 1, l <<= 1) {
        for (int j = 0, w, o = 0; j < i; j++, o += l << 1) {
            w = irt[i + j];
            for (int k = o, t; k < o + l; k++) {
                t = a[k + l];
                a[k + l] = dec(a[k], t) * (ulong)w % MOD;
                a[k] = add(a[k], t);
            }
        }
    }
    const int inv = modPow(n, MOD - 2);
    for (int i = 0; i < n; i++) a[i] = (ulong)a[i] * inv % MOD;
}
```

仅做一次多项式乘法/多项式求逆时，略快于 Cooley-Tukey，但差距很小（在 $10 ^ 6$ 时快 $10 \% \sim 20 \%$）。

做 `ln / exp` 时效果比较明显。

### Radix4-NTT
~~[Min_25 NTT](https://www.codechef.com/viewsolution/16314782)~~

基数为 $4$ 的 NTT，运算次数更少，但是从 Min_25 的提交记录来看，直接使用 Cooley-Tukey 算法实现的 `NTT_DIT4` + 蒙哥马利取模优化效率并[不好](https://www.codechef.com/viewsolution/15499538)（最快 $1.02s$）。

需要结合上面所说的 DIF 中的 Gentleman-Sande 算法实现 `NTT_DIF4`，配合蒙哥马利取模可以优化至 $0.25s$。

当基数 $\gt 4$ 后，发现常数反而增大。

#### 实现
**注意：**蒙哥马利取模不能用于 $998244353$。
[UOJ 34](http://uoj.ac/problem/34)
关于 C++ 98 的蒙哥马利取模可以看[这个](https://github.com/xehoth/OnlineJudgeCodes/blob/master/SuperOJ/p2103-%E5%91%BC%E5%90%B8%E5%86%B3%E5%AE%9A-%E6%89%A9%E5%B1%95%E5%9F%83%E7%AD%9B%2B%E8%87%AA%E7%84%B6%E6%95%B0%E5%B9%82%E5%92%8C%2B%E5%8F%96%E6%A8%A1%E4%BC%98%E5%8C%96.cpp)（原理是利用模板元编程来替代 `constexpr`）
``` cpp
#include <bits/stdc++.h>

using i64 = long long;
using u32 = unsigned;
using u64 = unsigned long long;
using f80 = long double;

const int BUFFER_SIZE = 1 << 25 | 1;

struct InputOutputStream {
    char ibuf[BUFFER_SIZE], *s;
    char obuf[BUFFER_SIZE], *oh;

    InputOutputStream() : s(ibuf), oh(obuf) {
        ibuf[fread(ibuf, 1, BUFFER_SIZE, stdin)] = '\0';
    }

    ~InputOutputStream() { fwrite(obuf, 1, oh - obuf, stdout); }

    template <typename T>
    inline InputOutputStream &operator>>(T &x) {
        while (!isdigit(*s)) s++;
        for (x = 0; isdigit(*s); s++) x = x * 10 + (*s ^ '0');
        return *this;
    }

    template <typename T>
    inline InputOutputStream &operator<<(T x) {
        static char buf[13];
        register char *top = buf;
        if (x != 0) {
            for (register int t; x;) {
                t = x / 10;
                *top++ = x - t * 10 + 48;
                x = t;
            }
            while (top != buf) *oh++ = *--top;
        } else {
            *oh++ = '0';
        }
        *oh++ = ' ';
        return *this;
    }
} io;

template <u32 mod, u32 G>
class UnsafeMod {
   private:
    static const int WORD_BITS = 8 * sizeof(u32);
    static constexpr u32 mulInv(u32 n, int e = 6, u32 x = 1) {
        return e == 0 ? x : mulInv(n, e - 1, x * (2 - x * n));
    }

   public:
    static constexpr u32 inv = mulInv(mod);
    static constexpr u32 r2 = -u64(mod) % mod;
    static constexpr int level = __builtin_ctzll(mod - 1);
    static_assert(inv * mod == 1, "invalid 1/M modulo 2^@.");

    UnsafeMod() {}
    UnsafeMod(u32 n) : x(init(n)){};
    static inline u32 modulus() { return mod; }
    static inline u32 init(u32 w) { return reduce(u64(w) * r2); }
    static inline u32 reduce(const u64 w) {
        return u32(w >> WORD_BITS) + mod -
               u32((u64(u32(w) * inv) * mod) >> WORD_BITS);
    }

    static inline UnsafeMod omega() {
        return UnsafeMod(G).pow((mod - 1) >> level);
    }

    inline UnsafeMod &operator+=(const UnsafeMod &rhs) {
        x += rhs.x;
        return *this;
    }

    inline UnsafeMod &operator-=(const UnsafeMod &rhs) {
        x += 3 * mod - rhs.x;
        return *this;
    }

    inline UnsafeMod &operator*=(const UnsafeMod &rhs) {
        x = reduce(u64(x) * rhs.x);
        return *this;
    }

    inline UnsafeMod operator+(const UnsafeMod &rhs) const {
        return UnsafeMod(*this) += rhs;
    }

    inline UnsafeMod operator-(const UnsafeMod &rhs) const {
        return UnsafeMod(*this) -= rhs;
    }

    inline UnsafeMod operator*(const UnsafeMod &rhs) const {
        return UnsafeMod(*this) *= rhs;
    }

    inline u32 get() const { return reduce(x) % mod; }

    inline void set(u32 n) { x = n; }

    inline UnsafeMod pow(u32 e) const {
        UnsafeMod ret = UnsafeMod(1);
        for (UnsafeMod base = *this; e; e >>= 1, base *= base)
            if (e & 1) ret *= base;
        return ret;
    }

    inline UnsafeMod inverse() const { return pow(mod - 2); }
    u32 x;
};

const int MAXN = 1 << 18 | 1;

using Int = UnsafeMod<104857601, 3>;

Int f[MAXN], g[MAXN];

inline void transform(Int *f, int n, const Int *roots, const Int *iroots) {
    const int logn = __builtin_ctz(n), nh = n >> 1, lv = Int::level;
    const Int one = Int(1), imag = roots[lv - 2];
    Int dw[lv - 1];
    dw[0] = roots[lv - 3];
    for (int i = 1; i < lv - 2; i++)
        dw[i] = dw[i - 1] * iroots[lv - 1 - i] * roots[lv - 3 - i];
    dw[lv - 2] = dw[lv - 3] * iroots[1];
    if (logn & 1) {
        for (int i = 0; i < nh; i++) {
            Int a = f[i], b = f[i + nh];
            f[i] = a + b;
            f[i + nh] = a - b;
        }
    }
    for (int e = logn & ~1; e >= 2; e -= 2) {
        const int m = 1 << e, m4 = m >> 2;
        Int w2 = one;
        for (int i = 0; i < n; i += m) {
            const Int w1 = w2 * w2, w3 = w1 * w2;
            for (int j = i; j < i + m4; ++j) {
                Int a0 = f[j + m4 * 0] * one, a1 = f[j + m4 * 1] * w2;
                Int a2 = f[j + m4 * 2] * w1, a3 = f[j + m4 * 3] * w3;
                Int t02p = a0 + a2, t13p = a1 + a3;
                Int t02m = a0 - a2, t13m = (a1 - a3) * imag;
                f[j + m4 * 0] = t02p + t13p;
                f[j + m4 * 1] = t02p - t13p;
                f[j + m4 * 2] = t02m + t13m;
                f[j + m4 * 3] = t02m - t13m;
            }
            w2 *= dw[__builtin_ctz(~(i >> e))];
        }
    }
}

inline void itransform(Int *f, int n, const Int *roots, const Int *iroots) {
    const int logn = __builtin_ctz(n), nh = n >> 1, lv = Int::level;
    const Int one = Int(1), imag = iroots[lv - 2];
    Int dw[lv - 1];
    dw[0] = iroots[lv - 3];
    for (int i = 1; i < lv - 2; i++)
        dw[i] = dw[i - 1] * roots[lv - 1 - i] * iroots[lv - 3 - i];
    dw[lv - 2] = dw[lv - 3] * roots[1];
    for (int e = 2; e <= logn; e += 2) {
        const int m = 1 << e, m4 = m >> 2;
        Int w2 = one;
        for (int i = 0; i < n; i += m) {
            const Int w1 = w2 * w2, w3 = w1 * w2;
            for (int j = i; j < i + m4; ++j) {
                Int a0 = f[j + m4 * 0], a1 = f[j + m4 * 1];
                Int a2 = f[j + m4 * 2], a3 = f[j + m4 * 3];
                Int t01p = a0 + a1, t23p = a2 + a3;
                Int t01m = a0 - a1, t23m = (a2 - a3) * imag;
                f[j + m4 * 0] = (t01p + t23p) * one;
                f[j + m4 * 2] = (t01p - t23p) * w1;
                f[j + m4 * 1] = (t01m + t23m) * w2;
                f[j + m4 * 3] = (t01m - t23m) * w3;
            }
            w2 *= dw[__builtin_ctz(~(i >> e))];
        }
    }
    if (logn & 1) {
        for (int i = 0; i < nh; i++) {
            Int a = f[i], b = f[i + nh];
            f[i] = a + b;
            f[i + nh] = a - b;
        }
    }
}

inline void convolve(Int *f, int s1, Int *g, int s2, bool cyclic = false) {
    const int s = cyclic ? std::max(s1, s2) : s1 + s2 - 1;
    const int size = 1 << (31 - __builtin_clz(2 * s - 1));
    assert(size <= (i64(1) << Int::level));
    Int roots[Int::level], iroots[Int::level];
    roots[0] = Int::omega();
    for (int i = 1; i < Int::level; i++) roots[i] = roots[i - 1] * roots[i - 1];
    iroots[0] = roots[0].inverse();
    for (int i = 1; i < Int::level; i++)
        iroots[i] = iroots[i - 1] * iroots[i - 1];
    std::fill(f + s1, f + size, 0);
    transform(f, size, roots, iroots);
    const Int inv = Int(size).inverse();
    if (f == g && s1 == s2) {
        for (int i = 0; i < size; i++) f[i] *= f[i] * inv;
    } else {
        std::fill(g + s2, g + size, 0);
        transform(g, size, roots, iroots);
        for (int i = 0; i < size; i++) f[i] *= g[i] * inv;
    }
    itransform(f, size, roots, iroots);
}

inline bool force(int n, int m) {
    register int l = std::__lg(n + m + 1);
    if ((unsigned long long)n * m > 64ull * (1 << l) * l) return false;
    static int a[100000 + 1];
    static int b[100000 + 1];
    for (register int i = 0; i <= n; i++) io >> a[i];
    for (register int i = 0, x; i <= m; i++) {
        io >> x;
        for (register int j = 0; j <= n; j++) b[i + j] += x * a[j];
    }
    for (register int i = 0; i < n + m + 1; i++) io << b[i];
    return true;
}

int main() {
    int n, m;
    io >> n >> m;
    if (force(n, m)) return 0;
    for (int i = 0, x; i <= n; i++) {
        io >> x;
        f[i] = x;
    }
    for (int i = 0, x; i <= m; i++) {
        io >> x;
        g[i] = x;
    }
    convolve(f, n + 1, g, m + 1);
    for (int i = 0; i <= n + m; i++) io << f[i].get();
    return 0;
}
```