---
title: OI 模板总结
date: 2016-09-12 22:28:28
tags:
categories:
  - OI
---
## OI模板总结
## 数学模板
### 快速幂
<!-- more -->
``` cpp
inline int modPow(int a, int b, int c) {
    register int ans = 1;
    while (b) {
        if (b & 1) ans = (ans * a) % c;
        b >>= 1;
        a = (a * a) % c;
    }
    return ans;
}
```
### gcd(位运算+非递归)
``` cpp
inline int gcd(int x, int y) {
    register int i, j;
    if (!x) return y;
    if (!y) return x;
    for (i = 0; !(x & 1); i++) x >>= 1;
    for (j = 0; !(y & 1); j++) y >>= 1;
    if (j < i) i = j;
    while (true) {
        if (x < y) x ^= y ^= x ^= y;
        if (!(x -= y)) return y << i;
        while (!(x & 1)) x >>= 1;
    }
}
```
### 扩展欧几里德(非递归)
``` cpp
typedef long long Long;
inline Long EXT_GCD(Long a, Long b, Long&x, Long&y) {
    if (a < b) a ^= b ^= a ^= b;
    register Long x0 = 1, y0 = 0, x1 = 0, y1 = 1, r, q;
    x = 0, y = 1, r = a % b, q = (a - r) / b;
    while (r)
        x = x0 - q * x1, y = y0 - q * y1, x0 = x1, y0 = y1, x1 = x, y1 = y, a = b, b = r, r = a % b, q = (a - r) / b;
    return b;
}
```
### 素数快速线性筛选法
``` cpp
#define MAX_NUM 2000000
int prime[MAX_NUM], prime_num;
bool is_not_prime[MAX_NUM] = {true, true};
inline void getPrime() {
    for (register int i = 2; i < MAX_NUM; i++) {
        if (!is_not_prime[i])
            prime[prime_num++] = i;
        for (register int j = 0; j < prime_num && i * prime[j] < MAX_NUM; j++) {
            is_not_prime[i * prime[j]] = true;
            if (!(i % prime[j]))
                break;
        }
    }
}
```
### 快速线性筛选法(bitset优化空间)
你们不觉得bool很耗空间吗?为什么不用神器bitset呢?
**注意这个比上面的慢,不MLE谨慎使用**
``` cpp
#define MAX_NUM 2000000
int prime[MAX_NUM], prime_num;
/* 3的二进制为11,等价于上面的bool数组先把前两个赋成true */
bitset<MAX_NUM> is_not_prime(3);
inline void getPrime() {
    for (register int i = 2; i < MAX_NUM; i++) {
        if (!is_not_prime.test(i))
            prime[prime_num++] = i;
        for (register int j = 0; j < prime_num && i * prime[j] < MAX_NUM; j++) {
            is_not_prime.set(i * prime[j]);
            if (!(i % prime[j]))
                break;
        }
    }
}
```
## 图论
### dijkstra(std优先队列)
``` cpp
#include <iostream>
#include <cstdio>
#include <algorithm>
#include <cstring>
#include <vector>
#include <queue>
#define pair_int std::pair<int,int>
using namespace std;
#define DIJKSTRA_MAX 10010
/*节点*/
struct node {
    /*v编号 w权值*/
    int v,w;
    node() {}
    node(int v0,int w0):v(v0),w(w0) {}
    bool operator< (const node&b)const {
        return w<b.w;
    }
};
bool vis[DIJKSTRA_MAX];
int dis[DIJKSTRA_MAX];
/*利用vector可以很轻松地实现邻接表*/
vector<node> son[DIJKSTRA_MAX];
inline int dijkstra(int s,int t) {
    priority_queue<pair_int,vector<pair_int>,greater<pair_int> > q;
    memset(dis,127,sizeof(dis));
    memset(vis,false,sizeof(vis));
    dis[s]=0;
    q.push(make_pair(dis[s],s));
    while(!q.empty()) {
        int now=q.top().second;
        q.pop();
        if(vis[now]) continue;
        vis[now]=true;
        for(int i=0; i<son[now].size(); i++) {
            node x=son[now][i];
            if(dis[now]+x.w<dis[x.v]) {
                dis[x.v]=dis[now]+x.w;
                q.push(make_pair(dis[x.v],x.v));
            }
        }
    }
    return dis[t];
}
inline void insert(int a,int b,int w) {
    son[a].push_back(node(b,w));
}
inline void insert_multi(int a,int b,int w) {
    son[a].push_back(node(b,w));
    son[b].push_back(node(a,w));
}
```
### dijkstra(pb_ds堆)
struct+数组版[传送门](http://oi.xehoth.cc/2016/08/08/pb-ds%E4%BC%98%E5%85%88%E9%98%9F%E5%88%97/)
``` cpp
#include <bits/stdc++.h>
#include <ext/pb_ds/priority_queue.hpp>
using namespace std;
using namespace __gnu_pbds;
typedef __gnu_pbds::priority_queue <pair<int, int>, greater<pair<int, int> >, pairing_heap_tag> heap;
/*节点*/
struct node {
    int v, w;
    node(int _v, int _w): v(_v), w(_w) {}
};
/*邻接表*/
vector<node> son[100010];
int dis[100010];
int n;
inline void dijkstra(int s) {
    heap q;
    fill(dis,dis+n+1,0x3ffffff);
    dis[s]=0;
    /*迭代器数组*/
    vector<heap::point_iterator> id;
    /*分配内存*/
    id.reserve(100005);
    id[s]=q.push(make_pair(dis[s],s));
    while (!q.empty()) {
        int now = q.top().second; q.pop();
        for (int i = 0; i < son[now].size(); i++) {
            /*这里用指针可以获得小小的性能提升*/
            node*x = &son[now][i];
            if (x->w + dis[now] < dis[x->v]) {
                dis[x->v] = x->w + dis[now];
                /*如果迭代器已存在*/
                if (id[x->v] != 0)
                    q.modify(id[x->v], make_pair(dis[x->v], x->v));
                else id[x->v] = q.push(make_pair(dis[x->v], x->v));
            }
        }
    }
}
```
### spfa
``` cpp
#include <iostream>
#include <cstdio>
#include <algorithm>
#include <cstring>
#include <vector>
#include <queue>
#define pair_int std::pair<int,int>
using namespace std;
template<class T>
class Queue : public std::queue<T> {
    public:
        T pop() {
            T tmp=std::queue<T>::front();
            std::queue<T>::pop();
            return tmp;
        }
};
#define SPFA_MAX 10010
struct node {
    int v,w;
    node(int v0,int w0):v(v0),w(w0) {}
};
bool vis[SPFA_MAX];
int dis[SPFA_MAX];
vector<node> vc[SPFA_MAX];
inline void insert(int a,int b,int w) {
    vc[a].push_back(node(b,w));
}
inline void insert_multi(int a,int b,int w) {
    vc[a].push_back(node(b,w));
    vc[b].push_back(node(a,w));
}
inline int spfa(int s,int t) {
    Queue<int> q;
    memset(dis,127,sizeof(dis));
    q.push(s),dis[s]=0,vis[s]=true;
    while(!q.empty()) {
        int now=q.pop();
        vis[now]=false;
        for(int i=0; i<vc[now].size(); ++i) {
            node x=vc[now][i];
            if(dis[x.v]>dis[now]+x.w) {
                dis[x.v]=dis[now]+x.w;
                if(!vis[x.v]) vis[x.v]=true,q.push(x.v);
            }
        }
    }
    return dis[t];
}
```
### spfa(slf优化)
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
### prim(std优先队列)
``` cpp
#define MAX 1000
struct node {
    int v, w;
    node() {}
    node(int _v, int _w): v(_v), w(_w) {}
    inline bool operator < (const node&_n) const {
        return w > _n.w;
    }
};
typedef priority_queue<node> heap;
vector<node> edge[MAX];
bool vis[MAX];
inline int prim(int s) {
    heap q;
    register int cost = 0;
    node t(s, 0);
    q.push(t);
    while (!q.empty()) {
        t = q.top(); q.pop();
        if (vis[t.v]) continue;
        cost += t.w;
        vis[t.v] = true;
        for (register int i = 0; i < edge[t.v].size(); i++)
            if (!vis[edge[t.v][i].v])
                q.push(node(edge[t.v][i].v, edge[t.v][i].w));
    }
    return cost;
}
inline void insert(int u, int v, int w) {
    edge[u].push_back(node(v, w));
    edge[v].push_back(node(u, w));
}
```
## 数据结构
### 树状数组+求逆序对
``` cpp
#define lowbit(k) k & -k
#define MAXN 100010
int tree[MAXN];
int n;
inline int sum(int k) {
    register int tmp = 0;
    while (k) tmp += tree[k], k -= lowbit(k);
    return tmp;
}
inline void add(int k, int num = 1) {
    while (k <= n) tree[k] += num, k += lowbit(k);
}
/*求逆序对*/
inline long long countPair(int*arr) {
    register long long ans = 0;
    for (register int i = 1; i <= n; i++)
        add(arr[i]), ans += i - sum(arr[i]);
    return ans;
}
```
### 并查集
``` cpp
#define MAXN 100010
int father[MAXN];
inline void init(int n) {
    memset(father, 0, sizeof(father));
    for (register int i = 1; i <= n; i++) father[i] = i;
}
int getFather(int v) {
    return father[v] == v ? v : father[v] = getFather(father[v]);
}
inline void Union(int x, int y) {
    register int i = getFather(x), j = getFather(y);
    if (i ^ j) father[i] = j;
}
inline bool same(int x, int y) {
    return getFather(x) == getFather(y);
}
```
## 其他
### 最长上升子序列
O(nlog<sub>2</sub>n)使用lower_bound实现
``` cpp
#define INF 0x7fffffff
/*arr原数组 n个数 d辅助数组 result LIS序列 返回序列长度*/
inline int LIS(int*arr, int n, int*d, int*result) {
    register int ans = 0, i, pos;
    fill(result + 1, result + n + 1, INF);
    for (i = 1; i <= n; i++) {
        d[i] = pos = lower_bound(result, result + i, arr[i]) - result;
        result[d[i]] = min(result[d[i]], arr[i]), ans = max(ans, d[i]);
    }
    return ans;
}
```
### 最长不下降子序列
O(nlog<sub>2</sub>n)使用upper_bound实现,把上面的改个函数不就完了
``` cpp
#define INF 0x7fffffff
/*arr原数组 n个数 d辅助数组 result LIS序列 返回序列长度*/
inline int LIS(int*arr, int n, int*d, int*result) {
    register int ans = 0, i, pos;
    fill(result + 1, result + n + 1, INF);
    for (i = 1; i <= n; i++) {
        d[i] = pos = upper_bound(result, result + i, arr[i]) - result;
        result[d[i]] = min(result[d[i]], arr[i]), ans = max(ans, d[i]);
    }
    return ans;
}
```
## 位运算
### swap
``` cpp
inline void swap(int&a,int&b){
    a ^= b;  
    b ^= a;  
    a ^= b; 
}
```
### abs
``` cpp
inline int abs(int n){
     return (n ^ (n >> 31)) - (n >> 31);  
}
```
### max
``` cpp
#define max(x,y) (x ^ ((x ^ y) & -(x < y)))
```
### min
``` cpp
#define min(x,y) (y ^ ((x ^ y) & -(x < y)))
```
### *10
``` cpp
x*=10
x=(x<<3)+(x<<1)
```
## STL函数
#### 查找对象
##### 简单查找
``` cpp
//返回指定值的迭代器,不存在则返回end
find(beg,end,val);
```
##### 统计个数
``` cpp
//返回指定值的个数
count(beg,end,val);
```
##### 查找重复元素
``` cpp
//返回第一对相邻重复元素的迭代器,若无返回end
adjacent_find(beg,end,val);

//返回有count个重复元素的的位置迭代器
search_n(beg,end,count,val);
```
##### 查找子序列
``` cpp
search(beg1,end1,beg2,end2);
```
##### 二分
``` cpp
//返回第一个小于等于val的元素的迭代器
lower_bound(beg,end,val);
//返回第一个大于val的元素的迭代器
upper_bound(beg,end,val);
//返回boolean 序列中是否包含val
binary_search(beg,end,val);
```
#### 修改元素
##### 填充
``` cpp
//用val填充beg~end
fill(beg,end,val);
```
##### 复制
``` cpp
//复制元素到dest
copy(beg,end,dest);
```
##### 转换
``` cpp
//用unaryOp转化元素
transform(beg,end,unaryOp);
```
#### 排序
##### 排序整个范围
``` cpp
sort(beg,end[,cmp]);
//若元素相等,保证相对初始位置
stable_sort(beg,end[,cmp]);
```
##### 部分排序
``` cpp
//保证mid前为最小(大)的mid-beg个元素,mid~end不保证
partial_sort(beg,mid,end[,cmp]);
```
##### 第n大数
``` cpp
nth_element(beg,end,val);
```
#### 重排
##### 去重
``` cpp
//并未真正去重,只是移动重复元素到返回的迭代器之后的位置
unique(beg,end);
```
##### 删除
``` cpp
remove(beg,end);
```
##### 反转
``` cpp
reverse(beg,end);
```
##### 打乱
``` cpp
random_shuffle(beg,end);
```
##### 排列
``` cpp
next_permutation(beg1,end1,beg2);
prev_permutation(beg1,end1,beg2);
```
#### 集合
``` cpp
//包含
includes(beg,end,beg2,end2);
//并集
set_union(beg,end,beg2,end2,dest);
//交集
set_intersection(beg,end,beg2,end2,dest);
//差集
set_difference(beg,end,beg2,end2,dest);
//对称差集
set_symmetric_difference(beg,end,beg2,end2,dest);
```
#### 最值
``` cpp
max_element(beg,end);
min_element(beg,end);
//返回pair first为min,second为max
minmax_element(beg,end);
```
#### 数值
``` cpp
//求和
accumulate(beg,end,init);
//内积
inner_product(beg,end,beg2,init[,binOp1,binOp2]);
```
