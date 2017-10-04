---
title: 「NOIP 2007」奖学金
date: 2016-05-24 14:04:26
tags:
  - 排序
categories:
  - OI
  - 排序
---
## 奖学金
### 题目背景
NOIP2007 普及组试题1
### 题目描述
某小学最近得到了一笔赞助，打算拿出其中一部分为学习成绩优秀的前 $5$ 名学生发奖学金。期末，每个学生都有 $3$ 门课的成绩：语文,数学,英语。先按总分从高到低排序，如果两个同学总分相同，再按语文成绩从高到低排序，如果两个同学总分和语文成绩都相同，那么规定学号小的同学排在前面，这样，每个学生的排序是唯一确定的。

任务：先根据输入的 $3$ 门课的成绩计算总分，然后按上述规则排序，最后按排名顺序输出前 $5$ 名学生的学号和总分。
<!-- more -->
### 输入格式
输入文件包含 $n + 1$ 行：
第 $1$ 行为一个正整数 $n$，表示该校参加评选的学生人数。
第 $2$ 到 $n + 1$ 行，每行有 $3$ 个用空格隔开的数字，每个数字都在 $0$ 到 $100$ 之间。第 $j$ 行的 $3$ 个数字依次表示学号为 $j - 1$ 的学生的语文,数学,英语的成绩。每个学生的学号按照输入顺序编号为 $1$ ~ $n$（恰好是输入数据的行号减1）。 所给的数据都是正确的，不必检验。
### 输出格式
输出文件共有 $5$ 行，每行是两个用空格隔开的正整数, 依次表示前5名学生的学号和总分。
### 样例数据 1
输入
``` bash
6
90 67 80
87 66 91
78 89 91
88 99 77
67 89 64
78 89 98
```
输出
``` bash
6 265
4 264
3 258
2 244
1 237
```
### 样例数据 2
输入
``` bash
8
80 89 89
88 98 78
90 67 80
87 66 91
78 89 91
88 99 77 
67 89 64 
78 89 98
```
输出
``` bash
8 265
2 264
6 264
1 258
5 258
```
### 备注
#### 【数据范围】
$50 \%$ 的数据满足：各学生的总成绩各不相同。
$100 \%$ 的数据满足：$6 \leq n \leq 300$。
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

using namespace std;
struct student {
    int Math, Chinese, English;
    int num;
    int score;
};
inline bool comparator(const student& s1, const student& s2) {
    if (s1.score != s2.score)
        return s1.score > s2.score;
    else if (s1.Chinese != s2.Chinese)
        return s1.Chinese > s2.Chinese;
    return s1.num < s2.num;
}
int main() {

    int num;
    cin >> num;
    int Math, English, Chinese;
    student* s = new student[num];
    for (int i = 0; i < num; i++) {
        cin >> Chinese >> Math >> English;
        s[i].Chinese = Chinese;
        s[i].Math = Math;
        s[i].English = English;
        s[i].score = Chinese + Math + English;
        s[i].num = i + 1;
    }
    sort(s, s + num, comparator);
    for (int i = 0; i < 5; i++) cout << s[i].num << " " << s[i].score << "\n";
    delete[] s;
    return 0;
}
```
