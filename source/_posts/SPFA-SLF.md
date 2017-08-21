---
title: SPFA-SLF优化
date: 2016-08-16 22:23:36
tags:
  - 图论
  - 最短路
categories:
  - oi
  - 图论
  - 最短路
---
## SPFA【SLF优化】
### SLF
Small Label First 策略，设要加入的节点是j，队首元素为i，若dis[j] < dis[i]，则将j插入队首，否则插入队尾，**可能会被卡到指数级复杂度**。
<!-- more -->
### 代码
``` cpp
#define INF 0x3ffffff
#define SPFA_MAX 10010
struct node {
    int v, w;
    node() { }
    node(int v0, int w0) : v(v0), w(w0) { }
    bool operator<(const node &b) const {
        return w < b.w;
    }
};
bool vis[SPFA_MAX];
vector<node> vc[SPFA_MAX];
int dis[SPFA_MAX], in_que_sum[SPFA_MAX];
int n, m;
/* 返回是否为负权环 */
inline bool spfa(int s) {
    deque<int> dq;
    register int now, to;
    fill(dis + 1, dis + n + 1, INF), fill(vis + 1, vis + n + 1, false), fill(in_que_sum + 1, in_que_sum + n + 1, 0);
    dis[s] = 0, dq.push_back(s), vis[s] = true, in_que_sum[s]++;
    while (!dq.empty()) {
        now = dq.front(), dq.pop_front(), vis[now] = false;
        for (register int i = 0; i < vc[now].size(); i++) {
            to = vc[now][i].v;
            if ((dis[now] < INF) && (dis[to] > dis[now] + vc[now][i].w)) {
                dis[to] = dis[now] + vc[now][i].w;
                if (!vis[to]) {
                    vis[to] = true, in_que_sum[to]++;
                    if (in_que_sum[to] == n) return false;
                    if ((!dq.empty()) && (dis[to] <= dis[dq.front()]))
                        dq.push_front(to);
                    else
                        dq.push_back(to);
                }
            }
        }
    }
    return true;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=788276&auto=1&height=66"></iframe>