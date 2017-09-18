---
title: 「CF-526D」Om Nom and Necklace-后缀数组
date: 2017-01-02 20:07:08
tags:
  - 后缀数组
  - 字符串
categories:
  - OI
  - 字符串
  - 后缀数组
---
Om Nom knows that his girlfriend loves beautiful patterns. That's why he wants the beads on the necklace to form a regular pattern. A sequence of beads S is regular if it can be represented as S = A + B + A + B + A + ... + A + B + A, where A and B are some bead sequences, " + " is the concatenation of sequences, there are exactly 2k + 1 summands in this sum, among which there are k + 1 "A" summands and k "B" summands that follow in alternating order. Om Nelly knows that her friend is an eager mathematician, so she doesn't mind if A or B is an empty sequence.
<!-- more -->
Help Om Nom determine in which ways he can cut off the first several beads from the found thread (at least one; probably, all) so that they form a regular pattern. When Om Nom cuts off the beads, he doesn't change their order.
### 链接
[CF-526D](http://codeforces.com/problemset/problem/526/D)
### 题解
正解 KMP，~~但我不会(逃)~~
于是用后缀数组啊，先跑出 KMP 的 $fail$ 指针，然后构建后缀数组，预处理数组 $g$，$dp$ 转移方程如下:
{% raw %}$$
g[sa[i]]=\left\{\begin{matrix}min(g[sa[i + 1]], height[i + 1])
 & i \in (0, rank[0] - 1] \cap \{i | height[i + 1] \neq  0\}  & \\ min(sa[i - 1], height[i])
 & i \in [rank[0] + 1, n) \cap \{i | height[i] \neq  0\}
\end{matrix}\right.
$${% endraw %}
接下来只需要利用 $fail$ 指针暴力判断即可。
由于使用了 $SA-IS$ 算法构造后缀数组，故时间复杂度为 $O(n)$
### 代码
``` cpp
#include <bits/stdc++.h>
template<size_t size>
struct SuffixArray {
    bool t[size << 1];
    int sa[size], ht[size], rk[size];
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
        for (register int i = 0; i < len; i++) if (sa[i] > 0 && !t[sa[i] - 1]) sa[cb[s[sa[i] - 1]]++] = sa[i] - 1;
        cb[0] = b[0];
        for (register int i = 1; i < sigma; i++) cb[i] = cb[i - 1] + b[i];
        for (register int i = len - 1; i >= 0; i--) if (sa[i] > 0 && t[sa[i] - 1]) sa[--cb[s[sa[i] - 1]]] = sa[i] - 1;
    }
    template<class T>
    inline void sais(T s, int *sa, const int len, bool *t, int *b, int *b1, const int sigma) {
        register int i, j, x, p = -1, cnt = 0, sz = 0, *cb = b + sigma;
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
        register int *s1 = sa + len - sz, *b2 = b1 + sz;
        if (cnt < sz) sais(s1, sa, sz, t + len, b, b1 + sz, cnt);
        else for (i = 0; i < sz; i++) sa[s1[i]] = i;
        for (i = 0; i < sz; i++) b2[i] = b1[sa[i]];
        sort(s, sa, len, sigma, sz, t, b, cb, b2);
    }
    template<class T>
    inline void getHeight(T s, int n) {
        for (register int i = 1; i <= n; i++) rk[sa[i]] = i;
        register int j = 0, k = 0;
        for (register int i = 0; i < n; ht[rk[i++]] = k)
            for (k ? k-- : 0, j = sa[rk[i] - 1]; s[i + k] == s[j + k]; k++);
    }
    template<class T>
    inline void init(T s, const int len, const int sigma) {
        sais(s, sa, len, t, rk, ht, sigma), rk[0] = 0;
    }
};
const int MAXN = 1000010;
char s[MAXN];
int len, n, k;
SuffixArray<MAXN> sf;
int f[MAXN], b[MAXN], g[MAXN];
bool q[MAXN];
inline void getFail(char *P, int *f) {
    register int m = strlen(P);
    f[0] = f[1] = 0;
    for (register int i = 1; i < m; i++) {
        int j = f[i];
        while (j && P[i] != P[j]) j = f[j];
        f[i + 1] = P[i] == P[j] ? j + 1 : 0;
    }
}
inline int min(int a, int b, int c) {
    if (a > b) a = b;
    if (a > c) a = c;
    return a;
}
inline void initSuffixArray() {
    s[++n] = 0;
    sf.init(s, n, 256), sf.getHeight(s, --n);
    g[0] = n;
    for (register int i = sf.rk[0] - 1; i && sf.ht[i + 1]; i--)
        g[sf.sa[i]] = std::min(g[sf.sa[i + 1]], sf.ht[i + 1]);
    for (register int i = sf.rk[0] + 1; i < n && sf.ht[i]; i++)
        g[sf.sa[i]] = std::min(g[sf.sa[i - 1]], sf.ht[i]);
}
inline void solve() {
    if (k == 1) for (register int i = 1; i <= n; i++) b[i] = 1;
    for (register int i = 1; i <= n; i++)
        if (f[i] > 0 && i % (i - f[i]) == 0 && (i / (i - f[i])) % k == 0)
            q[i] = true, b[i] += 1, b[i + min(i / k, g[i], n - i) + 1] -= 1;
    for (register int i = 1; i <= n; i++) b[i] += b[i - 1], printf(b[i] ? "1" : "0");
}
int main() {
    std::ios::sync_with_stdio(0), std::cin.tie(0), std::cout.tie(0);
    scanf("%d%d", &n, &k), scanf("%s", s);
    getFail(s, f);
    initSuffixArray();
    solve();
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=869390&auto=1&height=66"></iframe>
