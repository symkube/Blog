---
title: 「SuperOJ 2」军事机密
date: 2016-05-24 12:29:15
tags:
  - oi
categories:
  - oi
  - 排序
---
## 军事机密
### 题目描述
军方截获的信息由 $N(1 \leq N \leq 30000)$ 个整数组成，因为是敌国的高端秘密，所以一时不能破获。最原始的想法就是对这 $N$ 个整数进行小到大排序。排序后每个数都对应一个序号，然后对第 $i$ 个是什么数感兴趣，现在要求编程完成。
### 输入格式
第一行整数 $N$。
第二行是 $N$ 个截获的数字，相邻数字由一个空格隔开。
第三行是一个数字 $K (1 \leq K \leq N)$。
从第四行开始，共有 $K$ 个排序后的序号 $X_1, X_2, X_3, \cdots X_k$，每行一个。
### 输出格式
输出数据有 $K$ 行，每行一个整数。这个整数就是每个序号 $X_i$ 对应的数。
<!-- more -->
### 样例数据 1
输入
``` bash
5
121 1 126 123 7
3
2
4
3
```
输出
``` bash
7
123
121
```
### 备注
#### 样例注释
`2` 号对应的数是 $7$; `4` 号对应的数是 $123$; `3` 号对应的数是 $121$;
### 源码
``` cpp
#include <algorithm>
#include <cctype>
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <ctime>
#include <iostream>
#include <sstream>
#include <string>
#define MAX 30000
using namespace std;
int arr[MAX];
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    sort(arr, arr + n);
    cin >> n;
    for (int i = 0, tmp = 0; i < n; i++) {
        cin >> tmp;
        cout << arr[tmp - 1] << "\n";
    }
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=874229&auto=1&height=66"></iframe>