---
title: 博弈论学习笔记
date: 2016-11-02 21:13:08
tags:
  - 博弈论
  - 学习笔记
categories:
  - OI
  - 学习笔记
---
## 博弈论学习总结
### Nim游戏
Nim游戏就是经典的取石子游戏，规则如下：
桌子上有 `N` 堆石子，游戏者轮流取石子。每次只能从一堆中取出**任意数目**的石子，但不能不取。 取走**最后**一个石子者胜。
> 结论：对于一个nim游戏局面($a_1,a_2, \cdots ,a_n$)，若$a_1$ ^ $a_2$ ^  \cdots  ^ $a_n = 0$ 则先手必败。

<!-- more -->
### Sg函数
给定一个**有向无环图**和一个**位于起点**的棋子，两名选手轮流沿着有向边移动棋子，无法移动者输。
- 每个点对应一种状态
- 每条边对应一种移动

对这个游戏图定义SG函数
$sg(v) = mex\{sg(u)|$图中有一条v到u的边$\}$
其中 $mex\{A\}$ 是指不在集合A中的最小自然数
#### 定义P-position和N-position
- 无法进行任何移动的局面是P-position
- 可以移动到P-position的局面是N-position
- 所有移动都导致N-position的局面是P-position
- P即先手必败
- N即先手必胜
- 一个状态为P状态当且仅当它的sg值为0

#### 游戏的和
考虑任意多个同时进行的 SG-组合游戏，这些 SG-组合游戏的和是这样一个 SG-组合游戏，在它进行的过程中，游戏者可以任意挑选其中的一个单一游戏进行决策，最终，没有办法进行决策的人输。
### Nim游戏与Sg函数
#### 定理
> 对于任意游戏的和，若将其中任意一个单一的游戏换成数目与它sg值相等的一堆石子，规则变为取石子的规则，游戏和的胜负不变

**其实换成其他sg值相等的游戏都是可以的**
### Anti-Sg
Anti-SG 游戏规定，决策集合为**空**的游戏者赢。  
Anti-SG 其他规则与 SG 游戏**相同**。
#### SJ 定理
对于任意一个 Anti-SG 游戏，如果我们规定当局面中所有的单一游戏的 SG 值为 0 时，游戏结束，则先手必胜当且仅当：
>（1）游戏的 SG 函数不为 0 且游戏中某个单一游戏的 SG 函数大于 1；

>（2）游戏的 SG 函数 为 0 且游戏中没有单一游戏的 SG 函数大于 1

### Sg函数模板
#### Sg打表
`size`求解范围 `f`组是可以每次取的值,`n`是`f`的长度。
``` cpp
const int MAXN = 1010;
int sg[MAXN];
/* size求解范围 f[]数组是可以每次取的值,n是f的长度。 */
inline void getSg(int *f, int n) {
    static bool hash[MAXN];
    memset(sg, 0, sizeof(sg));
    register int i, j;
    for (i = 1; i <= MAXN; i++) {
        memset(hash, 0, sizeof(hash));
        for (j = 0; j < n; j++)
            if (i - f[j] >= 0)
                hash[sg[i - f[j]]] = 1;
        for (j = 0; j <= MAXN; j++)
            if (!hash[j])
                break;
        sg[i] = j;
    }
}
```
#### dfs
**注意：**`f`数组要按**从小到大排序**，SG函数要初始化为`-1` 对于每个集合只需初始化**1遍**
`n`是集合`f`的大小，`f[i]`是定义的特殊取法规则的数组
``` cpp
/* 注意:f数组要按从小到大排序,SG函数要初始化为-1,对于每个集合只需初始化1遍 */
/* n是集合f的大小,f[i]是定义的特殊取法规则的数组 */
int f[110], sg[10010], n;
int dfs(int x) {
    register int i;
    if (sg[x] != -1) return sg[x];
    bool vis[110];
    memset(vis, 0, sizeof(vis));
    for (i = 0; i < n; i++) {
        if (x >= f[i]) {
            dfs(x - f[i]);
            vis[sg[x - f[i]]] = 1;
        }
    }
    register int e;
    for (i = 0; ; i++) {
        if (!vis[i]) {
            e = i;
            break;
        }
    }
    return sg[x] = e;
}
```
### 例题
#### S-Nim【hdu1536】
[hdu1536](http://acm.hdu.edu.cn/showproblem.php?pid=1536)
**Problem Description**
Arthur and his sister Caroll have been playing a game called Nim for some time now. Nim is played as follows:
  The starting position has a number of heaps, all containing some, not necessarily equal, number of beads.
  The players take turns chosing a heap and removing a positive number of beads from it.
  The first player not able to make a move, loses.
Arthur and Caroll really enjoyed playing this simple game until they recently learned an easy way to always be able to find the best move:
  Xor the number of beads in the heaps in the current position (i.e. if we have `2`, `4` and `7` the xor-sum will be `1` as `2` xor `4` xor `7` = `1`).
  If the xor-sum is `0`, too bad, you will lose.
  Otherwise, move such that the xor-sum becomes `0`. This is always possible.
It is quite easy to convince oneself that this works. Consider these facts:
  The player that takes the last bead wins.
  After the winning player's last move the xor-sum will be `0`.
  The xor-sum will change after every move.
Which means that if you make sure that the xor-sum always is `0` when you have made your move, your opponent will never be able to win, and, thus, you will win. 
Understandibly it is no fun to play a game when both players know how to play perfectly (ignorance is bliss). Fourtunately, Arthur and Caroll soon came up with a similar game, S-Nim, that seemed to solve this problem. Each player is now only allowed to remove a number of beads in some predefined set S, e.g. if we have `S =(2, 5)` each player is only allowed to remove `2` or `5` beads. Now it is not always possible to make the xor-sum `0` and, thus, the strategy above is useless. Or is it? 
your job is to write a program that determines if a position of S-Nim is a losing or a winning position. A position is a winning position if there is at least one move to a losing position. A position is a losing position if there are no moves to a losing position. This means, as expected, that a position with no legal moves is a losing position.
**Input**
Input consists of a number of test cases. For each test case: The first line contains a number `k` (0 < k  \leq  100 describing the size of S, followed by k numbers si (0 < si  \leq  10000) describing S. The second line contains a number m (0 < m  \leq  100) describing the number of positions to evaluate. The next m lines each contain a number l (0 < l  \leq  100) describing the number of heaps and l numbers hi (0  \leq  hi  \leq  10000) describing the number of beads in the heaps. The last test case is followed by a `0` on a line of its own.
#### 方法一Sg打表
``` cpp
#include <bits/stdc++.h>
using namespace std;
const int MAXN = 10008;
int sg[MAXN];
/* size求解范围 f[]数组是可以每次取的值,n是f的长度。*/
inline void getSg(int *f, int n) {
    static bool hash[MAXN];
    memset(sg, 0, sizeof(sg));
    register int i, j;
    for (i = 1; i <= MAXN; i++) {
        memset(hash, 0, sizeof(hash));
        for (j = 0; j < n; j++)
            if (i - f[j] >= 0)
                hash[sg[i - f[j]]] = 1;
        for (j = 0; j <= MAXN; j++)
            if (!hash[j])
                break;
        sg[i] = j;
    }
}
int s[108], t;
int main() {
    int i, j, n, m, h;
    while (scanf("%d", &t), t) {
        string ans = "";
        for (i = 0; i < t; i++)
            scanf("%d", &s[i]);
        getSg(s, t);
        scanf("%d", &n);
        for (i = 0; i < n; i++) {
            scanf("%d", &m);
            int res = 0;
            for (j = 0; j < m; j++) {
                scanf("%d", &h);
                res ^= sg[h];
            }
            ans += res ? 'W' : 'L';
        }
        cout << ans << "\n";
    }
    return 0;
}
```
#### 方法二dfs
**记得排序**
``` cpp
#include <bits/stdc++.h>
using namespace std;
/* 注意:f数组要按从小到大排序,SG函数要初始化为-1,对于每个集合只需初始化1遍 */
/* n是集合f的大小,f[i]是定义的特殊取法规则的数组 */
int f[110], sg[10010], n;
int dfs(int x) {
    register int i;
    if (sg[x] != -1) return sg[x];
    bool vis[110];
    memset(vis, 0, sizeof(vis));
    for (i = 0; i < n; i++) {
        if (x >= f[i]) {
            dfs(x - f[i]);
            vis[sg[x - f[i]]] = 1;
        }
    }
    register int e;
    for (i = 0; ; i++) {
        if (!vis[i]) {
            e = i;
            break;
        }
    }
    return sg[x] = e;
}
int main() {
    int i, m, t, num;
    while (scanf("%d", &n) && n) {
        for (i = 0; i < n; i++)
            scanf("%d", &f[i]);
        memset(sg, -1, sizeof(sg));
        sort(f, f + n);
        scanf("%d", &m);
        while (m--) {
            scanf("%d", &t);
            int ans = 0;
            while (t--) {
                scanf("%d", &num);
                ans ^= dfs(num);
            }
            if (ans == 0)
                printf("L");
            else
                printf("W");
        }
        printf("\n");
    }
    return 0;
}
```
#### Climbing the Hill【hdu4315】
[hdu4315](http://acm.hdu.edu.cn/showproblem.php?pid=4315)
**题目描述**
大致意思是山上有`n`个人，每个人给出距离山顶的距离，给出其中一个人为**king**，每次能挑选一个人向上移动，不能越过其他人，最后将**king**移动到山顶者获胜。问获胜者。
**分析**
- 考虑与**Nim游戏**的转化，如果$ k = 1 $，那么显然先手必胜。
- 先考虑一个简化问题：不考虑**king**，当不能移动时为败。
- 首先注意到一个必败：如果`n`为偶数，且所有奇数位的人与其后的人均紧靠，那么此时为必败态，因为**不论**先手如何移动（只可能移动奇数位），后手必然可以移动偶数位使其依然保持紧靠。如果加入考虑**king**，那么`k`为偶数时，同上讨论，先手必败，如果`k`为奇数，那么可以把游戏看为移动`k - 1`位置的人到`1`（由前讨论，后手可以达到这一目标），故`k`为奇数时仍然为先手必败态。
- 此时我们就可以考虑如何将游戏进行至**必败态**，如果先手移动奇数位，那么后手总可以移动偶数位使得相隔距离不变，所以问题可以只考虑奇数位和其后相邻的偶数位的间距，把他们看成**Nim堆**，移动对应减少石子，当石子数为`0`时就是紧靠的必败态。
- 当`n`为奇数时，如果`k`不等于`2`，那么可以把**第一个人到山顶看成一堆石子**，当**Nim游戏**结束时第一个人到达山顶，情况就变得和偶数时一样。
- 如果`k`等于`2`，那么第一个人到山顶就是必败态，故第一个人最多能到`1`的位置，第一堆石子数减一。

``` cpp
#include <bits/stdc++.h>
const int MAXN = 1010;
using namespace std;
int a[MAXN];
int main() {
    ios::sync_with_stdio(0);
    cin.tie(0);
    int n, k, i;
    while (cin >> n >> k) {
        memset(a, 0, sizeof(a));
        for (i = 1; i <= n; i++) cin >> a[i];
        if (k == 1) {
            cout << "Alice" << endl;
            continue;
        }
        int t;
        if (~n & 1) {
            t = a[2] - a[1] - 1;
            for (i = 4; i <= n; i = i + 2) t = t ^ (a[i] - a[i - 1] - 1);
            if (t == 0) cout << "Bob" << endl;
            else cout << "Alice" << endl;
        }
        else {
            t = a[1];
            if (k == 2) t -= 1;
            for (i = 3; i <= n; i = i + 2) t = t ^ (a[i] - a[i - 1] - 1);
            if (t == 0) cout << "Bob" << endl;
            else cout << "Alice" << endl;
        }
    }
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=28138584&auto=1&height=66"></iframe>