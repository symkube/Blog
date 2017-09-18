---
title: 「TJOI 2013」单词
date: 2016-07-26 21:24:19
tags:
  - 字符串
  - AC自动机
categories: 
  - OI
  - 字符串
  - AC自动机
---
## 单词
### 题目背景
TJOI2013 DAY1 T3
### 题目描述
小张最近在忙毕业论文设计，所以一直在读论文。一篇论文是由许多单词组成的。
但小张发现一个单词会在论文中出现很多次，他想知道每个单词分别在论文中出现多少次。
### 输入格式
第一行一个整数 N (N \leq 200)，表示有 N 个单词。接下来 N 行每行一个单词。每个单词都由小写字母（'a'～'z'）组成。
所有单词构成论文（一行一个单词）。
### 输出格式
输出 N 个整数，第 i 行的数字表示第 i 个单词在文章中出现了多少次。
<!-- more -->
### 样例数据 1
#### 输入
``` bash
3
a
aa
aaa
```
#### 输出
``` bash
6
3
1
```
### 备注
#### 【数据范围】
30%的数据，单词总长度不超过 10<sup>3</sup> ；
100%的数据，单词总长度不超过 10<sup>6</sup> 。
### 分析
AC自动机模板题。
### 源码
``` cpp
#include <bits/stdc++.h>
#define MAX_N 1050050
using namespace std;
int n, len, l, tot, head = 0, tail = 1;
char ss[MAX_N], s[MAX_N];
int first[MAX_N], next[MAX_N], ans[MAX_N], fail[MAX_N], f[MAX_N][27];
int st, tag[MAX_N], line[MAX_N];
 
void solve(int v, int x) {
    if (x == l) {
        next[++st] = first[v];
        first[v] = st;
        return;
    }
    if (!f[v][s[x + 1] - 'a']) f[v][s[x + 1] - 'a'] = ++tot;
    solve(f[v][s[x + 1] - 'a'], x + 1);
}
 
void ac_bfs() {
    line[1] = 0;
    while (head ^ tail) {
        head++;
        if (line[head])
            for (int j = 0; j < 26; j++)
                if (f[line[head]][j])
                    fail[f[line[head]][j]] = f[fail[line[head]]][j];
        for (int j = 0; j < 26; j++)
            if (!f[line[head]][j])
                f[line[head]][j] = f[fail[line[head]]][j];
            else line[++tail] = f[line[head]][j];
    }
}
 
int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cin >> n;
    for (register int i = 1; i <= n; i++) {
        cin >> (s + 1);
        l = strlen(s + 1);
        solve(0, 0);
        ss[++len] = 'a' + 26;
        for (register int j = 1; j <= l; j++)
            ss[++len] = s[j];
    }
    ac_bfs();
    int pos = 0, now = 0;
    for (; pos < len; pos++) tag[now = f[now][ss[pos + 1] - 'a']]++;
    for (register int i = tail; i; i--) {
        tag[fail[line[i]]] += tag[line[i]];
        for (int k = first[line[i]]; k; k = next[k]) ans[k] = tag[line[i]];
    }
    for (register int i = 1; i <= n; i++) cout << ans[i] << "\n";
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=730748&auto=1&height=66"></iframe>