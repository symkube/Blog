---
title: 「POJ-1204」Word Puzzles-AC自动机
date: 2017-01-02 17:19:14
tags:
  - 字符串
  - AC自动机
categories:
  - OI
  - 字符串
  - AC自动机
---
给出一个字母地图和一些字符串，请你找出每个字符串的第一个字母在地图中的位置和该字符串的方向。
假设地图左上角为原点（0,0）。可能的方向有8个，从北开始顺时针方向依次编号A～H，北方编号为“A”。
<!-- more -->
### 链接
[POJ-1204](http://poj.org/problem?id=1204)
### 题解
题意就是是在一个矩阵中查找单词，并且有8个方向，从这个矩阵四周的每个点开始.每个点八个方向扫过去，并在树中查找，八个方向就定义一个二维数组，存下八个方向的 $x,y$ 的走势就好了。

**注意边界的判断**
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
#include <queue>
#include <climits>
const int INF = INT_MAX >> 1;
const int MAXN = 1000 + 10;
char s[MAXN][MAXN], b[MAXN];
int n, m, w;
int dir[8][2] = {0, 1, 0, -1, 1, 0, -1, 0, 1, 1, -1, -1, 1, -1, -1, 1};
char ch[9] = "CGEADHFB";
int pos[MAXN][3];
struct Node {
    int id;
    Node *next[26], *fail;
    Node() { id = 0, fail = 0, memset(next, 0, sizeof(next)); }
} *root;
inline void insert(const char *s, int id) {
    register int len = strlen(s) - 1;
    Node *p = root;
    while (len >= 0) {
        if (!p->next[s[len] - 'A']) p->next[s[len] - 'A'] = new Node;
        p = p->next[s[len--] - 'A'];
    }
    p->id = id;
}
inline void build() {
    Node *p = root, *next;
    std::queue<Node *>q;
    q.push(root);
    while (!q.empty()) {
        p = q.front(), q.pop();
        for (register int i = 0; i < 26; ++i) {
            if (p->next[i]) {
                next = p->fail;
                while (next && !next->next[i]) next = next->fail;
                p->next[i]->fail = (next ? next->next[i] : root), q.push(p->next[i]);
            }
        }
    }
}
inline void query(int x, int y, int d, int id) {
    Node *p = root, *next;
    while (x >= 0 && y >= 0 && x < n && y < m) {
        while (p && !p->next[s[x][y] - 'A']) p = p->fail;
        next = p = (p ? p->next[s[x][y] - 'A'] : root);
        while (next != root) {
            if (next->id) {
                register int k = next->id;
                if (pos[k][0] > x || (pos[k][0] == x && pos[k][1] > y)) pos[k][0] = x, pos[k][1] = y, pos[k][2] = id;
            }
            next = next->fail;
        }
        x += dir[d][0], y += dir[d][1];
    }
}
inline void clear(Node *p) {
    for (register int i = 0; i < 26; ++i) if (p->next[i]) clear(p->next[i]);
    delete p;
}

int main() {
    std::ios::sync_with_stdio(0), std::cin.tie(0);
    while (std::cin >> n >> m >> w) {
        root = new Node;
        for (register int i = 0; i < n; ++i) std::cin >> s[i];
        for (register int i = 1; i <= w; ++i) std::cin >> b, insert(b, i), pos[i][0] = pos[i][1] = INF;
        build();
        for (register int i = 0; i < n; ++i) {
            query(i, 0, 0, 1), query(i, m - 1, 1, 0);
            query(i, 0, 7, 6), query(i, m - 1, 6, 7);
            query(i, 0, 4, 5), query(i, m - 1, 5, 4);
        }
        for (register int i = 0; i < m; ++i) {
            query(0, i, 2, 3), query(n - 1, i, 3, 2);
            query(0, i, 6, 7), query(n - 1, i, 7, 6);
            query(0, i, 4, 5), query(n - 1, i, 5, 4);
        }
        for (register int i = 1; i <= w; ++i) std::cout << pos[i][0] << ' ' << pos[i][1] << ' ' << ch[pos[i][2]] << "\n";
        clear(root);
    }
    return 0;
}
```

