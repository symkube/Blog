---
title: 「POJ 2001」Shortest Prefixes
date: 2016-06-26 11:59:20
tags:
  - 字符串
  - Trie
categories:
  - OI
  - 字符串
  - Trie
---
## Shortest Prefixes
### 题目背景
[POJ 2001](http://poj.org/problem?id=2001)
### 题目描述
给出 $n$ 个单词（$1 \leq n \leq 1000$），求出每个单词的非公共前缀，如果没有，则输出自己。
### 输入格式
输入 N 个单词，每行一个，每个单词都是由 1～20 个小写字母构成。
### 输出格式
输出 N 行，每行由一个空格的两部分，第一部分是输入的单词，第二部分是该单词在所有单词中的非公共前缀，如果没有，则输出自己。
<!-- more -->
### 样例数据 1
输入
``` bash
carbohydrate 
cart 
carburetor 
caramel 
caribou 
carbonic 
cartilage 
carbon 
carriage 
carton 
car 
carbonate
```
输出
``` bash
carbohydrate carboh 
cart cart 
carburetor carbu 
caramel cara 
caribou cari 
carbonic carboni 
cartilage carti 
carbon carbon 
carriage carr 
carton carto 
car car 
carbonate carbona
```
### C++代码
典型的trie树的运用,**注意删除的问题,否则可能MLE**
``` cpp
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <iostream>
#define MIN 30
#define MAX 1100
using namespace std;
/*节点*/
struct node {
    int count;
    node *next[MIN];
} * root; /*根节点*/
char str[MAX][MIN];
node *CreateNode() {
    node *p;
    /*分配内存*/
    p = (node *)malloc(sizeof(node));
    p->count = 1;
    for (int i = 0; i < 26; ++i) p->next[i] = NULL;
    return p;
}
/*释放节点*/
void release(node *p) {
    for (int i = 0; i < 26; ++i)
        if (p->next[i] != NULL) release(p->next[i]);
    free(p);
}
/*插入字符串*/
void insert(char *str) {
    int i = 0, k;
    node *p = root;
    while (str[i]) {
        k = str[i++] - 'a';
        if (p->next[k] == NULL)
            p->next[k] = CreateNode();
        else
            p->next[k]->count++;
        p = p->next[k];
    }
}
/*搜索*/
void search(char *str) {
    int i = 0, k, j;
    bool flag = false;
    node *p = root;
    while (str[i] && !flag) {
        k = str[i++] - 'a';
        p = p->next[k];
        if (p->count == 1) {
            flag = true;
            cout << str << " ";
            for (j = 0; j < i; ++j) cout << str[j];
            cout << "\n";
        }
    }
    if (!flag) cout << str << " " << str << "\n";
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    root = CreateNode();
    int i;
    for (i = 0; cin >> str[i]; ++i) insert(str[i]);
    for (int j = 0; j < i; ++j) search(str[j]);
    release(root);
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=745158&auto=1&height=66"></iframe>