---
title: 「SPOJ-SARRAY」-后缀数组-SA-IS
date: 2016-12-27 19:54:36
tags:
  - 字符串
  - 后缀数组
categories:
  - OI
  - 字符串
  - 后缀数组
---
Given a string of length at most $100,000$ consist of alphabets and numbers. Output the suffix array of the string.
A suffix array is an array of integers giving the starting positions $(0-based)$ of suffixes of a string in lexicographical order. Consider a string $"abracadabra0AbRa4Cad14abra"$. The size of the suffix array is equal to the length of the string. Below is the list of $26$ suffixes of the string along with its starting position sorted in lexicographical order:
<!-- more -->
### 链接
[SPOJ-SARRAY](http://www.spoj.com/problems/SARRAY/)
### 输入
A single line containing the string.
### 输出
The suffix array of the string.
### 题解
题目意思就是给定一个最长为 $100000$ 的字符串，求出它的后缀数组，然后输出，注意时间限制是 $0.1s$，并且题目所给提示如下：
Note: this is a partial score problem.
$O(n^2 \log(n))$ is expected to score about $20-30$. (Naive sorting all suffixes)
$O(n \log n)$ is expected to score about $40$. (OK for most programming contest problems)
$O(n \log n)$ is expected to score about $60-70$. (Use counting sort for small alphabet size)
$O(n)$ without tweaks is expected to score about $80-90$.
$O(n)$ with tweaks is expected to score 100. (This is meant for fun only :)
于是我们就用 $SA-IS + fread + fwrite$ 水啊，2333333......
然后 $AC$ 信息就变成了这样：
``` bash
test 1 - AC (score=0.000000, sig=0, time=0.000000, mem=7676)
test 2 - AC (score=0.000000, sig=0, time=0.000000, mem=7676)
test 3 - AC (score=0.000000, sig=0, time=0.000000, mem=7676)
test 4 - AC (score=0.000000, sig=0, time=0.000000, mem=7676)
test 5 - AC (score=0.000000, sig=0, time=0.000000, mem=7676)
test 6 - AC (score=0.000000, sig=0, time=0.000000, mem=7676)
test 7 - AC (score=0.000000, sig=0, time=0.000000, mem=7676)
test 8 - AC (score=0.000000, sig=0, time=0.000000, mem=7676)
test 9 - AC (score=0.000000, sig=0, time=0.000000, mem=7676)
test 10 - AC (score=0.000000, sig=0, time=0.000000, mem=7676)
```
$0s$ $AC$，23333333.....
### 代码
``` cpp
#include <bits/stdc++.h>
#define FAST_IO
#ifdef FAST_IO
const int IN_LEN = 1000000, OUT_LEN = 1000000;
inline int nextChar() {
    static char buf[IN_LEN], *h, *t;
    if (h == t) {
        t = (h = buf) + fread(buf, 1, IN_LEN, stdin);
        if (h == t) return -1;
    }
    return *h++;
}
inline bool isWordSkippable(const char c) { return c == ' ' || c == '\n' || c == '\r'; }
inline bool read(char *str) {
    char c;
    for (c = nextChar(); isWordSkippable(c); c = nextChar()) if (c == -1) return false;
    for (; !isWordSkippable(c); c = nextChar()) *str++ = c;
    return true;
}
template<class T>
inline bool read(T &x) {
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
char obuf[OUT_LEN], *oh = obuf;
inline void writeChar(const char c) {
    if (oh == obuf + OUT_LEN) fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf;
    *oh++ = c;
}
template<class T>
inline void write(T x) {
    static int buf[30], cnt;
    if (!x) writeChar(48);
    else {
        if (x < 0) writeChar('-');
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 + 48;
        while (cnt) writeChar(buf[cnt--]);
    }
}
inline void flush() { fwrite(obuf, 1, oh - obuf, stdout); }
#endif
template<size_t size>
struct SuffixArray {
    bool t[size << 1];
    int b[size], b1[size];
    int sa[size], rk[size], ht[size];
    inline bool islms(const int i, const bool *t) { return i > 0 && t[i] && !t[i - 1]; }
    template<class T>
    inline void sort(T s, int *sa, const int len, const int sigma, const int sz, bool *t, int *b, int *cb, int *p) {
        memset(b, 0, sizeof(int) * sigma);
        memset(sa, -1, sizeof(int) * len);
        for (register int i = 0; i < len; i++) b[s[i]]++;
        cb[0] = b[0];
        for (register int i = 1; i < sigma; i++) cb[i] = cb[i - 1] + b[i];
        for (register int i = sz - 1; i >= 0; i--) sa[--cb[s[p[i]]]] = p[i];
        for (register int i = 1; i < sigma; i++) cb[i] = cb[i - 1] + b[i - 1];
        for (register int i = 0; i < len; i++) if (sa[i]> 0 && !t[sa[i] - 1]) sa[cb[s[sa[i] - 1]]++] = sa[i] - 1;
        cb[0] = b[0];
        for (register int i = 1; i < sigma; i++) cb[i] = cb[i - 1] + b[i];
        for (register int i = len - 1; i >= 0; i--) if (sa[i] > 0 && t[sa[i] - 1]) sa[--cb[s[sa[i] - 1]]] = sa[i] - 1;
    }
    template<class T>
    inline void sais(T s, int *sa, int len, bool *t, int *b, int *b1, int sigma) {
        int i, j, sz = 0, cnt = 0, p = -1, x, *cb = b + sigma;
        t[len - 1] = 1;
        for (i = len - 2; i >= 0; i--) t[i] = s[i] < s[i + 1] || (s[i] == s[i + 1] && t[i + 1]);
        for (i = 1; i < len; i++) if (t[i] && !t[i - 1]) b1[sz++] = i;
        sort(s, sa, len, sigma, sz, t, b, cb, b1);
        for (i = sz = 0; i < len; i++) if (islms(sa[i], t)) sa[sz++] = sa[i];
        for (i = sz; i < len; i++) sa[i] = -1;
        for (i = 0; i < sz; i++) {
            x = sa[i];
            for (j = 0; j < len; j++) {
                if (p == -1 || s[x + j] != s[p + j] || t[x + j] != t[p + j]) { cnt++, p = x; break; }
                else if (j > 0 && (islms(x + j, t) || islms(p + j, t))) break;
            }
            x = (~x & 1 ? x >> 1 : x - 1 >> 1), sa[sz + x] = cnt - 1;
        }
        for (i = j = len - 1; i >= sz; i--) if (sa[i] >= 0) sa[j--] = sa[i];
        int *s1 = sa + len - sz, *b2 = b1 + sz;
        if (cnt < sz) sais(s1, sa, sz, t + len, b, b1 + sz, cnt);
        else for (i = 0; i < sz; i++) sa[s1[i]] = i;
        for (i = 0; i < sz; i++) b2[i] = b1[sa[i]];
        sort(s, sa, len, sigma, sz, t, b, cb, b2);
    }
    template<class T>
    inline void init(T s, const int len, const int sigma) {
        sais(s, sa, len, t, b, b1, sigma);
    }
};
const int MAXN = 100000 + 10;
char s[MAXN];
int len;
SuffixArray<MAXN> sf;
int main() {
    read(s), len = strlen(s);
    sf.init(s, len + 1, 256);
    for (register int i = 1; i <= len; i++) write(sf.sa[i]), writeChar('\n');
    flush();
    return 0;
}
```

