---
title: 「TJOI2015」弦论-后缀数组
date: 2017-08-27 22:50:05
tags:
---
后缀自动机的做法相信大家都会，这里记录一下后缀数组做法。

<!-- more -->
### 链接
[BZOJ 3998](http://www.lydsy.com/JudgeOnline/problem.php?id=3998)

### 题解
从 [fstqwq](http://fstqwq.pw/archives/bzoj3998/) 大爷那里学到了这种做法。

首先当 $T = 0$ 时，就是求本质不同的字符串的个数，这是一个经典的后缀数组问题，原串的子串可以看作后缀的前缀，我们按排名从小到大枚举，对于排名为 $i$ 的后缀，其贡献为其长度减掉与排名 $i - 1$ 的后缀的最长公共前缀，即
$$len(sa_i) - ht_i = n - sa_i - ht_i$$
当贡献 $\geq k$ 时，我们选当前后缀的对应前缀输出就可以了，时间复杂度 $O(n)$。


对于 $T = 1$ 时，我们需要统计每个本质不同的字符串所出现的次数，一种比较直观的做法是对于每个新出现的本质不同的子串，在 $ht$ 数组上二分得到出现的次数，对于 $ht$ 数组外的部分直接统计。

事实上，对于一个新的长度为 $len$ 的本质不同的子串，二分结束时都会得到一个长度 $max$，表示出现了当前次数的字符串的长度的最大值，即对于当前位置，长度 $[len, max]$ 为的字符串都出现了相同次数，寻找下一个字符串就从 $max + 1$ 开始。

考虑用单调栈来维护，对于 $ht$ 数组的当前位置为 $i$，我们可以找到当前位置向后扩展的最大的 $ht$ 值，即对于当前来说，单调不下降的最大的 $ht$ 值，设这时位于 $ht$ 数组的 $j$ 位，我们用链表记录下当前位置的最大 $ht$ 值和区间长度（$j - i$，这里方便后面的实现记录的是开区间，即 $[len, max)$），而出现次数则为 $ht_j - ht_{i - 1}$，这是由于每个后缀出现的位置不同，即在弹出时用链表记录下这两个值。

然后我们只需要按照排名从小到大枚举即可，由于每次寻找下一个字符串会从记录下来的 $max + 1$ 开始，所以时间复杂度为 $O(n)$。

而我们使用 SA-IS 算法构建后缀数组，故此题的时间复杂度为 $O(n)$，优于后缀自动机 $O(n \Sigma)$ 的复杂度，实际的运行时间也符合这一点，虽然 $T = 1$ 时常数极大，但目前这个后缀数组的做法是 BZOJ rk1，比 rk2 的后缀自动机快了 1.8s。

### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「BZOJ 3998」「TJOI 2015」弦论 28-08-2017
 * 后缀数组
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
    for (x = 0; isdigit(c); c = read()) x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
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

inline void print(const char *s) {
    for (; *s; s++) print(*s);
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
}

namespace SuffixArray {

const int MAXN = 500000;

inline bool islms(const int i, const bool *t) {
    return i > 0 && t[i] && !t[i - 1];
}

template <typename T>
inline void sort(T s, int *sa, const int len, const int sz, const int sigma,
                 bool *t, int *b, int *cb, int *p) {
    memset(b, 0, sizeof(int) * sigma);
    memset(sa, -1, sizeof(int) * len);
    for (register int i = 0; i < len; i++) b[s[i]]++;
    cb[0] = b[0];
    for (register int i = 1; i < sigma; i++) cb[i] = cb[i - 1] + b[i];
    for (register int i = sz - 1; i >= 0; i--) sa[--cb[s[p[i]]]] = p[i];
    for (register int i = 1; i < sigma; i++) cb[i] = cb[i - 1] + b[i - 1];
    for (register int i = 0; i < len; i++)
        if (sa[i] > 0 && !t[sa[i] - 1]) sa[cb[s[sa[i] - 1]]++] = sa[i] - 1;
    cb[0] = b[0];
    for (register int i = 1; i < sigma; i++) cb[i] = cb[i - 1] + b[i];
    for (register int i = len - 1; i >= 0; i--)
        if (sa[i] > 0 && t[sa[i] - 1]) sa[--cb[s[sa[i] - 1]]] = sa[i] - 1;
}

template <typename T>
inline void sais(T s, int *sa, const int len, bool *t, int *b, int *b1,
                 const int sigma) {
    register int i, j, x, p = -1, sz = 0, cnt = 0, *cb = b + sigma;
    for (t[len - 1] = 1, i = len - 2; i >= 0; i--)
        t[i] = s[i] < s[i + 1] || (s[i] == s[i + 1] && t[i + 1]);
    for (i = 1; i < len; i++)
        if (t[i] && !t[i - 1]) b1[sz++] = i;
    sort(s, sa, len, sz, sigma, t, b, cb, b1);
    for (i = sz = 0; i < len; i++)
        if (islms(sa[i], t)) sa[sz++] = sa[i];
    for (i = sz; i < len; i++) sa[i] = -1;
    for (i = 0; i < sz; i++) {
        for (x = sa[i], j = 0; j < len; j++) {
            if (p == -1 || s[x + j] != s[p + j] || t[x + j] != t[p + j]) {
                p = x, cnt++;
                break;
            } else if (j > 0 && (islms(x + j, t) || islms(p + j, t))) {
                break;
            }
        }
        sa[sz + (x >>= 1)] = cnt - 1;
    }
    for (i = j = len - 1; i >= sz; i--)
        if (sa[i] >= 0) sa[j--] = sa[i];
    register int *s1 = sa + len - sz, *b2 = b1 + sz;
    if (cnt < sz)
        sais(s1, sa, sz, t + len, b, b1 + sz, cnt);
    else
        for (i = 0; i < sz; i++) sa[s1[i]] = i;
    for (i = 0; i < sz; i++) b2[i] = b1[sa[i]];
    sort(s, sa, len, sz, sigma, t, b, cb, b2);
}

template <typename T>
inline void getHeight(T s, const int n, int *sa, int *rk, int *ht) {
    for (register int i = 1; i <= n; i++) rk[sa[i]] = i;
    for (register int i = 0, j = 0, k = 0; i < n; ht[rk[i++]] = k)
        for (k ? k-- : 0, j = sa[rk[i] - 1]; s[i + k] == s[j + k]; k++)
            ;
}

struct SuffixArray {
    int sa[MAXN + 2], rk[MAXN + 2], ht[MAXN + 2];
    bool t[MAXN * 2 + 4];
    int n;
    char s[MAXN + 2];

    inline void build(const int sigma) {
        s[n] = 0, sais(s, sa, n + 1, t, rk, ht, sigma);
        rk[0] = ht[0] = 0, getHeight(s, n, sa, rk, ht);
    }

    inline void tie(int *&sa, int *&rk, int *&ht, char *&s) {
        sa = this->sa, rk = this->rk, ht = this->ht, s = this->s;
    }
} suffixArray;

int *sa, *rk, *ht, n, type, varK;
char *s;

inline void solveTask0() {
    register int cnt = 0;
    for (register int i = 1, cur; i <= n; i++) {
        cur = n - sa[i] - ht[i];
        if (cnt + cur >= varK) {
            register int remain = varK - cnt + ht[i];
            for (register int j = 0; j < remain; j++) IO::print(s[sa[i] + j]);
            return;
        }
        cnt += cur;
    }
}

typedef std::pair<int, int> Pair;
typedef std::vector<Pair> Vector;
Vector buc[MAXN + 1];

inline void solveTask1() {
    using namespace IO;
    static std::vector<int> st, p;
    st.reserve(n + 1), st.push_back(-1);
    p.reserve(n + 1), p.push_back(0);
    for (register int i = 1, r; i <= n; i++) {
        r = i;
        while (st.back() >= ht[i]) {
            r = std::min(r, p.back());
            if (st.back() > ht[i]) {
                buc[p.back()].push_back(Pair(st.back(), i - p.back()));
#ifdef DBG
                std::cerr << p.back() << " " << st.back() << " "
                          << i - p.back();
                std::cerr << std::endl;
#endif
            }
            st.pop_back(), p.pop_back();
        }
        st.push_back(ht[i]), p.push_back(r);
    }
    while (!st.empty() && st.back() > 0) {
        buc[p.back()].push_back(Pair(st.back(), n + 1 - p.back()));
#ifdef DBG
        std::cerr << p.back() << " " << st.back() << " " << n + 1 - p.back();
        std::cerr << std::endl;
#endif
        st.pop_back(), p.pop_back();
    }
    register int tot = 0;
    for (register int i = 1, j; i <= n; i++) {
        j = ht[i] + 1;
        for (Vector::reverse_iterator it = buc[i + 1].rbegin(),
                                      end = buc[i + 1].rend();
             it != end; it++) {
            register int d = it->second + 1, cnt = it->first - j + 1;

            if (varK - tot - 1 <= (long)cnt * d) {
                j += (varK - tot - 1) / d;
                for (register int l = 0; l < j; l++) print(s[sa[i] + l]);
                // std::cerr << "done";
                return;
            }
            tot += d * cnt, j += cnt;
        }
        register int remain = n - sa[i] - j + 1;
        if (tot + remain >= varK) {
            register int d = varK - tot + j - 1;
            for (j = 0; j < d; j++) print(s[sa[i] + j]);
            return;
        }
        tot += remain;
    }
    print("-1");
}

inline void solve() {
    using namespace IO;
    n = suffixArray.n = read(suffixArray.s), read(type), read(varK);
    suffixArray.build(124), suffixArray.tie(sa, rk, ht, s);
    type ? solveTask1() : solveTask0();
}
}

int main() {
    // freopen("in.in", "r", stdin);
    SuffixArray::solve();
    IO::flush();
    return 0;
}
```

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=498286385&auto=1&height=66"></iframe>