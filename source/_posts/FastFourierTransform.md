---
title: FFT 学习笔记
date: 2016-10-07 20:14:13
tags:
  - FFT
categories:
  - OI
  - 学习笔记
---
两个n次多项式相加最直接的方法所需时间为O(n)，但是相乘最直接的方法所需时间为O(n<sup>2</sup>)。
快速傅里叶变换（Fast Fourier Transform，FFT）是一种可在 O(n log n)时间内完成的离散傅里叶变换（Discrete Fourier transform，DFT）算法，在 OI 中的主要应用之一是加速多项式乘法的计算。
<!-- more -->
### 多项式
#### 系数表示
对于一个次数界为n的多项式![](http://oeicis1qk.bkt.clouddn.com/FFT1.gif)，其系数表示是由一个由系数组成的向量a=(a<sub>0</sub>，a<sub>1</sub>，···，a<sub>n-1</sub>)。
#### 点值表示
多项式的点值表示，将一组**互不相同**的n个x带入多项式，得到的n个值。设它们组成的n维向量分别为(x<sub>0</sub>，x<sub>1</sub>，···，x<sub>n-1</sub>),(y<sub>0</sub>，y<sub>1</sub>，···，y<sub>n-1</sub>)。
即![](http://oeicis1qk.bkt.clouddn.com/FFT2.gif)
#### 求值与插值
**定理:**一个n-1次多项式在n个不同点的取值唯一确定了该多项式。
证明请见算法导论30.1
#### 拉格朗日插值公式
![](http://oeicis1qk.bkt.clouddn.com/FFT3.gif)
已知多项式的点值表示，求其系数表示，可以使用插值。朴素的插值算法时间复杂度为O(n<sup>2</sup>)。
#### 多项式乘法
我们定义两个多项式![](http://oeicis1qk.bkt.clouddn.com/FFT4.gif)与![](http://oeicis1qk.bkt.clouddn.com/FFT5.gif)相乘的结果为C(x)（假设两个多项式次数相同，若不同可在后面补零）。
![](http://oeicis1qk.bkt.clouddn.com/FFT6.gif)
两个n-1次多项式相乘，得到的是一个2n-2次多项式，时间复杂度为 O(n<sup>2</sup>)。
如果使用两个多项式在2n-1个点处取得的点值表示，那么
![](http://oeicis1qk.bkt.clouddn.com/FFT7.gif)
复杂度为O(n)
### 复数
#### 复平面
在复平面中，x 轴代表实数,y轴(除原点外的所有点)代表虚数。每一个复数a+bi对应复平面上一个从(0, 0)指向(a, b)的向量。

 -  复数相加遵循平行四边形定则。
 - 复数相乘时，模长相乘，幅角相加。

### 单位根
在复平面上，以原点为圆心， 1 1 为半径作圆，所得的圆叫做单位圆。以原点为起点，单位圆的 n n 等分点为终点，作 n n 个向量。设所得的幅角为正且最小的向量对应的复数为ω<sub>n</sub>，称为n次单位根。
单位根的幅角为周角的1/n，这为我们提供了一个计算单位根及其幂的公式![](http://oeicis1qk.bkt.clouddn.com/FFT8.gif)
#### 性质
##### 性质一
![](http://oeicis1qk.bkt.clouddn.com/FFT9.gif)
从几何意义上看，在复平面上，二者表示的向量终点相同。
##### 性质二
![](http://oeicis1qk.bkt.clouddn.com/FFT10.gif)
### 快速傅里叶变换
这里引用一下[menci的笔记](https://oi.men.ci)
![](http://oeicis1qk.bkt.clouddn.com/FFT11.png)
![](http://oeicis1qk.bkt.clouddn.com/FFT12.png)
![](http://oeicis1qk.bkt.clouddn.com/FFT13.png)
![](http://oeicis1qk.bkt.clouddn.com/FFT14.png)
![](http://oeicis1qk.bkt.clouddn.com/FFT15.png)
![](http://oeicis1qk.bkt.clouddn.com/FFT16.png)
![](http://oeicis1qk.bkt.clouddn.com/FFT17.png)
### 实现
首先虚数使用`STL`中的`complex`，采用迭代和二进制位翻转实现
``` cpp
#include <bits/stdc++.h>
using namespace std;
#define MAXN 100
const double PI = acos(-1);
/*快速傅立叶变换*/
struct FastFourierTransform {
    /*复数*/
    complex<double> omega[MAXN], omegaInverse[MAXN];
    inline void init(const int n) {
        for (register int i = 0; i < n; i++) {
            omega[i] = complex<double>(cos(2 * PI / n * i), sin(2 * PI / n * i));
            /*conj函数可以返回一个复数的共轭复数*/
            omegaInverse[i] = conj(omega[i]);
        }
    }
    inline void transform(complex<double> *a, const int n, const complex<double> *omega) {
        int k = 0;
        while ((1 << k) < n) k++;
        for (register int i = 0; i < n; i++) {
            int t = 0;
            for (register int j = 0; j < k; j++) if (i & (1 << j)) t |= (1 << (k - j - 1));
            if (i < t) swap(a[i], a[t]);
        }
        for (register int l = 2; l <= n; l *= 2) {
            int m = l / 2;
            for (complex<double> *p = a; p != a + n; p += l) {
                for (int i = 0; i < m; i++) {
                    complex<double> t = omega[n / l * i] * p[m + i];
                    p[m + i] = p[i] - t;
                    p[i] += t;
                }
            }
        }
    }
    inline void dft(complex<double> *a, const int n) {
        transform(a, n, omega);
    }
    inline void idft(complex<double> *a, const int n) {
        transform(a, n, omegaInverse);
        for (register int i = 0; i < n; i++) a[i] /= n;
    }
} fft;
inline void multiply(const int *a1, const int n1, const int *a2, const int n2, int *res) {
    int n = 1;
    while (n < n1 + n2) n <<= 1;
    static complex<double> c1[MAXN], c2[MAXN];
    for (register int i = 0; i < n1; i++) c1[i].real(a1[i]);
    for (register int i = 0; i < n2; i++) c2[i].real(a2[i]);
    fft.init(n);
    fft.dft(c1, n), fft.dft(c2, n);
    for (register int i = 0; i < n; i++) c1[i] *= c2[i];
    fft.idft(c1, n);
    for (register int i = 0; i < n1 + n2 - 1; i++) res[i] = static_cast<int>(floor(c1[i].real() + 0.5));
}
int main() {
    return 0;
}
```
### 参考资料

- 算法导论第30章
- [多項式 - 维基百科](https://zh.wikipedia.org/zh/%E5%A4%9A%E9%A0%85%E5%BC%8F)
- [复平面 - 维基百科](https://zh.wikipedia.org/zh/%E5%A4%9A%E9%A0%85%E5%BC%8F)
- [复数 - 维基百科](https://zh.wikipedia.org/zh/%E5%A4%9A%E9%A0%85%E5%BC%8F)
- [快速傅里叶变换 - 维基百科](https://zh.wikipedia.org/zh/%E5%A4%9A%E9%A0%85%E5%BC%8F)
- [FFT笔记-menci](https://oi.men.ci/fft-notes/)

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=775348&auto=1&height=66"></iframe>