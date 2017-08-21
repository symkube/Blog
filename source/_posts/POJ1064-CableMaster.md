---
title: 「POJ 1064」Cable master
date: 2016-07-07 11:03:11
tags:
  - 二分
categories: 
  - oi
  - 二分
---
### 分析
二分答案题,先按绳子的长度进行升序排列,然后for循环二分100次就够了,避免while造成死循环,在 $O(n)$ 内枚举进行判断,所以时间复杂度为 $O(n \log n)$。
**注意:一定要用double,float精度太低,否则直接wrong answer**
<!-- more -->
### 源码
``` cpp
#include <algorithm>
#include <cmath>
#include <cstdio>
#include <iomanip>
#include <iostream>
#define decimal_format(a) setiosflags(std::ios::fixed) << setprecision(a)
using namespace std;
int N, K;
double L[10005];
inline bool check(double x) {
    int num = 0;
    for (int i = 0; i < N; i++) num += floor(L[i] / x);
    return num >= K;
}
inline void binarySearch() {
    sort(L, L + N);
    double l = 0, r = *max_element(L, L + N);
    for (int i = 0; i < 100; i++) {
        double mid = (l + r) / 2;
        if (check(mid))
            l = mid;
        else
            r = mid;
    }
    cout << decimal_format(2) << floor(r * 100) / 100;
}
int main(int argc, char const *argv[]) {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cin >> N >> K;
    for (int i = 0; i < N; i++) cin >> L[i];
    binarySearch();
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=748422&auto=1&height=66"></iframe>