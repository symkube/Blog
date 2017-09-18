---
title: 「POJ-3461」Oulipo-KMP
date: 2017-01-02 07:58:39
tags:
  - KMP
  - 字符串
categories:
  - OI
  - 字符串
  - KMP
---
The French author Georges Perec (1936–1982) once wrote a book, La disparition, without the letter 'e'. He was a member of the Oulipo group. A quote from the book:

Tout avait Pair normal, mais tout s'affirmait faux. Tout avait Fair normal, d'abord, puis surgissait l'inhumain, l'affolant. Il aurait voulu savoir où s'articulait l'association qui l'unissait au roman : stir son tapis, assaillant à tout instant son imagination, l'intuition d'un tabou, la vision d'un mal obscur, d'un quoi vacant, d'un non-dit : la vision, l'avision d'un oubli commandant tout, où s'abolissait la raison : tout avait l'air normal mais \cdots 
<!-- more -->
Perec would probably have scored high (or rather, low) in the following contest. People are asked to write a perhaps even meaningful text on some subject with as few occurrences of a given “word” as possible. Our task is to provide the jury with a program that counts these occurrences, in order to obtain a ranking of the competitors. These competitors often write very long texts with nonsense meaning; a sequence of 500,000 consecutive 'T's is not unusual. And they never use spaces.

So we want to quickly find out how often a word, i.e., a given string, occurs in a text. More formally: given the alphabet {'A', 'B', 'C',  \cdots , 'Z'} and two finite strings over that alphabet, a word W and a text T, count the number of occurrences of W in T. All the consecutive characters of W must exactly match consecutive characters of T. Occurrences may overlap.
### 链接
[POJ-3461](http://poj.org/problem?id=3461)
### 题解
裸题，KMP直接上模板...
### 代码
``` cpp
#include <iostream>
#include <cstring>
#include <vector>
#include <algorithm>
#include <cmath>
#include <cstdio>
const int MAXN = 1000010;
inline void getNext(int *next, const char *p, const int len) {
    for (register int i = 1, j = 0; i < len; i++) {
        while (j && p[i] != p[j]) j = next[j - 1];
        if (p[i] == p[j]) j++;
        next[i] = j;
    }
}
inline void kmp(const char *p, const char *t) {
    register int n = strlen(t), m = strlen(p);
    static int next[MAXN];
    register int ans = 0;
    memset(next, 0, sizeof(next));
    getNext(next, p, m);
    for (register int i = 0, j = 0; i < n; i++) {
        while (j && t[i] != p[j]) j = next[j - 1];
        if (t[i] == p[j]) j++;
        if (j == m) ans++;
    }
    std::cout << ans << "\n";
}
char t[MAXN], p[MAXN];
int T;
int main() {
#ifndef ONLINE_JUDGE
    freopen("in.in" , "r", stdin);
#endif
    std::ios::sync_with_stdio(0);
    std::cin.tie(0);
    std::cin >> T;
    while (T--) {
        std::cin >> t >> p;
        kmp(t, p);
    }
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=22728057&auto=1&height=66"></iframe>
