---
title: 「HDU 4773」Problem of Apollonius-圆的反演
date: 2017-09-19 15:34:53
tags:
  - 计算几何
  - 圆的反演
categories:
  - OI
  - 计算几何
  - 圆的反演
---
给定相离的两个圆（圆心坐标以及半径）以及圆外的一个定点 $P$，求出过点 $P$ 的且与已知的两个圆外切的所有圆。

<!-- more -->

### 链接
[HDU 4773](http://acm.hdu.edu.cn/showproblem.php?pid=4773)

### 题解
设已知两个圆的半径分别为 $r_1, r_2$，圆心分别为 $(x_1, y_1), (x_2, y_2)$，$P$ 点坐标为 $(x_0, y_0)$。

#### 反演的定义
已知一圆 $C$，圆心为 $O$，半径为 $r$，如果 $P$ 与 $P’$ 在过圆心 $O$ 的直线上，且 $OP \cdot OP' = r ^ 2$，则称 $P$ 与 $P'$ 关于 $O$ 互为反演。

#### 一些性质
- 除反演中心外，平面上的每一个点都只有唯一的反演点，且这种关系是对称的，位于反演圆上的点，保持在原处，位于
反演圆外部的点，变为圆内部的点，位于反演圆内部的点，变为圆外部的点。
- 任意一条不过反演中心的直线，它的反形是经过反演中心的圆，反之亦然，特别地，过反演中心相交的圆，变为不过反
演中心的相交直线。
- 不过反演中心的圆，它的反形是一个圆，反演中心是这两个互为反形的圆的一个位似中心，任意一对反演点是逆对应
点。
- 反演不改变相切性。
- 相切两圆的反象仍相切，若切点恰是反演中心，则其反象为两平行线。

先考虑求一个不过反演中心的圆的反形圆，如图
![圆的反演](/images/HDU4773-inversive.png)
蓝色的圆为反演圆，$O$ 为反演圆圆心，令 $r$ 为其半径，圆 $d, d'$ 的半径分别为 $r_1, r_2$，设其圆心分别为 $C_1, C_2$，根据定义有
{% raw %}$$OA \cdot OA' = (OC_1 + r_1)(OC_2 + r_2) = r ^ 2 \\ OB \cdot OB' = (OC_1 + r_1)(OC_2 + r_2) = r ^ 2$${% endraw %}
消去 $OC_2$ 可得
{% raw %}$$r_2 = \frac 1 2(\frac {1} {OC_1 - r_1} - \frac {1} {OC_1 + r_1})r ^ 2$${% endraw %}
于是我们得到了反演圆的半径，利用比例我们可以很容易得出圆心
{% raw %}$$x = x_0 + \frac {OC_2} {OC_1}(x_1 - x_0) \\ y = y_0 + \frac {OC_2} {OC_1}(y_1 - y_0)$${% endraw %}

然后对于此题，我们先以 $P$ 点为反演中心，随意定一个半径 $r$，把圆 $c_1, c_2$ 反演后求出其公切线，然后再把公切线反演回去，就是过 $P$ 点的圆且与 $c_1, c_2$ 相切，例如样例：
![HDU 4773](/images/HDU4773.png)
$A$ 为反演中心，黄色的圆为反演圆，$a', b'$ 为 $B, C$ 反演后的圆，蓝色的圆为公切线反演回去的圆。

### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「HDU 4773」Problem of Apollonius 19-09-2017
 * 圆的反演
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

inline void print(const char *s) {
    for (; *s; s++) print(*s);
}

inline void print(double x) {
    static char buf[40];
    sprintf(buf, "%.8f", x);
    print((const char *)buf);
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
const double EPS = 1e-8;
const double INVERSIVE_RADIUS = 10.0;
const double INVERSIVE_RADIUS2 = INVERSIVE_RADIUS * INVERSIVE_RADIUS;

struct Point {
    double x, y;

    Point(double x = 0, double y = 0) : x(x), y(y) {}

    inline void read() {
        static int t;
        io >> t, x = t, io >> t, y = t;
    }

    inline Point operator+(const Point &p) const {
        return Point(x + p.x, y + p.y);
    }

    inline double operator*(const Point &p) const { return y * p.x - x * p.y; }

    inline Point operator-(const Point &p) const {
        return Point(x - p.x, y - p.y);
    }

    inline Point operator*(const double d) const { return Point(x * d, y * d); }

    inline Point operator/(const double d) const { return Point(x / d, y / d); }

    inline double dis(const Point &p) const {
        return sqrt((x - p.x) * (x - p.x) + (y - p.y) * (y - p.y));
    }

    inline Point rotate(double a, double r) {
        return Point(x + r * cos(a), y + r * sin(a));
    }
};

struct Circle {
    double r;
    Point o;

    Circle(double x = 0, double y = 0, double r = 0) : o(x, y), r(r) {}

    inline void read() {
        static int t;
        o.read(), io >> t, r = t;
    }

    inline void print() { io << o.x << ' ' << o.y << ' ' << r << '\n'; }
};

inline int sign(double x) { return (x > EPS) - (x < -EPS); }

struct Task {
    int tot;
    Circle c[5];
    Point P;

    inline Circle inversive(const Circle &c1) {
        Circle res;
        register double oc1 = P.dis(c1.o);
        register double k1 = 1.0 / (oc1 - c1.r);
        register double k2 = 1.0 / (oc1 + c1.r);
        res.r = 0.5 * (k1 - k2) * INVERSIVE_RADIUS2;
        register double oc2 = 0.5 * (k1 + k2) * INVERSIVE_RADIUS2;
        res.o = P + (c1.o - P) * oc2 / oc1;
        return res;
    }

    inline void save(const Point &a, const Point &b) {  // save ans
        tot++;
        register double t =
            fabs(((P - a) * (b - a)) / a.dis(b));  // dis P to line ab
        c[tot].r = INVERSIVE_RADIUS2 / (2.0 * t);
        register double d = a.dis(c[1].o);
        c[tot].o = P + (a - c[1].o) * (c[tot].r / d);
        // vec(a, c[1].o) ⊥ common tangent
        // use similar triangle -> dis(P, c[tot].o)
    }

    inline void solveCase() {
        c[1] = inversive(c[1]), c[2] = inversive(c[2]);  // inversive
        if (c[1].r < c[2].r) std::swap(c[1], c[2]);

        Point tmp = c[2].o - c[1].o;
        register double a1 = atan2(tmp.y, tmp.x);
        register double a2 = acos((c[1].r - c[2].r) / c[1].o.dis(c[2].o));
        // rotate to common tangent
        Point P1 = c[1].o.rotate(a1 + a2, c[1].r);
        Point P2 = c[2].o.rotate(a1 + a2, c[2].r);
        if (sign((c[1].o - P1) * (P2 - P1)) == sign((P - P1) * (P2 - P1)))
            save(P1, P2);
        // another common tangent
        P1 = c[1].o.rotate(a1 - a2, c[1].r);
        P2 = c[2].o.rotate(a1 - a2, c[2].r);
        if (sign((c[1].o - P1) * (P2 - P1)) == sign((P - P1) * (P2 - P1)))
            save(P1, P2);
    }

    inline void solve() {
        register int T;
        io >> T;
        while (T--) {
            tot = 2, c[1].read(), c[2].read(), P.read();
            solveCase();
            io << tot - 2 << '\n';
            for (register int i = 3; i <= tot; i++) c[i].print();
        }
    }
} task;
}

int main() {
    // freopen("sample/1.in", "r", stdin);
    task.solve();
    return 0;
}
```

