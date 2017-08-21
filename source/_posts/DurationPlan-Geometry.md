---
title: 「补档计划」计算几何
date: 2017-05-19 09:41:37
tags:
  - 补档计划
  - 计算几何
categories:
  - oi
  - 补档计划
---
一些常见的计算几何。
<!-- more -->
### 「HDU1756」Cupid's Arrow
#### 链接
[HDU1756](http://acm.hdu.edu.cn/showproblem.php?pid=1756)
#### 题解
此题就是判断点是否在多边形内，采用射线法，时间复杂度 $O(n)$。
##### 判断点在直线上
设点为 $P$，直线为 $AB$，若 $\vec{PA} \times \vec{PB} = 0$ 则 $P$ 在直线 $AB$ 上。
##### 判断点在线段上
先判断 $P$ 是否在直线 $AB$ 上，然后判断 $P$ 是否在 $AB$ 端点构成的矩形范围内。
``` cpp
inline bool isPointOnSegment(const Point &a, const Point &b, const Point &p) {
    return (a - p) * (b - p) == 0 && std::min(a.x, b.x) <= p.x &&
           std::min(a.y, b.y) <= p.y && std::max(a.x, b.x) >= p.x &&
           std::max(a.y, b.y) >= p.y;
}
```
##### 射线法
平行于 $x$ 轴射出一条线，若与多边形有交点，则 `cnt++`，若 `cnt` 为奇数，那么点在多边形内。
#### 代码
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
 * 「HDU 1756」Cupid's Arrow 19-05-2017
 * 计算几何
 * @author xehoth
 */
namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template<class T>
inline bool read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return false;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
    return true;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template<class T>
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

const int MAXN = 105;

struct Point {
    int x, y;

    Point(int x = 0, int y = 0) : x(x), y(y) {}

    inline Point operator+(const Point &p) const {
        return Point(x + p.x, y + p.y);
    }

    inline Point operator-(const Point &p) const {
        return Point(x - p.x, y - p.y);
    }

    inline int operator*(const Point &p) const {
        return x * p.y - y * p.x;
    }

    inline int operator^(const Point &p) const {
        return x * p.x + y * p.y;
    }
    
    inline void read() {
        IO::read(x), IO::read(y);
    }
} q;

inline bool isPointOnSegment(const Point &a, const Point &b, const Point &p) {
    return (a - p) * (b - p) == 0 && std::min(a.x, b.x) <= p.x &&
           std::min(a.y, b.y) <= p.y && std::max(a.x, b.x) >= p.x &&
           std::max(a.y, b.y) >= p.y;
}

struct Polygon {
    Point p[MAXN];
    int n;

    Polygon(int n = 0) : n(n) {}

    inline int area() {
        register int ret = 0;
        for (register int i = 0; i < n; i++) ret += p[i] * p[i + 1];
        return ret / 2;
    }

    inline void fix() {
        p[n] = p[0];
        area() < 0 ? std::reverse(p, p + n) : (void)0;
        p[n] = p[0];
    }

    inline bool contains(const Point &q) {
        register int cnt = 0;
        for (register int i = 0; i < n; i++) {
            if (isPointOnSegment(p[i], p[i + 1], q)) return true;
            register int det = (p[i] - q) * (p[i + 1] - q);
            register int d1 = p[i].y - q.y, d2 = p[i + 1].y - q.y;
            if ((det >= 0 && d1 < 0 && d2 >= 0) ||
                (det <= 0 && d1 >= 0 && d2 < 0)) cnt++;
        }
        return cnt & 1;
    }

    inline Point &operator[](const int i) {
        return p[i];
    }
} p;

inline void solve() {
    using namespace IO;
    register int n, m;
    while (read(n)) {
        p.n = n;
        for (register int i = 0; i < n; i++) p[i].read();
        p.fix();
        read(m);
        while (m--) {
            q.read();
            p.contains(q) ? (print('Y'), print('e'), print('s')) : 
            (print('N'), print('o'));
            print('\n');
        }
    }
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    Task::solve();
    IO::flush();
    return 0;
}
```
### 「POJ1269」Intersecting Lines
#### 链接
[POJ1269](http://poj.org/problem?id=1269)
#### 题解
先判断直线平行，在判断共线，否则求交点。
##### 判断平行
$\vec{AB} \times \vec{CD} = 0$ 则两直线平行。
##### 判断共线
在平行的基础上，任意交换一个端点，叉积仍为 $0$ 则两直线共线。
##### 求交点
![求交点](/images/计算几何1.svg)
设交点为 $P$，则 $P = A + \vec{AB} \cdot \frac {S_{ACD}} {S_{ACBD}}$，
``` cpp
struct Line {
    Point s, t;

    inline Point intersection(const Line &l) const {
        return s + (t - s) * (((l.s - s) * (l.t - s)) / ((l.s - l.t) * (t - s)));
    }
};
```
#### 代码
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
#include <algorithm>
#include <cstdio>
#include <cstdlib>
#include <cmath>
#include <iostream>
#include <iomanip> 
/**
 * 「POJ 1269」Intersecting Lines 19-05-2017
 * 计算几何
 * @author xehoth
 */
namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template<class T>
inline bool read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return false;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
    return true;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template<class T>
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

inline void print(const char *s) {
    for (; *s; s++) print(*s);
}

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}
}

namespace Task {

struct Point {
    double x, y;

    Point(double x = 0, double y = 0) : x(x), y(y) {}

    inline Point operator+(const Point &p) const {
        return Point(x + p.x, y + p.y);
    }

    inline Point operator-(const Point &p) const {
        return Point(x - p.x, y - p.y);
    }

    inline double operator*(const Point &p) const {
        return x * p.y - y * p.x;
    }

    inline double operator^(const Point &p) const {
        return x * p.x + y * p.y;
    }
    
    inline Point operator*(const double t) const {
        return Point(x * t, y * t);
    } 
    
    inline void print() {
        std::cout << std::fixed << std::setprecision(2) << x << ' ' << y << '\n';
    }

    inline void read() {
        static int t;
        IO::read(t), x = t;
        IO::read(t), y = t;
    }
};

struct Line {
    Point s, t;

    inline void read() {
        s.read(), t.read();
    }

    inline Point intersection(const Line &l) const {
        return s + (t - s) * (((l.s - s) * (l.t - s)) / ((l.s - l.t) * (t - s)));
    }
} a, b;

const double EPS = 1e-7;

inline void solve() {
    using namespace IO;
    register int n;
    read(n);
    puts("INTERSECTING LINES OUTPUT");
    for (register int i = 0; i < n; i++) {
        a.read(), b.read();
        if (fabs((a.t - a.s) * (b.t - b.s)) < EPS) {
            if (fabs((a.t - a.s) * (b.t - a.s)) < EPS && 
                fabs((b.t - b.s) * (a.t - b.s)) < EPS) std::cout << "LINE\n";
            else std::cout << "NONE\n";
        } else {
            std::cout << "POINT ";
            a.intersection(b).print();
        }
    }
    puts("END OF OUTPUT");
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    Task::solve();
    IO::flush();
    return 0;
}
```
### 「POJ 3907」Build Your Home
#### 链接
[POJ3907](http://poj.org/problem?id=3907)
#### 题解
就是求多边形的面积。
##### 求多边形面积
相邻两点叉积求和，绝对值除以 $2$ 即为多边形的面积。
#### 代码
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
#include <algorithm>
#include <cstdio>
#include <cstdlib>
#include <cmath>
#include <iostream>
#include <iomanip> 
/**
 * 「POJ 3907」Build Your Home 19-05-2017
 * 计算几何
 * @author xehoth
 */
namespace Task {

struct Point {
    double x, y;

    Point(double x = 0, double y = 0) : x(x), y(y) {}

    inline Point operator+(const Point &p) const {
        return Point(x + p.x, y + p.y);
    }

    inline Point operator-(const Point &p) const {
        return Point(x - p.x, y - p.y);
    }

    inline double operator*(const Point &p) const {
        return x * p.y - y * p.x;
    }

    inline double operator^(const Point &p) const {
        return x * p.x + y * p.y;
    }
    
    inline Point operator*(const double t) const {
        return Point(x * t, y * t);
    } 
    
    inline void print() {
        std::cout << std::fixed << std::setprecision(2) << x << ' ' << y << '\n';
    }

    inline void read() {
        std::cin >> x >> y;
    }
} a, b, f;

inline void solve() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(NULL);
    register int n;
    while (std::cin >> n && n) {
        register double ans = 0;
        a.read(), f = a;
        n--;
        while (n--)
            b.read(), ans += a * b, a = b;
        ans += a * f;
        std::cout << std::abs((int)round(ans / 2 + 1e-6)) << '\n';
    }
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
### 「POJ 2318」TOYS
#### 链接
[POJ2318](http://poj.org/problem?id=2318)
#### 题解
求落在每个区域内的点的个数，二分，然后用叉积判断位置即可。
#### 代码
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
#include <algorithm>
#include <cstdio>
#include <cstdlib>
#include <cmath>
#include <iostream>
#include <iomanip>
#include <cstring>
/**
 * 「POJ 2318」TOYS 19-05-2017
 * 计算几何
 * @author xehoth
 */
namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template<class T>
inline bool read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return false;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
    return true;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template<class T>
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

inline void print(const char *s) {
    for (; *s; s++) print(*s);
}

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}
}

namespace Task {

struct Point {
    int x, y;

    Point(int x = 0, int y = 0) : x(x), y(y) {}

    inline Point operator+(const Point &p) const {
        return Point(x + p.x, y + p.y);
    }

    inline Point operator-(const Point &p) const {
        return Point(x - p.x, y - p.y);
    }

    inline int operator*(const Point &p) const {
        return x * p.y - y * p.x;
    }

    inline int operator^(const Point &p) const {
        return x * p.x + y * p.y;
    }
    
    inline Point operator*(const int t) const {
        return Point(x * t, y * t);
    } 

    inline void read() {
        IO::read(x), IO::read(y);
    }
};

struct Line {
    Point s, t;

    Line() {}

    Line(const Point &s, const Point &t) : s(s), t(t) {}
};

const int MAXN = 5050;
Line line[MAXN];
int ans[MAXN];

inline void solve() {
    using namespace IO;
    register int n, m, x1, y1, x2, y2;
    register bool first = true;
    while (read(n) && n) {
        first ? (void)(first = false) : print('\n');
        read(m), read(x1), read(y1), read(x2), read(y2);
        register int ui, li;
        for (register int i = 0; i < n; i++) {
            read(ui), read(li);
            line[i] = Line(Point(ui, y1), Point(li, y2));
        }
        line[n] = Line(Point(x2, y1), Point(x2, y2));
        Point p;
        memset(ans, 0, sizeof(int) * (n + 1));
        while (m--) {
            p.read();
            register int l = -1, r = n;
            while (r - l > 1) {
                register int mid = l + r >> 1;
                if ((line[mid].s - p) * (line[mid].t - p) < 0) r = mid;
                else l = mid;
            }
            ans[r]++;
        }
        for (register int i = 0; i <= n; i++) 
            print(i), print(": "), print(ans[i]), print('\n');
    }
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    Task::solve();
    IO::flush();
    return 0;
}
```
### 「POJ 3304」Segments
#### 链接
[POJ3304](http://poj.org/problem?id=3304)
#### 题解
暴力枚举，然后判断线段与直线是否相交即可。
##### 判断线段与直线是否相交
![判断线段与直线是否相交](/images/计算几何1.svg)
设直线为 $AB$，线段为 $CD$，若 $(\vec{AB} \times \vec{AC}) \times (\vec{AB} \times \vec{AD}) \leq 0$，则 $AB$ 与 $CD$ 相交。
#### 代码
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
#include <algorithm>
#include <cstdio>
#include <cstdlib>
#include <cmath>
#include <iostream>
#include <iomanip>
#include <cstring>
/**
 * 「POJ 3304」Segments 19-05-2017
 * 计算几何
 * @author xehoth
 */
namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template<class T>
inline bool read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return false;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
    return true;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template<class T>
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

inline void print(const char *s) {
    for (; *s; s++) print(*s);
}

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}
}

namespace Task {

const int MAXN = 105;

struct Point {
    double x, y;

    Point(double x = 0, double y = 0) : x(x), y(y) {}

    inline Point operator+(const Point &p) const {
        return Point(x + p.x, y + p.y);
    }

    inline Point operator-(const Point &p) const {
        return Point(x - p.x, y - p.y);
    }

    inline double operator*(const Point &p) const {
        return x * p.y - y * p.x;
    }

    inline double operator^(const Point &p) const {
        return x * p.x + y * p.y;
    }

    inline Point operator*(const double t) const {
        return Point(x * t, y * t);
    }

    inline void read() {
        std::cin >> x >> y;
    }
} p[MAXN << 1];

struct Line {
    Point s, t;

    Line() {}

    Line(const Point &s, const Point &t) : s(s), t(t) {}
} l[MAXN];

inline double mul(const Point &a, const Point &b, const Point &c) {
    return (b - a) * (c - a);
}

inline bool check(const Point &a, const Point &b, const Line &l) {
    return mul(l.s, a, b) * mul(l.t, a, b) < 1e-9;
}

inline int solve(int n) {
    register int k;
    for (register int i = 1; i <= 2 * n; i++) {
        for (register int j = i + 1; j <= 2 * n; j++) {
            if (!(fabs(p[i].x - p[j].x) < 1e-8 && fabs(p[i].y - p[j].y) < 1e-8)) {
                for (k = 1; k <= n; k++) {
                    if (check(p[i], p[j], l[k]) == 0)
                        break;
                }
            }
            if (k > n) return 1;
        }
    }
    return 0;
}

inline void solve() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(NULL);
    register int t, n;
    std::cin >> t;
    while (t--) {
        std::cin >> n;
        for (register int i = 1; i <= n; i++) {
            p[2 * i - 1].read(), p[2 * i].read();
            l[i] = Line(p[2 * i - 1], p[2 * i]);
        }
        puts(solve(n) ? "Yes!" : "No!");
    }
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    Task::solve();
    IO::flush();
    return 0;
}
```
### 「POJ 1066」Treasure Hunt
#### 链接
[POJ1066](http://poj.org/problem?id=1066)
#### 题解
就是判断线段与线段是否相交的问题。
##### 判断线段与线段相交
首先是快速跨立实验，
$$max(A.x, B.x) \geq min(C.x, D.x)$$ $$max(A.y, B.y) \geq min(C.y, D.y)$$ $$max(C.y, D.y) \geq min(A.y, B.y)$$ 
$$max(C.y, D.y) \geq min(A.y, B.y)$$，
然后再判断
$$(\vec{AB} \times \vec{AC}) \times (\vec{AB} \times \vec{AD}) \leq 0 \&\& (\vec{CD} \times \vec{CB}) \times (\vec{CD} \times \vec{CA}) \leq 0$$
#### 代码
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
#include <algorithm>
#include <cstdio>
#include <cstdlib>
#include <cmath>
#include <iostream>
#include <iomanip>
#include <cstring>
/**
 * 「POJ 1066」Treasure Hunt 19-05-2017
 * 计算几何
 * @author xehoth
 */
namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template<class T>
inline bool read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return false;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
    return true;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template<class T>
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

inline void print(const char *s) {
    for (; *s; s++) print(*s);
}

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}
}

namespace Task {

const int MAXN = 105;

struct Point {
    double x, y;

    Point(double x = 0, double y = 0) : x(x), y(y) {}

    inline Point operator+(const Point &p) const {
        return Point(x + p.x, y + p.y);
    }

    inline Point operator-(const Point &p) const {
        return Point(x - p.x, y - p.y);
    }

    inline double operator*(const Point &p) const {
        return x * p.y - y * p.x;
    }

    inline double operator^(const Point &p) const {
        return x * p.x + y * p.y;
    }

    inline Point operator*(const double t) const {
        return Point(x * t, y * t);
    }

    inline void read() {
        std::cin >> x >> y;
    }
} p[MAXN], des;

struct Line {
    Point s, t;

    Line() {}

    Line(const Point &s, const Point &t) : s(s), t(t) {}

    inline bool isIntersect(const Line &l) const {
        return std::max(s.x, t.x) >= std::min(l.s.x, l.t.x) &&
               std::max(s.y, t.y) >= std::min(l.s.y, l.t.y) &&
               std::max(l.s.x, l.t.x) >= std::min(s.x, t.x) &&
               std::max(l.s.y, l.t.y) >= std::min(s.y, t.y) &&
               ((l.t - l.s) * (s - l.s)) * ((l.t - l.s) * (t - l.s)) < -1e-9 &&
               ((t - s) * (l.s - s)) * ((t - s) * (l.t - s)) < -1e-9;
    }
} l[MAXN], tmp;

inline void solve() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(NULL);
    register int n, tot;
    while (std::cin >> n) {
        tot = 0;
        for (register int i = 0; i < n; i++) {
            p[tot++].read(), p[tot++].read();
            l[i].s = p[tot - 2], l[i].t = p[tot - 1];
        }
        p[tot].x = 0, p[tot++].y = 0;
        p[tot].x = 0, p[tot++].y = 100;
        p[tot].x = 100, p[tot++].y = 0;
        p[tot].x = 100, p[tot++].y = 100;
        des.read();
        register int ans = 1000, cnt;
        for (register int i = 0; i < tot; i++) {
            tmp.s = des, tmp.t = p[i], cnt = 0;
            for (register int i = 0; i < tot; i++)
                if (tmp.isIntersect(l[i])) cnt++;
            ans = std::min(ans, cnt);
        }
        std::cout << "Number of doors = " << ans + 1 << '\n';
    }

}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    Task::solve();
    IO::flush();
    return 0;
}
```
### 「POJ 1039」Pipe
#### 链接
[POJ1039](http://poj.org/problem?id=1039)
#### 题解
题意就是从前面一段过来的光线，问最远可以射到哪，只能直射。

最远的那条光线肯定过一个上端点和一个下端点，所以我们枚举两个点，然后判断求交点。

**注意精度**
#### 代码
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
#include <algorithm>
#include <cstdio>
#include <cstdlib>
#include <cmath>
#include <iostream>
#include <iomanip>
#include <cstring>
/**
 * 「POJ 1039」Pipe 19-05-2017
 * 计算几何
 * @author xehoth
 */
namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template<class T>
inline bool read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return false;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
    return true;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template<class T>
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

inline void print(const char *s) {
    for (; *s; s++) print(*s);
}

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}
}

namespace Task {

const int MAXN = 105;

struct Point {
    double x, y;

    Point(double x = 0, double y = 0) : x(x), y(y) {}

    inline Point operator+(const Point &p) const {
        return Point(x + p.x, y + p.y);
    }

    inline Point operator-(const Point &p) const {
        return Point(x - p.x, y - p.y);
    }

    inline double operator*(const Point &p) const {
        return x * p.y - y * p.x;
    }

    inline double operator^(const Point &p) const {
        return x * p.x + y * p.y;
    }

    inline Point operator*(const double t) const {
        return Point(x * t, y * t);
    }

    inline void read() {
        std::cin >> x >> y;
    }
} up[MAXN], down[MAXN];

template<typename T>
inline int sign(const T &x) {
    return x > 1e-8 ? 1 : (x < -1e-8 ? -1 : 0);
}

struct Line {
    Point s, t;

    Line() {}

    Line(const Point &s, const Point &t) : s(s), t(t) {}

    inline friend bool isIntersectLineSegment(const Line &l, const Line &seg) {
        return sign((l.t - l.s) * (seg.s - l.s)) * sign((l.t - l.s) * (seg.t - l.s)) <= 0;
    }

    inline Point intersect(const Line &l) const {
        return sign((t - s) * (l.t - l.s)) == 0 ? s :
               (s + (t - s) * (((l.t - s) * (l.s - s)) / ((l.t - l.s) * (t - s))));
    }
};

inline void solve() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(NULL);
    register int n;
    while (std::cin >> n && n) {
        for (register int i = 0; i < n; i++)
            up[i].read(), down[i] = up[i], down[i].y--;
        register bool flag = false;
        register double ans = -10000000.0;
        for (register int i = 0, k; i < n; i++) {
            for (register int j = i + 1; j < n; j++) {
                for (k = 0; k < n; k++)
                    if (!isIntersectLineSegment(Line(up[i], down[j]),
                                                Line(up[k], down[k]))) break;
                if (k >= n) {
                    flag = true;
                    break;
                }
                if (k > std::max(i, j)) {
                    if (isIntersectLineSegment(Line(up[i], down[j]),
                                               Line(up[k - 1], up[k]))) {
                        ans = std::max(ans, Line(up[i], down[j])
                                       .intersect(Line(up[k - 1], up[k])).x);
                    }
                    if (isIntersectLineSegment(Line(up[i], down[j]),
                                               Line(down[k - 1], down[k]))) {
                        ans = std::max(ans, Line(up[i], down[j])
                                       .intersect(Line(down[k - 1], down[k])).x);
                    }
                }

                for (k = 0; k < n; k++)
                    if (!isIntersectLineSegment(Line(down[i], up[j]),
                                                Line(up[k], down[k]))) break;
                if (k >= n) {
                    flag = true;
                    break;
                }
                if (k > std::max(i, j)) {
                    if (isIntersectLineSegment(Line(down[i], up[j]),
                                               Line(up[k - 1], up[k]))) {
                        ans = std::max(ans, Line(down[i], up[j])
                                       .intersect(Line(up[k - 1], up[k])).x);
                    }
                    if (isIntersectLineSegment(Line(down[i], up[j]),
                                               Line(down[k - 1], down[k]))) {
                        ans = std::max(ans, Line(down[i], up[j])
                                       .intersect(Line(down[k - 1], down[k])).x);
                    }
                }
            }
            if (flag) break;
        }
        if (flag) std::cout << "Through all the pipe.\n";
        else std::cout << std::fixed << std::setprecision(2) << ans << '\n';
    }
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    Task::solve();
    IO::flush();
    return 0;
}
```
### 「POJ 3348」Cows
#### 链接
[POJ3348](http://poj.org/problem?id=3348)
#### 题解
答案就是凸包的面积除以 $50$，直接用 andrew 算法就可以了。
#### 代码
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
#include <algorithm>
#include <cstdio>
#include <cstdlib>
#include <cmath>
#include <iostream>
#include <iomanip>
#include <cstring>
/**
 * 「POJ 3348」Cows 19-05-2017
 * 计算几何
 * @author xehoth
 */
namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template<class T>
inline bool read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return false;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
    return true;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template<class T>
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

inline void print(const char *s) {
    for (; *s; s++) print(*s);
}

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}
}

namespace Task {

const int MAXN = 10005;

struct Point {
    double x, y;

    Point(double x = 0, double y = 0) : x(x), y(y) {}

    inline Point operator+(const Point &p) const {
        return Point(x + p.x, y + p.y);
    }

    inline Point operator-(const Point &p) const {
        return Point(x - p.x, y - p.y);
    }

    inline double operator*(const Point &p) const {
        return x * p.y - y * p.x;
    }

    inline double operator^(const Point &p) const {
        return x * p.x + y * p.y;
    }

    inline Point operator*(const double t) const {
        return Point(x * t, y * t);
    }

    inline bool operator<(const Point &p) const {
        return x < p.x || (fabs(x - p.x) < 1e-8 && y < p.y);
    }

    inline void read() {
        std::cin >> x >> y;
    }
} p[MAXN], con[MAXN];

inline int andrew(Point *p, const int n, Point *con) {
    std::sort(p, p + n);
    register int top = 0, k;
    for (register int i = 0; i < n; i++) {
        while (top > 1 && (con[top - 1] - con[top - 2]) * (p[i] - con[top - 2]) <= 0) top--;
        con[top++] = p[i];
    }
    k = top;
    for (register int i = n - 2; i >= 0; i--) {
        while (top > k && (con[top - 1] - con[top - 2]) * (p[i] - con[top - 2]) <= 0) top--;
        con[top++] = p[i];
    }
    return n > 1 ? --top : top; 
}

inline double area(Point *p, const int n) {
    register double ret = 0;
    p[n] = p[0];
    for (register int i = 0; i < n; i++) ret += p[i] * p[i + 1];
    return fabs(ret) / 2;
}

inline void solve() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(NULL);
    register int n;
    std::cin >> n;
    for (register int i = 0; i < n; i++) p[i].read();
    std::cout << (int)(area(con, andrew(p, n, con)) / 50);
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
### 「POJ 2187」Beauty Contest
#### 链接
[POJ2187](http://poj.org/problem?id=2187)
#### 题解
就是裸的旋转卡壳。
#### 代码
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
#include <algorithm>
#include <cstdio>
#include <cstdlib>
#include <cmath>
#include <iostream>
#include <iomanip>
#include <cstring>
/**
 * 「POJ 2187」Beauty Contest 19-05-2017
 * 计算几何
 * @author xehoth
 */
namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template<class T>
inline bool read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return false;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
    return true;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template<class T>
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

inline void print(const char *s) {
    for (; *s; s++) print(*s);
}

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}
}

namespace Task {

const int MAXN = 10005;

template<typename T>
inline T square(const T &x) {
    return x * x;
}

struct Point {
    int x, y;

    Point(int x = 0, int y = 0) : x(x), y(y) {}

    inline Point operator+(const Point &p) const {
        return Point(x + p.x, y + p.y);
    }

    inline Point operator-(const Point &p) const {
        return Point(x - p.x, y - p.y);
    }

    inline int operator*(const Point &p) const {
        return x * p.y - y * p.x;
    }

    inline int operator^(const Point &p) const {
        return x * p.x + y * p.y;
    }

    inline Point operator*(const int t) const {
        return Point(x * t, y * t);
    }

    inline bool operator<(const Point &p) const {
        return x < p.x || (x == p.x && y < p.y);
    }

    inline int dis(const Point &p) const {
        return square(x - p.x) + square(y - p.y);
    }

    inline void read() {
        IO::read(x), IO::read(y);
    }
} p[MAXN], con[MAXN];

inline int andrew(Point *p, const int n, Point *con) {
    std::sort(p, p + n);
    register int top = 0, k;
    for (register int i = 0; i < n; i++) {
        while (top > 1 && (con[top - 1] - con[top - 2]) * (p[i] - con[top - 2]) <= 0) top--;
        con[top++] = p[i];
    }
    k = top;
    for (register int i = n - 2; i >= 0; i--) {
        while (top > k && (con[top - 1] - con[top - 2]) * (p[i] - con[top - 2]) <= 0) top--;
        con[top++] = p[i];
    }
    return n > 1 ? --top : top; 
}

inline int rotatingCalispers(Point *p, const int n) {
    register int ans = 0;
    p[n] = p[0];
    for (register int i = 0, top = 1; i < n; i++) {
        while ((p[i + 1] - p[i]) * (p[top] - p[i]) < 
               (p[i + 1] - p[i]) * (p[top + 1] - p[i]))
            ++top == n ? top = 0 : 0;
        ans = std::max(ans, std::max(p[i].dis(p[top]), p[i + 1].dis(p[top + 1])));
    }
    return ans;
}

inline void solve() {
    using namespace IO;
    register int n;
    read(n);
    for (register int i = 0; i < n; i++) p[i].read();
    print(rotatingCalispers(con, andrew(p, n, con)));
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    Task::solve();
    IO::flush();
    return 0;
}
```
### 「POJ3335」Rotating Scoreboard
#### 链接
[POJ3335](http://poj.org/problem?id=3335)
#### 题解
求多边形的核是否为空，直接半平面交就好了。
#### 代码
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
#include <algorithm>
#include <vector>
#include <deque>
#include <cstring>
#include <iostream>
#include <cmath>
/**
 * 「POJ3335」Rotating Scoreboard 22-05-2017
 * 半平面交
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
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void print(const char *s) {
    for (; *s; s++) print(*s);
}

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}
}

namespace HalfPlaneIntersection {

const int MAXN = 110;

const double EPS = 1e-8;

struct Point {
    double x, y;

    Point(double x = 0, double y = 0) : x(x), y(y) {}

    inline Point operator+(const Point &p) const {
        return Point(x + p.x, y + p.y);
    }

    inline Point operator-(const Point &p) const {
        return Point(x - p.x, y- p.y);
    }

    inline double operator*(const Point &p) const {
        return x * p.y - y * p.x;
    }

    inline Point operator*(const double i) const {
        return Point(x * i, y * i);
    }

    inline double operator^(const Point &p) const {
        return x * p.x + y * p.y;
    }
    
    inline void read() {
        static int t;
        IO::read(t), x = t, IO::read(t), y = t;
    }
} p[MAXN];

struct Line {
    Point s, t;
    double arg;
    Line(const Point &s, const Point &b) : s(s), t(b - s), arg(atan2(t.y, t.x)) {}

    Line() {}

    inline friend bool onLeft(const Point &p, const Line &l) {
        return l.t * (p - l.s) > -EPS;
    }

    inline bool operator<(const Line &l) const {
        return std::abs(arg - l.arg) < EPS ? onLeft(s, l) : arg < l.arg;
    }

    inline Point intersect(const Line &l) const {
        return s + t * (((s - l.s) * l.t) / (l.t * t));
    }
} l[MAXN];

typedef std::pair<Line, Point> Pair;
typedef std::deque<Pair> Deque; 

inline Deque &halfPlaneIntersection(Line *l, const int n) {
    static Deque q;
    q.clear(), std::sort(l, l + n);
    q.push_back(Pair(l[0], Point()));
    for (register int i = 1; i < n; i++) {
        if (std::abs(l[i].arg - l[i - 1].arg) < EPS) continue;
        while (q.size() > 1 && !onLeft(q.back().second, l[i])) q.pop_back();
        while (q.size() > 1 && !onLeft(q[1].second, l[i])) q.pop_front();
        q.push_back(Pair(l[i], l[i].intersect(q.back().first)));
    }
    while (q.size() > 1 && !onLeft(q.back().second, q.front().first)) q.pop_back();
    q.front().second = q.front().first.intersect(q.back().first);
    return q;
}

inline void solve() {
    using namespace IO;
    register int T, n;
    read(T);
    while (T--) {
        read(n);
        for (register int i = n; i; i--) p[i].read();
        for (register int i = 1; i < n; i++) l[i - 1] = Line(p[i], p[i + 1]);
        l[n - 1] = Line(p[n], p[1]);
        const Deque &q = halfPlaneIntersection(l, n);
        q.size() <= 2 ? print("NO\n") : print("YES\n"); 
    }
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    HalfPlaneIntersection::solve();
    IO::flush();
    return 0;
}
```
### 「POJ3130」How I Mathematician Wonder What You Are!
#### 链接
[POJ3130](http://poj.org/problem?id=3130)
#### 题解
同上，求多边形的核，半平面交即可 (这数据范围已无力吐槽，$n^2$ 都随便过啊....)

话说 [PKUSC](http://bailian.openjudge.cn/ty2017c/G/) 怎么就考了这个题啊......
#### 代码
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
#include <algorithm>
#include <vector>
#include <deque>
#include <cstring>
#include <iostream>
#include <cmath>
/**
 * 「POJ3130」How I Mathematician Wonder What You Are! 22-05-2017
 * 半平面交
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
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void print(const char *s) {
    for (; *s; s++) print(*s);
}

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}
}

namespace HalfPlaneIntersection {

const int MAXN = 110;

const double EPS = 1e-8;

struct Point {
    double x, y;

    Point(double x = 0, double y = 0) : x(x), y(y) {}

    inline Point operator+(const Point &p) const {
        return Point(x + p.x, y + p.y);
    }

    inline Point operator-(const Point &p) const {
        return Point(x - p.x, y- p.y);
    }

    inline double operator*(const Point &p) const {
        return x * p.y - y * p.x;
    }

    inline Point operator*(const double i) const {
        return Point(x * i, y * i);
    }

    inline double operator^(const Point &p) const {
        return x * p.x + y * p.y;
    }
    
    inline void read() {
        static int t;
        IO::read(t), x = t, IO::read(t), y = t;
    }
} p[MAXN];

struct Line {
    Point s, t;
    double arg;
    Line(const Point &s, const Point &b) : s(s), t(b - s), arg(atan2(t.y, t.x)) {}

    Line() {}

    inline friend bool onLeft(const Point &p, const Line &l) {
        return l.t * (p - l.s) > -EPS;
    }

    inline bool operator<(const Line &l) const {
        return std::abs(arg - l.arg) < EPS ? onLeft(s, l) : arg < l.arg;
    }

    inline Point intersect(const Line &l) const {
        return s + t * (((s - l.s) * l.t) / (l.t * t));
    }
} l[MAXN];

typedef std::pair<Line, Point> Pair;
typedef std::deque<Pair> Deque; 

inline Deque &halfPlaneIntersection(Line *l, const int n) {
    static Deque q;
    q.clear(), std::sort(l, l + n);
    q.push_back(Pair(l[0], Point()));
    for (register int i = 1; i < n; i++) {
        if (std::abs(l[i].arg - l[i - 1].arg) < EPS) continue;
        while (q.size() > 1 && !onLeft(q.back().second, l[i])) q.pop_back();
        while (q.size() > 1 && !onLeft(q[1].second, l[i])) q.pop_front();
        q.push_back(Pair(l[i], l[i].intersect(q.back().first)));
    }
    while (q.size() > 1 && !onLeft(q.back().second, q.front().first)) q.pop_back();
    q.front().second = q.front().first.intersect(q.back().first);
    return q;
}

inline void solve() {
    using namespace IO;
    register int n;
    while (read(n), n) {
        for (register int i = 1; i <= n; i++) p[i].read();
        for (register int i = 1; i < n; i++) l[i - 1] = Line(p[i], p[i + 1]);
        l[n - 1] = Line(p[n], p[1]);
        const Deque &q = halfPlaneIntersection(l, n);
        q.size() <= 2 ? print("0\n") : print("1\n"); 
    }
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    HalfPlaneIntersection::solve();
    IO::flush();
    return 0;
}
```
### 「HNOI2007」最小矩形覆盖
#### 链接
[BZOJ1185](http://www.lydsy.com/JudgeOnline/problem.php?id=1185)
#### 题解
首先有这样一个结论:
> 最小矩形中有一条边在凸包的边上。

否则可以旋转一个角度让面积变小。

我们逆时针枚举一条边，用旋转卡壳维护此时最左，最右，最上的点。

对于最上的点利用叉积计算面积来维护，对于左右点，其点积是在其对应边的投影与此边的乘积，所以我们可以通过点积来维护。

**注意：**第一次找卡壳，需要特判最左点。

~~此题 SPJ 似乎又被 Hack 掉了~~
#### 代码
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
 * 「HNOI2007」最小矩形覆盖 22-05-2017
 * 旋转卡壳
 * @author xehoth
 */
namespace IO {

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
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
    static char buf[20];
    read(buf), x = atof(buf);
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
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void print(const char *s) {
    for (; *s; s++) print(*s);
}

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}
}

namespace Task {

const int MAXN = 51000;
const double EPS = 1e-10;

template<typename T>
inline T square(const T &x) {
    return x * x;
}

struct Point {
    double x, y;

    Point(double x = 0, double y = 0) : x(x), y(y) {}

    inline Point operator+(const Point &p) const {
        return Point(x + p.x, y + p.y);
    }

    inline Point operator-(const Point &p) const {
        return Point(x - p.x, y - p.y);
    }

    inline double operator*(const Point &p) const {
        return x * p.y - y * p.x;
    }

    inline double operator^(const Point &p) const {
        return x * p.x + y * p.y;
    }

    inline Point operator*(const double i) const {
        return Point(x * i, y * i);
    }

    inline bool operator<(const Point &p) const {
        return x < p.x || (std::abs(x - p.x) < EPS && y < p.y);
    }

    inline double dis(const Point &p) const {
        return hypot(x - p.x, y - p.y);
    }

    inline void read() {
        IO::read(x), IO::read(y);
    }
} ans[10], p[MAXN], con[MAXN];

inline int andrew(Point *p, const int n, Point *con) {
    std::sort(p, p + n);
    register int top = 0, k;
    for (register int i = 0; i < n; i++) {
        while (top > 1 && (con[top - 1] - con[top - 2]) * (p[i] - con[top - 2]) < EPS) top--;
        con[top++] = p[i];
    }
    k = top;
    for (register int i = n - 2; i >= 0; i--) {
        while (top > k && (con[top - 1] - con[top - 2]) * (p[i] - con[top  - 2]) < EPS) top--;
        con[top++] = p[i];
    }
    return n > 1 ? --top : top;
}

inline double rotatingCalispers(Point *p, const int n) {
    register double dis, height, width, min = DBL_MAX, now;
    for (register int i = 0, up = 1, l = 1, r = 1; i < n; i++) {
        while ((p[i + 1] - p[i]) * (p[up] - p[i]) <
                (p[i + 1] - p[i]) * (p[up + 1] - p[i]) + EPS)
            ++up == n ? up = 0 : 0;
        while (((p[i + 1] - p[i]) ^ (p[r] - p[i])) <
                ((p[i + 1] - p[i]) ^ (p[r + 1] - p[i])) + EPS)
            ++r == n ? r = 0 : 0;
        if (i == 0) l = r;
        while (((p[i + 1] - p[i]) ^ (p[l] - p[i])) >
                ((p[i + 1] - p[i]) ^ (p[l + 1] - p[i])) - EPS)
            ++l == n ? l = 0 : 0;
        dis = p[i].dis(p[i + 1]);
        height = (p[up] - p[i + 1]) * (p[i] - p[i + 1]) / dis;
        width = std::abs(((p[i + 1] - p[i]) ^ (p[l] - p[i])) / dis) +
                std::abs(((p[i + 1] - p[i]) ^ (p[r] - p[i])) / dis);
        now = width * height;
        if (now < min) {
            min = now;
            ans[0] = p[i] + (p[i + 1] - p[i]) *
                     ((std::abs((p[i + 1] - p[i]) ^ (p[r] - p[i + 1])) /
                       dis + dis) / dis);
            ans[1] = ans[0] + (p[r] - ans[0]) * (height / p[r].dis(ans[0]));
            ans[2] = ans[1] + (p[up] - ans[1]) * (width / p[up].dis(ans[1]));
            ans[3] = ans[2] + (p[l] - ans[2]) * (height / p[l].dis(ans[2]));
        }
    }
    return min;
}

inline bool cmp(const Point &a, const Point &b) {
    return a.y < b.y || (std::abs(a.y - b.y) < EPS && a.x < b.x);
}

inline void solve() {
    using namespace IO;
    register int n;
    read(n);
    for (register int i = 0; i < n; i++) p[i].read();
    printf("%.5lf\n", rotatingCalispers(con, andrew(p, n, con)));
    register int tmp = std::min_element(ans, ans + 4, cmp) - ans;
    for (register int i = 0; i < 4; i++)
        printf("%.5lf %.5lf\n", 
            std::abs(ans[i + tmp & 3].x) < EPS ? 0 : ans[i + tmp & 3].x, 
            std::abs(ans[i + tmp & 3].y) < EPS ? 0 : ans[i + tmp & 3].y);
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

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=40915589&auto=1&height=66"></iframe>