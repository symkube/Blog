---
title: 「SuperOJ 376」选数问题
date: 2016-07-05 12:21:55
tags:
  - 二分
categories: 
  - oi
  - 二分
---
## 选数问题
### 题目描述
在给定的 $N$ 个数中选出 $R \times C$ 个数，然后填入 $R \times C$ 的矩阵中，每一行的 $D(i)$ 定义为本行最大值与最小值的差，然后要令所有行中 $D(i)$ 的最大值 $F$ 尽量小，其中 $1 \leq i \leq R$。请你求出满足条件的 $F$。
### 输入格式
第一行是三个整数：$N, R, C$，其中, $1 \leq R,C \leq 10^4$，$R \times C \leq N \leq 5 \times 10^5$。
第二行是 $N$ 个整数 $P_i$，$0 < P_i \leq 10^9$
### 输出格式
输出一个整数，即满足条件的最小的 $F$。
<!-- more -->
### 样例数据 1
输入
``` bash
7 2 3
170 205 225 190 260 225 160
```
输出
``` bash
30
```
### 备注
#### 【样例说明】
输入样例可以选出以下数字构成2×3的矩阵

190 170 160  —> D(1) = 190 – 160 = 30
225 225 205  —> D(2) = 225 – 205 = 20
    
所以 `D(i)` 的最大值 $F = max(D_1,D_2) = max(30,20) = 30$，而且 $F$ 是所有方案中最小的。
### 分析
注意数据范围,提示了这道题要用二分，二分时判断数量能否达到 $R \times C$。
### 源码
``` cpp
#include <algorithm>
#include <cmath>
#include <cstdio>
#include <cstring>
#include <iostream>
using namespace std;
char ch_buffer;
bool signum;
inline void readInt(int &l) {
    l = 0;
    do
        ch_buffer = getchar();
    while ((ch_buffer < '0' || ch_buffer > '9') && ch_buffer != '0' &&
           ch_buffer != '-');
    if (ch_buffer == '-') ch_buffer = getchar(), signum = true;
    while (ch_buffer <= '9' && ch_buffer >= '0')
        l = (l << 3) + (l << 1) + ch_buffer - '0', ch_buffer = getchar();
    if (signum) l = -l, signum = false;
}
#define MAX_N 500000
int p[MAX_N];
int n, r, c;
inline void binarySearch() {
    sort(p, p + n);
    int ans;
    int low = 0, high = 1000000000;
    while (low <= high) {
        int mid = (low + high) >> 1;
        int cnt = 0;
        for (int i = 0; i + c - 1 < n;)
            if (p[i + c - 1] - p[i] <= mid) {
                cnt++;
                i = i + c;
            } else
                ++i;

        if (cnt >= r) {
            high = mid - 1;
            ans = mid;
        } else
            low = mid + 1;
    }
    cout << ans;
}
int main(int argc, char const *argv[]) {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    readInt(n), readInt(r), readInt(c);
    for (int i = 0; i < n; ++i) readInt(p[i]);
    binarySearch();
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=837185&auto=1&height=66"></iframe>