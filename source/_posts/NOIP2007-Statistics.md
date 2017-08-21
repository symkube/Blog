---
title: 「NOIP 2007」统计数字
date: 2016-05-24 15:19:28
tags:
  - 排序
categories:
  - oi
  - 排序
---
## 统计数字
### 题目背景
NOIP 2007提高组试题1。
### 题目描述
某次科研调查时得到了 $n$ 个自然数，每个数均不超过 $1500000000(1.5 \times 10^9)$。已知不相同的数不超过 $10000$ 个，现在需要统计这些自然数各自出现的次数，并按照自然数从小到大的顺序输出统计结果。
### 输入格式
输入文件包含 $n + 1$ 行：
第 $1$ 行是整数 $n$，表示自然数的个数。  
第 $2$ ~ $n+1$ 行每行一个自然数。
### 输出格式
输出文件包含 $m$ 行（$m$ 为 $n$ 个自然数中不相同数的个数），按照自然数从小到大的顺序输出。每行输出两个整数，分别是自然数和该数出现的次数，其间用一个空格隔开。
<!-- more -->
### 样例数据 1
输入
``` bash
8
2
4
2
4
5
100
2
100
```
输出
``` bash
2 3
4 2
5 1
100 2
```
### 备注
#### 数据范围
$40 \%$ 的数据满足：$1 \leq n \leq 1000$
$80 \%$ 的数据满足：$1 \leq n \leq 50000$
$100 \%$ 的数据满足：$1 \leq n \leq 200000$，每个数均不超过 $1500000000(1.5 \times 10^9)$
### 源码
``` cpp
#include <algorithm>
#include <cstdio>
#define MAXN 200010
using namespace std;
int num[MAXN];
int main() {
    int n, bri = 0, sum = 1;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) scanf("%d", &num[i]);
    sort(&num[1], &num[1] + n);
    for (int i = 2; i <= n; i++) {
        if (num[i] != num[i - 1]) {
            printf("%d %d\n", num[i - 1], sum);
            sum = 1;
        } else
            sum++;
    }
    printf("%d %d\n", num[n], sum);
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=832877&auto=1&height=66"></iframe>