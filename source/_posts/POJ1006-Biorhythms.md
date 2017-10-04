---
title: 「POJ-1006」Biorhythms-中国剩余定理
date: 2017-01-03 17:09:29
tags:
  - 数学
  - 中国剩余定理
categories:
  - OI
  - 数学
---
Some people believe that there are three cycles in a person's life that start the day he or she is born. These three cycles are the physical, emotional, and intellectual cycles, and they have periods of lengths 23, 28, and 33 days, respectively. There is one peak in each period of a cycle. At the peak of a cycle, a person performs at his or her best in the corresponding field (physical, emotional or mental). For example, if it is the mental curve, thought processes will be sharper and concentration will be easier.
<!-- more -->
Since the three cycles have different periods, the peaks of the three cycles generally occur at different times. We would like to determine when a triple peak occurs (the peaks of all three cycles occur in the same day) for any person. For each cycle, you will be given the number of days from the beginning of the current year at which one of its peaks (not necessarily the first) occurs. You will also be given a date expressed as the number of days from the beginning of the current year. You task is to determine the number of days from the given date to the next triple peak. The given date is not counted. For example, if the given date is 10 and the next triple peak occurs on day 12, the answer is 2, not 3. If a triple peak occurs on the given date, you should give the number of days to the next occurrence of a triple peak.
<!-- more -->
### 链接
[POJ-1006](http://poj.org/problem?id=1006)
### 题解
裸的中国剩余定理，记住最后相差取模即可。
### 代码
``` cpp
#include <cstdio>
#include <cstring>
#include <cstdlib>
#include <vector>
#include <algorithm>
#include <cmath>
#include <cctype>
#include <iostream>
int main() {
    std::ios::sync_with_stdio(0), std::cin.tie(0);
    register int p, e, i, d, time = 1;
    while (std::cin >> p >> e >> i >> d) {
        if (p == -1 && e == -1 && i == -1 && d == -1) break;
        register int lcm = 21252, n = (5544 * p + 14421 * e + 1288 * i - d + 21252) % 21252;
        if (!n) n = 21252;
        std::cout << "Case " << time++ << ": the next triple peak occurs in " << n << " days." << "\n";
    }
    return 0;
}
```

