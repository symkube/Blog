---
title: 常系数齐次线性递推
date: 2017-09-06 19:27:50
tags:
  - 递推
categories:
  - oi
  - 数学
---
$h_n = a_1h_{n - 1} + a_2h_{n - 2} + \cdots + a_kh_{n - k}$

求其第 $n$ 项。

<!-- more -->

### 矩阵乘法
显然直接用矩阵快速幂就可以做到 $O(k ^ 3 \log n)$ 的复杂度了。

### 特征多项式
对于这样的常系数齐次线性递推式，先构造递推矩阵
$$M = \begin{pmatrix}
a_1 & a_2 & a_3 & \cdots & a_{k - 2} & a_{k - 1} & a_k \\
1   &  0  &  0  & \cdots &     0   & 0 &  0  \\
0   &  1  &  0  & \cdots &     0   & 0  &  0  \\
0   &  0  &  1  & \cdots &     0   & 0  &  0  \\
\vdots & \vdots & \vdots & \ddots & \vdots & \vdots & \vdots \\
0 & 0 & 0 & \cdots &  1  & 0  & 0 \\
0 &  0& 0 & \cdots &  0  & 1 &  0
\end{pmatrix}_{\  k \times k}$$
初始值向量
$$X = \begin{pmatrix}h_{k - 1} \\
h_{k - 2} \\
h_{k - 3} \\
\vdots \\
h_2 \\
h_1 \\
h_0
\end{pmatrix}_{\  k \times 1}$$
则
$$Y = MX = \begin{pmatrix}
a_1 & a_2 & a_3 & \cdots & a_{k - 2} & a_{k - 1} & a_k \\
1   &  0  &  0  & \cdots &     0   & 0 &  0  \\
0   &  1  &  0  & \cdots &     0   & 0  &  0  \\
0   &  0  &  1  & \cdots &     0   & 0  &  0  \\
\vdots & \vdots & \vdots & \ddots & \vdots & \vdots & \vdots \\
0 & 0 & 0 & \cdots &  1  & 0  & 0 \\
0 &  0& 0 & \cdots &  0  & 1 &  0
\end{pmatrix} \begin{pmatrix}h_{k - 1} \\
h_{k - 2} \\
h_{k - 3} \\
\vdots \\
h_2 \\
h_1 \\
h_0
\end{pmatrix} = \begin{pmatrix}h_{k} \\
h_{k - 1} \\
h_{k - 2} \\
\vdots \\
h_3 \\
h_2 \\
h_1
\end{pmatrix}$$

考虑矩阵 $M$ 的特征多项式
$$f(\lambda) = |\lambda E - M| = \begin{pmatrix}
\lambda - a_1 & -a_2 & -a_3 & \cdots & -a_{k - 2} & -a_{k - 1} & -a_k \\
-1   &  \lambda  &  0  & \cdots &     0   & 0 &  0  \\
0   &  -1  &  \lambda  & \cdots &     0   & 0  &  0  \\
0   &  0  &  -1  & \cdots &     0   & 0  &  0  \\
\vdots & \vdots & \vdots & \ddots & \vdots & \vdots & \vdots \\
0 & 0 & 0 & \cdots &  -1  & \lambda  & 0 \\
0 &  0& 0 & \cdots &  0  & -1 &  \lambda
\end{pmatrix}_{\  k \times k}$$

然后我们按照第一行展开，得
$$f(\lambda) = (\lambda - a_1)A_{11} + (-a_2)A_{12} + \cdots + (-a_k)A_{1n} = \lambda ^ k - a_1 \lambda ^ {k - 1} - a_2 \lambda ^ {k - 2} - \cdots - a_k$$
其中 $A_{1i}$ 为元素 $a_{1i}$ 的代数余子式，根据 [Cayley-hamilton](https://en.wikipedia.org/wiki/Cayley%E2%80%93Hamilton_theorem) 定理，$f(\lambda)$ 是零化多项式，即 $f(M) = 0$。

故可以得到 $M ^ k$ 与 $E, M, \cdots, M ^ {k - 1}$ 的线性递推关系，$M ^ i$ 也可以用 $E, M, \cdots, M ^ {k - 1}$ 线性表示。

**证明：**  
当 $0 \leq i \leq k - 1$ 时，结论显然成立。  
当 $i = k$ 时，因为 $f(M) = 0$，即 $M ^ k = a_1 M ^ {k - 1} + a_2  M ^ {k - 2} + \cdots + a_k E$。  
假设当 $i < k_0$ 时，结论成立，于是当 $i = k_0$ 时，取 $1 \leq j \leq i - 1$，则 $M ^ i = M ^ j M ^ {i - j}$，由于 $M ^ j, M ^ {i - j}$，都可以由 $E, M, M ^ 2, \cdots, M ^ {k - 1}$ 的线性组合得到，故 $M ^ i$ 由 $E, M, M ^ 2, \cdots, M ^ {2k - 2}$ 的线性组合得到，而 $f(M) = 0$，则 $M ^ i f(M) = 0$，展开可得
$$M ^ {i + k} = \sum_{j = 1} ^ k a_j M ^ {i + k - j}$$
即 $M ^ {i + k}$ 可以表示为 $M ^ i, M ^ {i + 1}, \cdots, m ^ {i + k - 1}$，我们反复利用此式并根据数学归纳法，结论成立。

上述的过程实质上就是一个多项式乘法，由于多项式乘法满足结合律，我们可以利用类似快速幂的思想在 $O(\log n)$ 次乘法完成，由于朴素的多项式乘法的复杂度为 $O(n ^ 2)$，故我们可以在 $O(k ^ 2 \log n)$ 求出常系数齐次线性递推式的第 $n$ 项，由于要对 $f(M)$ 取模，我们可以利用 FFT 优化多项式乘法以及多项式取模配合生成函数做到 $O(k \log k \log n)$ 的复杂度。

### 代码
[BZOJ 4161](http://www.lydsy.com/JudgeOnline/problem.php?id=4161)

- [x] $O(k ^ 2 \log n)$
- [ ] $O(k \log k \log n)$

#### $O(k ^ 2 \log n)$
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「BZOJ 4161」Shlw loves matrixI 07-09-2017
 * 特征多项式 O(k ^ 2 \log n)
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
    for (x = 0; isdigit(c); c = read()) x = x * 10 + (c ^ '0');
    iosig ? x = -x : 0;
}

inline void read(char &c) {
    while (c = read(), isspace(c) && c != -1)
        ;
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

struct InputOutputStream {
    template <typename T>
    inline InputOutputStream &operator>>(T &x) {
        read(x);
        return *this;
    }

    template <typename T>
    inline InputOutputStream &operator<<(const T &x) {
        print(x);
        return *this;
    }

    ~InputOutputStream() { flush(); }
} io;
}

namespace {

using IO::io;

const int MAXN = 4005;
const int MOD = 1e9 + 7;

struct LinearRecursion {
#define long long long

    int k, *a, b[MAXN + 1], c[MAXN + 1];

    inline void mulMod(int *x, int *y) {
        static int buc[MAXN + 1];
        memset(buc, 0, sizeof(int) * (k << 1));
        for (register int i = 0; i < k; i++)
            for (register int j = 0; j < k; j++)
                buc[i + j] = (buc[i + j] + (long)x[i] * y[j]) % MOD;
        // 对 f(M) = x ^ k - a_1 x ^ {k - 1} - \cdots - a_k 取模，模拟手算
        for (register int i = 2 * k - 2; i >= k; i--)
            for (register int j = 1; j <= k; j++)
                buc[i - j] = (buc[i - j] + (long)buc[i] * a[j]) % MOD;
        memcpy(x, buc, sizeof(int) * k);
    }

    inline void pow(int *a, int b, int *ans) {
        for (; b; b >>= 1, mulMod(a, a)) (b & 1) ? mulMod(ans, a) : (void)0;
    }

    inline int getLinearRecursion(const int n, const int k, int *a, int *h) {
        this->k = k, this->a = a;
        memset(c, 0, sizeof(int) * k);
        memset(b, 0, sizeof(int) * k);
        c[1] = 1, b[0] = 1;
        pow(c, n, b);
        register int ans = 0;
        for (register int i = 0; i < k; i++)
            ans = (ans + (long)b[i] * h[i]) % MOD;
        return ans;
    }
#undef long
};

struct Task {
    int a[MAXN + 1], h[MAXN + 1];
    LinearRecursion d;

    inline void solve() {
        register int n, k;
        io >> n >> k;
        for (register int i = 1; i <= k; i++)
            io >> a[i], a[i] < 0 ? a[i] += MOD : 0;
        for (register int i = 0; i < k; i++)
            io >> h[i], h[i] < 0 ? h[i] += MOD : 0;
        io << d.getLinearRecursion(n, k, a, h);
    }
} task;
}

int main() {
    task.solve();
    return 0;
}
```

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=26085475&auto=1&height=66"></iframe>