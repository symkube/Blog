---
title: '「NOIP2016」组合数问题 - 递推 + 前缀和'
date: 2016-12-03 22:41:05
tags:
  - DP
  - 数学
  - 树状数组
  - 组合数
  - 前缀和
categories: 
  - OI
  - 数学
---
组合数表示的是从 $n$ 个物品中选出 $m$ 个物品的方案数。举个例子，从 $(1, 2, 3) $ 三个物品中选择两个物品可以有 $(1, 2)$， $(1, 3)$， $(2, 3)$ 这三种选择方法。
根据组合数的定义，我们可以给出计算组合数的一般公式：
$C_n ^ m = \frac{n!}{m!(n - m)!}$
其中 $n! = 1 \times 2 \times \cdots \times n$。
小葱想知道如果给定 $n$， $m$ 和 $k$，对于所有的 $0 \leq i \leq n$， $0 \leq j \leq \min(i, m)$ 有多少对 $(i, j)$ 满足是 $k$ 的倍数。
<!-- more -->
### 题解
根据 $Pascal$ 定理，有
{% raw %}$C_n^m = C_{n - 1} ^ {m - 1} + C_{n - 1} ^ {m}${% endraw %}

预处理出每个 $C$ 对 $k$ 取模后的值 ，建立 $n$ 个树状数组，若 $C_i^j$ 不为 $0$，添加到第 $i$ 个树状数组中，询问即是统计前缀和，时间复杂度 $O(n^2logn+tnlogn)$。
### 代码
``` cpp
/*@author xht*/
#include <cassert>
#include <cctype>
#include <climits>
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <ctime>
#include <algorithm>
#include <bitset>
#include <complex>
#include <deque>
#include <iomanip>
#include <iostream>
#include <list>
#include <map>
#include <queue>
#include <set>
#include <stack>
#include <string>
#include <vector>
using std::cin;
using std::cout;
char ch;
bool iosig;
template<class T>
inline void read(T &x) {
    iosig = 0, x = 0;
    do {
        ch = getchar();
        if (ch == '-') iosig = 1;
    } while (!isdigit(ch));
    while (isdigit(ch)) x = (x << 1) + (x << 3) + (ch ^ '0'), ch = getchar();
    if (iosig) x = -x;
}
typedef long long ll;
int t, k;
int f[2010][2010];
int tree[2010][2010];
#define lowbit(k) k & -k
inline void modify(int k, int n, int cur, int v = 1) {
    for (; k <= n; k += lowbit(k))
        tree[cur][k] += v;
}
inline int query(int k, int cur) {
    int ans = 0;
    for (; k; k -= lowbit(k))
        ans += tree[cur][k];
    return ans;
}
inline void init() {
    for (int i = 0; i <= 2000; i++)
        f[i][0] = 1;
    for (int i = 1; i <= 2000; i++)
        for (int j = 1; j <= i; j++)
            f[i][j] = (f[i - 1][j - 1] + f[i - 1][j]) % k;
    for (int i = 0; i <= 2000; i++)
        for (int j = 0; j <= i; j++)
            if (!f[i][j])
                modify(j + 1, 2001, i + 1);

}
inline void solve() {
    int n, m;
    read(n), read(m);
    int ans = 0;
    for (int i = 0; i <= n; i++)
        ans += query(std::min(i, m) + 1, i + 1);
    cout << ans << "\n";
}
int main() {
    read(t), read(k);
    init();
    while (t--)
        solve();
    return 0;
}
```

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=730859&auto=1&height=66"></iframe>
