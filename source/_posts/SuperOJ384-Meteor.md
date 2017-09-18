---
title: 「SuperOJ 384」流星雨
date: 2016-07-16 21:37:48
tags:
  - BFS
categories: 
  - OI
  - BFS
---
## 流星雨
### 题目描述
茜听说了一个骇人听闻的消息，一场流星雨即将袭击整个农场，由于流星体积过大，它们无法在撞击到地面前燃烧殆尽，届时将会对它撞到的一切东西造成毁灭性的打击。很自然地，贝茜开始担心自己的安全问题。以FJ牧场中最聪明的奶牛的名誉起誓，她一定要在被流星砸到前，到达一个安全的地方（也就是说，一块不会被任何流星砸到的土地）。如果将牧场放入一个直角坐标系中，贝茜现在的位置是原点，并且，贝茜不能踏上一块被流星砸过的土地。
根据预报，一共有 M 颗流星（1 <= M <= 50,000）会坠落在农场上，其中第 i 颗流星会在时刻 T_i （0 <= T_i <= 1,000）砸在坐标为（X_i, Y_i）（0 <= X_i <= 500；0 <= Y_i <= 500）的格子里。流星的力量会将它所在的格子，以及周围 4 个相邻的格子都化为焦土，当然贝茜也无法再在这些格子上行走。
贝茜在时刻 0 开始行动，它只能在第一象限中，平行于坐标轴行动，每 1 个时刻中，她能移动到相邻的（一般是 4 个）格子中的任意一个，当然目标格子要没有被烧焦才行。如果一个格子在时刻 t 被流星撞击或烧焦，那么贝茜只能在 t 之前的时刻在这个格子里出现。请你计算一下，贝茜最少需要多少时间才能到达一个安全的格子。 
<!-- more -->
### 输入格式
第 1 行: 1个正整数：M
第 2.. M+1行: 第 i+1 行为 3 个用空格隔开的整数：X_i，Y_i，以及 T_i
### 输出格式
输出 1 个整数，即贝茜逃生所花的最少时间。如果贝茜无论如何都无法在流星雨中存活下来，输出 -1
### 样例数据 1
#### 输入
``` bash
4
0 0 2
2 1 2
1 1 2
0 3 5
```
#### 输出
``` bash
5
```
### 分析
广搜,直接广搜是会出问题的,需要预先处理一下,否则我也不知道会发生什么...
### 源码
``` cpp
#include <algorithm>
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <iostream>
#include <vector>
#define INF 0x3ffffff
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
int meteor[500][500], dis[500][500];
int n;
const int dx[] = {-1, 0, 1, 0};
const int dy[] = {0, -1, 0, 1};
vector<pair<int, int> > vc;
inline void move(int x, int y, int t) {
    if ((x >= 0) && (y >= 0) && (t < meteor[x][y]) && (t < dis[x][y])) {
        if (meteor[x][y] == INF) cout << t, exit(0);
        dis[x][y] = t;
        vc.push_back(pair<int, int>(x, y));
    }
}
inline void init() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    readInt(n);
    for (register int i = 0; i < 500; i++)
        fill(meteor[i], meteor[i] + 500, INF), fill(dis[i], dis[i] + 500, INF);
    for (register int i = 0, x_i, y_i, t; i < n; i++) {
        readInt(x_i), readInt(y_i), readInt(t);
        meteor[x_i][y_i] = min(meteor[x_i][y_i], t);
        if (x_i > 0) meteor[x_i - 1][y_i] = min(meteor[x_i - 1][y_i], t);
        if (y_i > 0) meteor[x_i][y_i - 1] = min(meteor[x_i][y_i - 1], t);
        meteor[x_i + 1][y_i] = min(meteor[x_i + 1][y_i], t);
        meteor[x_i][y_i + 1] = min(meteor[x_i][y_i + 1], t);
    }
    move(0, 0, 0);
}
int main() {
    init();
    for (register int i = 0; i < vc.size(); i++) {
        for (register int j = 0; j < 4; j++) {
            pair<int, int>* pir = &vc[i];
            move(pir->first + dx[j], pir->second + dy[j],
                 dis[pir->first][pir->second] + 1);
        }
    }
    cout << "-1";
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=28977339&auto=1&height=66"></iframe>