---
title: 「APIO 2012」派遣-PairingHeap
date: 2016-08-02 14:15:11
tags:
  - STL
  - 可并堆
categories:
  - OI
  - 数据结构
  - 可并堆
---
### 题目描述
在一个忍者的帮派里，一些忍者们被选中派遣给顾客，然后依据自己的工作获取报偿。
在这个帮派里，有一名忍者被称之为 Master。除了 Master 以外，每名忍者都有且仅有一个上级。为保密，同时增强忍者们的领导力，所有与他们工作相关的指令总是由上级发送给他的直接下属，而不允许通过其他的方式发送。
<!-- more -->
现在你要招募一批忍者，并把它们派遣给顾客。你需要为每个被派遣的忍者支付一定的薪水，同时使得支付的薪水总额不超过你的预算。另外，为了发送指令，你需要选择一名忍者作为管理者，要求这个管理者可以向所有被派遣的忍者发送指令，在发送指令时，任何忍者（不管是否被派遣）都可以作为消息的传递人。管理者自己可以被派遣，也可以不被派遣。当然，如果管理者没有被派遣，你就不需要支付管理者的薪水。
你的目标是在预算内使顾客的满意度最大。这里定义顾客的满意度为派遣的忍者总数乘以管理者的领导力，其中每个忍者的领导力也是一定的。
写一个程序，给定每一个忍者 i 的上级 B<sub>i</sub> ，薪水 C<sub>i</sub> ，领导力 Li ，以及支付给忍者们的薪水总预算 M ，输出在预算内满足上述要求时顾客满意度的最大值。
### 输入格式
第一行包含两个整数 N 和 M ，其中 N 表示忍者的个数，M 表示薪水的总预算。
接下来 N 行描述忍者们的上级、薪水以及领导力。其中的第 i 行包含三个整数 B<sub>i></sub> ,C<sub>i</sub> , L<sub>i</sub> 分别表示第 i 个忍者的上级，薪水以及领导力。Master 满足 Bi = 0，并且每一个忍者的上级的编号一定小于自己的编号 B<sub>i</sub><i。
### 输出格式
输出一个数，表示在预算内顾客的满意度的最大值。
### 样例数据 1
#### 输入 
``` bash
5 4
0 3 3
1 3 5
2 2 2
1 2 4
2 3 1
```
#### 输出
``` bash
6
```
### 分析
ext/pb_ds大法,pbds有一个pairing_heap,提供了O(1)的push,O(log(n))的pop,关键是附送了O(1)的合并!!!!!
### 源码
``` cpp
#include <bits/stdc++.h>
#include <ext/pb_ds/priority_queue.hpp>
#define MAX 100010
#define max(x,y) (x ^ ((x ^ y) & -(x < y)))
typedef long long Long;
using namespace std;
__gnu_pbds::priority_queue<int, std::less<int>, __gnu_pbds::pairing_heap_tag > pq[MAX];
int lead[MAX], father[MAX], money[MAX], first[MAX];
Long tot[MAX], num[MAX];
int size, n, m;
Long ans;
struct Edge {
    int to, next;
} edge[MAX << 1];
inline void add(int u, int v) {
    size++;
    edge[size].to = v;
    edge[size].next = first[u];
    first[u] = size;
}
void dfs(int now) {
    if (money[now] < m) ans = max(ans, lead[now]);
    for (int u = first[now]; u ^ 0; u = edge[u].next) {
        if (edge[u].to != father[now]) {
            dfs(edge[u].to);
            pq[now].join(pq[edge[u].to]);
            num[now] += num[edge[u].to];
            tot[now] += tot[edge[u].to];
        }
    }
    while (num[now] > m) {
        num[now] -= pq[now].top();
        tot[now]--;
        pq[now].pop();
    }
    ans = max(ans, tot[now] * lead[now]);
}
int main(int argc, char *argv[]) {
    std::ios::sync_with_stdio(false);
    cin.tie(NULL);
    cin >> n >> m;
    for (register int i = 1; i <= n; i++)
        cin >> father[i] >> money[i] >> lead[i], add(i, father[i]), add(father[i], i), pq[i].push(money[i]), tot[i] = 1, num[i] = money[i];
    dfs(1);
    cout << ans;
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=26085472&auto=1&height=66"></iframe>