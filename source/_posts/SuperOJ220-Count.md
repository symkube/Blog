---
title: 「SuperOJ 220」选票统计
date: 2016-07-27 20:51:27
tags:
  - 排序
categories: 
  - oi
  - 排序
---
## 选票统计
### 题目描述
国际运动协会组织了一个评选n佳运动员的活动。对 n 个运动员从 1 到 n 进行编号，然后评委们开始投票，最后根据不同的得票数，颁发不同的奖项。
现在组织者想知道投票后，这n个运动员分别获得的票数，请你帮他完成统计工作。
<!-- more -->
### 输入格式
输入文件第一行是一个整数 n（1 \leq n \leq 1000），表示有 n 个运动员。
输入文件第二行是一组以空格隔开的选票，选票值为 1 到 n 范围类的整数，以 -1 为数据的结尾标志。选票的数量不超过 longint 范围。
### 输出格式
输出文件有 n 行。每行是用空格隔开的两个整数，分别表示编号和这个编号的得票数。
### 样例数据 1
#### 输入
``` bash
3
3 1 2 3 2 1 2 3 1 2 2 1 2 3 3 -1
```
#### 输出
``` bash
1 4
2 6
3 5
```
### 备注
####【样列说明】
1 4    (表示编号为1的运动员得票数是4张)
2 6    (表示编号为2的运动员得票数是6张)
3 5    (表示编号为3的运动员得票数是5张)
### 分析
桶排裸题
### 源码
``` cpp
#include <bits/stdc++.h>
using namespace std;
map<int, int> m;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    int n, tmp;
    cin >> n;
    while (cin >> tmp, tmp != -1) m[tmp]++;
    for (int i = 1; i <= n; i++) cout << i << " " << m[i] << "\n";
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=27643981&auto=1&height=66"></iframe>