---
title: 「POJ-1523」Power Strings-KMP
date: 2017-01-02 16:41:06
tags:
  - KMP
  - 字符串
categories:
  - OI
  - 字符串
  - KMP
---
Given two strings a and b we define a*b to be their concatenation. For example, if a = "abc" and b = "def" then a*b = "abcdef". If we think of concatenation as multiplication, exponentiation by a non-negative integer is defined in the normal way: a^0 = "" (the empty string) and a^(n+1) = a*(a^n).
<!-- more -->
### 链接
[POJ-2406](http://poj.org/problem?id=2406)
### 题解
~~写了个后缀数组水过，还是说正解吧~~
KMP 求循环节，KMP 时 $j - m$ 为循环节长度，接下来用除法或取模就能判断了。
### 代码
后缀数组就不附了。
``` cpp
#include <cstdio>
#include <cstring>
#include <cstdlib>
#include <vector>
#include <algorithm>
#include <cmath>
#include <cctype>
#include <iostream>
using namespace std;
const int MAXN = 1000010;
char T[MAXN << 1], P[MAXN];
int next[MAXN];
inline void getNext(int m) {
    register int i = 0, j = -1;
    next[0] = -1;
    while (i < m) {
        if (j == -1 || P[i] == P[j]) {
            i++, j++;
            if (P[i] != P[j])next[i] = j;
            else next[i] = next[j];
        }
        else j = next[j];
    }
}
inline int kmp(int pos, int n, int m) {
    register int i = pos, j = 0;
    while (i < n && j < m) {
        if (j == -1 || T[i] == P[j]) i++, j++;
        else j = next[j];
    }
    if (j == m) return i - m;
    else return -1;
}
int main() {
    while (scanf("%s", P), P[0] != '.') {
        register int n, m;
        m = strlen(P), n = m << 1;
        strcpy(T, P), strcpy(T + m, P), getNext(m);
        printf("%d\n", m / kmp(1, n, m));
    }
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=28524863&auto=1&height=66"></iframe>
