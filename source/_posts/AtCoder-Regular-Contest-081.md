---
title: AtCoder Regular Contest 081
date: 2017-08-21 17:10:52
tags:
  - dp
  - 字符串
  - 贪心
categories:
  - oi
---
### 链接
[AtCoder Regular Contest 081](http://arc081.contest.atcoder.jp/)

<!-- more -->
### C Make a Rectangle
#### 题解
贪心，显然选取长度最大的是最优的，用一个 map 存一下出现次数，倒着找就可以了。  
**注意：可以是正方形。**

时间复杂度 $O(n \log n)$。

#### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「ARC 081C」Make a Rectangle 21-08-2017
 * 贪心
 * @author xehoth
 */
#include <bits/stdc++.h>

namespace Task {

#define long long long

std::map<int, int> map;

inline void solve() {
    std::ios::sync_with_stdio(false), std::cin.tie(NULL), std::cout.tie(NULL);
    register int n, cnt = 2;
    register long ans = 1;
    std::cin >> n;
    for (register int i = 0, t; i < n; i++) std::cin >> t, map[t]++;
    for (auto it = map.rbegin(); it != map.rend(); it++) {
        if (it->second > 1) {
            ans *= it->first, cnt--;
            if (it->second > 3 && cnt == 1) ans *= it->first, cnt--;
        }
        if (cnt == 0) break;
    }
    if (cnt == 0)
        std::cout << ans;
    else
        std::cout << '0';
}

#undef long
}

int main() {
    Task::solve();
    return 0;
}
```

### D Coloring Dominoes
#### 题解
~~写个三维 dp，暴力转移就能过了，后面看了看题解，真是...~~

中间转移情况只可能是图下几种情况：

![AtCoder Regular Contest 081 D Coloring Dominoes](/images/ARC081D.png)

所以我们处理好边界，分类讨论乘上对应贡献即可。

时间复杂度 $O(n)$。

#### 代码
``` cpp
/**
 * Copyright (c) 2017, xehoth
 * All rights reserved.
 * 「ARC 081D」Coloring Dominoes 21-08-2017
 * dp
 * @author xehoth
 */
#include <bits/stdc++.h>

namespace Task {

const int MAXN = 52;
const int MOD = 1e9 + 7;

char s[2][MAXN];

inline void solve() {
    std::ios::sync_with_stdio(false), std::cin.tie(NULL), std::cout.tie(NULL);
    register int n;
    std::cin >> n >> s[0] >> s[1];
    register int ans, tot = 0;
    if (s[0][0] == s[1][0])
        ans = 3, tot = 1;
    else if (s[0][0] == s[0][1])
        ans = 6, tot = 2;
    for (; tot < n;) {
        if (s[0][tot] == s[1][tot]) {
            if (s[0][tot - 1] == s[1][tot - 1]) ans = ans * 2ll % MOD;
            tot++;
        } else if (s[0][tot] == s[0][tot + 1]) {
            if (s[0][tot - 1] == s[1][tot - 1])
                ans = ans * 2ll % MOD;
            else if (s[0][tot - 1] == s[0][tot - 2])
                ans = ans * 3ll % MOD;
            tot += 2;
        }
    }
    std::cout << ans;
}
}

int main() {
    Task::solve();
    return 0;
}
```

<iframe async frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=499793439&auto=1&height=66"></iframe>