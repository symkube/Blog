---
title: 「SuperOJ 383」麻烦的聚餐
date: 2016-07-16 21:44:35
tags:
  - DP
categories: 
  - oi
  - DP
---
## 麻烦的聚餐
### 题目描述
为了避免餐厅过分拥挤，FJ要求奶牛们分3批就餐。每天晚饭前，奶牛们都会在餐厅前排队入内，按FJ的设想，所有第3批就餐的奶牛排在队尾，队伍的前端由设定为第1批就餐的奶牛占据，中间的位置就归第2批就餐的奶牛了。由于奶牛们不理解FJ的安排，晚饭前的排队成了一个大麻烦。
第i头奶牛有一张标明她用餐批次 D_i(1 <= D_i <= 3) 的卡片。虽然所有 N (1 <= N <= 30,000) 头奶牛排成了很整齐的队伍，但谁都看得出来，卡片上的号码是完全杂乱无章的。 在若干次混乱的重新排队后，FJ找到了一种简单些的方法：奶牛们不动，他沿着队伍从头到尾走一遍，把那些他认为排错队的奶牛卡片上的编号改掉，最终得到一个他想要的每个组中的奶牛都站在一起的队列，例如 111222333 或者 333222111。哦，你也发现了，FJ不反对一条前后颠倒的队列，那样他可以让所有奶牛向后转，然后按正常顺序进入餐厅。
你也晓得，FJ是个很懒的人。他想知道，如果他想达到目的，那么他最少得改多少头奶牛卡片上的编号。所有奶牛在FJ改卡片编号的时候，都不会挪位置。
<!-- more -->
### 输入格式
第 1 行: 1 个整数：N。
第 2.. N+1 行: 第 i+1 行是 1 个整数，为第 i 头奶牛的用餐批次 D_i 。
### 输出格式
输出 1 个整数，为FJ最少要改几头奶牛卡片上的编号，才能让编号变成他设想中的样子。
### 样例数据 1
#### 输入
``` bash
5
1
3
2
1
1
```
#### 输出
``` bash
1
```
### 分析
求最长不下降序列和最长不下降序列,由于编号只有1,2,3,故时间复杂度为O(n),有些同学写了两个DP,我不想写,就无聊地把数组reverse了一下→_→...
### 源码
``` cpp
#include <algorithm>
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <iostream>
#define inf 1000000000
using namespace std;
char ch_buffer;
bool signum;
inline void readInt(int& l) {
    l = 0;
    do
        ch_buffer = cin.get();
    while (ch_buffer < '0' ||
           ch_buffer > '9' && ch_buffer != '0' && ch_buffer != '-');
    if (ch_buffer == '-') signum = true, ch_buffer = cin.get();
    while (ch_buffer >= '0' && ch_buffer <= '9')
        l = (l << 1) + (l << 3) + ch_buffer - '0', ch_buffer = cin.get();
    if (signum) l = -l, signum = false;
}
int n, ans = inf, a[30001], f[30001][4];
inline void dp() {
    memset(f, 127, sizeof(f));
    f[0][1] = f[0][2] = f[0][3] = 0;
    for (register int i = 1; i <= n; i++)
        for (register int j = 1; j <= 3; j++)
            for (register int k = 1; k <= j; k++)
                if (a[i] == j)
                    f[i][j] = min(f[i][j], f[i - 1][k]);
                else
                    f[i][j] = min(f[i][j], f[i - 1][k] + 1);
    ans = min(ans, f[n][1]);
    ans = min(ans, f[n][2]);
    ans = min(ans, f[n][3]);
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    readInt(n);
    for (register int i = 1; i <= n; i++) readInt(a[i]);
    dp();
    /*reverse→_→.........*/
    for (register int i = 1, range = (n >> 1); i <= range; i++)
        swap(a[i], a[n - i + 1]);
    dp();
    cout << ans;
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=849739&auto=1&height=66"></iframe>