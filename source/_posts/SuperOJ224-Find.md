---
title: 「SuperOJ 224」查找
date: 2016-07-27 21:03:24
tags:
  - 模拟
categories: 
  - OI
  - 模拟
---
## 查找
### 题目描述
中考成绩出来了，许多考生想知道自己成绩排名情况，于是考试委员会找到了你，让你帮助完成一个成绩查找程序，考生只要输入成绩，即可知道其排名及同名次的人有多少。
### 输入格式
第一行一个正整数 n（1<=n<=1500），表示一共有 n 个考生；
第二行一个正整数 k（1<=k<=n），表示一共有 k 个待查分数；
第三行 n 个数是以空格隔开的从大到小排列的 n 个学生成绩；
第四行 k 个数是待查的成绩。
### 输出格式
共输出 k 行，每行三个数，分别用一个空格隔开：第一个数为待查成绩所对应的名次；第二个数为同名次的人数；第三个数为分数高于该成绩的人数。
若查找不到，本行只输出一个单词“fail!”（fail后面加一个惊叹号，引号不输出）。
<!-- more -->
### 样例数据 1
#### 输入
``` bash
10
2
580 570 565 564 564 534 534 534 520 520
564 520
```
#### 输出
``` bash
4 2 3
6 2 8
```
### 分析
有点麻烦的模拟题,要分好几种情况,慢慢来就好,本来想用STL写的,结果写挂了...
### 源码
``` cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    int n, k, sum = 1, sl = 0, x = 0;
    int a[1600] = {0}, b[1600] = {0};
    cin >> n >> k;
    for (register int i = 1; i <= n; i++)
        cin >> a[i];
    for (register int i = 1; i <= k; i++)
        cin >> b[i];
    for (register int j = 1; j <= k; j++) {
        for (register int i = 1; i <= n; i++) {
            if (b[j] < a[i] && (a[i]^a[i + 1]))
                sum++;
            if (b[j] < a[i])
                x++;
            if (b[j] == a[i])
                sl++;
        }
        if (sl == 0)
            cout << "fail!\n";
        else
            cout << sum << " " << sl << " " << x << "\n";
        sum = 1, sl = 0, x = 0;
    }
    return 0;
}
```
