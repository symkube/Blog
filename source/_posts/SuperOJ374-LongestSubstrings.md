---
title: 「SuperOJ 374」最长子串
date: 2016-07-07 11:03:11
tags:
  - 字符串
categories: 
  - OI
  - 字符串
---
## 最长子串
### 题目描述
给出一个全部由小写字母构成的字符串，要求从该串中找出满足下面条件的最长子串：

条件1：子串是连续的；

条件2：子串的长度是偶数；

条件3：沿子串的中心切开，对左右两部分的串按顺序进行比较，要求不同的字符对数 $N$ 不超过题目给出的一个限定值 $D$。
比如：`abcaec` 的 $N$ 值为 $1$。因为平分的两部分 `abc` 和 `aec` 比较，只有 $1$ 对字符不同：即 `b` 和 `e`，而其余字符都相同。
<!-- more -->
### 输入格式
只有一行，先是一个整数 $D(0 \leq D \leq 1000)$，然后一个空格，接着是一个由小写字母构成的字符串（长度不超过 $2000$）。
### 输出格式
如果找到满足条件的最长子串，则按如下格式输出一行：

先是一个整数X，表示最长子串的长度，然后一个空格，接着是满足条件的最长子串。

如果有多解，则输出左端点在原串中最靠前的子串，如果找不到满足条件的最长子串，则输出 `Not found`
### 样例数据 1
输入
``` bash
1 f
```
输出
``` bash
Not found
```
### 样例数据 2
输入
``` bash
0 kjjjgieie
```
输出
``` bash
4 ieie
```
### 样例数据 3
输入
``` bash
0 abcd
```
输出
``` bash
Not found
```
### 方法一
#### 直接暴力
三重循环直接比较即可(评测机速度比较快就不会超时),时间复杂度 $O(n ^ 3)$。
#### 源码
``` cpp
#include <iostream>
#include <string>
using namespace std;
int d;
string str;
int val_length = 0;
int val_pos = -1;
int dif;
int main() {
    cin >> d >> str;
    for (int i = 0, range = str.length(); i < range; i++) {
        for (int j = i + 1; j < range; j += 2) {
            int mid_pos = (j + i) >> 1;
            dif = 0;
            /*比较*/
            for (int m = i, n = mid_pos + 1; m <= mid_pos; m++, n++)
                if (str[m] != str[n]) dif++;
            int len = j - i + 1;
            if (dif <= d && len > val_length) val_length = len, val_pos = i;
        }
    }
    /*最后剪切字符串,避免中间造成大量重复剪切*/
    if (val_pos != -1)
        cout << val_length << " " << str.substr(val_pos, val_length);
    else
        cout << "Not found"
             << "\n";
    return 0;
}
```
### 方法二
#### 正解
从中间开始查找,谨慎使用 string,(方法一把 string 换成 char 就快多了)。
``` cpp
#include <cstring>
#include <iostream>
#include <string>
using namespace std;
char t[2005], s[2005];
int f[2005], a[2005];
int d, h, hh;
int m, u;
bool b = false;
int main() {
    cin >> d >> s;
    h = strlen(s);
    /*中间点*/
    hh = h >> 1;
    /*遍历扫描*/
    for (int i = hh; i > 0; i--) {
        /*比较*/
        for (int j = i; j < h; j++)
            if (s[j] != s[j - i])
                f[j] = 1;
            else
                f[j] = 0;
        a[i] = f[i];
        m = i << 1;
        for (int j = i + 1; j < m; j++) a[j] = a[j - 1] + f[j];
        for (int j = m; j < h; j++) a[j] = a[j - 1] + f[j] - f[j - i];
        for (int j = m - 1; j < h; j++)
            if (a[j] <= d) {
                b = true;
                u = 0;
                for (int k = j - m + 1; k <= j; k++) t[u++] = s[k];
                t[m] = 0;
                cout << m << " " << t;
                break;
            }
        if (b) break;
    }
    if (!b)
        cout << "Not found"
             << "\n";
    return 0;
}
```
