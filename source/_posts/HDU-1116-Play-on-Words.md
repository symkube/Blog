---
title: 「HDU-1116」Play on Words-欧拉回路
date: 2017-01-01 19:34:22
tags:
  - 图论
  - 欧拉回路
categories:
  - OI
  - 图论
  - 欧拉回路
---
Some of the secret doors contain a very interesting word puzzle. The team of archaeologists has to solve it to open that doors. Because there is no other way to open the doors, the puzzle is very important for us.
<!-- more -->
There is a large number of magnetic plates on every door. Every plate has one word written on it. The plates must be arranged into a sequence in such a way that every word begins with the same letter as the previous word ends. For example, the word `acm` can be followed by the word `motorola`. Your task is to write a computer program that will read the list of words and determine whether it is possible to arrange all of the plates in a sequence (according to the given rule) and consequently to open the door.
### 链接
[HDU-1116](http://acm.hdu.edu.cn/showproblem.php?pid=1116)
### 题解
这是道关于欧拉回路的问题, 最前面的字母是起点,最后的字母是终点. 一个有向图,要想能构成欧拉路径,首先必须是联通的.所以用并查集判断是不是一个祖先来判断是否是完全联通的图，其次要保证,它的出度和入度要全相等或者恰好两个(起点和终点)的时候出入度差值可以为一.
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
const int MAXN = 1000 + 5;
int fa[256];
inline int get(int x) { return fa[x] != x ? fa[x] = get(fa[x]) : x; }
int vis[256], deg[256];
inline void solve() {
    int n;
    char word[MAXN];
    scanf("%d", &n);
    memset(vis, 0, sizeof(vis));
    memset(deg, 0, sizeof(deg));
    for (int ch = 'a'; ch <= 'z'; ch++) fa[ch] = ch;
    int charCount = 26;
    for (register int i = 0; i < n; i++) {
        scanf("%s", word);
        char chead = word[0], ctail = word[strlen(word) - 1];
        deg[chead]++;
        deg[ctail]--;
        vis[chead] = vis[ctail] = 1;
        int s1 = get(chead), s2 = get(ctail);
        if (s1 != s2) {
            fa[s1] = s2; charCount--;
        }
    }
    std::vector<int> g;
    for (int ch = 'a'; ch <= 'z'; ch++) {
        if (!vis[ch]) charCount--;
        else if (deg[ch] != 0) g.push_back(deg[ch]);
    }
    bool valid = false;
    if (charCount == 1 && (g.empty() || (g.size() == 2 && (g[0] == 1 || g[0] == -1)))) valid = true;
    if (valid) printf("Ordering is possible.\n");
    else printf("The door cannot be opened.\n");
}
int main() {
#ifndef ONLINE_JUDGE
    freopen("in.in", "r", stdin);
#endif
    int T;
    scanf("%d", &T);
    while (T--) solve();
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=28581725&auto=1&height=66"></iframe>
