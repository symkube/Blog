---
title: 「HDU 1671」Phone List
date: 2016-07-07 13:49:06
tags:
  - 字符串
  - Trie
categories:
  - OI
  - 字符串
  - Trie
---
## Phone List
### 题目背景
[HDU 1671](http://acm.hdu.edu.cn/showproblem.php?pid=1671)
### 题目描述
给出一份电话号码列表，如果不存在有一个号码是另一个号码的前缀，我们就说这份电话号码列表是合法的。让我们看看如下号码列表：
1. Emergency  911
2. Alice  97625999
3. Bob  91125426

在这组号码中，我们不能拨通 Bob 的电话，因为当你按下 Bob 电话号码的前 $3$ 个数字 `911` 时，电话局会把你的拨号连接到 Emergency 的线路。

所以这组号码是不合法的。
<!-- more -->
### 输入格式
有多组输入数据。

第一行输入一个正整数 $t(1 \leq t \leq 40)$，表示数据组数。

每组数据第一行是一个正整数 $n(1 \leq n \leq 10000)$，表示电话号码的数量。

接下来有 $n$ 行，每行一个电话号码，每个电话号码是不超过 $10$ 位的连续数字。
### 输出格式
对每组数据，如果电话号码列表合法，则输出 `YES`，不合法则输出 `NO`。
### 样例数据 1
输入
``` bash
2
3
911
97625999
91125426
5
113
12340
123440
12345
98346
```
输出
``` bash
NO
YES
```
### 分析
trie树,**注意删除,否则MLE**
### 源码
``` cpp
#include <cstdio>
#include <cstring>
#include <iostream>
using namespace std;
struct node {
    int count;
    node *next[10];
    node() : count(0) { memset(next, 0, sizeof(next)); }
};
typedef node *pnode;
pnode root;
pnode b[10003];
int k = 0;
void insert(char *a) {
    int l = strlen(a);
    node *p = root;
    for (int i = 0; i < l; i++) {
        if (p->next[a[i] - '0'] == 0) p->next[a[i] - '0'] = new node;
        p = p->next[a[i] - '0'];
        p->count++;
    }
    b[k++] = p;
}
bool findprefix(int n) {
    for (int i = 0; i < k; i++)
        if (b[i]->count != 1) return true;
    return false;
}
void del(node *p) {
    if (p == 0) return;
    for (int i = 0; i < 10; i++) {
        del(p->next[i]);
    }
    delete p;
}
int t, n;
char str[11];
int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cin >> t;
    while (t--) {
        root = new node;
        k = 0;
        cin >> n;
        for (int i = 0; i < n; i++) cin >> str, insert(str);
        cout << (findprefix(n) ? "NO\n" : "YES\n");
        del(root);
    }
    return 0;
}
```
