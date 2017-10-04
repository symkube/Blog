---
title: "「UOJ-34」多项式乘法-FFT"
date: 2016-12-23 19:12:23
tags:
  - FFT
categories:
  - OI
  - FFT
---
这是一道模板题。
给你两个多项式，请输出乘起来后的多项式。
### 输入格式
第一行两个整数 $n$ 和 $m$，分别表示两个多项式的次数。
第二行 $n+1$ 个整数，分别表示第一个多项式的 $0$ 到 $n$ 次项前的系数。
第三行 $m+1$ 个整数，分别表示第一个多项式的 $0$ 到 $m$ 次项前的系数。
### 输出格式
一行 $n+m+1$ 个整数，分别表示乘起来后的多项式的 $0$ 到 $n+m$ 次项前的系数。
<!-- more -->
### 链接
[uoj34](http://uoj.ac/problem/34)
### 代码
``` cpp
#include <bits/stdc++.h>
const int MAXN = 300000;
const double pi2 = 2 * acos(-1.0);
struct Complex {
    double r, i;
    Complex(double r = 0, double i = 0) : r(r), i(i) {}
    inline Complex operator + (const Complex &x) { return Complex(r + x.r, i + x.i); }
    inline Complex operator - (const Complex &x) { return Complex(r - x.r, i - x.i); }
    inline Complex operator * (const Complex &x) { return Complex(r * x.r - i * x.i, r * x.i + i * x.r); }
    inline Complex conj() { return Complex(r, -i); }
} a[MAXN], b[MAXN];
struct FFT {
    int k, pos[MAXN];
    inline void init(int n, int m) {
        for (k = 1; k <= n || k <= m; k <<= 1); k <<= 1;
        for (register int j = j = __builtin_ctz(k) - 1, i = 0; i < k; i++) pos[i] = pos[i >> 1] >> 1 | ((i & 1) << j);
    }
    inline void fft(Complex *a, const int n, const int t) {
        for (register int i = 1; i < n; i++) if (i < pos[i]) std::swap(a[i], a[pos[i]]);
        for (register int d = 0, m1, m2; 1 << d < n; d++) {
            m1 = 1 << d, m2 = m1 << 1;
            double tmp = pi2 / m2 * t;
            Complex _w(cos(tmp), sin(tmp));
            for (register int i = 0; i < n; i += m2) {
                Complex w(1, 0);
                for (register int j = 0; j < m1; j++) {
                    Complex &A = a[i + j + m1], &B = a[i + j], t = w * A;
                    A = B - t, B = B + t, w = w * _w;
                }
            }
        }
        if (t == -1) for (register int i = 0; i < n; i++) a[i].r /= n;
    }
    inline void multiply(Complex *a, Complex *b) {
        fft(a, k, 1);
        for (register int i = 0, j; i < k; i++) j = (k - i) & (k - 1), b[i] = (a[i] * a[i] - (a[j] * a[j]).conj()) * Complex(0, -0.25);
        fft(b, k, -1);
    }
} fft;
const int IN_LEN = 500100, OUT_LEN = 2000000;
char ibuf[IN_LEN], obuf[OUT_LEN], *ih = ibuf, *oh = obuf;
inline void read(int &x) { for (x = 0; !isdigit(*ih); ih++); while (isdigit(*ih)) x = (x << 1) + (x << 3) + ((*ih++) ^ '0'); }
inline void write(int x) {
    static int buf[30], cnt;
    if (!x) *oh++ = 48;
    else {
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 + 48;
        while (cnt) *oh++ = buf[cnt--];
    }
}
int n, m;
int main() {
    fread(ibuf, 1, IN_LEN, stdin), read(n), read(m), fft.init(n, m);
    for (register int i = 0, j; i <= n; i++) read(j), a[i].r = j;
    for (register int i = 0, j; i <= m; i++) read(j), a[i].i = j;
    fft.multiply(a, b);
    for (register int i = 0; i <= n + m; i++) write(int(b[i].r + 0.5)), *oh++ = 32;
    fwrite(obuf, 1, oh - obuf, stdout);
    return 0;
}
```

