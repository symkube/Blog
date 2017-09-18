---
title: 矩阵树定理学习笔记
date: 2017-09-07 09:58:12
tags:
  - 学习笔记
  - 矩阵树定理
  - 线性代数
categories:
  - OI
  - 学习笔记
---
矩阵树定理的学习笔记和部分线性代数的知识，记录三道经典题目及变元矩阵树定理。

<!-- more -->

### 线性代数
#### 逆序数
对于 $n$ 个不同的元素，先规定各元素之间有一个标准次序(例如 $n$ 个不同的自然数，可规定由小到大为标准次序)，于是在这 $n$ 个元素的任一排列中，当某两个元素的先后次序与标准次序不同时，就**说有 $1$ 个逆序**。一个排列中所有逆序的总数叫做这个**排列的逆序数**。

#### 奇排列与偶排列
逆序数为奇数的排列叫做**奇排列**，逆序数为偶数的排列叫做**偶排列**。

#### 对换
在排列中，将任意两个元素对调，其余的元素不动，这种作出新排列的手续叫做**对换**。将相邻两个元素对换，叫做**相邻对换**)

#### $n$ 阶行列式
设有 $n ^ 2$ 个数，组成 $n$ 行 $n$ 列的数表
{% raw %}$$\begin{matrix}a_{11} & a_{12} & \cdots & a_{1n} \\ 
a_{21} & a_{22} & \cdots & a_{2n} \\
\cdots & \cdots & \cdots & \cdots \\
a_{n1} & a_{n2} & \cdots & a_{nn}
\end{matrix}$${% endraw %}
作出表中位于不同行不同列的 $n$ 个数的乘积，并冠以符号 $(-1) ^ \tau$，得到形如
{% raw %}$$(-1) ^ \tau a_{1_{p_1}}a_{2_{p_2}} \cdots a_{n_{p_n}}$${% endraw %}
的项，其中 $p_1, p_2, \cdots, p_n$ 为自然数 $1, 2, \cdots, n$ 的一个排列，$\tau$ 为这个排列的逆序数。由于这样的排列共有 $n!$ 个，因而形如上式的项共有 $n!$ 项。所有这 $n!$ 的代数和
{% raw %}$$\sum (-1) ^ \tau a_{1_{p_1}}a_{2_{p_2}} \cdots a_{n_{p_n}}$${% endraw %}
称为 $n$ 阶行列式，记作
{% raw %}$$D = \begin{vmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\ 
a_{21} & a_{22} & \cdots & a_{2n} \\
\cdots & \cdots & \cdots & \cdots \\
a_{n1} & a_{n2} & \cdots & a_{nn}
\end{vmatrix}$${% endraw %}
{% raw %}简记作 $\det \begin{pmatrix} a_{ij} \end{pmatrix}$。数 $a_{ij}$ 称为行列式 $\det \begin{pmatrix} a_{ij} \end{pmatrix}$ 的元素。{% endraw %}

#### 基本原理公式
##### 公式一
{% raw %}$$\begin{vmatrix}\lambda_1 & & & \\ 
 & \lambda_2 & & \\
 & & \ddots & \\
 & & & \lambda_n
\end{vmatrix} = \lambda_1 \lambda_2 \cdots \lambda_n$${% endraw %}

{% raw %}$$\begin{vmatrix} a_{11} & 0 &\cdots & 0 \\ 
a_{21} & a_{22} & \cdots & 0 \\
\vdots & \vdots & \ddots & 0 \\
a_{n1} & a_{n2}& \cdots & a_{nn}
\end{vmatrix} = a_{11}a_{22} \cdots a_{nn} $${% endraw %}

##### 公式二
{% raw %}$$\begin{vmatrix} a_{11} & a_{12} &\cdots & a_{1n} \\ 
a_{21} & a_{22} & \cdots & 0 \\
\vdots & \vdots & \ddots & 0 \\
a_{n1} & 0& \cdots & 0
\end{vmatrix} = (-1) ^ {\frac {n (n - 1)} {2}}a_{1n}a_{2(n-1)} \cdots a_{n1} $${% endraw %}

#### 行列式的一些性质
行列式 $D ^ T$ 称为行列式 $D$ 的转置行列式。

- 行列式与它的转置行列式相等。
- 互换行列式的两行(列)，行列式变号。
- 如果行列式有两行(列)完全相同，则此行列式为零。
- 行列式的某一行(列)中所有的元素都乘以同一数 $k$，等于用数 $k$ 乘此行列式。
- 行列式中某一行(列)的所有元素的公因子可以提到行列式符号的外面。
- 行列式中如果有两行(列)元素成比例，则此行列式等于零。
- 若行列式的某一行(列)的元素都是两数之和，例如第j列的元素都是两数之和：
{% raw %}$$\begin{vmatrix} a_{11} & a_{12} &\cdots & a_{1j} + b_{1j}& \cdots& a_{1n} \\ 
a_{21} & a_{22} & \cdots &a_{2j} + b_{2j} & \cdots& a_{2n} \\
\vdots & \vdots &  & \vdots & \cdots & \vdots \\
a_{n1} & a_{n2} & \cdots & a_{nj} + b_{nj} & \cdots & a_{nn}
\end{vmatrix} = \begin{vmatrix} a_{11} & a_{12} &\cdots & a_{1j}& \cdots& a_{1n} \\ 
a_{21} & a_{22} & \cdots &a_{2j} & \cdots& a_{2n} \\
\vdots & \vdots &  & \vdots & \cdots & \vdots \\
a_{n1} & a_{n2} & \cdots & a_{nj} & \cdots & a_{nn}
\end{vmatrix} + \\ \begin{vmatrix} a_{11} & a_{12} &\cdots & b_{1j}& \cdots& a_{1n} \\ 
a_{21} & a_{22} & \cdots & b_{2j} & \cdots& a_{2n} \\
\vdots & \vdots &  & \vdots & \cdots & \vdots \\
a_{n1} & a_{n2} & \cdots & b_{nj} & \cdots & a_{nn}
\end{vmatrix}$${% endraw %}
- 把行列式的某一列(行)的各元素乘以同一数然后加到另一列(行)对应的元素上去，行列式不变。

#### 余子式和代数余子式
在 $n$ 阶行列式中，把元素 $a_{ij}$ 所在第 $i$ 行和第 $j$ 列划去后，留下来的 $n - 1$ 阶行列式叫做元素 $a_{ij}$ 的余子式，记作 $M_{ij}$，记
$$A_{i_j} = (-1) ^ {i + j} M_{ij}$$
$A_{ij}$ 叫做元素 $a_{ij}$ 的**代数余子式**。

#### 按行（列）展开行列式
行列式等于它的任一行（列）的各元素与其对应的代数余子式乘积之和，即
{% raw %}$$D = \sum_{j = 1} ^ n a_{ij}A_{ij} \  (i = 1, 2, \cdots, n)$${% endraw %}
即 $i$ 为某一行，按列展开同理。

#### 范德蒙德(Vandermonde)行列式
{% raw %}$$D_n = \begin{vmatrix}1 & 1 & \cdots & 1 \\ 
x_1 & x_2 & \cdots & x_n \\
x_1 ^ 2 & x_2 ^ 2 & \cdots & x_n ^ 2 \\
\vdots & \vdots & & \vdots \\
x_1 ^ {n - 1} & x_2 ^ {n - 1} & \cdots & x_n ^ {n - 1}
\end{vmatrix} = \prod_{n \geq i \geq j \geq 1}(x_i - x_j)$${% endraw %}

#### 克拉默法则
##### 非齐次线性方程组
{% raw %}$$\begin{cases}
a_{11}x_1 + a_{12}x_2 + \cdots + a_{1n}x_n = b_1 \\ 
a_{21}x_1 + a_{22}x_2 + \cdots + a_{2n}x_n = b_2 \\
\cdots \\
a_{n1}x_1 + a_{n2}x_2 + \cdots + a_{nn}x_n = b_n
\end{cases}$${% endraw %}
其中右端的常数项 $b_1, b_2, \cdots, b_n$ 不能全为零。
##### 齐次线性方程组
{% raw %}$$\begin{cases}
a_{11}x_1 + a_{12}x_2 + \cdots + a_{1n}x_n = 0 \\ 
a_{21}x_1 + a_{22}x_2 + \cdots + a_{2n}x_n = 0 \\
\cdots \\
a_{n1}x_1 + a_{n2}x_2 + \cdots + a_{nn}x_n = 0
\end{cases}$${% endraw %}
#### 克拉默法则
设非齐次线性方程组
{% raw %}$$\begin{cases}
a_{11}x_1 + a_{12}x_2 + \cdots + a_{1n}x_n = b_1 \\ 
a_{21}x_1 + a_{22}x_2 + \cdots + a_{2n}x_n = b_2 \\
\cdots \\
a_{n1}x_1 + a_{n2}x_2 + \cdots + a_{nn}x_n = b_n
\end{cases}$${% endraw %}
其系数行列式为
{% raw %}$$D = \begin{vmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\ 
a_{21} & a_{22} & \cdots & a_{2n} \\
\vdots & \vdots &  & \vdots \\
a_{n1} & a_{n2} & \cdots & a_{nn}
\end{vmatrix} \neq 0$${% endraw %}
则方程组有唯一解
{% raw %}$$x_j = \frac {D_j} {D} \ \  (j = 1, 2, \cdots, n)$${% endraw %}
其中 $D_j$ 是把系数行列式 $D$ 中的第 $j$ 列的元素用方程组右端的常数项代替后所得到的 $n$ 阶行列式。

- 如果线性方程组的系数行列式 $D \neq 0$，则一定有解，且解是唯一的。
- 如果线性方程组无解或有两个不同的解，则它的系数行列式必为零。
- 如果齐次线性方程组的系数行列式 $D \neq 0$，则齐次线性方程组没有非零解。
- 如果齐次线性方程组有非零解，则它的系数行列式必为零。

#### 子式与主子式
在矩阵中任取 $k$ 行、$k$ 列，这 $k * k$ 个元素按原来的次序构成的行列式，称为该矩阵的一个 $k$ 阶子式。  
位于矩阵左上角的 $k$ 阶子式，称为矩阵的 $k$ 阶主子式。

#### Binet-Cauchy 公式
设 $A$ 和 $B$ 各为 $p \times q$ 及 $q \times p$ 矩阵，则有

{% raw %}$$\det AB = \begin{cases}0 & p > q \\
\det A \det B & p = q \\
\sum_{1 \leq j_1 {% endraw %} < {% raw %}\cdots{% endraw %} < {% raw %}j_p \leq q} A \begin{pmatrix}1 & 2 & \cdots & p\\ j_1 & j_2 & \cdots & j_p\end{pmatrix} B \begin{pmatrix}j_1 & j_2 & \cdots & j_p \\ 1 & 2 & \cdots & p\end{pmatrix} & p{% endraw %} < {% raw %}q
\end{cases}$${% endraw %}

特别的，{% raw %}$\det A A ^ T = (\det A) ^ 2${% endraw %}

### 矩阵树定理
#### 一些定义
- 对于图 $G$ 的度数矩阵 $D[G]$ 是一个 $n * n$ 的矩阵，且满足当 $i \neq j$ 时，$d_{ij} = 0$，当 $i = j$ 时，$d_{ij}$ 等于 $v_i$ 的度数。
- 邻接矩阵 $A[G]$ 也是一个 $n * n$ 的矩阵，且满足 $v_i, v_j$ 之间有边相连，$a_{ij} = 1$，否则为 $0$。

##### 基尔霍夫矩阵（拉普拉斯算子）
定义 $G$ 的基尔霍夫矩阵 $C[G] = D[G] - A[G]$。

#### 矩阵树定理
$G$ 的所有不同的生成树的个数等于其基尔霍夫矩阵 $C[G]$ 任意一个 $n - 1$ 阶主子式的行列式的绝对值。

$n - 1$ 阶主子式，就是对于 $r (1 \leq r \leq n)$，将 $C[G]$ 的第 $r$ 行，第 $r$ 列同时去掉后的到的新矩阵，用 $C_r[G]$ 表示。

如图

![MatrixTree](/images/MatrixTree1.svg)

{% raw %}$$D[G] = \begin{pmatrix}2 & 0 & 0 & 0 & 0 \\
0 & 3 & 0 & 0 & 0 \\
0 & 0 & 3 & 0 & 0 \\
0 & 0 & 0 & 2 &  0\\
0 &  0 & 0 & 0 & 2 \end{pmatrix}$${% endraw %}

{% raw %}$$A[G] = \begin{pmatrix}0 & 1 & 1 & 0 & 0 \\
1 & 0 & 1 & 1 & 0 \\
1 & 1 & 0 & 0 & 1 \\
0 & 1 & 0 & 0 &  1\\
0 &  0 & 1 & 1 & 0 \end{pmatrix}$${% endraw %}

{% raw %}$$C[G] = \begin{pmatrix}2 & -1 & -1 & 0 & 0 \\
-1 & 3 & -1 & -1 & 0 \\
-1 & -1 & 3 & 0 & -1 \\
0 & -1 & 0 & 2 &  -1\\
0 &  0 & -1 & -1 & 2 \end{pmatrix}$${% endraw %}

任意取一个 $r$，如 $r = 2$ 得
{% raw %}$$C_2[G] = \begin{pmatrix}2 & -1 & 0 & 0 \\
-1 & 3 & 0 & -1 \\
0 & 0 & 2 &  -1\\
0 &  -1 & -1 & 2 \end{pmatrix}$${% endraw %}

计算其行列式值为 $11$，故该图生成树个数为 $11$。

### 「SPOJ 104」Highways
一个有 $n$ 座城市的组成国家，城市 $1$ 至 $n$ 编号，其中一些城市之间可以修建高速公路。现在，需要有选择的建一些高速公路，从而组成一个交通网络。你的任务是计算有多少种方案，使得任意两座城市之间恰好只有一条路？

#### 链接
[SPOJ 104](http://www.spoj.com/problems/HIGH/en/)

#### 题解
题意其实就是有 $n$ 个点 $m$ 条边，求生成树个数。

我们直接用矩阵树定理，建出基尔霍夫矩阵，然后求其 $n - 1$ 阶主子式的行列式的值的绝对值就好了。

关于行列式值的求法，我们可以利用 Gauss-Jordan 消元法将其转成上三角矩阵，然后主对角线元素的乘积就是其行列式的值。

**注意开 `long long`**

#### 代码
这里求的是 $C_n[G]$，即去掉的是第 $n$ 行和第 $n$ 列。
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「SPOJ 104」Highways 07-09-2017
 * 矩阵树定理
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

const int MAXN = 20;
const double EPS = 1e-9;

struct Task {
#define long long long
    double a[MAXN + 1][MAXN + 1];

    template <typename T, size_t size>
    inline bool gaussJordan(T a[size][size], const int n) {
        for (register int i = 0, idx; idx = i, i < n; ++i) {
            for (register int j = i + 1; j < n; j++)
                if (fabs(a[j][i]) > fabs(a[idx][i])) idx = j;
            if (fabs(a[idx][i]) < EPS) return false;
            if (idx != i)
                for (register int j = i; j <= n; j++)
                    std::swap(a[i][j], a[idx][j]);
            for (register int j = 0; j < n; j++)
                if (i != j)
                    for (register int k = n; k >= i; k--)
                        a[j][k] -= a[i][k] / a[i][i] * a[j][i];
        }
        return true;
    }

    template <typename T, size_t size>
    inline long getDetVal(T a[size][size], const int n) {
        gaussJordan(a, n);
        register double ans = 1;
        for (register int i = 0; i < n - 1; i++) ans *= a[i][i];
        return round(fabs(ans));
    }

    inline void solve() {
        register int T, n, m;

        for (io >> T; T--;) {
            memset(a, 0, sizeof(a));
            static int deg[MAXN + 1];
            memset(deg, 0, sizeof(deg));
            io >> n >> m;
            for (register int i = 0, u, v; i < m; i++) {
                io >> u >> v, u--, v--;
                deg[u]++, deg[v]++, a[u][v] = a[v][u] = -1;
            }
            for (register int i = 0; i < n; i++) a[i][i] += deg[i];
            io << getDetVal(a, n) << '\n';
        }
    }
#undef long
} task;
}

int main() {
    task.solve();
    return 0;
}
```

### 「UVA 10766」Organising the Organisation
#### 链接
[UVA 10766](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1707)

#### 题解
如果 $a, b$ 没有矛盾，就在他们之间连一条边，最后要求得到的关系就是原图的一棵生成树，虽然此题规定了生成树的根，但无向图生成树个数与根无关，所以我们直接用矩阵树定理计算原图的生成树个数即可。

**注意要用 `long double`**

#### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「UVA 10766」Organising the Organisation 07-09-2017
 * 矩阵树定理
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
inline bool read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return false;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read()) x = x * 10 + (c ^ '0');
    iosig ? x = -x : 0;
    return true;
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

const int MAXN = 60;
typedef long double ld;
const ld EPS = 1e-9;

struct Task {
#define long long long
    ld a[MAXN + 1][MAXN + 1];
    bool vis[MAXN + 1][MAXN + 1];

    template <typename T, size_t size>
    inline bool gaussJordan(T a[size][size], const int n) {
        for (register int i = 0, idx; idx = i, i < n; i++) {
            for (register int j = i + 1; j < n; j++)
                if (fabs(a[j][i]) > fabs(a[idx][i])) idx = j;
            if (fabs(a[idx][i]) < EPS) return false;
            if (i != idx)
                for (register int j = i; j <= n; j++)
                    std::swap(a[i][j], a[idx][j]);
            for (register int j = 0; j < n; j++)
                if (i != j)
                    for (register int k = n; k >= i; k--)
                        a[j][k] -= a[i][k] / a[i][i] * a[j][i];
        }
    }

    template <typename T, size_t size>
    inline long getDetVal(T a[size][size], const int n) {
        gaussJordan(a, n);
        register ld ans = 1;
        for (register int i = 0; i < n - 1; i++) ans *= a[i][i];
        return round(fabs(ans));
    }

    inline void solve() {
        register int n, m, k;
        while (IO::read(n) && IO::read(m) && IO::read(k)) {
            memset(vis, 0, sizeof(vis));
            memset(a, 0, sizeof(a));
            for (register int i = 0, u, v; i < m; i++)
                io >> u >> v, u--, v--, vis[u][v] = vis[v][u] = true;
            for (register int i = 0; i < n; i++)
                for (register int j = i + 1; j < n; j++)
                    if (!vis[i][j]) a[i][i]++, a[j][j]++, a[i][j]--, a[j][i]--;
            io << getDetVal(a, n) << '\n';
        }
    }
#undef long
} task;
}

int main() {
    task.solve();
    return 0;
}
```

### 「SDOI 2014」重建
#### 链接
[BZOJ 3534](http://www.lydsy.com/JudgeOnline/problem.php?id=3534)

#### 题解
##### 变元矩阵树定理
邻接矩阵中是可以带权的，$w_{ij}$ 表示 $i, j$ 的边权，{% raw %}$e_i${% endraw %} 表示边。
定义 {% raw %}$G(i, j) = G(j, i) = w_{ij}${% endraw %}，令 {% raw %}$G(i, i) = - \sum_{j \neq i} G(i, j)${% endraw %}

那么 $n - 1$ 阶主子式的值为
{% raw %}$$\sum_{T \text{ form a tree}}(\prod_{i \in T}w_{e_i})$${% endraw %}

即求出的是所有生成树边权积之和。

有了变元矩阵树定理，我们再来考虑这道题。

令 $P(i, j)$ 表示题目中所给出的概率矩阵，$G(i, j)$ 为我们所要构造的基尔霍夫矩阵。

先考虑一棵生成树的概率，$T$ 表示这棵生成树，其概率应为
{% raw %}$$\prod_{e \in T}P_e \prod_{e \notin T}(1 - P_e)$${% endraw %}
即在生成树上的边连通的概率乘上不在生成树上的边不连通的概率。

我们令 $G(i, j) = \frac {P(i, j)} {1 - P(i, j)}$，然后套用变元矩阵树定理，令
{% raw %}$$G(i, i) = -\sum_{j \neq i}G(i, j)$${% endraw %}
求出 $G$ 的 $n - 1$ 阶主子式，即为
{% raw %}$$\sum_{T \text{ form a tree}}\prod_{e \in T}\frac {P_e} {1 - P_e}$${% endraw %}
令
{% raw %}$$f = \prod_{e} (1 - P_e)$${% endraw %}
那么将其乘上 $f$，可得
{% raw %}$$\begin{aligned} & \prod_{e}(1 - P_e) \sum_{T \text{ form a tree}}\prod_{e \in T}\frac {P_e} {1 - P_e}\\ = & \sum_{T \text{ form a tree}} \prod_{e}(1 - P_e)\prod_{e \in T}\frac {P_e} {1 - P_e} \\
= & \sum_{T \text{ form a tree}}\prod_{e \in T}P_e \prod_{e \notin T}(1 - P_e) \end{aligned}$${% endraw %}

于是我们就得出了答案，实现的时候要注意 $P = 1$ 的问题，我们把它当成 $1 - \epsilon$ 就好了。

#### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「SDOI 2014」重建 07-09-2017
 * 变元矩阵树定理
 * @author xehoth
 */
#include <bits/stdc++.h>

namespace {

const int MAXN = 60;

const double EPS = 1e-10;

struct Task {
#define long long long
    double a[MAXN + 1][MAXN + 1];

    template <typename T, size_t size>
    inline bool gaussJordan(T a[size][size], const int n) {
        for (register int i = 0, idx; idx = i, i < n; i++) {
            for (register int j = i + 1; j < n; j++)
                if (fabs(a[j][i]) > fabs(a[idx][i])) idx = j;
            if (fabs(a[idx][i]) < EPS) return false;
            if (i != idx)
                for (register int j = i; j <= n; j++)
                    std::swap(a[i][j], a[idx][j]);
            for (register int j = 0; j < n; j++)
                if (i != j)
                    for (register int k = n; k >= i; k--)
                        a[j][k] -= a[i][k] / a[i][i] * a[j][i];
        }
    }

    template <typename T, size_t size>
    inline double getDetVal(T a[size][size], const int n) {
        gaussJordan(a, n);
        register double ans = 1;
        for (register int i = 0; i < n - 1; i++) ans *= a[i][i];
        return fabs(ans);
    }

    inline void solve() {
        register int n;
        std::cin >> n;
        register double f = 1;
        for (register int i = 0; i < n; i++) {
            for (register int j = 0; j < n; j++) {
                std::cin >> a[i][j];
                if (i != j) {
                    if (a[i][j] > 1 - EPS) a[i][j] -= EPS;
                    if (i < j) f *= 1 - a[i][j];
                    a[i][j] = a[i][j] / (1 - a[i][j]);
                }
            }
        }
        for (register int i = 0; i < n; i++)
            for (register int j = 0; j < n; j++)
                if (i != j) a[i][i] -= a[i][j];
        std::cout << std::fixed << std::setprecision(13) << getDetVal(a, n) * f;
    }
#undef long
} task;
}

int main() {
    std::ios::sync_with_stdio(false), std::cin.tie(NULL), std::cout.tie(NULL);
    task.solve();
    return 0;
}
```

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=874229&auto=1&height=66"></iframe>