---
title: 计算几何模板
date: 2017-01-05 20:29:28
tags:
  - 线段树
  - 计算几何
  - 学习笔记
categories:
  - OI
  - 学习笔记
---
不完全模板如下，~~长期更新中(已弃)~~:
<!-- more -->
``` cpp
/*
Created by xehoth on 17-1-5.
*/

#ifndef XEHOTH_HEADER
#define XEHOTH_HEADER
#define FAST_IO
#define XEHOTH_GEOMETRY
/*#define STD_IO
#define FUNCTIONS
define CONSTANT
define MEMORY_POOL
define RECYCLE
define DATA_STRUCTURE
define USING_BITS
define USING_TR1
deifne USING_EXT*/
#ifdef USING_BITS
#include <bits/stdc++.h>
#else
#ifndef _glibcxx_no_assert

#include <cassert>

#endif

#include <cctype>
#include <cerrno>
#include <cfloat>
#include <ciso646>
#include <climits>
#include <clocale>
#include <cmath>
#include <csetjmp>
#include <csignal>
#include <cstdarg>
#include <cstddef>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <ctime>

#if __cplusplus >= 201103l
#include <ccomplex>
#include <cfenv>
#include <cinttypes>
#include <cstdalign>
#include <cstdbool>
#include <cstdint>
#include <ctgmath>
#include <cwchar>
#include <cwctype>
#endif

#include <algorithm>
#include <bitset>
#include <complex>
#include <deque>
#include <exception>
#include <fstream>
#include <functional>
#include <iomanip>
#include <ios>
#include <iosfwd>
#include <iostream>
#include <istream>
#include <iterator>
#include <limits>
#include <list>
#include <locale>
#include <map>
#include <memory>
#include <new>
#include <numeric>
#include <ostream>
#include <queue>
#include <set>
#include <sstream>
#include <stack>
#include <stdexcept>
#include <streambuf>
#include <string>
#include <typeinfo>
#include <utility>
#include <valarray>
#include <vector>

#if __cplusplus >= 201103l
#include <array>
#include <atomic>
#include <chrono>
#include <condition_variable>
#include <forward_list>
#include <future>
#include <initializer_list>
#include <mutex>
#include <random>
#include <ratio>
#include <regex>
#include <scoped_allocator>
#include <system_error>
#include <thread>
#include <tuple>
#include <typeindex>
#include <type_traits>
#include <unordered_map>
#include <unordered_set>
#endif
#endif
#ifdef USING_TR1
#include <tr1/array>
#include <tr1/cctype>
#include <tr1/cfenv>
#include <tr1/cfloat>
#include <tr1/cinttypes>
#include <tr1/climits>
#include <tr1/cmath>
#include <tr1/complex>
#include <tr1/cstdarg>
#include <tr1/cstdbool>
#include <tr1/cstdint>
#include <tr1/cstdio>
#include <tr1/cstdlib>
#include <tr1/ctgmath>
#include <tr1/ctime>
#include <tr1/cwchar>
#include <tr1/cwctype>
#include <tr1/functional>
#include <tr1/random>
#include <tr1/tuple>
#include <tr1/unordered_map>
#include <tr1/unordered_set>
#include <tr1/utility>
#endif
#ifdef USING_EXT
#include <ext/algorithm>
#include <ext/array_allocator.h>
#include <ext/atomicity.h>
#include <ext/bitmap_allocator.h>
#include <ext/cast.h>
#include <ext/concurrence.h>
#include <ext/debug_allocator.h>
#include <ext/extptr_allocator.h>
#include <ext/functional>
#include <ext/iterator>
#include <ext/malloc_allocator.h>
#include <ext/memory>
#include <ext/mt_allocator.h>
#include <ext/new_allocator.h>
#include <ext/numeric>
#include <ext/pod_char_traits.h>
#include <ext/pointer.h>
#include <ext/pool_allocator.h>
#include <ext/rb_tree>
#include <ext/rope>
#include <ext/slist>
#include <ext/stdio_filebuf.h>
#include <ext/stdio_sync_filebuf.h>
#include <ext/throw_allocator.h>
#include <ext/typelist.h>
#include <ext/type_traits.h>
#include <ext/vstring.h>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/priority_queue.hpp>
#include <ext/pb_ds/exception.hpp>
#include <ext/pb_ds/hash_policy.hpp>
#include <ext/pb_ds/list_update_policy.hpp>
#include <ext/pb_ds/tree_policy.hpp>
#include <ext/pb_ds/trie_policy.hpp>
#endif
#ifdef CONSTANT
const double pi = acos(-1);
const double pi2 = 2 * acos(-1);
typedef long long ll;
typedef long long long;
typedef unsigned long long ull;
typedef unsigned long long ulong;
typedef unsigned int uint;
typedef long double ld;
typedef __float128 float128;
#endif
#ifdef FUNCTIONS
template<class t>
inline void clear(t *a) { memset(a, 0, sizeof(a)); }
template<class t>
inline void clear(t *a, const int n) { memset(a, 0, sizeof(t) * n); }
template<class t>
inline void copy(t *s, t *t) { memcpy(t, s, sizeof(s)); }
template<class t>
inline void copy(t *s, t *t, const int n) { memcpy(s, t, sizeof(t) * n); }
template<class t>
inline void addval(t &x, const t &v, const t &mod) {
    x += v;
    if (x >= mod) x -= mod;
    if (x < 0) x += mod;
}
inline int randomint() { return (bool(rand() & 1) << 30) | (rand() << 15) + rand(); }
inline int random(const int l, const int r) { return randomint() % (r - l + 1) + l; }
inline bool readbits(const uint x, const int pos) { return (x >> pos) & 1; }
inline uint readbits(uint x, const int pos, const int cnt) { return x >> pos & ((1u << cnt) - 1); }
inline int countbits(const uint x) { return __builtin_popcount(x); }
#endif
#ifdef STD_IO
inline void initio() {
    std::ios::sync_with_stdio(0);
    std::cin.tie(0);
    std::cout.tie(0);
}
#endif
#ifdef FAST_IO
const int in_len = 100000, out_len = 100000;

inline char nextChar() {
    static char buf[in_len], *h, *t;
    if (h == t) {
        t = (h = buf) + fread(buf, 1, in_len, stdin);
        if (h == t) return -1;
    }
    return *h++;
}

template<class t>
inline bool read(t &x) {
    static bool iosig = 0;
    static char c;
    for (iosig = 0, c = nextChar(); !isdigit(c); c = nextChar()) {
        if (c == -1) return false;
        if (c == '-') iosig = 1;
    }
    for (x = 0; isdigit(c); c = nextChar()) x = (x << 1) + (x << 3) + (c ^ '0');
    if (iosig) x = -x;
    return true;
}

template<class t1, class t2>
inline bool read(t1 &x1, t2 &x2) { return read(x1), read(x2); }

template<class t1, class t2, class t3>
inline bool read(t1 &x1, t2 &x2, t3 &x3) { return read(x1), read(x2), read(x3); }

template<class t1, class t2, class t3, class t4>
inline bool read(t1 &x1, t2 &x2, t3 &x3, t4 &x4) { return read(x1), read(x2), read(x3), read(x4); }

inline bool isLineSkippable(const char c) { return c == '\n' || c == '\r'; }

inline bool isWordSkippable(const char c) { return c == ' ' || c == '\n' || c == '\r'; }

inline void skip() { for (char c = nextChar(); isWordSkippable(c); c = nextChar()); }

inline void skipline() { for (char c = nextChar(); isLineSkippable(c); c = nextChar()); }

inline bool read(char *str) {
    char c;
    for (c = nextChar(); isWordSkippable(c); c = nextChar()) if (c == -1) return false;
    for (; !isWordSkippable(c); c = nextChar()) *str++ = c;
    return true;
}

inline void readLine(char *str) {
    static char c;
    while (isLineSkippable(c = nextChar()));
    while (!isLineSkippable(c)) *str++ = c = nextChar();
}

inline int nextInt() {
    static int i;
    read(i);
    return i;
}

inline long long nextLong() {
    static long long i;
    read(i);
    return i;
}

inline std::string nextString() {
    static char buf[in_len];
    read(buf);
    return std::string(buf);
}

char obuf[out_len], *oh = obuf;

inline void writeChar(const char c) {
    if (oh == obuf + out_len) fwrite(obuf, 1, out_len, stdout), oh = obuf;
    *oh++ = c;
}

template<class t>
inline void write(t x) {
    static int buf[30], cnt;
    if (!x) writeChar(48);
    else {
        if (x < 0) writeChar('-'), x = -x;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 + 48;
        while (cnt) writeChar(buf[cnt--]);
    }
}

template<class t>
inline void writeln(t x) { write(x), writeChar('\n'); }

template<class t1, class t2>
inline void write(t1 x1, t2 x2) { write(x1), write(x2); }

template<class t1, class t2, class t3>
inline void write(t1 x1, t2 x2, t3 x3) { write(x1), write(x2), write(x3); }

template<class t1, class t2, class t3, class t4>
inline void write(t1 x1, t2 x2, t3 x3, t4 x4) { write(x1), write(x2), write(x3), write(x4); }

inline void flush() { fwrite(obuf, 1, oh - obuf, stdout); }

#endif
#ifdef MEMORY_POOL
template<class t, size_t size>
struct MemoryPool {
    t buf[size], *tail, *end;
#ifdef RECYCLE
    int top;
    t *st[size];
    MemoryPool() : top(0), tail(buf), end(buf + size) {}
#else
    MemoryPool() : tail(buf), end(buf + size) {}
#endif
    inline t *alloc() {
#ifdef RECYCLE
        if (top) return st[--top];
#endif
        if (tail != end) return tail++;
        return new t;
    }
#ifdef RECYCLE
    inline void RECYCLE(t *x) {
        if (top > size) delete x;
        else st[top++] = x;
    }
#endif
};
#endif
#ifdef DATA_STRUCTURE
template<class t, size_t n>
struct BinaryIndexedTree {
    t tree[n + 10];
    static inline int lowbit(const int k) { return k & -k; }
    inline void update(int k, const t &v) { for (; k <= n; k += lowbit(k)) tree[k] += v; }
    inline int query(int k) {
        register t ret = 0;
        for (; k; k -= lowbit(k)) ret += tree[k];
        return ret;
    }
};
#endif
#ifdef XEHOTH_GEOMETRY
const double eps = 1e-8;
const double pi = std::acos(-1.0);
#define sign(x) ((x) > eps ? 1 : ((x) < -eps ? (-1) : (0)))

#endif
#ifndef TEMPLATE_GEOMETRY
#define TEMPLATE_GEOMETRY

/* 点 */
template<class T>
class Point {
public:
    T x, y;

    Point() {};

    Point(const T &x, const T &y) : x(x), y(y) {};

    inline static T xmult(const Point<T> &ps, const Point<T> &pe, const Point<T> &po) {
        return (ps.x - po.x) * (pe.y - po.y) - (pe.x - po.x) * (ps.y - po.y);
    }

    /* 相对原点的差乘结果，参数：点[_Off] */
    /* 即由原点和这两个点组成的平行四边形面积 */
    T operator*(const Point<T> &b) const {
        return x * b.y - y * b.x;
    }

    /* 相对偏移 */
    Point<T> operator-(const Point<T> &b) const {
        return Point<T>(x - b.x, y - b.y);
    }

    /* 点位置相同(double类型) */
    bool operator==(const Point<T> &b) const {
        return std::fabs(b.x - x) < eps && std::fabs(b.y - y) < eps;
    }

    /* 点位置不同(double类型) */
    bool operator!=(const Point<T> &b) const {
        return !((*this) == b);
    }

    /* 两点间距离的平方 */
    T dis2(const Point<T> &b) const {
        return (x - b.x) * (x - b.x) + (y - b.y) * (y - b.y);
    }

    /* 两点间距离 */
    T dis(const Point<T> &b) const {
        return std::sqrt((x - b.x) * (x - b.x) + (y - b.y) * (y - b.y));
    }

    inline friend std::istream &operator>>(std::istream &in, Point<T> &p) { return in >> p.x >> p.y, in; }
};

/* 两点表示的向量 */
template<class T>
class Line {
public:
    Point<T> s, e;/* 两点表示，起点[s]，终点[e] */
    T a, b, c;/* 一般式,ax+by+c=0 */

    Line() {}

    Line(const Point<T> &s, const Point<T> &e) : s(s), e(e) {}

    /* 向量与点的叉乘,参数：点[b] */
    /* [点相对向量位置判断] */
    T operator*(const Point<T> &b) const {
        return (b.y - s.y) * (e.x - s.x) - (b.x - s.x) * (e.y - s.y);
    }

    /* 向量与向量的叉乘,参数：向量[b] */
    T operator*(const Line<T> &b) const {
        return (e.x - s.x) * (b.e.y - b.s.y) - (e.y - s.y) * (b.e.x - b.s.x);
    }

    /* 从两点表示转换为一般表示 */
    bool convertToGeneral() {
        a = s.y - e.y;
        b = e.x - s.x;
        c = s.x * e.y - s.y * e.x;
        return true;
    }

    /* -----------点和直线（向量）----------- */
    /* 点在向量左边（右边的小于号改成大于号即可,在对应直线上则加上=号）*/
    /* 参数：点[b],向量[l] */
    friend bool operator<(const Point<T> &b, const Line<T> &l) {
        return (l.e.y - l.s.y) * (b.x - l.s.x) < (b.y - l.s.y) * (l.e.x - l.s.x);
    }

    friend std::istream &operator>>(std::istream &in, Line<T> &l) { return in >> l.s >> l.e, in; }

    /* 点在直线上,参数：点[b] */
    bool lineContains(const Point<T> &b) const {
        return std::fabs((*this) * b) < eps;
    }

    /* 点在线段上,参数：点[b] */
    bool segmentContains(const Point<T> &b) const {
        return lineContains(b) && b.x - std::min(s.x, e.x) > -eps && b.x - std::max(s.x, e.x) < eps
               && b.y - std::min(s.y, e.y) > -eps && b.y - std::max(s.y, e.y) < eps;
    }

    /* 点到直线/线段的距离 */
    /* 参数： 点[b], 是否是线段[isSegment](默认为直线) */
    T dis(const Point<T> &_Off, bool isSegment = false) {
        /* 化为一般式 */
        convertToGeneral();

        /* 到直线垂足的距离 */
        T td = (a * _Off.x + b * _Off.y + c) / sqrt(a * a + b * b);

        /* 如果是线段判断垂足 */
        if (isSegment) {
            T xp = (b * b * b.x - a * b * b.y - a * c) / (a * a + b * b);
            T yp = (-a * b * b.x + a * a * b.y - b * c) / (a * a + b * b);
            T xb = std::max(s.x, e.x);
            T yb = std::max(s.y, e.y);
            T xs = s.x + e.x - xb;
            T ys = s.y + e.y - yb;
            if (xp > xb + eps || xp < xs - eps || yp > yb + eps || yp < ys - eps)
                td = std::min(b.dis(s), b.dis(e));
        }

        return fabs(td);
    }

    /* 关于直线对称的点 */
    Point<T> mirror(const Point<T> &p) const {
        /* 注意先转为一般式 */
        convertToGeneral();
        Point<T> ret;
        T d = a * a + b * b;
        ret.x = (b * b * p.x - a * a * p.x - 2 * a * b * p.y - 2 * a * c) / d;
        ret.y = (a * a * p.y - b * b * p.y - 2 * a * b * p.x - 2 * b * c) / d;
        return ret;
    }

    /* 计算两点的中垂线 */
    static Line<T> perpendicular(const Point<T> &_a, const Point<T> &_b) {
        Line<T> ret;
        ret.s.x = (_a.x + _b.x) / 2;
        ret.s.y = (_a.y + _b.y) / 2;
        /* 一般式 */
        ret.a = _b.x - _a.x;
        ret.b = _b.y - _a.y;
        ret.c = (_a.y - _b.y) * ret.s.y + (_a.x - _b.x) * ret.s.x;
        /* 两点式 */
        if (std::fabs(ret.a) > eps) {
            ret.e.y = 0.0;
            ret.e.x = -ret.c / ret.a;
            if (ret.e == ret.s) {
                ret.e.y = 1e10;
                ret.e.x = -(ret.c - ret.b * ret.e.y) / ret.a;
            }
        } else {
            ret.e.x = 0.0;
            ret.e.y = -ret.c / ret.b;
            if (ret.e == ret.s) {
                ret.e.x = 1e10;
                ret.e.y = -(ret.c - ret.a * ret.e.x) / ret.b;
            }
        }
        return ret;
    }

    /* ------------直线和直线（向量）------------- */
    /* 直线重合,参数：直线向量[p] */
    bool collinear(const Line<T> &p) const {
        return lineContains(p.e) && lineContains(p.s);
    }

    /* 直线平行，参数：直线向量[p] */
    bool parallel(const Line<T> &p) const {
        return std::fabs((*this) * p) < eps;
    }

    /* 两直线交点，参数：目标直线[p] */
    Point<T> crossLineLine(Line<T> p) {
        /* 注意先判断平行和重合 */
        Point<T> ret = s;
        T t = ((s.x - p.s.x) * (p.s.y - p.e.y) - (s.y - p.s.y) * (p.s.x - p.e.x))
              / ((s.x - e.x) * (p.s.y - p.e.y) - (s.y - e.y) * (p.s.x - p.e.x));
        ret.x += (e.x - s.x) * t;
        ret.y += (e.y - s.y) * t;
        return ret;
    }

    /* ------------线段和直线（向量）---------- */
    /* 线段和直线交 */
    /* 参数：线段[p] */
    bool isCrossSegmentLine(const Line<T> &p) const {
        T rs = (*this) * p.s;
        T re = (*this) * p.e;
        return rs * re < eps;
    }

    /* ------------线段和线段（向量）---------- */
    /* 判断线段是否相交(注意添加eps)，参数：线段[p] */
    bool isCrossSegmentSegment(const Line<T> &p) const {
        /* 1.快速排斥试验判断以两条线段为对角线的两个矩形是否相交 */
        /* 2.跨立试验（等于0时端点重合） */
        return (
                (std::max(s.x, e.x) >= std::min(p.s.x, p.e.x)) &&
                (std::max(p.s.x, p.e.x) >= std::min(s.x, e.x)) &&
                (std::max(s.y, e.y) >= std::min(p.s.y, p.e.y)) &&
                (std::max(p.s.y, p.e.y) >= std::min(s.y, e.y)) &&
                ((Line<T>(p.s, s) * p) * (p * Line<T>(p.s, e)) >= 0.0) &&
                ((Line<T>(s, p.s) * (*this)) * ((*this) * Line<T>(s, p.e)) >= 0.0)
        );
    }
};

/*
template<class T>
class Polygon {
public:
    const static long maxpn = 2e4;
    Point<T> pt[maxpn];/* 点（顺时针或逆时针） */
    long n;/* 点的个数 */

    Point<T> &operator[](int _p) {
        return pt[_p];
    }

    /* 求多边形面积，多边形内点必须顺时针或逆时针 */
    T area() const {
        T ans = 0.0;
        int i;
        for (i = 0; i < n; i++) {
            int nt = (i + 1) % n;
            ans += pt[i].x * pt[nt].y - pt[nt].x * pt[i].y;
        }
        return std::fabs(ans / 2.0);
    }

    /* 求多边形重心，多边形内点必须顺时针或逆时针 */
    Point<T> gravity() const {
        Point<T> ans;
        ans.x = ans.y = 0.0;
        int i;
        T area = 0.0;
        for (i = 0; i < n; i++) {
            int nt = (i + 1) % n;
            T tp = pt[i].x * pt[nt].y - pt[nt].x * pt[i].y;
            area += tp;
            ans.x += tp * (pt[i].x + pt[nt].x);
            ans.y += tp * (pt[i].y + pt[nt].y);
        }
        ans.x /= 3 * area;
        ans.y /= 3 * area;
        return ans;
    }

    /* 判断点在凸多边形内，参数：点[p] */
    bool chas(const Point<T> &p) const {
        T tp = 0, np;
        int i;
        for (i = 0; i < n; i++) {
            np = Line<T>(pt[i], pt[(i + 1) % n]) * p;
            if (tp * np < -eps)
                return false;
            tp = (std::fabs(np) > eps) ? np : tp;
        }
        return true;
    }

    /* 判断点是否在任意多边形内[射线法]，O(n) */
    bool ahas(const Point<T> &p) const {
        int ret = 0;
        T infv = 1e-10;/* 坐标系最大范围 */
        Line<T> l = Line<T>(p, Point<T>(-infv, p.y));
        for (int i = 0; i < n; i++) {
            Line<T> ln = Line<T>(pt[i], pt[(i + 1) % n]);
            if (fabs(ln.s.y - ln.e.y) > eps) {
                Point<T> tp = (ln.s.y > ln.e.y) ? ln.s : ln.e;
                if (fabs(tp.y - p.y) < eps && tp.x < p.x + eps)
                    ret++;
            } else if (ln.isCrossSegmentSegment(l))
                ret++;
        }
        return (ret % 2 == 1);
    }

    /* 凸多边形被直线分割,参数：直线[p] */
    Polygon<T> split(Line<T> p) {
        /* 注意确保多边形能被分割 */
        Polygon<T> ret;
        Point<T> spt[2];
        T tp = 0.0, np;
        bool flag = true;
        int i, pn = 0, spn = 0;
        for (i = 0; i < n; i++) {
            if (flag)
                pt[pn++] = pt[i];
            else
                ret.pt[ret.n++] = pt[i];
            np = p * pt[(i + 1) % n];
            if (tp * np < -eps) {
                flag = !flag;
                spt[spn++] = p.crossLineLine(Line<T>(pt[i], pt[(i + 1) % n]));
            }
            tp = (std::fabs(np) > eps) ? np : tp;
        }
        ret.pt[ret.n++] = spt[0];
        ret.pt[ret.n++] = spt[1];
        n = pn;
        return ret;
    }

    /* -------------凸包------------- */
    /* Graham扫描法，复杂度O(nlg(n)),结果为逆时针 */
    
    static bool graham_cmp(const Point<T> &l, const Point<T> &r) {/*凸包排序函数*/

        return l.y < r.y || (l.y == r.y && l.x < r.x);
    }

    Polygon<T> &graham(Point<T> _p[], int _n) {
        int i, len;
        std::sort(_p, _p + _n, Polygon<T>::graham_cmp);
        n = 1;
        pt[0] = _p[0], pt[1] = _p[1];
        for (i = 2; i < _n; i++) {
            while (n && Point<T>::xmult(_p[i], pt[n], pt[n - 1]) >= 0)
                n--;
            pt[++n] = _p[i];
        }
        len = n;
        pt[++n] = _p[_n - 2];
        for (i = _n - 3; i >= 0; i--) {
            while (n != len && Point<T>::xmult(_p[i], pt[n], pt[n - 1]) >= 0)
                n--;
            pt[++n] = _p[i];
        }
        return (*this);
    }

    /* 凸包旋转卡壳(注意点必须顺时针或逆时针排列) */
    /* 返回值凸包直径的平方（最远两点距离的平方） */
    T rotating_calipers() {
        int i = 1;
        T ret = 0.0;
        pt[n] = pt[0];
        for (int j = 0; j < n; j++) {
            while (fabs(Point<T>::xmult(pt[j], pt[j + 1], pt[i + 1])) >
                   fabs(Point<T>::xmult(pt[j], pt[j + 1], pt[i])) + eps)
                i = (i + 1) % n;
            /* pt[i]和pt[j],pt[i + 1]和pt[j + 1]可能是对踵点 */
            ret = std::max(ret, std::max(pt[i].dis(pt[j]), pt[i + 1].dis(pt[j + 1])));
        }
        return ret;
    }

    /* 凸包旋转卡壳(注意点必须逆时针排列)
       返回值两凸包的最短距离 */
    T rotating_calipers(Polygon<T> &p) {
        int i = 0;
        T ret = 1e10;
        pt[n] = pt[0];
        p.pt[p.n] = p.pt[0];
        /* 注意凸包必须逆时针排列且pt[0]是左下角点的位置 */
        while (p.pt[i + 1].y > p.pt[i].y)
            i = (i + 1) % p.n;
        for (int j = 0; j < n; j++) {
            T tp;
            /* 逆时针时为 >,顺时针则相反 */
            while ((tp = Point<T>::xmult(pt[j], pt[j + 1], p.pt[i + 1]) -
                         Point<T>::xmult(pt[j], pt[j + 1], p.pt[i])) >
                   eps)
                i = (i + 1) % p.n;
            /* (pt[i],pt[i+1])和(p.pt[j],p.pt[j + 1])可能是最近线段 */
            ret = std::min(ret, Line<T>(pt[j], pt[j + 1]).dis(p.pt[i], true));
            ret = std::min(ret, Line<T>(p.pt[i], p.pt[i + 1]).dis(pt[j + 1], true));
            if (tp > -eps)/* 如果不考虑TLE问题最好不要加这个判断 */
            {
                ret = std::min(ret, Line<T>(pt[j], pt[j + 1]).dis(p.pt[i + 1], true));
                ret = std::min(ret, Line<T>(p.pt[i], p.pt[i + 1]).dis(pt[j], true));
            }
        }
        return ret;
    }

    /*-----------半平面交-------------*/
    /*复杂度:O(nlog2(n))*/
    /*半平面计算极角函数[如果考虑效率可以用成员变量记录]*/
    static T hpc_pa(const Line<T> &p) {
        return atan2(p.e.y - p.s.y, p.e.x - p.s.x);
    }

    /*半平面交排序函数[优先顺序: 1.极角 2.前面的直线在后面的左边]*/
    static bool hpc_cmp(const Line<T> &l, const Line<T> &r) {
        T lp = hpc_pa(l), rp = hpc_pa(r);
        if (fabs(lp - rp) > eps)
            return lp < rp;
        return Point<T>::xmult(l.s, r.e, r.s) < 0.0;
    }

    /*用于计算的双端队列*/
    Line<T> dequeue[maxpn];

    /*获取半平面交的多边形（多边形的核）*/
    /*参数：向量集合[l]，向量数量[ln];(半平面方向在向量左边）*/
    /*函数运行后如果n[即返回多边形的点数量]为0则不存在半平面交的多边形（不存在区域或区域面积无穷大）*/
    Polygon<T> &halfPanelCross(Line<T> p[], int ln) {
        int i, tn;
        n = 0;
        std::sort(p, p + ln, hpc_cmp);
        /*平面在向量左边的筛选*/
        for (i = tn = 1; i < ln; i++)
            if (fabs(hpc_pa(p[i]) - hpc_pa(p[i - 1])) > eps)
                p[tn++] = p[i];
        ln = tn;
        int bot = 0, top = 1;
        dequeue[0] = p[0];
        dequeue[1] = p[1];
        for (i = 2; i < ln; i++) {
            if (dequeue[top].parallel(dequeue[top - 1]) ||
                dequeue[bot].parallel(dequeue[bot + 1]))
                return (*this);
            while (bot < top &&
                   Point<T>::xmult(dequeue[top].crossLineLine(dequeue[top - 1]), p[i].e, p[i].s) > eps)
                top--;
            while (bot < top &&
                   Point<T>::xmult(dequeue[bot].crossLineLine(dequeue[bot + 1]), p[i].e, p[i].s) > eps)
                bot++;
            dequeue[++top] = p[i];
        }

        while (bot < top &&
               Point<T>::xmult(dequeue[top].crossLineLine(dequeue[top - 1]), dequeue[bot].e, dequeue[bot].s) > eps)
            top--;
        while (bot < top &&
               Point<T>::xmult(dequeue[bot].crossLineLine(dequeue[bot + 1]), dequeue[top].e, dequeue[top].s) > eps)
            bot++;
        /*计算交点(注意不同直线形成的交点可能重合)*/
        if (top <= bot + 1)
            return (*this);
        for (i = bot; i < top; i++)
            pt[n++] = dequeue[i].crossLineLine(dequeue[i + 1]);
        if (bot < top + 1)
            pt[n++] = dequeue[bot].crossLineLine(dequeue[top]);
        return (*this);
    }
};
*/
template<class T>
class Polygon {
public:
    const static long maxpn = 2e4;
    std::vector<Point<T> > pt;/*点（顺时针或逆时针）*/
    long n;/*点的个数*/
    Point<T> &operator[](int p) {
        return pt[p];
    }

    /*求多边形周长*/
    inline T perimeter() {
        T sum = 0;
        for (register int i = 0; i < n; i++) sum += (pt[(i + 1) % n] - pt[i]).norm();
        return sum;
    }

    /*求多边形面积，多边形内点必须顺时针或逆时针*/
    T area() const {
        T ans = 0.0;
        int i;
        for (i = 0; i < n; i++) {
            int nt = (i + 1) % n;
            ans += pt[i].x * pt[nt].y - pt[nt].x * pt[i].y;
        }
        return std::fabs(ans / 2.0);
    }

    /*求多边形重心，多边形内点必须顺时针或逆时针*/
    Point<T> gravity() const {
        Point<T> ans;
        ans.x = ans.y = 0.0;
        int i;
        T area = 0.0;
        for (i = 0; i < n; i++) {
            int nt = (i + 1) % n;
            T tp = pt[i].x * pt[nt].y - pt[nt].x * pt[i].y;
            area += tp;
            ans.x += tp * (pt[i].x + pt[nt].x);
            ans.y += tp * (pt[i].y + pt[nt].y);
        }
        ans.x /= 3 * area;
        ans.y /= 3 * area;
        return ans;
    }

    /*点是否在多边形内,0外,1内,2边界*/
    inline int contains(const Point<T> &t) {
        register int num = 0, d1, d2, k;
        for (register int i = 0; i < n; i++) {
            if (Line<T>(pt[i], pt[(i + 1) % n]).segmentContains(t)) return 2;
            k = sign((pt[(i + 1) % n] - pt[i]) * (t - pt[i]));
            d1 = sign(pt[i].y - t.y);
            d2 = sign(pt[(i + 1) % n].y - t.y);
            if (k > 0 && d1 <= 0 && d2 > 0) num++;
            if (k < 0 && d2 <= 0 && d1 > 0) num--;
        }
        return num != 0;
    }

    inline void init(long n) { this->n = n, pt.clear(), pt.reserve(n + 1); }
    inline void add(const Point<T> &p) { pt.push_back(p); }

    /*判断点在凸多边形内，参数：点[p]*/
    bool chas(const Point<T> &p) const {
        T tp = 0, np;
        int i;
        for (i = 0; i < n; i++) {
            np = Line<T>(pt[i], pt[(i + 1) % n]) * p;
            if (tp * np < -eps)
                return false;
            tp = (std::fabs(np) > eps) ? np : tp;
        }
        return true;
    }

    /*判断点是否在任意多边形内[射线法]，O(n)*/
    bool ahas(const Point<T> &p) const {
        int ret = 0;
        T infv = 1e-10;/*坐标系最大范围*/
        Line<T> l = Line<T>(p, Point<T>(-infv, p.y));
        for (int i = 0; i < n; i++) {
            Line<T> ln = Line<T>(pt[i], pt[(i + 1) % n]);
            if (fabs(ln.s.y - ln.e.y) > eps) {
                Point<T> tp = (ln.s.y > ln.e.y) ? ln.s : ln.e;
                if (fabs(tp.y - p.y) < eps && tp.x < p.x + eps)
                    ret++;
            } else if (ln.isCrossSegmentSegment(l))
                ret++;
        }
        return (ret % 2 == 1);
    }

    /*凸多边形被直线分割,参数：直线[p]*/
    Polygon<T> split(Line<T> p) {
        /*注意确保多边形能被分割*/
        Polygon<T> ret;
        Point<T> spt[2];
        T tp = 0.0, np;
        bool flag = true;
        int i, pn = 0, spn = 0;
        for (i = 0; i < n; i++) {
            if (flag)
                pt[pn++] = pt[i];
            else
                ret.pt[ret.n++] = pt[i];
            np = p * pt[(i + 1) % n];
            if (tp * np < -eps) {
                flag = !flag;
                spt[spn++] = p.crossLineLine(Line<T>(pt[i], pt[(i + 1) % n]));
            }
            tp = (std::fabs(np) > eps) ? np : tp;
        }
        ret.pt[ret.n++] = spt[0];
        ret.pt[ret.n++] = spt[1];
        n = pn;
        return ret;
    }

    /*-------------凸包-------------*/
    /*Graham扫描法，复杂度O(nlg(n)),结果为逆时针*/
    static bool graham_cmp(const Point<T> &l, const Point<T> &r) {/*凸包排序函数*/

        return l.y < r.y || (l.y == r.y && l.x < r.x);
    }

    Polygon<T> &graham(Point<T> _p[], int _n) {
        int i, len;
        std::sort(_p, _p + _n, Polygon<T>::graham_cmp);
        n = 1;
        pt[0] = _p[0], pt[1] = _p[1];
        for (i = 2; i < _n; i++) {
            while (n && Point<T>::xmult(_p[i], pt[n], pt[n - 1]) >= 0)
                n--;
            pt[++n] = _p[i];
        }
        len = n;
        pt[++n] = _p[_n - 2];
        for (i = _n - 3; i >= 0; i--) {
            while (n != len && Point<T>::xmult(_p[i], pt[n], pt[n - 1]) >= 0)
                n--;
            pt[++n] = _p[i];
        }
        return (*this);
    }

    /*凸包旋转卡壳(注意点必须顺时针或逆时针排列)*/
    /*返回值凸包直径的平方（最远两点距离的平方）*/
    T rotating_calipers() {
        int i = 1;
        T ret = 0.0;
        pt[n] = pt[0];
        for (int j = 0; j < n; j++) {
            while (fabs(Point<T>::xmult(pt[j], pt[j + 1], pt[i + 1])) >
                   fabs(Point<T>::xmult(pt[j], pt[j + 1], pt[i])) + eps)
                i = (i + 1) % n;
            /*pt[i]和pt[j],pt[i + 1]和pt[j + 1]可能是对踵点*/
            ret = std::max(ret, std::max(pt[i].dis(pt[j]), pt[i + 1].dis(pt[j + 1])));
        }
        return ret;
    }

    /*凸包旋转卡壳(注意点必须逆时针排列)*/
    /*返回值两凸包的最短距离*/
    T rotating_calipers(Polygon<T> &p) {
        int i = 0;
        T ret = 1e10;/*inf*/
        pt[n] = pt[0];
        p.pt[p.n] = p.pt[0];
        /*注意凸包必须逆时针排列且pt[0]是左下角点的位置*/
        while (p.pt[i + 1].y > p.pt[i].y)
            i = (i + 1) % p.n;
        for (int j = 0; j < n; j++) {
            T tp;
            /*逆时针时为 >,顺时针则相反*/
            while ((tp = Point<T>::xmult(pt[j], pt[j + 1], p.pt[i + 1]) -
                         Point<T>::xmult(pt[j], pt[j + 1], p.pt[i])) >
                   eps)
                i = (i + 1) % p.n;
            /*(pt[i],pt[i+1])和(p.pt[j],p.pt[j + 1])可能是最近线段*/
            ret = std::min(ret, Line<T>(pt[j], pt[j + 1]).dis(p.pt[i], true));
            ret = std::min(ret, Line<T>(p.pt[i], p.pt[i + 1]).dis(pt[j + 1], true));
            if (tp > -eps)/*如果不考虑TLE问题最好不要加这个判断*/
            {
                ret = std::min(ret, Line<T>(pt[j], pt[j + 1]).dis(p.pt[i + 1], true));
                ret = std::min(ret, Line<T>(p.pt[i], p.pt[i + 1]).dis(pt[j], true));
            }
        }
        return ret;
    }

    /*-----------半平面交-------------*/
    /*杂度:O(nlog2(n))*/
    /*半平面计算极角函数[如果考虑效率可以用成员变量记录]*/
    static T hpc_pa(const Line<T> &p) {
        return atan2(p.e.y - p.s.y, p.e.x - p.s.x);
    }

    /*半平面交排序函数[优先顺序: 1.极角 2.前面的直线在后面的左边]*/
    static bool hpc_cmp(const Line<T> &l, const Line<T> &r) {
        T lp = hpc_pa(l), rp = hpc_pa(r);
        if (fabs(lp - rp) > eps)
            return lp < rp;
        return Point<T>::xmult(l.s, r.e, r.s) < 0.0;
    }

    /* 用于计算的双端队列 */
    Line<T> dequeue[maxpn];

    /* 获取半平面交的多边形（多边形的核） */
    /* 参数：向量集合[l]，向量数量[ln];(半平面方向在向量左边） */
    /* 函数运行后如果n[即返回多边形的点数量]为0则不存在半平面交的多边形（不存在区域或区域面积无穷大） */
    Polygon<T> &halfPanelCross(Line<T> p[], int ln) {
        int i, tn;
        n = 0;
        std::sort(p, p + ln, hpc_cmp);
        /* 平面在向量左边的筛选 */
        for (i = tn = 1; i < ln; i++)
            if (fabs(hpc_pa(p[i]) - hpc_pa(p[i - 1])) > eps)
                p[tn++] = p[i];
        ln = tn;
        int bot = 0, top = 1;
        dequeue[0] = p[0];
        dequeue[1] = p[1];
        for (i = 2; i < ln; i++) {
            if (dequeue[top].parallel(dequeue[top - 1]) ||
                dequeue[bot].parallel(dequeue[bot + 1]))
                return (*this);
            while (bot < top &&
                   Point<T>::xmult(dequeue[top].crossLineLine(dequeue[top - 1]), p[i].e, p[i].s) > eps)
                top--;
            while (bot < top &&
                   Point<T>::xmult(dequeue[bot].crossLineLine(dequeue[bot + 1]), p[i].e, p[i].s) > eps)
                bot++;
            dequeue[++top] = p[i];
        }

        while (bot < top &&
               Point<T>::xmult(dequeue[top].crossLineLine(dequeue[top - 1]), dequeue[bot].e, dequeue[bot].s) > eps)
            top--;
        while (bot < top &&
               Point<T>::xmult(dequeue[bot].crossLineLine(dequeue[bot + 1]), dequeue[top].e, dequeue[top].s) > eps)
            bot++;
        /* 计算交点(注意不同直线形成的交点可能重合) */
        if (top <= bot + 1)
            return (*this);
        for (i = bot; i < top; i++)
            pt[n++] = dequeue[i].crossLineLine(dequeue[i + 1]);
        if (bot < top + 1)
            pt[n++] = dequeue[bot].crossLineLine(dequeue[top]);
        return (*this);
    }
};

template<class T>
class Circle {
public:
    Point<T> c;/* 圆心 */
    T r;/* 半径 */
    T db, de;/*圆弧度数起点， 圆弧度数终点(逆时针0-360)*/

    /*-------圆---------*/

    /*判断圆在多边形内*/
    bool inside(const Polygon<T> &p) const {
        if (p.ahas(c) == false)
            return false;
        for (int i = 0; i < p.n; i++) {
            Line<T> l = Line<T>(p.pt[i], p.pt[(i + 1) % p.n]);
            if (l.dis(c, true) < r - eps)
                return false;
        }
        return true;
    }

    /*判断多边形在圆内（线段和折线类似）*/
    bool has(const Polygon<T> &p) const {
        for (int i = 0; i < p.n; i++)
            if (p.pt[i].dis2(c) > r * r - eps)
                return false;
        return true;
    }

    /*-------圆弧-------*/
    /*圆被其他圆截得的圆弧，参数：圆[p]*/
    Circle<T> operator-(Circle<T> &p) const {
        /*注意圆必须相交，圆心不能重合*/
        T d2 = c.dis2(p.c);
        T d = c.dis(p.c);
        T ans = std::acos((d2 + r * r - p.r * p.r) / (2 * d * r));
        Point<T> py = p.c - c;
        T oans = std::atan2(py.y, py.x);
        Circle<T> res;
        res.c = c;
        res.r = r;
        res.db = oans + ans;
        res.de = oans - ans + 2 * pi;
        return res;
    }

    /*圆被其他圆截得的圆弧，参数：圆[p]*/
    Circle<T> operator+(Circle<T> &p) const {
        /*注意圆必须相交，圆心不能重合*/
        T d2 = c.dis2(p.c);
        T d = c.dis(p.c);
        T ans = std::acos((d2 + r * r - p.r * p.r) / (2 * d * r));
        Point<T> py = p.c - c;
        T oans = std::atan2(py.y, py.x);
        Circle<T> res;
        res.c = c;
        res.r = r;
        res.db = oans - ans;
        res.de = oans + ans;
        return res;
    }

    /*过圆外一点的两条切线*/
    /*参数：点[p](必须在圆外),返回：两条切线(切线的s点为_Off,e点为切点)*/
    std::pair<Line<T>, Line<T> > tangent(const Point<T> &p) const {
        T d = c.dis(p);
        /*计算角度偏移的方式*/
        T angp = std::acos(r / d), ango = std::atan2(p.y - c.y, p.x - c.x);
        Point<T> pl = Point<T>(c.x + r * std::cos(ango + angp), c.y + r * std::sin(ango + angp)),
                pr = Point<T>(c.x + r * std::cos(ango - angp), c.y + r * std::sin(ango - angp));
        return std::make_pair(Line<T>(p, pl), Line<T>(p, pr));
    }

    /*计算直线和圆的两个交点*/
    /*参数：直线[p](两点式)，返回两个交点，注意直线必须和圆有两个交点*/
    std::pair<Point<T>, Point<T> > cross(Line<T> p) const {
        p.convertToGeneral();
        /*到直线垂足的距离*/
        T td = fabs(p.a * c.x + p.b * c.y + p.c) / sqrt(p.a * p.a + p.b * p.b);

        /*计算垂足坐标*/
        T xp =
                (p.b * p.b * c.x - p.a * p.b * c.y - p.a * p.c) / (p.a * p.a + p.b * p.b);
        T yp = (-p.a * p.b * c.x + p.a * p.a * c.y - p.b * p.c) /
               (p.a * p.a + p.b * p.b);

        T ango = std::atan2(yp - c.y, xp - c.x);
        T angp = std::acos(td / r);

        return std::make_pair(Point<T>(c.x + r * std::cos(ango + angp), c.y + r * std::sin(ango + angp)),
                              Point<T>(c.x + r * std::cos(ango - angp), c.y + r * std::sin(ango - angp)));
    }
};

template<class T>
class Triangle {
public:
    Point<T> a, b, c;/*顶点*/
    Triangle() {}

    Triangle(Point<T> a, Point<T> b, Point<T> c) : a(a), b(b), c(c) {}

    /*计算三角形面积*/
    T area() {
        return fabs(Point<T>::xmult(a, b, c)) / 2.0;
    }

    /*计算三角形外心*/
    /*返回：外接圆圆心*/
    Point<T> circumcenter() {
        Line<T> u, v;
        u.s.x = (a.x + b.x) / 2;
        u.s.y = (a.y + b.y) / 2;
        u.e.x = u.s.x - a.y + b.y;
        u.e.y = u.s.y + a.x - b.x;
        v.s.x = (a.x + c.x) / 2;
        v.s.y = (a.y + c.y) / 2;
        v.e.x = v.s.x - a.y + c.y;
        v.e.y = v.s.y + a.x - c.x;
        return u.crossLineLine(v);
    }

    /*计算三角形内心*/
    /*返回：内接圆圆心*/
    Point<T> incenter() {
        Line<T> u, v;
        T m, n;
        u.s = a;
        m = atan2(b.y - a.y, b.x - a.x);
        n = atan2(c.y - a.y, c.x - a.x);
        u.e.x = u.s.x + cos((m + n) / 2);
        u.e.y = u.s.y + sin((m + n) / 2);
        v.s = b;
        m = atan2(a.y - b.y, a.x - b.x);
        n = atan2(c.y - b.y, c.x - b.x);
        v.e.x = v.s.x + cos((m + n) / 2);
        v.e.y = v.s.y + sin((m + n) / 2);
        return u.crossLineLine(v);
    }

    /*计算三角形垂心*/
    /*返回：高的交点*/
    Point<T> perpencenter() {
        Line<T> u, v;
        u.s = c;
        u.e.x = u.s.x - a.y + b.y;
        u.e.y = u.s.y + a.x - b.x;
        v.s = b;
        v.e.x = v.s.x - a.y + c.y;
        v.e.y = v.s.y + a.x - c.x;
        return u.crossLineLine(v);
    }

    /*计算三角形重心*/
    /*返回：重心*/
    /*到三角形三顶点距离的平方和最小的点*/
    /*三角形内到三边距离之积最大的点*/
    Point<T> barycenter() {
        Line<T> u, v;
        u.s.x = (a.x + b.x) / 2;
        u.s.y = (a.y + b.y) / 2;
        u.e = c;
        v.s.x = (a.x + c.x) / 2;
        v.s.y = (a.y + c.y) / 2;
        v.e = b;
        return u.crossLineLine(v);
    }

    /*计算三角形费马点*/
    /*返回：到三角形三顶点距离之和最小的点*/
    Point<T> fermentpoint() {
        Point<T> u, v;
        T step = fabs(a.x) + fabs(a.y) + fabs(b.x) + fabs(b.y) + fabs(c.x) + fabs(c.y);
        int i, j, k;
        u.x = (a.x + b.x + c.x) / 3;
        u.y = (a.y + b.y + c.y) / 3;
        while (step > eps) {
            for (k = 0; k < 10; step /= 2, k++) {
                for (i = -1; i <= 1; i++) {
                    for (j = -1; j <= 1; j++) {
                        v.x = u.x + step * i;
                        v.y = u.y + step * j;
                        if (u.dis(a) + u.dis(b) + u.dis(c) > v.dis(a) + v.dis(b) + v.dis(c))
                            u = v;
                    }
                }
            }
        }
        return u;
    }
};

#endif
#endif

Point<int> q;
int n, m;

int main() {
    std::ios::sync_with_stdio(0);
    std::cin.tie(0);
    for (register int t = 1;; t++) {
        Polygon<int> p;
        std::cin >> n;
        if (!n) break;
        std::cin >> m;
        p.init(n);
        for (register int i = 0; i < n; i++) std::cin >> q, p.add(q);
        if (t != 1) std::cout << "\n";
        std::cout << "Problem " << t << ":\n";
        while (m--) {
            std::cin >> q;
            if (p.contains(q)) std::cout << "Within\n";
            else std::cout << "Outside\n";
        }
    }
    return 0;
}
```

