---
title: 「CF-17E」Palisection-乱搞
date: 2017-01-02 18:50:47
tags:
  - 字符串
  - 乱搞
categories:
  - OI
  - 字符串
---
In an English class Nick had nothing to do at all, and remembered about wonderful strings called palindromes. We should remind you that a string is called a palindrome if it can be read the same way both from left to right and from right to left. Here are examples of such strings: «eye», «pop», «level», «aba», «deed», «racecar», «rotor», «madam».

Nick started to look carefully for all palindromes in the text that they were reading in the class. For each occurrence of each palindrome in the text he wrote a pair — the position of the beginning and the position of the ending of this occurrence in the text. Nick called each occurrence of each palindrome he found in the text subpalindrome. When he found all the subpalindromes, he decided to find out how many different pairs among these subpalindromes cross. Two subpalindromes cross if they cover common positions in the text. No palindrome can cross itself.
<!-- more -->
### 链接
[CF-17E](http://codeforces.com/problemset/problem/17/E)
### 题解
以下均为乱搞...
~~暴力枚举子串，然后记录前缀和后缀和，计算对应贡献，暴力 DP 就水过了。~~
### 代码
``` cpp
#include <cstdio>
#include <cstring>
#include <algorithm>
const int mod = 51123987;
const int MAXN = 2000001;
int m;
char w[2000010];
int d[MAXN][2];
int start[MAXN], finish[MAXN], qa[MAXN], qb[MAXN];
long long sstart[MAXN];
inline int get(int i) { return d[(i + 1) >> 1][i & 1] == ((i + 1) >> 1); }
inline void solve(const int n) {
    gets(w);
    long long all = 0;
    for (register int t = 0; t < 2; t++) {
        register int l = 0, r = -1, j;
        for (register int i = 0; i < n; i++) {
            if (i > r) j = 1;
            else j = std::min (d[l + r - i + t][t], r - i + t) + 1;
            while (i + j - t < n && i - j >= 0 && w[i + j - t] == w[i - j]) j++;
            d[i][t] = --j;
            if (i + j + t > r) { l = i - j; r = i + j - t; }
            register int x = i - d[i][t], y = i - t + d[i][t];
            if (x <= y) {
                all += d[i][t] + (1 - t), qa[x]++;
                if (i - t + 1 < n) qa[i - t + 1]--;
                if (i > 0) qb[i - 1]--;
                qb[y]++;
            }
        }
    }
    register long long all2 = all - 1;
    if (~all & 1) all >>= 1;
    else all2 >>= 1;
    all = (all % mod) * (all2 % mod), all %= mod;
    register int cur = 0;
    for (register int i = 0; i < n; i++) cur += qa[i], start[i] = cur;
    cur = 0;
    for (register int i = n - 1; i >= 0; i--) cur += qb[i], finish[i] = cur;
    register long long sum = 0;
    for (register int i = 0; i + 1 < n; i++) sum += finish[i], all = (all - (sum * start [i + 1]) % mod + mod) % mod;
    printf("%d\n", (int)(all % mod));
}
int main() {
    int n;
    scanf ("%d\n", &n);
    solve(n);
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=729434&auto=1&height=66"></iframe>
