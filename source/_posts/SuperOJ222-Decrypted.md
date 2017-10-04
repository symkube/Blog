---
title: 「SuperOJ 222」破译密码
date: 2016-07-27 20:58:35
tags:
  - 排序
categories: 
  - OI
  - 排序
---
## 破译密码
### 题目描述
抗日战争中，中方截获日方的信息由 n（n \leq 30000）个非负整数组成，其中每个数字都在 int 范围内。因为是日军的高端秘密，所以一时不能破获。最原始的想法就是对这 n 个数进行从小到大排序，对排序后的数按顺序依次从 1～n 进行编号，然后请你输出编号为 i 的数。
<!-- more -->
### 输入格式
第一行 n ，表示下面有 n 个截获的数字。
第二行是 n 个截获的数字，相邻两个数字之间用一个空格隔开。
第三行是一个整数 k，表示后面有 k 个询问。
从第四行开始，有 k 行，每行是排序后一个数的编号。
### 输出格式
对 k 行的每一个编号，在输出文件中输出每个编号对应的排序后的数字，每行一个。
### 样例数据 1
#### 输入
``` bash
5
121 1 126 123 7
3
2
4
3
```
#### 输出
``` bash
7
123
121
```
### 分析
排序...
### 源码
``` cpp
#include <algorithm>
#include <cstdio>
#include <iostream>
using namespace std;
int n, k;
int main(int argc, char const *argv[]) {
    /* code */
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cin >> n;
    int *arr = new int[n];
    for (int i = 0; i < n; i++) cin >> arr[i];
    sort(arr, arr + n);
    cin >> k;
    int tmp;
    for (int i = 0; i < k; i++) {
        cin >> tmp;
        cout << arr[tmp - 1] << "\n";
    }
    return 0;
}
```
