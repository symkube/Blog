---
title: 「POJ-2945」Find the Clones-map
date: 2017-01-02 16:55:13
tags:
  - map
  - 字符串
categories:
  - oi
  - 字符串
---
Doubleville, a small town in Texas, was attacked by the aliens. They have abducted some of the residents and taken them to the a spaceship orbiting around earth. After some (quite unpleasant) human experiments, the aliens cloned the victims, and released multiple copies of them back in Doubleville. So now it might happen that there are 6 identical person named Hugh F. Bumblebee: the original person and its 5 copies. The Federal Bureau of Unauthorized Cloning (FBUC) charged you with the task of determining how many copies were made from each person. To help you in your task, FBUC have collected a DNA sample from each person. All copies of the same person have the same DNA sequence, and different people have different sequences (we know that there are no identical twins in the town, this is not an issue).
<!-- more -->
### 链接
[POJ-2945](http://poj.org/problem?id=2945)
### 题解
~~直接 map 水，用什么 Trie 树(逃)~~
### 代码
``` cpp
#include <cstdio>
#include <cstring>
#include <cstdlib>
#include <vector>
#include <algorithm>
#include <cmath>
#include <cctype>
#include <iostream>
#include <bitset>
#include <map>
#include <string>
typedef std::map<std::string, int> Map;
Map map;
const int MAXN = 20005;
int ans[MAXN];
int main() {
    register int n, m;
    while (scanf("%d%d", &n, &m) != EOF && (n + m)) {
        register int cnt = 0;
        memset(ans, 0, sizeof(ans)), map.clear();
        for (register int i = 0; i < n; i++) {
            char s[25];
            scanf("%s", s);
            std::string a = s;
            ans[map[a]]--, map[a]++, ans[map[a]]++;
        }
        for (register int i = 1; i <= n; i++) printf("%d\n", ans[i]);
    }
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=718091&auto=1&height=66"></iframe>
