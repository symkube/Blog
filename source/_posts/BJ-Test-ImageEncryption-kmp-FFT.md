---
title: 「BJ模拟」图片加密-kmp+FFT
date: 2017-03-27 20:11:19
tags:
  - 字符串
  - KMP
  - FFT
categories:
  - OI
  - 字符串
  - KMP
---
CJB 天天要跟妹子聊天，可是他对微信的加密算法表示担心：“微信这种加密算法，早就过时了，我发明的加密算法早已风靡全球，安全性天下第一！”

CJB 是这样加密的：设 CJB 想加密的信息有 $m$ 个字节。首先，从网上抓来一张 $n(n \geq m)$ 个字节的图片，分析里面的每个字节(byte)。每个字节有 $8$ 位(bit)二进制数字。他想替换掉某些字节中最低位的二进制数字，使得这张图片中，连续 $m$ 个字节恰为他想加密的信息。这样，图片看起来没什么区别，却包含了意味深长的信息。

很显然，不是所有的图片都能让 CJB 加密他那 $m$ 个字节的信息。他想请你帮忙写个程序判断这张图片是否能加密指定的信息。如果可以加密，则 CJB 要求改变最少的字节数。如果仍有多种解，他希望信息在图片中的位置越前越好。
<!-- more -->
### 输入
第一行包含两个整数 $n, m(1 \leq n, m \leq 250000)$，表示图片的大小和信息的大小。

第二行表示图片的内容。

第三行表示信息的内容。

所有内容都以二进制字节的形式给出。每个字节有 $8$ 位，最左边是最高位，最右边为**最低位**。

### 输出
如果这张图片不能加密这些信息，输出 `No`

否则第一行输出 `Yes`，第二行输出两个整数：最少修改的字节数，加密信息的起始位置。如果有多组解，要求加密信息的起始位置尽量前。

### 样例
```
【样例输入1】
3 2
11110001 11110001 11110000
11110000 11110000
【样例输入2】
3 1 
11110000 11110001 11110000
11110000

【样例输出1】
Yes
1 2
【样例输出2】
Yes
0 1
```
### 样例解释
图片有 $3$ 个字节，信息有 $2$ 个字节。

图片前两个字节可以匹配信息，需要改变两个字节中的最低位。

图片后两个字节可以匹配信息，只需要改变一个字节（第二个字节）中的最低位，信息在图片中的起始位置为第 $2$ 个字节。
### 数据范围与约定
对于 $10\%$ 的数据，$n, m \leq 500$

对于 $40\%$ 的数据，$n, m \leq 5000$

对于 $70\%$ 的数据，$n, m \leq 10^5$

对于所有数据，$1 \leq n, m \leq 2.5 \times 10^5$

### 题解
首先，先去掉最低位，跑一次 $KMP$，记录所有可以加密为信息的起始位置。

然后我们只保留最低位，存入 $a, b$ 数组里。我们很容易发现，从第 $i$ 个字节作为起始位置计算的话，答案为 $\sum_{j = 1}^{m}a[i + j] \text{ xor } b[j]$。

我们可以把 $b$ 反过来，即可变成卷积形式。

其中，异或可以拆成两个乘法操作相加，即：{% raw %}$a \text{ xor } b = (a * !b) + (!a * b)${% endraw %}。，那么我们做两次 $FFT$ 就可以解决了。

为什么我考场上都写 $FFT$ 打暴力了，不继续想 $KMP$ 啊........

### 代码
``` cpp
/*
 * craeted by xehoth on 27-03-2017
 */
#include <bits/stdc++.h>

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    if (s == t) {
        t = (s = buf) + fread(buf, 1, IN_LEN, stdin);
        if (s == t) return -1;
    }
    return *s++;
}

template<class T>
inline void read(T &x) {
    static bool iosig;
    static char c;
    for (iosig = false, c = read(); !isdigit(c); c = read()) {
        if (c == '-') iosig = true;
        if (c == -1) return;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    if (iosig) x = -x;
}

inline int read(char *buf) {
    register size_t s = 0;
    register char ch;
    while (ch = read(), isspace(ch) && ch != -1);
    if (ch == EOF) {
        *buf = '\0';
        return -1;
    }
    do buf[s++] = ch; while (ch = read(), !isspace(ch) && ch != -1);
    buf[s] = '\0';
    return s;
}


const int OUT_LEN = 10000000;
char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    if (oh == obuf + OUT_LEN) fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf;
    *oh++ = c;
}

template<class T>
inline void print(T x) {
    static int buf[30], cnt;
    if (x == 0) {
        print('0');
    } else {
        if (x < 0) print('-'), x = -x;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 + 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}

namespace FastFourierTansform {

const int MAXN = 300005;

struct Complex {
    double r, i;

    Complex(double r = 0, double i = 0) : r(r), i(i) {}

    inline Complex operator + (const Complex &x) {
        return Complex(r + x.r, i + x.i);
    }

    inline Complex operator - (const Complex &x) {
        return Complex(r - x.r, i - x.i);
    }

    inline Complex operator * (const Complex &x) {
        return Complex(r * x.r - i * x.i, r * x.i + i * x.r);
    }

    inline Complex conj() {
        return Complex(r, -i);
    }
} A[MAXN], C[MAXN];

const double PI = acos(-1);

inline void fft(Complex *a, const int n, const int f) {
    register int i, j, k;
    for (i = j = 0; i < n; i++) {
        if (i > j) std::swap(a[i], a[j]);
        for (k = n >> 1; (j ^= k) < k; k >>= 1);
    }
    for (i = 1; i < n; i <<= 1) {
        Complex wn(cos(PI / i), f * sin(PI / i));
        for (j = 0; j < n; j += i << 1) {
            Complex w(1, 0);
            for (k = 0; k < i; k++, w = w * wn) {
                Complex x = a[j + k], y = w * a[i + j + k];
                a[j + k] = x + y, a[i + j + k] = x - y;
            }
        }
    }
    if (f == -1) for (i = 0; i < n; i++) a[i].r /= n;
}

char in[10];
int a[MAXN], b[MAXN], pre[MAXN], tot, cost[MAXN];
int pat[MAXN], tmp[MAXN], fail[MAXN], n, m;

inline int parse() {
    register int ret = 0;
    register char *p = in;
    ret = ((*p - 48) << 7) | ((*(p + 1)) - 48 << 6) | ((*(p + 2)) - 48 << 5) |
          ((*(p + 3)) - 48 << 4) | ((*(p + 4)) - 48 << 3) | ((*(p + 5)) - 48 << 2) | 
          ((*(p + 6)) - 48 << 1) | ((*(p + 7)) - 48);
    return ret;
}

inline void kmp() {
    fail[1] = fail[2] = 1;
    for (register int j = 1, i = 2; i <= m; i++) {
        while (j > 1 && tmp[i] != tmp[j]) j = fail[j];
        fail[i + 1] = tmp[i] == tmp[j] ? ++j : j;
    }
    for (register int j = 1, i = 1; i <= n; i++) {
        while (j > 1 && tmp[j] != pat[i]) j = fail[j];
        if (tmp[j] == pat[i]) j++;
        if (j > m) pre[++tot] = i;
    }
}

int len;

inline void match(int p) {
    for (register int i = 0; i < n; i++) A[i].r = a[i + 1] & 1 ^ p;
    for (register int i = 0; i < m; i++) A[i].i = b[i + 1] & 1 ^ p ^ 1;
    for (register int i = n; i < len; i++) A[i].r = 0;
    for (register int i = m; i < len; i++) A[i].i = 0;
    fft(A, len, 1);
    for (register int i = 0, j; i <= len; i++) {
        j = (len - i) & (len - 1), C[i] = (A[i] * A[i] - (A[j] * A[j]).conj()) *
                                    Complex(0, -0.25);
    }
    fft(C, len, -1);
    for (register int i = 0; i <= len; i++) cost[i] += (int)(C[i].r + 0.5);
}

inline void solve() {
    read(n), read(m);
    for (register int i = 1; i <= n; i++) {
        read(in), a[i] = parse(), pat[i] = a[i] & 1 ? a[i] : a[i] ^ 1;
    }
    for (register int i = 1; i <= m; i++) {
        read(in), b[i] = parse(), tmp[i] = b[i] & 1 ? b[i] : b[i] ^ 1;
    }
    kmp();
    if (!tot) puts("No"), exit(0);
    puts("Yes");
    for (len = 1; len <= n; len <<= 1);
    std::reverse(b + 1, b + m + 1);
    match(0), match(1);
    register int min = INT_MAX, id = 0;
    for (register int j = 1; j <= tot; j++) 
        cost[pre[j] - 1] < min ? (min = cost[pre[j] - 1], id = pre[j] - m + 1) : 0;
    printf("%d %d\n", min, id);
}
}

int main() {
    FastFourierTansform::solve();
    flush();
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=30251864&auto=1&height=66"></iframe>