---
title: 树状数组
date: 2016-05-24 20:52:20
tags:
  - 树状数组
  - 逆序对
  - 数据结构
  - 学习笔记
categories: 
  - OI
  - 数据结构
  - 树状数组
---
## 树状数组求逆序对

### 树状数组
[树状数组(Binary Indexed Tree(BIT), Fenwick Tree)](https://en.wikipedia.org/wiki/Fenwick_tree) 是一个查询和修改复杂度都为 $O(\log n)$ 的数据结构。主要用于查询任意两位之间的所有元素之和，但是每次只能修改一个元素的值；
经过简单修改可以在 $O(\log n)$ 的复杂度下进行范围修改，但是这时只能查询其中一个元素的值。
<!-- more -->
### 计算 $2 ^ x$ lowbit

``` cpp
/**
 *利用机器的补码原理,计算节点管辖的区间 (2 ^ x), x 为 k 右起第一个 1 的位置
 *@ param k k
 *@ return 2 ^ x
 */
int lowbit(int k) {
    return k & (-k);
}
```
### 计算前 k 项的和
``` cpp
/**
 *1~k的区间和
 *@ param k k
 *@ return 和
 */
int sum(int k) {
    int tmp = 0;  
    while (k) {
        tmp += tree[k];  
        k -= lowbit(k);  
    }
    return tmp;  
}
```
### 修改元素
``` cpp
/**
 *修改元素
 *@ param k 位置pos
 *@ param num修改的值(求逆序对时常为1)
 */
void add(int k, int num = 1) {  
    while (k <= n) {  
        tree[k] += num;  
        k += lowbit(k);  
    }  
}  
```
### 求逆序对
``` java
for(int i = 数组起始位置; i < 元素个数; i++) {
    add(数组[i]);
    计数器 += i - sum(数组[i]);
}
```
## 「NOIP 2013」火柴排队
### 题目背景
NOIP2013 提高组 Day1 试题
### 题目描述
涵涵有两盒火柴，每盒装有 $n$ 根火柴，每根火柴都有一个高度。现在将每盒中的火柴各
自排成一列，同一列火柴的高度互不相同，两列火柴之间的距离定义为：
$$\sum_{i = 1} ^ n (a_i - b_i) ^ 2$$
其中 $a_i$ 表示第一列火柴中第 $i$ 个火柴的高度，$b_i$ 表示第二列火柴中第 $i$ 个火柴的高度。
每列火柴中相邻两根火柴的位置都可以交换，请你通过交换使得两列火柴之间的距离最
小。请问得到这个最小的距离，最少需要交换多少次？如果这个数字太大，请输出这个
最小交换次数对 $99999997$ 取模的结果。 
### 输入格式
共三行，第一行包含一个整数 $n$，表示每盒中火柴的数目。 

第二行有 $n$ 个整数，每两个整数之间用一个空格隔开，表示第一列火柴的高度。 

第三行有 $n$ 个整数，每两个整数之间用一个空格隔开，表示第二列火柴的高度。 
### 输出格式
输出共一行，包含一个整数，表示最少交换次数对 $99999997$ 取模的结果。
### 样例数据 1
输入
``` bash
4 
2 3 1 4 
3 2 1 4
```
输出
``` bash
1
```
### 样例数据 2
输入
``` bash
4 
1 3 4 2 
1 7 2 4
```
输出
``` bash
2
```
### 备注
**样例1说明**

最小距离是 $0$，最少需要交换 $1$ 次，比如：交换第 $1$ 列的前 $2$ 根火柴或者交换第 $2$ 列的前 $2$ 根火柴。

**样例2说明**

最小距离是 $10$，最少需要交换 $2$ 次，比如：交换第 $1$ 列的中间 $2$ 根火柴的位置，再交换第 $2$ 列中后 $2$ 根火柴的位置。 
### 代码
``` cpp
/*using Binary Indexed Tree(BIT)
 *21/05/2016
 */
#include <algorithm>
#include <cstdio>
#include <cstring>
#include <iostream>
#define mod 99999997
using namespace std;
inline int read() {
    int x = 0, f = 1;
    char ch = getchar();
    while (ch < '0' || ch > '9') {
        if (ch == '-') f = -1;
        ch = getchar();
    }
    while (ch >= '0' && ch <= '9') {
        x = x * 10 + ch - '0';
        ch = getchar();
    }
    return x * f;
}
int n, ans;
int t[100005], rank[100005];
struct data {
    int v, num;
} a[100005], b[100005];
inline bool cmp1(data a, data b) { return a.v < b.v; }
inline bool cmp2(data a, data b) { return a.num < b.num; }
inline int lowbit(int x) { return x & (-x); }
inline int ask(int x) {
    int tmp = 0;
    for (int i = x; i; i -= lowbit(i)) tmp += t[i];
    return tmp;
}
void update(int x) {
    for (int i = x; i <= n; i += lowbit(i)) t[i]++;
}
int main() {
    n = read();
    for (int i = 1; i <= n; i++) {
        a[i].v = read();
        a[i].num = i;
    }
    for (int i = 1; i <= n; i++) {
        b[i].v = read();
        b[i].num = i;
    }
    sort(a + 1, a + n + 1, cmp1);
    sort(b + 1, b + n + 1, cmp1);
    for (int i = 1; i <= n; i++) rank[a[i].num] = b[i].num;
    sort(a + 1, a + n + 1, cmp2);
    for (int i = 1; i <= n; i++) {
        update(rank[i]);
        ans = (ans + i - ask(rank[i])) % mod;
    }
    printf("%d", ans);
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=785902&auto=1&height=66"></iframe>