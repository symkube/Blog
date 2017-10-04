---
title: 「SuperOJ 773」集合的运算
date: 2016-08-01 08:51:42
tags:
  - STL
  - 模拟
categories:
  - OI
  - STL
---
### 题目描述
在计算机科学应用中，我们经常要用到集合的运算，集合的运算操作有很多，下面是我们给出的集合基本运算定义：
（1）“∪”运算：设 S，T 是 2 个集合，那么 S∪T 是由 S 和 T 的元素组成的集合。
（2）“-”运算：设 S，T 是 2 个集合，那么 S-T 是由 S 中非 T 中的元素组成的集合。
（3）“∩”运算：设 S，T 是 2 个集合，那么 S∩T 是由既是 S 又是 T 的元素组成的集合。
<!-- more -->
（4）“⊕” 运算：设 S，T 是 2 个集合，那么 S⊕T 是由 S 中不是 T 中的元素和 T 中不是 S 中的元素组成的集合。
例如，S={1，2，3，4}，T={3，4，5，6}，那么：
S∪T={1，2，3，4，5，6}
S-T={1，2}
S∩T={3，4}
S⊕T={1，2，5，6}
你的任务就是：对于输入文件中给出的正整数集合 S,T ，编程求出 S∪T，S-T，S∩T 和 S⊕T。
### 输入格式
第 1 行，为集合 S 的各元素；
第 2 行，为集合 T 的各元素；
每行数据之间用空格分开，集合元素的个数 \leq 10000，各正整数在 1 到 30000 之间。
### 输出格式
第 1 行为集合 S∪T；
第 2 行为集合 S-T；
第 3 行为集合 S∩T；
第 4 行为集合 S⊕T。
要求：集合的元素按由小到大顺序输出，正整数之间用空格分开；如果是空集，则输出 -1 。
### 样例数据 1
#### 输入 
``` bash
9 3 7 6 5
10 5 4 3 2 7
```
#### 输出
``` bash
2 3 4 5 6 7 9 10
6 9
3 5 7
2 4 6 9 10
```
### 分析
此题我只能说STL大法好...
### 源码
``` cpp
#include <bits/stdc++.h>
using namespace std;
set<int> s1, s2;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    int tmp;
    while (cin >> tmp) {
        s1.insert(tmp);
        if ((cin.peek() == '\n') || (cin.peek() == '\r')) break;
    }
    while (cin >> tmp) {
        s2.insert(tmp);
        if ((cin.peek() == '\n') || (cin.peek() == '\r')) break;
    }
    set_union(s1.begin(), s1.end(), s2.begin(), s2.end(),
              ostream_iterator<int>(cout, " "));
    cout << "\n";
    set_difference(s1.begin(), s1.end(), s2.begin(), s2.end(),
                   ostream_iterator<int>(cout, " "));
    cout << "\n";
    set_intersection(s1.begin(), s1.end(), s2.begin(), s2.end(),
                     ostream_iterator<int>(cout, " "));
    cout << "\n";
    set_symmetric_difference(s1.begin(), s1.end(), s2.begin(), s2.end(),
                             ostream_iterator<int>(cout, " "));
    return 0;
}
```
