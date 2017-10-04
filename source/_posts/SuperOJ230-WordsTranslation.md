---
title: 「SuperOJ 230」单词翻译
date: 2016-06-29 22:44:23
tags:
  - 字符串
  - STL
categories: 
  - OI
  - STL
---
## 单词翻译
### 题目描述
众所周知，Mr.Zeng 不会说英语，他会使用 $A$ 语言。因为我们的国家已经加入世贸组织，他感受到了压力，已经在开始学习英语。现在需要你用计算机来帮助他做一些翻译工作。
### 输入格式
输入 $N(1 \leq N \leq 100005)$ 个词典条目，每个字典条目占一行，分别包含一个英语单词,一个空格和一个该英语单词对应的A语言单词。词典中每个 $A$ 语言单词出现一次。

接着一个空行。

然后是多达 $M(1 \leq M \leq 100005)$ 个需要翻译的A语言单词，每行一个单词。

输入的每个单词最多 $10$ 个小写字母。 
<!-- more -->
### 输出格式
对于每个 $A$ 语言单词，请你在输入的词典中找出它对应的英语单词，每行一个单词。

如果 $A$ 语言单词在词典中没出现，就输出 `eh`。
### 样例数据 1
输入
``` bash
dog ogday
cat atcay
pig igpay
froot ootfray
loops oopslay

atcay
ittenkay
oopslay
```
输出
``` bash
cat
eh
loops
```
### 分析
这道题其实就是查找一个对应关系,有些同学用了trie树,但map就足够了(虽然有HashMap更好),而且代码量少得多，**注意数据量100005**,map是用红黑树实现的,它可以在 $O(\log n)$ 时间内做查找，插入和删除,即使 STL 不优化很慢,也不会超时。
**注意处理输入中的空行**
### 源码
``` cpp
#include <algorithm>
#include <cmath>
#include <cstdio>
#include <iostream>
#include <map>
#include <string>
using namespace std;
map<string, string> m;
string word, a_word, str;
int main(int argc, char const *argv[]) {
    /* code */
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    while (true) {
        /*处理读入*/
        getline(cin, str);
        /*判断是否为空行*/
        if (str == "") break;
        /*拆分单词,利用sting.substr(pos,len)*/
        int pos = str.find(" ");
        word = str.substr(0, pos + 1);
        a_word = str.substr(pos + 1, str.length() - pos);
        /*直接用了[],insert应该会更快*/
        m[a_word] = word;
    }
    while (cin >> a_word) {
        word = m[a_word];
        /*如果 A 语言单词在词典中没出现，就输出“eh”*/
        cout << (word == "" ? "eh" : word) << "\n";
    }
    return 0;
}
```
