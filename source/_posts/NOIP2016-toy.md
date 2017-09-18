---
title: '「NOIP2016」玩具谜题 - 模拟'
date: 2016-12-03 22:23:02
tags:
  - 模拟
categories: 
  - OI
  - 模拟
---
小南有一套可爱的玩具小人，它们各有不同的职业。

有一天，这些玩具小人把小南的眼镜藏了起来。小南发现玩具小人们围成了一个圈，它们有的面朝圈内，有的面朝圈外。

这时 `singer` 告诉小南一个谜题：「眼镜藏在我左数第 $3$ 个玩具小人的右数第 $1$ 个玩具小人的左数第 $2$ 个玩具小人那里。」

小南发现，这个谜题中玩具小人的朝向非常关键， 因为朝内和朝外的玩具小人的左右方向是相反的：面朝圈内的玩具小人，它的左边是顺时针方向，右边是逆时针方向；而面向圈外的玩具小人，它的左边是逆时针方向，右边是顺时针方向。
<!-- more -->
小南一边艰难地辨认着玩具小人，一边数着：

`singer` 朝内，左数第 $3$ 个是 `archer`。
`archer` 朝外，右数第 $1$ 个是 `thinker`。
`thinker` 朝外，左数第 $2$ 个是 `writer`。

所以眼镜藏在 `writer` 这里！

虽然成功找回了眼镜，但小南并没有放心。如果下次有更多的玩具小人藏他的眼镜，或是谜题的长度更长，他可能就无法找到眼镜了。所以小南希望你写程序帮他解决类似的谜题。这样的谜题具体可以描述为：

有 $n$ 个玩具小人围成一圈，已知它们的职业和朝向。现在第 $1$ 个玩具小人告诉小南一个包含 $m$ 条指令的谜题。其中第 $i$ 条指令形如「左数/右数第 $s_i$ 个玩具小人」。你需要输出依次数完这些指令后，到达的玩具小人的职业。
### 题解
维护当前是第几个小人，通过每个小人的朝向和指令方向判断下标的增减，每次增减下标后对 $n$ 加减。
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
#include <functional>
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
}
struct Toy {
    int dir;
    char job[12];
} toy[100010];
int n, m;
inline void fix(int &pos) {
    if (pos <= 0) pos += n;
    if (pos > n) pos -= n;
}
int main() {
    scanf("%d %d", &n, &m);
    for (int i = n; i >= 1; i--)
        scanf("%d %s", &toy[i].dir, toy[i].job);
    int pos = n;
    for (int i = 1,a, s; i <= m; i++) {
        scanf("%d %d", &a, &s);
        if (a == 0 && toy[pos].dir == 0) {
            pos += s;
            fix(pos);
        } else if (a == 0 && toy[pos].dir == 1) {
            pos -= s;
            fix(pos);
        } else if (a == 1 && toy[pos].dir == 0) {
            pos -= s;
            fix(pos);
        } else if (a == 1 && toy[pos].dir == 1) {
            pos += s;
            fix(pos);
        }
    }
    cout << toy[pos].job;
    return 0;
}
```


<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=36024567&auto=1&height=66"></iframe>
