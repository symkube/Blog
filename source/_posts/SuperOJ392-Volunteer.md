---
title: 「SuperOJ 392」志愿者选拔
date: 2016-07-24 21:18:16
tags:
  - 单调队列
  - 数据结构
categories:
  - oi
  - 数据结构
  - 单调队列
---
## 志愿者选拔
### 题目描述
西博会马上就要开幕了，电子科技大学组织了一次志愿者选拔活动。
参加志愿者选拔的同学们排队接受面试官们的面试。参加面试的同学们按照先来先面试并且先结束的原则接受面试官们的考查。
面试中每个人的英语口语能力是主要考查对象之一。
作为主面试官的John想知道当前正在接受面试的同学队伍中口语能力值最高的是多少。于是他请你帮忙编写一个程序来计算。
<!-- more -->
### 输入格式
输入数据第一行为一整数 T，表示有 T(T<=5)组输入数据。
每组数据第一行为“START”，表示面试开始。
接下来的数据中有三种情况：
1 C NAME KY_VALUE 名字为 NAME 的口语能力值为 KY_VALUE 的同学加入面试队伍。(名字长度不大于5，0<=KY_VALUE<=1,000,000,000)。
2 G 排在面试队伍最前面的同学面试结束离开考场。
3 Q 主面试官 John 想知道当前正在接受面试的队伍中口语能力最高的值是多少。
最后一行为”END”，表示所有的面试结束，面试的同学们可以依次离开了。
所有参加面试的同学总人数不超过 1,000,000。
### 输出格式
对于每个询问 Q，输出当前正在接受面试的队伍中口语能力最高的值，如果当前没有人正在接受面试则输出 -1。
### 样例数据 1
#### 输入
``` bash
2
START
C Tiny 1000000000
C Lina 0
Q
G
Q
END
START
Q
C ccQ 200
C cxw 100
Q
G
Q
C wzc 500
Q
END
```
#### 输出
``` bash
1000000000
0
-1
200
100
500
```
### 分析
这是一道单调队列裸题,但是...
**这是一道卡输入输出的题！！！！**
**史上巨坑卡输入输出**
**本题限时2s**
### 30分做法
直接scanf+getchar优化... TLE七个点,全部大于3500ms...
**这是题解做法,吓哭我了...**
``` cpp
#include <algorithm>
#include <cstdio>
using namespace std;

inline void get(int &x) {
    static int t;
    while (!((x = getchar()) >= '0' && x <= '9'))
        ;
    x -= '0';
    while ((t = getchar()) >= '0' && t <= '9') x = x * 10 + t - '0';
}

const int maxn = 100010;
int q[maxn], head, tail, left, node[maxn], sum;

int main() {
    int _, t, x;
    scanf("%d\n", &_);
    char s[100];
    while (_--) {
        gets(s);
        head = 1, tail = sum = left = 0;
        while ((t = getchar()) != 'E')
            if (t == 'C') {
                get(x);
                while (head <= tail && q[tail] <= x) --tail;
                q[++tail] = x, node[tail] = ++sum;
            } else if (t == 'G') {
                ++left;
                while (head <= tail && node[tail] - node[head] + 1 > sum - left)
                    ++head;
                getchar();
            } else {
                printf("%d\n", head <= tail ? q[head] : -1);
                getchar();
            }
        gets(s);
    }
    return 0;
}
```
### 80分做法
cin解绑+cin.get()+位运算优化。
TLE两个点 2100ms,2700ms...
``` cpp
#include <bits/stdc++.h>
using namespace std;
int T;
string str;
char t;
deque<pair<int, int> > dq;
int head, rear, val;
int main(int argc, char const *argv[]) {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cin >> T;
    while (T--) {
        head = rear = 0;
        dq.clear();
        cin >> str;
        cin.get();
        while ((t = cin.get()) ^ 'E') {
            switch (t) {
                case 'C':
                    cin >> str >> val;
                    while (!dq.empty() && dq.back().first < val) dq.pop_back();
                    dq.push_back(make_pair(val, rear));
                    rear++;
                    cin.get();
                    break;
                case 'G':
                    if (dq.front().second == head) dq.pop_front();
                    head++;
                    cin.get();
                    break;
                default:
                    if (!dq.empty())
                        cout << dq.front().first << "\n";
                    else
                        cout << "-1\n";
                    cin.get();
                    break;
            }
        }
        cin >> str;
        cin.get();
    }
    return 0;
}
```
### 100分做法
**经过无数次优化后,我终于AC了...**
fread+解绑+位运算优化
单点最长耗时1062ms
**最快优化看下面**
``` cpp
#include <bits/stdc++.h>
using namespace std;
int T;
string str;
char t;
deque<pair<int, int> > dq;
typedef long long Long;
int head, rear, val;
namespace io {
using namespace std;
#define IO_L 1048576
char _buf[IO_L], *S, *T, _buf1[IO_L + 1], *S1 = _buf1, c;
inline char freadChar() {
    if (S == T) {
        T = (S = _buf) + fread(_buf, 1, IO_L, stdin);
        if (S == T) return 0;
    }
    return *S++;
}
inline void freadLong(Long &x) {
    for (c = freadChar(); c < '0' || c > '9'; c = freadChar())
        ;
    for (x = c ^ '0', c = freadChar(); c >= '0' && c <= '9'; c = freadChar())
        x = (x << 3) + (x << 1) + (c ^ '0');
}
void freadInt(int &x) {
    for (c = freadChar(); c < '0' || c > '9'; c = freadChar())
        ;
    for (x = c ^ '0', c = freadChar(); c >= '0' && c <= '9'; c = freadChar())
        x = (x << 3) + (x << 1) + (c ^ '0');
}
inline void fwriteChar(char c) {
    if (S1 == _buf1 + IO_L) {
        fwrite(_buf1, 1, IO_L, stdout);
        S1 = _buf1;
    }
    *S1++ = c;
}
inline void fwriteString(const string &str) {
    for (register int i = 0, range = str.length(); i < range; i++)
        fwriteChar(str[i]);
}
inline void flushIO() { fwrite(_buf1, 1, S1 - _buf1, stdout); }
void fwriteInt(int x) {
    if (x > 9) fwriteInt(x / 10);
    fwriteChar(x % 10 ^ '0');
}
inline void initIO() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(NULL);
}
}
int main(int argc, char const *argv[]) {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    io::freadInt(T);
    while (T--) {
        head = rear = 0;
        dq.clear();
        io::freadChar(), io::freadChar(), io::freadChar(), io::freadChar(),
            io::freadChar(), io::freadChar();
        while ((t = io::freadChar()) ^ 'E') {
            switch (t) {
                case 'C':
                    io::freadInt(val);
                    while (!dq.empty() && dq.back().first < val) dq.pop_back();
                    dq.push_back(make_pair(val, rear));
                    rear++;
                    break;
                case 'G':
                    if (dq.front().second == head) dq.pop_front();
                    head++;
                    io::freadChar();
                    break;
                default:
                    if (!dq.empty())
                        cout << dq.front().first << "\n";
                    else
                        cout << "-1\n";
                    io::freadChar();
                    break;
            }
        }
        io::freadChar(), io::freadChar(), io::freadChar();
    }
    return 0;
}
```
### 1s以内做法
fread+fwrite+位运算+解绑
``` cpp
#include <bits/stdc++.h>
using namespace std;
int T;
string str;
char t;
deque<pair<int, int> > dq;
typedef long long Long;
int head, rear, val;
namespace io {
using namespace std;
#define IO_L 1048576
char _buf[IO_L], *S, *T, _buf1[IO_L + 1], *S1 = _buf1, c;
inline char freadChar() {
    if (S == T) {
        T = (S = _buf) + fread(_buf, 1, IO_L, stdin);
        if (S == T) return 0;
    }
    return *S++;
}
inline void freadLong(Long &x) {
    for (c = freadChar(); c < '0' || c > '9'; c = freadChar())
        ;
    for (x = c ^ '0', c = freadChar(); c >= '0' && c <= '9'; c = freadChar())
        x = (x << 3) + (x << 1) + (c ^ '0');
}
void freadInt(int &x) {
    for (c = freadChar(); c < '0' || c > '9'; c = freadChar())
        ;
    for (x = c ^ '0', c = freadChar(); c >= '0' && c <= '9'; c = freadChar())
        x = (x << 3) + (x << 1) + (c ^ '0');
}
inline void fwriteChar(char c) {
    if (S1 == _buf1 + IO_L) {
        fwrite(_buf1, 1, IO_L, stdout);
        S1 = _buf1;
    }
    *S1++ = c;
}
inline void fwriteString(const string &str) {
    for (register int i = 0, range = str.length(); i < range; i++)
        fwriteChar(str[i]);
}
inline void flushIO() { fwrite(_buf1, 1, S1 - _buf1, stdout); }
void fwriteInt(int x) {
    if (x > 9) fwriteInt(x / 10);
    fwriteChar(x % 10 ^ '0');
}
inline void initIO() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(NULL);
}
}
int main(int argc, char const *argv[]) {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    io::freadInt(T);
    while (T--) {
        head = rear = 0;
        dq.clear();
        io::freadChar(), io::freadChar(), io::freadChar(), io::freadChar(),
            io::freadChar(), io::freadChar();
        while ((t = io::freadChar()) ^ 'E') {
            switch (t) {
                case 'C':
                    io::freadInt(val);
                    while (!dq.empty() && dq.back().first < val) dq.pop_back();
                    dq.push_back(make_pair(val, rear));
                    rear++;
                    break;
                case 'G':
                    if (dq.front().second == head) dq.pop_front();
                    head++;
                    io::freadChar();
                    break;
                default:
                    if (!dq.empty())
                        io::fwriteInt(dq.front().first), io::fwriteChar('\n');
                    else
                        io::fwriteString("-1\n");
                    io::freadChar();
                    break;
            }
        }
        io::freadChar(), io::freadChar(), io::freadChar();
    }
    io::flushIO();
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=729774&auto=1&height=66"></iframe>