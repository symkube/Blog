---
title: 「SuperOJ 405」系列操作II
date: 2016-07-22 20:46:25
tags:
  - 数据结构
  - 线段树
categories:
  - oi
  - 数据结构
  - 线段树
---
## 系列操作Ⅱ
### 题目描述
给出数列 $a_1, a_2,\cdots,a_n(0 \leq a_i \leq 10 ^ 9)$，有关序列的两种操作。
1. $a_l, a_{ l + 1 }, \cdots, a_r(1 \leq l \leq r \leq n)$ 加上 $x(-10 ^ 3 \leq x \leq 10 ^ 3)$
2. 求 $a_i(1 \leq i \leq n)$

### 输入格式
第一行包含两个数 $n(1 \leq n \leq 10 ^ 5)$ 和 $m(1 \leq m \leq 10 ^ 5)$，表示序列的长度和操作次数。

接下来的一行有 $n$ 个数，以空格隔开，表示 $a_1, a_2, \cdots, a_n$。

接下来的 $m$ 行，每行为有以下两种格式之一：

0 1 r x ，表示 $a_l, a_{l+1},\cdots,a_r$ 加上 $x$。

1 i ，求 $a_i$。
### 输出格式
对于每次询问，输出单独一行表示答案。
<!-- more -->
### 样例数据 1
#### 输入
``` bash
5 3
1 2 3 4 5
1 5
0 1 5 -7
1 5
```
#### 输出
``` bash
5
-2
```
#### 分析
线段树模板...

### 源码
``` cpp
#include <bits/stdc++.h>
#define MAX_N 100010
using namespace std;
char ch_buffer;
bool signum;
inline void readInt(int &l) {
    l = 0;
    do
        ch_buffer = cin.get();
    while ((ch_buffer < '0' || ch_buffer > '9') && ch_buffer != '0' &&
           ch_buffer != '-');
    if (ch_buffer == '-') ch_buffer = cin.get(), signum = true;
    while (ch_buffer <= '9' && ch_buffer >= '0')
        l = (l << 3) + (l << 1) + ch_buffer - '0', ch_buffer = cin.get();
    if (signum) l = -l, signum = false;
}
int n, m;
int a[MAX_N], tree[MAX_N << 2];
#define update(k) \
    if (tree[k])  \
    tree[k << 1] += tree[k], tree[k << 1 | 1] += tree[k], tree[k] = 0
void modify(int k, int s, int t, int l, int r, int x) {
    if (l <= s && t <= r) {
        tree[k] += x;
        return;
    }
    register int mid = s + t >> 1;
    update(k);
    if (l <= mid) modify(k << 1, s, mid, l, r, x);
    if (mid < r) modify(k << 1 | 1, mid + 1, t, l, r, x);
}
int query(int k, int s, int t, int p) {
    if (s == t) return tree[k] + a[s];
    int mid = s + t >> 1;
    update(k);
    return p <= mid ? query(k << 1, s, mid, p)
                    : query(k << 1 | 1, mid + 1, t, p);
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    readInt(n), readInt(m);
    for (register int i = 1; i <= n; i++) readInt(a[i]);
    for (register int j = 0, flag, l, r, x, i; j < m; j++) {
        readInt(flag);
        if (flag == 0)
            readInt(l), readInt(r), readInt(x), modify(1, 1, n, l, r, x);
        else
            readInt(i), cout << query(1, 1, n, i) << "\n";
    }
    return 0;
}
```

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=784835&auto=1&height=66"></iframe>