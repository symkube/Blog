---
title: 「SuperOJ 7」众数
date: 2016-05-24 15:23:06
tags:
  - 排序
categories:
  - OI
  - 排序
---
## 众数
### 题目描述
由文件给出 $N$ 个 $1$ 到 $30000$ 间无序数正整数，其中 $1 \leq N \leq 10000$，同一个正整数可能会出现多次，出现次数最多的整数称为众数。求出它的众数及它出现的次数。
### 输入格式
输入文件第一行是正整数的个数 $N$，第二行开始为 $N$ 个正整数。
### 输出格式
输出文件有若干行，每行两个数，第 $1$ 个是众数，第 $2$ 个是众数出现的次数。
<!-- more -->
### 样例数据 1
输入
``` bash
12
2 4 2 3 2 5 3 7 2 3 4 3
```
输出
``` bash
2 4
3 4
```
### 源码
``` cpp
#include <algorithm>
#include <cstdio>
#include <cstring>
#include <iostream>
#define MAX 30000
using namespace std;
struct number {
    int num;
    int count;
} numbers[MAX];
inline bool comparator(const number& n1, const number& n2) {
    if (n1.count != n2.count) return n1.count > n2.count;
    return n1.num < n2.num;
}
int main() {
    int tmp;
    cin >> tmp;
    while (cin >> tmp) {
        numbers[tmp].num = tmp;
        numbers[tmp].count++;
    }
    sort(numbers, numbers + MAX, comparator);
    for (int i = 0; i < MAX; i++) {
        if (i > 0)
            if (numbers[i - 1].count > numbers[i].count) break;
        cout << numbers[i].num << " " << numbers[i].count << "\n";
    }
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=412785212&auto=1&height=66"></iframe>