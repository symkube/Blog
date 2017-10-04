---
title: 「补档计划」随机化算法
date: 2017-05-23 14:47:42
tags:
  - 补档计划
  - 模拟退火
  - 爬山算法
  - 随机化
categories:
  - OI
  - 补档计划
---
模拟退火是一种通用概率算法，用来在固定时间内寻求在一个大的搜寻空间内找到的最优解。
<!-- more -->
### 爬山算法
通俗的来说，爬山算法就是一个贪心的过程。

我们要找到山脉的最高峰，但是我只能看到我的脚下哪边是上升的，哪边是下降的，看不到远处是否上升。每次移动，我们随机选择一个方向。如果这个方向是上升的的（更优），那么就决定往那个方向走。
#### 缺点
> 容易陷入局部极大值的困境

#### 随机爬山
为了解决陷入局部极大值的问题，我们可以多次重新爬山，随机生成初始状态。

### 模拟退火
在爬山算法的基础上，模拟退火算法则可以接受一些劣解，即如果这个方向是下降的（更差），那么**随机地接受**这个方向，接受就走，不接受就再随机一次——这个随机是关键，要考虑很多因素。比如，一个陡的下坡的接受率要比一个缓的下坡要小（因为陡的下坡后是答案的概率小）；同样的下降坡度，接受的概率随时间降低（逐渐降低才能趋向稳定）。
#### 实现
##### 接受答案
如果答案更优，或者 `exp(delta / t) * RAND_MAX >= rand()`，那么接受当前答案。

这个是由热力学公式得到的。
#### 代码
详见后文题目。

### 随机增量法
这里是针对最小圆覆盖的随机增量法。
#### 流程
1. 将所有平面上的点随机排列
2. 先以点 `1, 2` 确定直径，作出一个圆
3. 向后扫，将点逐个加入最小覆盖圆中，如果该点已在当前圆中或在圆上，则跳过；若不是，那么这个点一定是新的最小覆盖圆上的一个点，我们以这个点作为定点，用同样的方法来找第二个点,第三个点，确定三点后即可确定点1—i的最小覆盖圆
4. 重复步骤 $3$，即可得到点 `1 ~ n` 的最小覆盖圆

#### 时间复杂度
看上去时间复杂度似乎是 $O(n^3)$ 的，但注意到我们第一步是将平面上的点**随机**排列，所以我们确定了前 $i-1$ 个点的最小覆盖圆后，第 $i$ 个点在圆外的概率是 $\frac {3} {i}$，而根据确定点 $i$ 重新求出 `1 ~ i` 的最小覆盖圆的复杂度为 $O(i)$，根据期望的线性性得 $T(n) = \sum_{i = 1}^n O(i) \cdot \frac {3} {i} = O(n)$

#### 实现
##### 求线段的中垂线
设 $\vec{AB} = (x_1, y_1)$，其中垂线 $\vec{CD} = (x_2, y_2)$。

由于 $\vec{AB} \cdot \vec{CD} = 0$，我们有 $x_1x_2 + y_1y_2 = 0$，所以我们把 $AB$ 中点看成原点时，$x_2 = -y_1$，$y_2 = x_1$ 是其中一组特解，此时我们给 $(-y_1, x_1)$ 加上中点就是 $CD$。
#### 代码
详见后文的最小圆覆盖。
### 题目
#### 「BZOJ3680」吊打XXX
##### 链接
[BZOJ3680](http://www.lydsy.com/JudgeOnline/problem.php?id=3680)
##### 题解
此题就是求广义费马点，广义费马点满足:
$$min \sum_{i = 1}^n val[i] \times dis[i]$$。

所以我们直接模拟退火就好了，值得注意的是我们在退火完成后，再进行爬山，可以使答案更准确。
##### 代码
``` cpp
/*******************************************************************************
 * Copyright (c) 2016-2017, xehoth
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name xehoth, nor the names of its contributors may be used
 *       to endorse or promote products derived from this software without
 *       specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY XEHOTH AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL XEHOTH AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 ******************************************************************************/
#include <bits/stdc++.h>
/**
 * 「BZOJ3680」吊打XXX 23-05-2017
 * 模拟退火
 * @author xehoth
 */
namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template<typename T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

inline int read(char *buf) {
    register int s = 0;
    register char c;
    while (c = read(), isspace(c) && c != -1);
    if (c == -1) {
        *buf = '\0';
        return -1;
    }
    do buf[s++] = c; while (c = read(), !isspace(c) && c != -1);
    buf[s] = '\0';
    return s;
}

inline void read(double &x) {
    static char buf[30];
    read(buf), x = atof(buf);
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template<typename T>
inline void print(T x) {
    static int buf[30], cnt;
    if (x == 0) {
        print('0');
    } else {
        x < 0 ? (print('0'), x = -x) : 0;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}
}

namespace SimulatedAnnealing {

const int MAXN = 100000;

const double PI2 = 2 * acos(-1);
const double EPS = 1e-3;
const double DROP = 0.97;

struct Point {
    double x, y, w;
    Point(double x = 0, double y = 0, double w = 0) : x(x), y(y), w(w) {}

    inline void operator+=(const Point &p) {
        x += p.x, y += p.y;
    }

    inline void operator/=(const int i) {
        x /= i, y /= i;
    }

    inline double dis(const Point &p) const {
        return hypot(x - p.x, y - p.y);
    }

    inline void read() {
        IO::read(x), IO::read(y), IO::read(w);
    }
} now, ans, p[MAXN];

double total = DBL_MAX;
int n;
 
inline double check(const Point &p) {
    register double ret = 0;
    for (register int i = 0; i < n; i++) 
        ret += p.dis(SimulatedAnnealing::p[i]) * SimulatedAnnealing::p[i].w;
    if (ret < total) total = ret, ans = p;
    return ret;
}

inline void solve() {
    using namespace IO;
    srand(495);
    read(n);
    for (register int i = 0; i < n; i++) p[i].read(), now += p[i];
    now /= n;
    for (double t = 100000; t > EPS; t *= DROP) {
        Point tmp(now.x + t * sin(rand()), now.y + t * sin(rand()));
        register double delta = check(now) - check(tmp);
        if (delta >= 0 || exp(delta / t) * RAND_MAX >= rand()) now = tmp;
    }
    for (register int i = 1; i <= 1000; i++) {
        check(Point(ans.x + 0.001 * cos(rand()), ans.y + 0.001 * sin(rand())));
    }
    printf("%.3lf %.3lf\n", ans.x, ans.y);
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    SimulatedAnnealing::solve();
    
    return 0;
}
```
#### 「HAOI2006」均分数据
##### 链接
[BZOJ2428](http://www.lydsy.com/JudgeOnline/problem.php?id=2428)
##### 题解
直接上退火板就好了....
##### 代码
``` cpp
/*******************************************************************************
 * Copyright (c) 2016-2017, xehoth
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name xehoth, nor the names of its contributors may be used
 *       to endorse or promote products derived from this software without
 *       specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY XEHOTH AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL XEHOTH AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 ******************************************************************************/
#include <bits/stdc++.h>
/**
 * 「HAOI2006」均分数据 23-05-2017
 * 模拟退火
 * @author xehoth
 */
namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template<typename T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template<typename T>
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

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}
}

namespace SimulatedAnnealing {

const int MAXN = 25;
const double EPS = 0.1;
const double DROP = 0.99;

double a[MAXN], sum[MAXN], min = DBL_MAX, average;
int n, m;
double *pos[MAXN];

template<typename T>
inline T square(const T &x) {
    return x * x;
}

inline double check(double tmp, double **o, double *p) {
    tmp -= square(**o - average) + square(*p - average);
    **o -= a[o - pos], *p += a[o - pos];
    tmp += square(**o - average) + square(*p - average);
    return tmp;
}

inline void simulatedAnnealing() {
    memset(sum, 0, sizeof(double) * (m + 1));
    register double now = 0;
    for (register int i = 1; i <= n; i++)
        pos[i] = sum + rand() % m + 1, *pos[i] += a[i];
    for (register int i = 1; i <= m; i++)
        now += square(sum[i] - average);
    for (double t = 2000; t > EPS; t *= DROP) {
        register double *p, **o = pos + rand() % n + 1;
        if (t > 500) p = std::min_element(sum + 1, sum + m + 1);
        else p = sum + rand() % m + 1;
        if (*o == p) continue;
        register double tmp = check(now, o, p);
        register double delta = now - tmp;
        if (delta >= 0 || exp(delta / t) * RAND_MAX >= rand()) {
            now = tmp, *o = p;
        } else {
            **o += a[o - pos], *p -= a[o - pos];
        }
        min = std::min(min, now);
    }
}

inline void solve() {
    using namespace IO;
    srand(495);
    read(n), read(m);
    for (register int i = 1, t; i <= n; i++)
        read(t), average += (a[i] = t);
    std::random_shuffle(a + 1, a + n + 1);
    average /= m;
    for (register int i = 0; i < 1000; i++)
        simulatedAnnealing();
    printf("%.2f", sqrt(min / m));
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    SimulatedAnnealing::solve();
    return 0;
}
```
#### 「POJ1379」Run Away
##### 链接
[POJ1379](http://poj.org/problem?id=1379)
##### 题解
此题就是找出一点，使其距离所有所有点的最短距离最大，先随机选取 $20$ 个点，然后退火就好了，注意初温不能太高。
##### 代码
``` cpp
/*******************************************************************************
 * Copyright (c) 2016-2017, xehoth
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name xehoth, nor the names of its contributors may be used
 *       to endorse or promote products derived from this software without
 *       specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY XEHOTH AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL XEHOTH AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 ******************************************************************************/
#include <cstdio>
#include <iostream>
#include <algorithm>
#include <cmath>
#include <cctype>
#include <climits>
#include <cfloat>
/**
 * 「POJ1379」Run Away 23-05-2017
 * 模拟退火
 * @author xehoth
 */
namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template<typename T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template<typename T>
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

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}
}

namespace SimulatedAnnealing {

const int MAXN = 1005;
const int MAXP = 20;
const double EPS = 1e-2;
const double DROP = 0.9;

template<typename T>
inline T square(const T &x) {
    return x * x;
}

struct Point {
    double x, y;

    Point(double x = 0, double y = 0) : x(x), y(y) {}

    inline double dis(const Point &p) const {
        return sqrt(square(x - p.x) + square(y - p.y));
    }

    inline void read() {
        static int t;
        IO::read(t), x = t, IO::read(t), y = t;
    }
} a[MAXN], ans[MAXN];

double x, y;
int n;

inline double get(const Point &p) {
    register double ret = DBL_MAX;
    for (register int i = 0; i < n; i++)
        ret = std::min(ret, p.dis(a[i]));
    return ret;
}

inline void simulatedAnnealing() {
    static double dis[MAXP + 5];
    for (register int i = 0; i < MAXP; i++)
        ans[i] = Point((rand() + 1.0) / RAND_MAX, (rand() + 1.0) / RAND_MAX), 
        dis[i] = get(ans[i]);
    for (double t = std::max(x, y) / sqrt((double)n); t > EPS; t *= DROP) {
        for (register int i = 0; i < MAXP; i++) {
            for (register int j = 0; j < MAXP; j++) {
                Point tmp = ans[i];
                tmp.x += t * cos((double)rand()), tmp.y += t * sin((double)rand());
                if (tmp.x < 0 || tmp.x > x || tmp.y < 0 || tmp.y > y) continue;
                register double now = get(tmp);
                register double delta = now - dis[i];
                if (delta >= 0 || (t > 500 && exp(delta / t) * RAND_MAX >= rand()))
                    dis[i] = now, ans[i] = tmp; 
            }
        }
    }
    for (register int times = 0; times < 100; times++) {
        for (register int i = 0; i < MAXP; i++) {
            for (register int j = 0; j < MAXP; j++) {
                Point tmp = ans[i];
                tmp.x += EPS * cos((double)rand()), tmp.y += EPS * sin((double)rand());
                if (tmp.x < 0 || tmp.x > x || tmp.y < 0 || tmp.y > y) continue;
                register double now = get(tmp);
                register double delta = now - dis[i];
                if (delta >= 0)
                    dis[i] = now, ans[i] = tmp;
            }
        }
    }
    Point *cur = std::max_element(dis, dis + MAXP) - dis + ans;
    printf("The safest point is (%.1f, %.1f).\n", cur->x, cur->y);
}

inline void solve() {
    using namespace IO;
    srand(495);
    register int t, tmp;
    for (read(t); t--;) {
        read(tmp), x = tmp, read(tmp), y = tmp, read(n);
        for (register int i = 0; i < n; i++) a[i].read();
            simulatedAnnealing();
    }
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    SimulatedAnnealing::solve();
    return 0;
}
```
#### 「BZOJ1336」Alien最小圆覆盖
##### 链接
[BZOJ1336](http://www.lydsy.com/JudgeOnline/problem.php?id=1336)
此题三倍经验(需要改输出和 EPS)。
[BZOJ1337](http://www.lydsy.com/JudgeOnline/problem.php?id=1337)
[BZOJ2823](http://www.lydsy.com/JudgeOnline/problem.php?id=2823)
##### 题解
见上最小圆覆盖。
##### 代码
``` cpp
/*******************************************************************************
 * Copyright (c) 2016-2017, xehoth
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name xehoth, nor the names of its contributors may be used
 *       to endorse or promote products derived from this software without
 *       specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY XEHOTH AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL XEHOTH AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 ******************************************************************************/
#include <bits/stdc++.h>
/**
 * 「BZOJ1336」Alien最小圆覆盖 23-05-2017
 * 随机增量法
 * @author xehoth
 */
namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template<typename T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        iosig ? x = -x : 0;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

inline int read(char *buf) {
    register int s = 0;
    register char c;
    while (c = read(), isspace(c) && c != -1);
    if (c == -1) {
        *buf = '\0';
        return -1;
    }
    do buf[s++] = c; while (c = read(), !isspace(c) && c != -1);
    buf[s] = '\0';
    return s;
}

inline void read(double &x) {
    static char buf[30];
    read(buf), x = atof(buf);
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template<typename T>
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

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}
}

namespace Task {

const int MAXN = 100005;
const double EPS = 1e-8;

template<typename T>
inline T square(const T &x) {
    return x * x;
}

struct Point {
    double x, y;

    Point(double x = 0, double y = 0) : x(x), y(y) {}

    inline double dis(const Point &p) const {
        return sqrt(square(x - p.x) + square(y - p.y));
    }

    inline Point operator+(const Point &p) const {
        return Point(x + p.x, y + p.y);
    }

    inline Point operator-(const Point &p) const {
        return Point(x - p.x, y - p.y);
    }

    inline Point operator*(const double i) const {
        return Point(x * i, y * i);
    }

    inline double operator*(const Point &p) const {
        return x * p.y - y * p.x;
    }

    inline double operator^(const Point &p) const {
        return x * p.x + y * p.y;
    }

    inline Point operator/(const double i) const {
        return Point(x / i, y / i);
    }

    inline void read() {
        IO::read(x), IO::read(y);
    }
} p[MAXN];

struct Circle {
    Point o;
    double r;

    Circle(const Point &o, const double r) : o(o), r(r) {}

    Circle() {}
};

struct Line {
    Point s, t;

    Line(const Point &s, const Point &t) : s(s), t(t) {}

    inline Point intersect(const Line &l) const {
        return s + (t - s) * (((s - l.s) * (l.t - l.s)) / ((l.t - l.s) * (t - s)));
    }

    inline Line getPerpendicularBisector() {
        return Line(Point((s.x + t.x) / 2, (s.y + t.y) / 2), 
                    Point((s.x + t.x) / 2 + s.y - t.y, (s.y + t.y) / 2 + t.x - s.x));
    }
};

inline Point getCenter(const Point &a, const Point &b, const Point &c) {
    return Line(a, b).getPerpendicularBisector().
           intersect(Line(a, c).getPerpendicularBisector());
}

inline void solve() {
    using namespace IO;
    srand(495);
    register int n;
    read(n);
    for (register int i = 1; i <= n; i++) p[i].read();
    std::random_shuffle(p + 1, p + n + 1);
    Circle c(p[1], 0);
    for (register int i = 1; i <= n; i++) {
        if (c.o.dis(p[i]) - c.r < EPS) continue;
        c = Circle((p[1] + p[i]) / 2, p[1].dis(p[i]) / 2);
        for (register int j = 2; j < i; j++) {
            if (c.o.dis(p[j]) - c.r < EPS) continue;
            c = Circle((p[i] + p[j]) / 2, p[i].dis(p[j]) / 2);
            for (register int k = 1; k < j; k++) {
                if (c.o.dis(p[k]) - c.r < EPS) continue;
                c = Circle(getCenter(p[i], p[j], p[k]), c.r);
                c.r = c.o.dis(p[k]);
            }
        }
    }
    printf("%.5lf\n%.5lf %.5lf\n", c.r, c.o.x, c.o.y);
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    Task::solve();
    return 0;
}
```
