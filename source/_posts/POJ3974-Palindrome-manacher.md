---
title: 「POJ-3974」Palindrome-manacher
date: 2017-01-02 08:09:51
tags:
  - 字符串
  - manacher
categories:
  - OI
  - 字符串
  - manacher
---
Andy the smart computer science student was attending an algorithms class when the professor asked the students a simple question, "Can you propose an efficient algorithm to find the length of the largest palindrome in a string?"

A string is said to be a palindrome if it reads the same both forwards and backwards, for example "madam" is a palindrome while "acm" is not.
<!-- more -->
The students recognized that this is a classical problem but couldn't come up with a solution better than iterating over all substrings and checking whether they are palindrome or not, obviously this algorithm is not efficient at all, after a while Andy raised his hand and said "Okay, I've a better algorithm" and before he starts to explain his idea he stopped for a moment and then said "Well, I've an even better algorithm!".

If you think you know Andy's final solution then prove it! Given a string of at most $1000000$ characters find and print the length of the largest palindrome inside this string.
### 链接
[POJ-3974](http://poj.org/problem?id=3974)
### 题解
套板子...
### 代码
``` cpp
#include <cstdio>
#include <cstring>
#include <iostream>
#include <algorithm>
const int MAXN = 2010000;
int p[MAXN];
char s1[MAXN], s2[MAXN];
inline int manacher(const int len, const char *s2, int *p) {
    register int ans = 0, max = -1, id = -1;
    for (register int i = 1; i <= len; i++) {
        if (id + max >= i) p[i] = std::min(p[id * 2 - i], id + max - i);
        while (i - p[i] - 1 >= 0 && i + p[i] + 1 <= len && s2[i - p[i] - 1] == s2[i + p[i] + 1]) p[i]++;
        if (i + p[i] > id + max) max = p[i], id = i;
        ans = std::max(ans, p[i]);
    }
    return ans;
}
inline int solve(const int len, const char *s1, char *s2) {
    for (register int i = 0; i < len; i++) s2[i << 1 | 1] = s1[i], s2[(i << 1) + 2] = '#';
    return s2[0] = '#', s2[len << 1 | 1] = '\0', memset(p, 0, sizeof(p)), manacher(len << 1 | 1, s2, p);
}
int main() {
    register int cnt = 0;
    while (scanf("%s", s1)) {
        if (strcmp(s1, "END") == 0)break;
        printf("Case %d: %d\n", ++cnt, solve(strlen(s1), s1, s2));
    }
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=814721&auto=1&height=66"></iframe>
