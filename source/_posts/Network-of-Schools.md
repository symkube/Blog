---
title: 「POJ 1236」Network of Schools
date: 2016-07-08 09:55:25
tags:
  - 图论
  - Tarjan
categories:
  - oi
  - 图论
  - Tarjan
---
## Network of Schools
### 题目背景
[poj1236](http://poj.org/problem?id=1236)
### 题目描述
大致意思: $N(2 < N < 100)$ 各学校之间有单向的网络，每个学校得到一套软件后，可以通过单向网络向周边的学校传输。

问题：初始至少需要向多少个学校发放软件，使得网络内所有的学校最终都能得到软件。至少需要添加几条传输线路(边)，使任意向一个学校发放软件后，经过若干次传送，网络内所有的学校最终都能得到软件。
<!-- more -->
### 输入格式
The first line contains an integer N: the number of schools in the network (2 <= N <= 100). The schools are identified by the first N positive integers. Each of the next N lines describes a list of receivers. The line i+1 contains the identifiers of the receivers of school i. Each list ends with a 0. An empty list contains a 0 alone in the line.
### 输出格式
Your program should write two lines to the standard output. The first line should contain one positive integer: the solution of subtask A. The second line should contain the solution of subtask B.
### 样例数据 1
输入
``` bash
5
2 4 3 0
4 5 0
0
0
1 0
```
输出
``` bash
1
2
```
### 分析
#### 题目理解
给定一个有向图，求：

1. 至少要选几个顶点，才能做到从这些顶点出发，可以到达全部顶点。
2. 至少要加多少条边，才能使得从任何一个顶点出发，都能到达全部顶点。

#### 思路
1. 求出所有强连通分量。
2. 每个强连通分量缩成一点，则形成一个有向无环图DAG。
3. DAG上面有多少个入度为0的顶点，问题1的答案就是多少。
4. 在DAG上要加几条边，才能使得DAG变成强连通的，问题2的答案就是多少。

#### 方法
要为每个入度为 $0$ 的点添加入边，为每个出度为 $0$ 的点添加出边。假定有 $n$ 个入度为 $0$ 的点，$m$ 个出度为 $0$ 的点,把所有入度为 $0$ 的点编号 $0,1,2,3,4,\cdots, N-1$,每次为一个编号为i的入度 $0$ 点可达的出度 $0$ 点，添加一条出边，连到编号为 $(i+1) \% N$ 的那个出度 $0$点,这需要加 $n$ 条边。

1. 若 $m \leq n$，则加了这 $n$ 条边后，已经没有入度 $0$ 点，则问题解决，一共加了 $n$ 条边。
2. 若 $m > n$，则还有 $m - n$ 个入度 $0$ 点，则从这些点以外任取一点，和这些点都连上边，即可，这还需加 $m - n$ 条边。

**所以，$max(m,n)$ 就是第二个问题的解。**

**此外：**当只有一个强连通分支的时候，就是缩点后只有一个点，虽然入度出度为0的都有一个，但是实际上不需要增加清单的项了，所以答案是 $1, 0$
### 源码
``` cpp
#include <cstring>
#include <iostream>
#include <stack>
#include <vector>
using namespace std;
/*优化读入
 *@ param l 要读入的int
 */
char ch_buffer;
bool signum;
inline void readInt(int &l) {
    l = 0;
    do
        ch_buffer = getchar();
    while ((ch_buffer < '0' || ch_buffer > '9') && ch_buffer != '0' &&
           ch_buffer != '-');
    if (ch_buffer == '-') ch_buffer = getchar(), signum = true;
    while (ch_buffer <= '9' && ch_buffer >= '0')
        l = (l << 3) + (l << 1) + ch_buffer - '0', ch_buffer = getchar();
    if (signum) l = -l, signum = false;
}
#define M 110             /*题目中可能的最大点数*/
stack<int> st;            /*tarjan算法中的栈*/
int DFN[M];               /*深度优先搜索访问次序*/
int Low[M];               /*能追溯到的最早的次序*/
int ComponentNumber = 0;  /*有向图强连通分量个数*/
int Index = 0;            /*索引号*/
vector<int> Edge[M];      /*邻接表表示*/
vector<int> Component[M]; /*获得强连通分量结果*/
int InComponent[M];       /*记录每个点在第几号强连通分量里*/
int ComponentDegree[M];   /*记录每个强连通分量的度*/
int inDegree[M];          /*入度*/
int outDegree[M];         /*出度*/
/*所给点的数量*/
int n;
/*无向图插入
 *@ param u 第一个顶点编号
 *@ param v 第二个顶点编号
 */
inline void insertMulty(int u, int v) {
    Edge[u].push_back(v), Edge[v].push_back(u);
}
/*有向图插入
 *@ param u 顶点编号
 *@ param v 连通顶点的编号
 */
inline void insert(int u, int v) { Edge[u].push_back(v); }
/*初始化
 *@ param num_of_n 顶点的数量
 */
inline void init(int num_of_n) {
    memset(DFN, 0, sizeof(DFN));
    memset(Low, 0, sizeof(Low));
    memset(inDegree, 0, sizeof(inDegree));
    memset(outDegree, 0, sizeof(outDegree));
    while (!st.empty()) st.pop();
    ComponentNumber = Index = 0;
    n = num_of_n;
}
/*tajan+缩点*/
void tarjan(int u) {
    DFN[u] = Low[u] = ++Index;
    /*入栈*/
    st.push(u);
    int v;
    /*for each (u, v) in E*/
    for (int e = 0; e < Edge[u].size(); e++) {
        v = Edge[u][e];
        if (!DFN[v]) {
            tarjan(v);
            Low[u] = min(Low[u], Low[v]);
            /*!InComponent[v]=>如果不在栈中,*/
            /*这里用这种写法,既可以缩点还能节约一个boolean数组*/
        } else if (!InComponent[v])
            Low[u] = min(Low[u], Low[v]);
    }
    if (DFN[u] == Low[u]) {
        ComponentNumber++;
        do {
            v = st.top(), st.pop();
            /*记录强连通分量*/
            Component[ComponentNumber].push_back(v);
            /*缩点=>degree*/
            InComponent[v] = ComponentNumber;
        } while (v != u); /*until v==u*/
    }
}
/*缩点*/
inline void degree() {
    /*遍历*/
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < Edge[i].size(); j++) {
            int k = Edge[i][j];
            /*这里的InComponent指的是点对应的强连通分量的编号*/
            /*等价于网上许多教程中的belong数组*/
            if (InComponent[i] != InComponent[k]) {
                /*统计入度*/
                inDegree[InComponent[k]]++;
                /*统计出度*/
                outDegree[InComponent[i]]++;
            }
        }
    }
}
int x;
int main(int argc, char const *argv[]) {
    /* code */
    readInt(n);
    init(n);
    for (int i = 0; i < n; i++) {
        /*在c++中,while只根据最后一个","后的变量来判定条件是否成立*/
        while (readInt(x), x) /*所有编号都-1,节约空间*/
            /*如编号为1,存入为0*/
            x--, insert(i, x);
    }
    /*上面编号已减1,故从0开始遍历*/
    for (int i = 0; i < n; i++)
        if (!DFN[i]) tarjan(i);
    /*特殊情况节约时间,避免再往下运行*/
    if (ComponentNumber == 1) cout << "1\n0\n", exit(0);
    /*缩点*/
    degree();
    /*统计入度为0的点*/
    int in_tot = 0, out_tot = 0;
    for (int i = 1; i <= ComponentNumber; i++) {
        if (!inDegree[i]) in_tot++;
        if (!outDegree[i]) out_tot++;
    }
    cout << in_tot << "\n" << max(in_tot, out_tot);
    return 0;
}
```

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=729715&auto=1&height=66"></iframe>