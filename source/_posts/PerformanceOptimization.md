---
title: 常数优化的技巧及应用
date: 2017-03-31 14:15:00
tags:
  - 学习笔记
  - 黑科技
categories:
  - OI
  - 学习笔记
---
作为一个先学工程的蒟蒻 oier，也就只能在卡常上有一些技巧了......

然而我太弱，并没有去成 WC，~~虽然感觉 T2 卡三级缓存不是应该很好卡吗？~~

这里总结松爷的一些技巧和记录一些其他技巧及一些实际例子。
<!-- more -->
### 说明
既然都是常数/硬件级别的优化了，那么一切复杂度分析都是不靠谱的，以下技巧均通过了在 Intel Xeon CPU E5-2660 v3 @ 2.6GHz 以及 AMD FX 8300 @ 3.3GHz 下的基准测试和单元测试，所有测试均打开 O2 优化，OS: Ubuntu 16.10 xenial，Kernel: x86_64 Linux 4.9.7-53-generic。
### 废话
先列举一些大家都会的...

- 寻址优化
- register
- inline
- 三目运算符

永远不要相信前置自增比后置快，这个东西在现代编译器优化和基准测试下是行不通的。
### IO优化
数据量大的题目在多数情况下，IO 是耗时最高的。
#### 普通优化
`getchar` 和 `putchar` 优化 IO，相信大家都会...
#### 高级优化
使用 `fread` 和 `fwrite`，这里并不提倡 jcvb 打表式输出优化(除非你想抢 rank)。
``` cpp
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
    /* 这里这么写的原因见下 */
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    if (iosig) x = -x;
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
```
#### 鬼畜优化
这里使用内存映射，即使用 `mmap` 进行输入，输出同理。
``` cpp
#include <bits/stdc++.h>
#include <sys/mman.h>
#include <sys/stat.h>

#define private private:
#define public public:
class BufferedInputStream {
    private char *buf, *p;
    private int size;

    public inline void init() {
        register int fd = fileno(stdin);
        struct stat sb;
        fstat(fd, &sb);
        size = sb.st_size;
        buf = reinterpret_cast<char *>(mmap(0, size, PROT_READ, MAP_PRIVATE, fileno(stdin), 0));
        p = buf;
    }

    public inline char nextChar() {
        return (p == buf + size || *p == -1) ? -1 : *p++;
    }
};
```
#### 一些技巧
C 语言中的库函数相当快，比如 `isdigit` 严格快于手写判断。

解析整数也可以不用手写，直接使用 `strtol` 系列函数就好了。
**注意：手写整数解析的问题**
由于开了 O2
```
x = x * 10;
```
会被优化为
```
mul10:
x = x + (4 * x) /* lea 一条指令搞定 */
x += x
```
一共两条指令。

而这样写的同学请自重:
```
x = (x << 1) + (x << 3);
```
一共三条指令。

在开 O2 的情况下，应该写 $\times 10$ 或按以下写法：
```
x = (x + (x << 2) << 1) + (c ^ '0');
```
### 循环展开
#### 基础作用
- 减少了不直接有助于程序结果的操作的数量，例如循环索引计算和分支条件。
- 提供了一些方法，可以进一步变化代码，减少整个计算中关键路径上的操作数量。

#### 例子
如松爷 pdf 中的例子
``` cpp
double sum(double *a, int n) {
    double s = 0;
    for (int i = 0; i < n; i++) {
        s += a[i];
    }
    return s;
}

double sum(double *a, int n) {
    double s0 = 0, s1 = 0, s2 = 0, s3 = 0;
    for (int i = 0; i < n; i += 4) {
        s0 += a[i];
        s1 += a[i + 1];
        s2 += a[i + 2];
        s3 += a[i + 3];
    }
    return s0 + s1 + s2 + s3;
}
```
当展开次数过多时，性能反而下降，因为寄存器不够用 → 寄存器溢出
### goto
**goto 不符合编码规范，非特殊情况请不要使用。**

while + switch 跳转时， switch 和 while 上出现了至少两个分支语句, 一次指令循环中要进行一次条件跳转和三次无条件跳转(开启switch跳转表优化后)，可以考虑 goto， 在使用goto语句后可以大大减少在这些控制语句上的性能消耗, 配合GCC的拓展 [Labels as Values](https://gcc.gnu.org/onlinedocs/gcc/Labels-as-Values.html) 使用。
### 缓存
具体应用其实是 `vector`，详见第三个例题。
### CPU 并发
**注意：在使用这个技巧时，需要自行判断能否使用，否则后果自负...**

下面这个技巧看似简单，但能带来常数级别的飞越，可能出现的情况 ~~$n^2$ 过百万，暴力踩标程。~~

在单线程评测的情况下，我的程序并不能充分利用 CPU，尤其是睿频/turbo core 之类的技术，这时我们可以大量循环展开且将其写在一条语句内(具体方法见例题)。

如：
``` cpp
while (p1 <= pr) {
    tmp += (*p1) * (*p2) + (*(p1 + 1)) * (*(p2 + 1)) + (*(p1 + 2)) *
           (*(p2 + 2)) + (*(p1 + 3)) * (*(p2 + 3)) + (*(p1 + 4)) * (*(p2 + 4))
           + (*(p1 + 5)) * (*(p2 + 5)) + (*(p1 + 6)) * (*(p2 + 6)) + (*(p1 + 7))
           * (*(p2 + 7)) + (*(p1 + 8)) * (*(p2 + 8)) + (*(p1 + 9)) * (*(p2 + 9))
           + (*(p1 + 10)) * (*(p2 + 10)) + (*(p1 + 11)) * (*(p2 + 11))
           + (*(p1 + 12)) * (*(p2 + 12)) + (*(p1 + 13)) * (*(p2 + 13))
           + (*(p1 + 14)) * (*(p2 + 14));
    p1 += 15, p2 += 15;
}
```
#### 使用条件
- 你的程序对并行流水线友好。
- 循环展开后，可以方便地用大量简单的运算完成对答案的更新。
- 观察到你的寄存器并不会溢出。

## 例题
### COUNTARI
[CodeChef-COUNTARI](https://www.codechef.com/problems/COUNTARI)
[BZOJ-3509](http://www.lydsy.com/JudgeOnline/problem.php?id=3509)
给定 $n$ 个整数 $A_1,A_2,A_n$ ，求有多少个三元组 $(i,j,k)$ 满足 $1 \leq i<j<k \leq n$ 且 $A_j-A_i=A_k-A_j$ 
#### 正解
分块 + FFT，网上随便找一篇都有详细题解。
#### 暴力 + 卡常
我们用前后两个桶来统计，直接枚举就好了，复杂度 $O(n max(a)) = 3 \times 10^9$，但利用上述技巧，我们可以踩掉标算。

注意到我们枚举桶时，对并行流水线十分友好，且桶可以利用指针轻松访问，此题更新答案就是将两指针解引用后相乘再累加，我们可以使用 CPU 并发，实际效果就是轻松拿下 bzoj 和 cc rk1(cc 没有更新我最后 0.64s 的[记录](https://www.codechef.com/viewsolution/13113297))。

``` cpp
/*
 * created by xehoth on 18-03-2017
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
inline bool read(T &x) {
    static bool iosig;
    static char c;
    for (iosig = false, c = read(); !isdigit(c); c = read()) {
        if (c == '-') iosig = true;
        if (c == -1) return false;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    if (iosig) x = -x;
    return true;
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

typedef unsigned long long ull;
typedef unsigned int uint;
#define long long long

const int MAXN = 100000;
const int MAX_VAL = 30000;
uint v[MAXN], bucL[MAX_VAL + 1], bucR[MAX_VAL + 1];

namespace Concurrent {

/*concurrent*/
inline void concurrentSolve() {
    /* real register %esp %ebp %eax */
    register int i, n, tmp;
    read(n);
    for (i = 0; i < n; i++)
        read(tmp), bucR[MAX_VAL - (v[i] = tmp)]++;

    bucR[MAX_VAL - v[0]]--;
    register int minL = v[0], maxL = v[0];

    register long ans = 0;

    n--;
    for (i = 1; i < n; i++) {
        register int last = v[i - 1], cur = v[i];
        if (last < minL) minL = last;
        else if (last > maxL) maxL = last;

        bucL[last]++;
        bucR[MAX_VAL - cur]--;

        register int bufx = cur << 1, low = std::max(minL, bufx - MAX_VAL),
                     high = std::min(maxL, bufx - 1);
        /*CPU 并发优化*/
        register uint tmp = 0, *p1 = bucL + low, *pr = bucL + high - 14,
                      *p2 = bucR + MAX_VAL - bufx + low;
        /*循环展开 + 刺激并发*/
        while (p1 <= pr) {
            tmp += (*p1) * (*p2) + (*(p1 + 1)) * (*(p2 + 1)) + (*(p1 + 2)) *
                   (*(p2 + 2)) + (*(p1 + 3)) * (*(p2 + 3)) + (*(p1 + 4)) * (*(p2 + 4))
                   + (*(p1 + 5)) * (*(p2 + 5)) + (*(p1 + 6)) * (*(p2 + 6)) + (*(p1 + 7))
                   * (*(p2 + 7)) + (*(p1 + 8)) * (*(p2 + 8)) + (*(p1 + 9)) * (*(p2 + 9))
                   + (*(p1 + 10)) * (*(p2 + 10)) + (*(p1 + 11)) * (*(p2 + 11))
                   + (*(p1 + 12)) * (*(p2 + 12)) + (*(p1 + 13)) * (*(p2 + 13))
                   + (*(p1 + 14)) * (*(p2 + 14));

            p1 += 15, p2 += 15;
        }
        while (p1 <= bucL + high) tmp += (*(p1++)) * (*(p2++));
        ans += tmp;
    }

    print(ans);
}

}

int main() {
#ifndef ONLINE_JUDGE
    freopen("in.in", "r", stdin);
#endif
    Concurrent::concurrentSolve();
    flush();
    return 0;
}
```

### Increase the Constraints
[cf-472G](http://codeforces.com/contest/472/problem/G)
原理同上，贴份代码。
#### 普通优化
``` cpp
#include <bits/stdc++.h>

unsigned long long shifted1[64][200000 / 64];
unsigned long long shifted2[64][200000 / 64];
char s[2000000];
char *ptr = s;

inline int parse() {
    int ans = 0;
    while (*ptr != 0 && *ptr != ' ') {
        ans = ans * 10 + *ptr - '0';
        ptr++;
    }
    ptr++;
    return ans;
}

int cnt[1 << 16];

inline void solve() {
    for (int i = 0; i < (1 << 16); ++i) {
        for (int j = 0; j < 16; ++j) {
            cnt[i] += ((i >> j) & 1);
        }
    }
    gets(s);
    for (int i = 0; s[i]; ++i) {

        if (s[i] == '1') {
            for (int j = 0; j < 64; ++j) {
                if (i >= j) {
                    shifted1[j][(i - j) >> 6] |= (1ULL << ((i - j) & 63));
                }
            }
        }
    }

    gets(s);
    for (int i = 0; s[i]; ++i) {
        if (s[i] == '1') {
            for (int j = 0; j < 64; ++j) {
                if (i >= j) {
                    shifted2[j][(i - j) >> 6] |= (1ULL << ((i - j) & 63));
                }
            }
        }
    }

    gets(s);
    int q = parse();
    unsigned long long last16 = (1 << 16) - 1;
    while (q--) {
        gets(s);
        ptr = s;
        int ans = 0;
        int p1 = parse();
        int p2 = parse();
        int len = parse();
        unsigned long long *ptr1 = shifted1[p1 & 63] + (p1 >> 6);
        unsigned long long *ptr2 = shifted2[p2 & 63] + (p2 >> 6);
        int r = len >> 6;

        for (int i = 0; i < r; ++i) {
            unsigned long long cur = *ptr1 ^*ptr2;
            ++ptr1;
            ++ptr2;
            ans += cnt[cur >> 48] + cnt[(cur >> 32) & (last16)] + cnt[(cur >> 16) & last16] + cnt[cur & last16];
        }
        unsigned long long cur = (*ptr1 ^ *ptr2) & ((1ULL << (len & 63)) - 1);
        ans += cnt[cur >> 48] + cnt[(cur >> 32) & (last16)] + cnt[(cur >> 16) & last16] + cnt[cur & last16];


        printf("%d\n", ans);
    }
}


int main() {
    std::cout.sync_with_stdio(0);
    std::cout.precision(20);
    std::cout << std::fixed;

    int tests = 1;
    while (tests--) {
        solve();
    }

    return 0;
}
```
#### 使用 SIMD 指令集 / 内联汇编
这份代码是没有什么作用的，考场又不能用，上面那份才是靠谱的.....
``` cpp
/*
 * created by xehoth on 31-03-2017
 */
#include <bits/stdc++.h>
#include <stdint.h>


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


const int OUT_LEN = 100000;
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

#ifdef ALIGN_DATA
#define __aligned__ __attribute__((aligned(16)))
#else
#define __aligned__
#endif

#define MAX_CHUNKS 32768

uint8_t buffer[16 * MAX_CHUNKS];

using namespace std;

typedef long long ll;
typedef unsigned long long ull;
typedef std::vector<int> Vector;

const ll MOD = 2184057LL;

ull a[64][(218 * 1000) / 64];
ull b[64][(218 * 1000) / 64];

char buf[512 * 1000];

/* lookup for SSE */
uint8_t POPCOUNT_4bit[16] __aligned__ = {
    /* 0 */ 0,
    /* 1 */ 1,
    /* 2 */ 1,
    /* 3 */ 2,
    /* 4 */ 1,
    /* 5 */ 2,
    /* 6 */ 2,
    /* 7 */ 3,
    /* 8 */ 1,
    /* 9 */ 2,
    /* a */ 2,
    /* b */ 3,
    /* c */ 2,
    /* d */ 3,
    /* e */ 3,
    /* f */ 4
};

uint32_t ssse3Popcount3(uint8_t* buffer, int chunks16) {
    static char MASK_4bit[16] = {0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf};

    uint32_t result;

#ifdef DEBUG
    assert(chunks16 % 4 == 0);
#endif

    __asm__ volatile ("movdqu (%%eax), %%xmm7" : : "a" (POPCOUNT_4bit));
    __asm__ volatile ("movdqu (%%eax), %%xmm6" : : "a" (MASK_4bit));
    __asm__ volatile ("pxor    %%xmm5, %%xmm5" : : ); /* xmm5 -- global accumulator */

    result = 0;

    int k, n, i;

    i = 0;
    while (chunks16 > 0) {
        /* max(POPCOUNT_8bit) = 8, thus byte-wise addition could be done */
        /* for floor(255/8) = 31 iterations */
#define MAX (7 * 4)
        if (chunks16 > MAX) {
            k = MAX;
            chunks16 -= MAX;
        }
        else {
            k = chunks16;
            chunks16 = 0;
        }
#undef MAX
        __asm__ volatile ("pxor %xmm4, %xmm4"); /* xmm4 -- local accumulator */
        for (n = 0; n < k; n += 4) {
#define body(index) \
            __asm__ volatile( \
                "movdqa   (%%eax), %%xmm0   \n" \
                "movdqa    %%xmm0, %%xmm1   \n" \
                "psrlw         $4, %%xmm1   \n" \
                "pand      %%xmm6, %%xmm0   \n" \
                "pand      %%xmm6, %%xmm1   \n" \
                "movdqa    %%xmm7, %%xmm2   \n" \
                "movdqa    %%xmm7, %%xmm3   \n" \
                "pshufb    %%xmm0, %%xmm2   \n" \
                "pshufb    %%xmm1, %%xmm3   \n" \
                "paddb     %%xmm2, %%xmm4   \n" \
                "paddb     %%xmm3, %%xmm4   \n" \
                : : "a" (&buffer[index]));

            body(i);
            body(i + 1 * 16);
            body(i + 2 * 16);
            body(i + 3 * 16);
#undef body
            i += 4 * 16;
        }

        /* update global accumulator (two 32-bits counters) */
        __asm__ volatile (
            "pxor   %xmm0, %xmm0        \n"
            "psadbw %xmm0, %xmm4        \n"
            "paddd  %xmm4, %xmm5        \n"
        );
    }

    /* finally add together 32-bits counters stored in global accumulator */
    __asm__ volatile (
        "movhlps   %%xmm5, %%xmm0   \n"
        "paddd     %%xmm5, %%xmm0   \n"
        "movd      %%xmm0, %%eax    \n"
        : "=a" (result)
    );

    return result;
}



int main() {
    std::string sa, sb;
    read(buf); 
    sa = std::string(buf);
    read(buf); 
    sb = std::string(buf);

    memset(a, 0, sizeof(a));
    memset(b, 0, sizeof(b));
    for (int shift = 0; shift < 64; ++shift) {
        for (int i = 0; shift + i < sa.size(); ++i) {
            ull bit = ((ull) 1) << (ull) (i % 64);
            int bucket = i / 64;
            if (sa[i + shift] == '1') {
                a[shift][bucket] |= bit;
            }
        }
        for (int i = 0; shift + i < sb.size(); ++i) {
            ull bit = ((ull) 1) << (ull) (i % 64);
            int bucket = i / 64;
            if (sb[i + shift] == '1') {
                b[shift][bucket] |= bit;
            }
        }
    }
    int m;
    read(m);
    int prevP1 = -1, prevP2 = -1, prevL = -1, prevRes = -1;
    for (int it = 0; it < m; ++it) {
        int p1, p2, l;
        read(p1), read(p2), read(l);
        if (p1 == prevP1 && p2 == prevP2 && l == prevL) {
            print(prevRes), print('\n');
            continue;
        }
        prevP1 = p1; prevP2 = p2; prevL = l;
        int shift1 = p1 % 64;
        int shift2 = p2 % 64;
        int start1 = p1 / 64;
        int start2 = p2 / 64;
        int res = 0;
        ull* A = a[shift1];
        ull* B = b[shift1];
        A += start1;
        B += start2;
        int UP = l / 64 - 1;
        ull* buff = (ull*) buffer;
        for (int i = 0; i <= UP; ++i) {
            buff[i] = a[shift1][start1 + i] ^ b[shift2][start2 + i];
        }
        ull mask = (((ull) 1) << (ull) (l % 64)) - (ull) 1;
        buff[UP + 1] = ((a[shift1][start1 + l / 64] ^ b[shift2][start2 + l / 64]) & mask);
        for (int i = 0; i < 16; ++i) buff[UP + i + 2] = 0;
        res = ssse3Popcount3(buffer, l / (8 * 16) + 1);
        
        print(res), print('\n');
        prevRes = res;

    }
    flush();
    return 0;
}
```
### 最大流
[LYOI-159](https://ly.men.ci/problem/159) (这个时限太大了，应该是 $1s$)
[THOJ-7](http://thoj.xehoth.cc/problem/7)
有 $n$ 个点，$m$ 条边，给定每条边的容量，求从点 $s$ 到点 $t$ 的最大流。

$1 \leq n \leq 10^6, 1 \leq m \leq 4 \times 10^6, 0 \leq c \leq 2^{31} - 1$

此题你非要基排预处理我也不说什么(详见 [q234rty](https://ly.men.ci/submission/3578))...

直接把前向星换成 `vector`，然后此题做完了....

原因：vector 缓存直接命中了，内存连续，大量访问....
``` cpp
/*
 * created by xehoth on 01-03-2017
 */
#include <bits/stdc++.h>
#include <sys/mman.h>
#include <sys/stat.h>

#define long long long

struct BufferedInputStream {
    char *buf, *p;
    int size;

    inline void init() {
        register int fd = fileno(stdin);
        struct stat sb;
        fstat(fd, &sb);
        size = sb.st_size;
        buf = (char *)mmap(0, size, PROT_READ, MAP_SHARED, fd, 0);
        p = buf;
    }

    inline char nextChar() {
        return (p == buf + size || *p == -1) ? -1 : *p++;
    }

    template<class T>
    inline void read(T &x) {
        register char c;
        register bool iosig = false;
        for (c = nextChar(); !isdigit(c); c = nextChar()) {
            if (c == -1) return;
            if (c == '-') iosig = true;
        }
        for (x = 0; isdigit(c); c = nextChar())
            x = (x + (x << 2) << 1) + (c ^ '0');
        if (iosig) x = -x;
    }

    inline int read(char *buf) {
        register size_t s = 0;
        register char ch;
        while (ch = nextChar(), isspace(ch) && ch != EOF);
        if (ch == EOF) {
            *buf = '\0';
            return -1;
        }
        do buf[s++] = ch; while (ch = nextChar(), !isspace(ch) && ch != EOF);
        buf[s] = '\0';
        return s;
    }

    inline int nextInt() {
        register int i;
        read(i);
        return i;
    }

    inline int nextLong() {
        register long i;
        read(i);
        return i;
    }
} in;

const int MAXN = 1000010;

int gap[MAXN], h[MAXN];

struct Node {
    int v, f, index;
    Node(int v, int f, int index) : v(v), f(f), index(index) {}
};

std::vector<Node> edge[MAXN];

inline void addEdge(int u, int v, int f) {
    edge[u].push_back(Node(v, f, edge[v].size()));
    edge[v].push_back(Node(u, 0, edge[u].size() - 1));
}

inline int sap(int v, int flow, int s, int t, int n) {
    static int iter[MAXN];
    if (v == t) return flow;
    register int rec = 0;
    for (register int i = iter[v]; i < edge[v].size(); i++) {
        Node *p = &edge[v][i];
        if (h[v] == h[p->v] + 1) {
            register int ret = sap(p->v, std::min(flow - rec, p->f), s, t, n);
            p->f -= ret, edge[p->v][p->index].f += ret, iter[v] = i;
            if ((rec += ret) == flow) return flow; 
        }
    }
    iter[v] = 0;
    if (!(--gap[h[v]])) h[s] = n;
    gap[++h[v]]++;
    return rec;
}

inline int sap(int s, int t, int n) {
    register int ret = 0;
    gap[0] = n;
    while (h[s] < n) ret += sap(s, INT_MAX, s, t, n);
    return ret;
}

int main() {
    in.init();
    register int n, m, s, t;
    in.read(n), in.read(m), in.read(s), in.read(t);
    for (register int i = 0, a, b, h; i < m; i++) {
        in.read(a), in.read(b), in.read(h);
        addEdge(a, b, h);
    }
    return printf("%d", sap(s, t, n)), 0;
}
```
### 后缀数组的 SA-IS 算法
详见[此](https://blog.xehoth.cc/SA-IS/)，这个算法快的原因就是缓存命中与顺序访问。

例题[THOJ-8](http://thoj.xehoth.cc/problem/8)
### 松爷 pdf
{% pdf /pdf/wys-full.pdf %}
### 一些考场上并不能用的优化
#### attribute
``` cpp
__attribute__((optimize("Ofast"))) __attribute__((__gnu_inline__, __always_inline__, __artificial__))

__attribute__((aligned))

__fastcall    
```
#### SIMD 指令集优化矩阵乘法
``` cpp
#include <immintrin.h>
#include <intrin.h>

#define DIFFERENT_ORDER 0
 
static inline void lincomb_SSE(const float *a, const __m128 b[4], float *out) {
    __m128 result;
    __m128 column = _mm_load_ps(a);
    result = _mm_mul_ps(_mm_shuffle_ps(column, column, 0x00), b[0]);
    result = _mm_add_ps(result, _mm_mul_ps(_mm_shuffle_ps(column, column, 0x55), b[1]));
    result = _mm_add_ps(result, _mm_mul_ps(_mm_shuffle_ps(column, column, 0xaa), b[2]));
    result = _mm_add_ps(result, _mm_mul_ps(_mm_shuffle_ps(column, column, 0xff), b[3]));
    _mm_store_ps(out, result);
}
 
void matmult_SSE(float *A, const float *B) {
    _MM_ALIGN16 float mA[16], mB[16];
#if DIFFERENT_ORDER
    float *out = mA;
    memcpy(mA, A, 16 * sizeof(float));
    memcpy(mB, B, 16 * sizeof(float));
#else
    _MM_ALIGN16 float out[16];
    memcpy(mB, A, 16 * sizeof(float));
    memcpy(mA, B, 16 * sizeof(float));
#endif
    __m128 Bcolumns[] = { 
        _mm_load_ps(mB + 0),
        _mm_load_ps(mB + 4),
        _mm_load_ps(mB + 8),
        _mm_load_ps(mB + 12)
    };
    lincomb_SSE(mA + 0,  Bcolumns, out + 0);
    lincomb_SSE(mA + 4,  Bcolumns, out + 4);
    lincomb_SSE(mA + 8,  Bcolumns, out + 8);
    lincomb_SSE(mA + 12, Bcolumns, out + 12);
    memcpy(A, out, 16 * sizeof(float));
}
```
### 快速乘
内联汇编，$x \times y \% MOD$
``` cpp
inline int mul(int x,int y) {
  int ret; 
  __asm__ __volatile__ ("\tmull %%ebx\n\tdivl %%ecx\n":"=d"(ret):"a"(x),"b"(y),"c"(MOD));
  return ret;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=32405990&auto=1&height=66"></iframe>