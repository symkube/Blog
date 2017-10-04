---
title: 「HDU 1251」统计难题
date: 2016-07-07 15:49:45
tags:
  - 字符串
  - Trie
categories:
  - OI
  - 字符串
  - Trie
---
## 统计难题
### 题目背景
[HDU 1251](http://acm.hdu.edu.cn/showproblem.php?pid=1251)
### 题目描述
Ignatius 最近遇到一个难题，老师交给他很多单词(只有小写字母组成，不会有重复的单词出现)，现在老师要他统计出以某个字符串为前缀的单词数量(单词本身也是自己的前缀)。
### 输入格式
输入数据的第一部分是一张单词表（不超过 $10^4$ 个单词），每行一个单词，单词的长度不超过 10，它们代表的是老师交给 Ignatius 统计的单词，一个空行代表单词表的结束。第二部分是一连串的提问，每行一个提问，每个提问都是一个字符串（不超过 $10^4$ 个提问串）。
注意:本题只有一组测试数据，处理到文件结束。
<!-- more -->
### 输出格式
对于每个提问，给出以该字符串为前缀的单词的数量。
### 样例数据 1
输入
``` bash
banana
band
bee
absolute
acm

ba
b
band
abc
```
输出
``` bash
2
3
1
0
```
### 分析
trie树,**注意处理输入中的空行**
### 源码
``` cpp
#include <algorithm>
#include <cstdio>
#include <cstring>
#include <iostream>
#define MAX 100005
using namespace std;
struct TRIE {
    int son[26];
    int num;
};
TRIE trie[MAX];
string str;
int tot;
inline void build_trie() {
    int position = 0;
    for (int i = 0; i < str.length(); i++) {
        if (!trie[position].son[str[i] - 'a'])
            trie[position].son[str[i] - 'a'] = ++tot;
        position = trie[position].son[str[i] - 'a'];
        trie[position].num++;
    }
}

inline int get_ans() {
    int position = 0;
    for (int i = 0; i < str.length(); i++) {
        if (!trie[position].son[str[i] - 'a']) return 0;
        position = trie[position].son[str[i] - 'a'];
    }
    return trie[position].num;
}
int main(int argc, char const *argv[]) {
    /* code */
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    while (getline(cin, str) && str[0] != '\0') build_trie();
    while (cin >> str) cout << get_ans() << "\n";
    return 0;
}
```
