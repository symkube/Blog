---
title: 「SuperOJ 404」系列操作I
date: 2016-07-22 20:43:36
tags:
  - 数据结构
  - 线段树
categories:
  - OI
  - 数据结构
  - 线段树
---
## 系列操作Ⅰ
### 题目描述
给出序列 $a_1,a_2, \cdots ,a_n(0 \leq a_i \leq 10^9)$，有关于序列的两种操作：
1. $a_i(1 \leq i \leq n)$ 加上 $x(-10^3 \leq x \leq 10^3)$
2. 求 $max \{ a_l, a_{l+1}, \cdots ,a_r \} (1 \leq l \leq r \leq n)$

### 输入格式
第一行包含两个数 $n(1 \leq n \leq 10^5)$ 和 $m(1 \leq m \leq 10^5)$,表示序列长度和操作次数。
接下来一行 $n$ 个数，以空格隔开，表示 $a_1, a_2, \cdots, a_n$。
接下来 $m$ 行，每行为以下两种格式之一。

`0 i x`，表示 $a_i$ 加上 $x$。

`1 l r`，求 $max\{ a_l,a_{l+1}, \cdots, a_r \}$。
### 输出格式
对于每次询问，输出单独一行表示答案。
<!-- more -->
### 样例数据 1
#### 输入
``` bash
5 3
1 2 3 4 5
1 1 5
0 5 -5
1 1 5
```
#### 输出
``` bash
5
4
```
#### 分析
线段树模板...

### 源码
``` cpp
#include <bits/stdc++.h>
#define MAX_N 100010
typedef long long Long;
using namespace std;
int n, m, a[MAX_N];
long long tree[MAX_N * 4];

void build(int k, int s, int t) {
    if (s == t) {
        tree[k] = a[s];
        return;
    }
    int mid = s + t >> 1;
    build(k << 1, s, mid);
    build(k << 1 | 1, mid + 1, t);
#define update(k) tree[k] = max(tree[k << 1], tree[k << 1 | 1])
    update(k);
}

void modify(int k, int s, int t, int p, int x) {
    if (s == t) {
        tree[k] += x;
        return;
    }
    int mid = s + t >> 1;
    if (p <= mid)
        modify(k << 1, s, mid, p, x);
    else
        modify(k << 1 | 1, mid + 1, t, p, x);
    update(k);
}

long long query(int k, int s, int t, int l, int r) {
    if (l <= s && t <= r) return tree[k];
    int mid = s + t >> 1;
    long long ret = -1000000000000LL;
    if (l <= mid) ret = max(ret, query(k << 1, s, mid, l, r));
    if (mid < r) ret = max(ret, query(k << 1 | 1, mid + 1, t, l, r));
    return ret;
}

int main() {
    cin >> n >> m;
    for (int i = 0; i < n; i++) cin >> a[i + 1];
    build(1, 1, n);
    while (m--) {
        int ctrl, i, x, l, r;
        cin >> ctrl;
        if (ctrl == 0) {
            cin >> i >> x;
            modify(1, 1, n, i, x);
        } else {
            cin >> l >> r;
            cout << query(1, 1, n, l, r) << "\n";
        }
    }
    return 0;
}
```
