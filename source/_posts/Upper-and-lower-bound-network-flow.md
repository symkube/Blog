---
title: 上下界网络流学习总结
date: 2017-01-15 19:06:55
tags:
  - 网络流
  - 学习笔记
categories:
  - oi
  - 学习笔记
---

有上下界的网络流。
$(u, v)$ 为一条边，$s$ 为源，$t$ 为汇，$S$ 为超级源，$T$ 为超级汇，$d$ 记录下界和。
<!-- more -->
### 无源汇可行流
我们从 $u$ 向 $v$ 连 $upper - lower$ 的边，$d[v] += lower$，$d[u] -= lower$。最后枚举每一个点，若 $d[i] < 0$，从 $i$ 向 $T$ 连 $-d[i]$ 的边，否则从 $S$ 向 $i$ 连 $d[i]$ 的边，然后从 $S$ 到 $T$ 跑最大流，判断是否跑满就好。

### 有源汇最大流
我们从 $u$ 向 $v$ 连 $upper - lower$ 的边，$d[v] += lower$，$d[u] -= lower$。最后枚举每一个点，若 $d[i] < 0$，从 $i$ 向 $T$ 连 $-d[i]$ 的边，否则从 $S$ 向 $i$ 连 $d[i]$ 的边。再从 $t$ 向 $s$ 连 $+ \infty$ 的边，然后从 $S$ 到 $T$ 跑最大流判断是否可行，若可行再从 $s$ 到 $t$ 跑最大流即为答案。

### 有源汇最小流
我们从 $u$ 向 $v$ 连 $upper - lower$ 的边，$d[v] += lower$，$d[u] -= lower$。最后枚举每一个点，若 $d[i] < 0$，从 $i$ 向 $T$ 连 $-d[i]$ 的边，否则从 $S$ 向 $i$ 连 $d[i]$ 的边。先从 $S$ 到 $T$ 跑一遍最大流，再从 $t$ 向 $s$ 连 $+ \infty$ 的边，然后从 $S$ 到 $T$ 再跑最大流判断是否可行，若可行则最后加入边的反向边的流量为答案。

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=27709044&auto=1&height=66"></iframe>