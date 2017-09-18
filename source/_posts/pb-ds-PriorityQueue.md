---
title: pb_ds优先队列学习笔记
date: 2016-08-08 18:47:36
tags:
  - 学习笔记
  - 堆
  - 黑科技
categories:
  - OI
  - 学习笔记
---
### pb_ds库
pb_ds??
平板电视??
pb_ds是G++编译器默认附带的一个扩展库,全称是Policy-Based Data Structures(官方[传送门](https://gcc.gnu.org/onlinedocs/libstdc++/ext/pb_ds/))...
pb_ds库里含有许多数据结构,如HashTable,trie,rb_tree,priority_queue...
<!-- more -->
### std优先队列
std里也有优先队列(priority_queue),但功能少得可怜(其实我都好久没有手写过堆了),在堆优化dijkstra中,我们可以用std优先队列这样做
``` cpp
#define DIJKSTRA_MAX 10010
struct node {
    int v, w;
    node() {}
    node(int v0, int w0) : v(v0), w(w0) {}
    bool operator<(const node &b) const { return w < b.w; }
};
bool vis[DIJKSTRA_MAX];
int dis[DIJKSTRA_MAX];
vector<node> son[DIJKSTRA_MAX];
inline int dijkstra(int s, int t) {
    priority_queue<pair_int, vector<pair_int>, greater<pair_int> > q;
    memset(dis, 127, sizeof(dis));
    memset(vis, false, sizeof(vis));
    dis[s] = 0;
    q.push(make_pair(dis[s], s));
    while (!q.empty()) {
        int now = q.top().second;
        q.pop();
        if (vis[now]) continue;
        vis[now] = true;
        for (int i = 0; i < son[now].size(); i++) {
            node x = son[now][i];
            if (dis[now] + x.w < dis[x.v]) {
                dis[x.v] = dis[now] + x.w;
                q.push(make_pair(dis[x.v], x.v));
            }
        }
    }
    return dis[t];
}
```
但是由于是pop()后再push,std优先队列pop和push都是O(log<sub>2</sub>n)的,多次重复会大量影响效率。
### pb_ds优先队列
所以我们应该用pb_ds优先队列。
#### 如何使用
首先要包含库...
``` cpp
#include <ext/pb_ds/priority_queue.hpp>
```
然后是名称空间__gnu_pbds
接下来我们来定义pb_ds优先队列,官网上给出了以下定义
``` cpp
template<
    typename Value_Type,
    typename Cmp_Fn = std::less<Value_Type>,
    typename Tag = pairing_heap_tag,
    typename Allocator = std::allocator<char> >
class priority_queue;
```
##### Value_Type
指的是优先队列中存放元素的类型
##### Cmp_Fn
是比较方法,默认为std::less
##### Tag
标记???(这才是关键)
pbds提供了以下tag

 - pairing_heap_tag(配对堆)
 - binary_heap_tag(二叉堆)
 - binomial_heap(二项堆)
 - rc_binomial_heap_tag(另一种二项堆)
 - thin_heap_tag(某种斐波那契堆)

这么多tag选哪一个呢???
**官方性能测试**[传送门](https://gcc.gnu.org/onlinedocs/libstdc++/ext/pb_ds/pq_performance_tests.html)
实际使用中发现pairing_heap_tag快于其他所有tag,也是默认使用的tag
##### Allocator
内存分配还是不管的好....
#### 代码
说了那么多还是直接上代码比较好...
``` cpp
#include <bits/stdc++.h>
#include <ext/pb_ds/priority_queue.hpp>
using namespace std;
using namespace __gnu_pbds;
typedef __gnu_pbds::priority_queue <pair<int, int>, greater<pair<int, int> >, pairing_heap_tag> heap;
heap q;
```
这样就定义好了
#### 成员方法
让我们来看看pb_ds优先队列究竟提供了哪些方法→_→
我就只列一些常用的,所有方法的官网[传送门](https://gcc.gnu.org/onlinedocs/libstdc++/ext/pb_ds/priority_queue.html)
 - priority_queue()默认构造函数
 - priority_queue(const priority_queue &other) 用另一个优先队列来构造
 - size()用法同std
 - empty()用法同std
 - push(const_reference r_val)注意push返回point_iterator
 - top()没区别...
 - pop()没什么好说的
 - point_iterator对应某元素的迭代器
 - erase(point_iterator it)删除对应点
 - modify(point_iterator it,const_reference r_new_val)修改对应点的值(这是优化dijkstra神方法,均摊复杂度O(1))
 - clear()基本没什么用,还不如重新定义一个...
 - join(priority_queue &other)神方法*2,白送可并堆啊,还是O(1)的,注意合并后other会被清空
 - split(Pred prd,priority_queue &other)拆分,但好像没什么用
 -  其他迭代器同std

### 例子
#### 1.【APIO2012】派遣
我的pb_ds优先队列实现[传送门](http://oi.xehoth.cc/2016/08/02/%E3%80%90APIO2012%E3%80%91%E6%B4%BE%E9%81%A3/)
#### 2.优化dijkstra
优化dijkstra的思路就是在前面提到的std优先队列优化的基础上,维护一个point_iterator数组,push的时候存下push时返回的迭代器,更新dis是判断是否存在此迭代器,若存在O(1)modify,不存在均摊O(1)push...
在此贴2个模板,一个struct+数组实现邻接表,另一个vector实现
##### vector
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
##### struct+数组
``` cpp
#include <bits/stdc++.h>
#include <ext/pb_ds/priority_queue.hpp>
using namespace std;
using namespace __gnu_pbds;
typedef __gnu_pbds::priority_queue <pair<int, int>, greater<pair<int, int> >, pairing_heap_tag> heap;
/*邻接表*/
int cnt, first[100010];
struct data {int to, next, w;} e[100010];
inline void insert(int u, int v, int w) {
    e[++cnt].to = v; e[cnt].next = first[u]; first[u] = cnt; e[cnt].w = w;
}
int dis[100010];
int n;
inline void dijkstra(int s) {
    heap q;
    fill(dis, dis + n + 1, 0x3ffffff);
    dis[s] = 0;
    /*迭代器数组*/
    vector<heap::point_iterator> id;
    /*分配内存*/
    id.reserve(100005);
    id[s] = q.push(make_pair(dis[s], s));
    while (!q.empty()) {
        int now = q.top().second; q.pop();
        for (int i = first[now]; i; i = e[i].next) {
            if (e[i].w + dis[now] < dis[e[i].to]) {
                dis[e[i].to] = e[i].w + dis[now];
                if (id[e[i].to] != 0)
                    q.modify(id[e[i].to], make_pair(dis[e[i].to], e[i].to));
                else id[e[i].to] = q.push(make_pair(dis[e[i].to], e[i].to));
            }
        }
    }
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=27584963&auto=1&height=66"></iframe>