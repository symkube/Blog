---
title: 后缀自动机应用总结
date: 2017-03-19 14:41:32
tags:
  - 字符串
  - 后缀自动机
  - 学习笔记
categories:
  - OI
  - 学习笔记
---
这里保存一些后缀自动机常见应用和例题，~~不断完善中~~，更多的还是看补档计划吧......
<!-- more -->
### 「POJ1509」Glass Beads
题意就是给一个字符串 $S$，每次可以将它的第一个字符移到最后面，求这样能得到的字典序最小的字符串。输出开始下标。

此题可用最小表示法，但用后缀自动机练习板子还是挺不错的，我们把原串复制一遍建立 $SAM$，然后考虑贪心，每次跳到最左的节点，走 $len$ 次即为原串的最小循环表示。
``` cpp
/*
 * created by xehoth on 12-03-2017
 */
#include <algorithm>
#include <cstdio>
#include <cstring>
#include <iostream>

namespace SuffixAutomation {
const int MAXN = 40005;

struct Node {
    Node *fa, *next[26];
    int max;
    Node(int max = 0) : max(max), fa(NULL) {
        memset(next, 0, sizeof(next));
    } 

    inline void *operator new(size_t);
} pool[MAXN], *cur = pool, *root, *last;

inline void *Node::operator new(size_t) {
    return cur++;
}

inline Node *extend(int c, Node *p) {
    Node *np = new Node(p->max + 1);
    while (p && !p->next[c]) p->next[c] = np, p = p->fa;
    if (!p) {
        np->fa = root;
    } else {
        Node *q = p->next[c];
        if (q->max == p->max + 1) {
            np->fa = q;
        } else {
            Node *nq = new Node(p->max + 1);
            memcpy(nq->next, q->next, sizeof(q->next));
            nq->fa = q->fa, q->fa = np->fa = nq;
            while (p && p->next[c] == q) p->next[c] = nq, p = p->fa;
        }
    }
    return np;
}

inline void init() {
    cur = pool;
    root = last = new Node();
}

inline int get(const int n) {
    Node *p = root;
    for (register int i = 1; i <= n; i++) {
        for (register int j = 0; j < 26; j++) {
            if (p->next[j]) {
                p = p->next[j];
                break;
            }
        }
    }
    return p->max;
}

char str[10005];
inline void solve() {
    register int t, n;
    scanf("%d", &t);
    while (t--) {
        scanf("%s", str);
        n = strlen(str);
        init();
        for (register int i = 0; i < n; i++) last = extend(str[i] - 'a', last);
        for (register int i = 0; i < n; i++) last = extend(str[i] - 'a', last);
        std::cout << get(n) - n + 1 << "\n";
    }
}

}

int main() {

    SuffixAutomation::solve();
    return 0;
}
```
### 「SPOJ-1811」LCS
**链接:** [SPOJ-1811](http://www.spoj.com/problems/LCS/)

题意：求两个字符串A,B的最长公共子串。字符串长度不超过 $250000$。

我们先构造 $A$ 的 $SAM$，然后用 $A$ 的 $SAM$ 一次读入 $B$ 的每一个字符，初始时状态在 $root$ 处，此时最大匹配数为 $0$，（这里的最大匹配数是指以当前读入的字符结尾，往前能匹配的最大长度），设当前到达的状态为 $p$，最大匹配数为 $res$，读入的字符为 $x$，若 $p->next[x]!=NULL$，则说明可从当前状态读入一个字符 $x$ 到达下一个状态，则 $res++,p=p->next[x]$,否则，找到 $p$ 的第一个祖先 $s$，$s->next[x]!=NULL$,若 $s$ 不存在，则说明以 $x$ 结尾的字符串无法和 $A$ 串的任何位置匹配，则设 $res=0,p=root$。否则，设 $res=s->res+1,p=s->next[x]$。我们求$res$ 所达到的最大值即为所求．
``` cpp
/*
 * created by xehoth on 12-03-2017
 */
#include <bits/stdc++.h>

namespace SuffixAutomation {
const int MAXN = 500010;
struct Node {
    Node *fa, *next[26];
    int max;
    Node(int max = 0) : max(max), fa(NULL) {
     /*   memset(next, 0, sizeof(next)); */
    }
    
    Node(int max, Node *p) {
        *this = *p, this->max = max;
    }
    inline void *operator new(size_t);
} pool[MAXN], *cur = pool, *root, *last;

inline void *Node::operator new(size_t) {
    return cur++;
}

inline Node *extend(int c, Node *p) {
    Node *np = new Node(p->max + 1);
    while (p && !p->next[c]) p->next[c] = np, p = p->fa;
    if (!p) {
        np->fa = root;
    } else {
        Node *q = p->next[c];
        if (p->max + 1 == q->max) {
            np->fa = q;
        } else {
            Node *nq = new Node(p->max + 1, q);
            q->fa = np->fa = nq;
            while (p && p->next[c] == q) p->next[c] = nq, p = p->fa;
        }
    }
    return np;
}

inline int work(char *s) {
    register int res = 0;
    register Node *p = root;
    for (register int len = 0; *s; ++s) {
        register int c = *s - 'a';
        while (p && !p->next[c]) p = p->fa;
        if (!p) p = root, len = 0;
        else len = std::min(p->max, len) + 1, p = p->next[c];
        res = std::max(res, len);
    }
    return res;
}

inline void solve() {
    root = last = new Node();
    static char s[MAXN];
    scanf("%s", s);
    for (register char *c = s; *c; c++) last = extend(*c - 'a', last);
    scanf("%s", s);
    std::cout << work(s);
}

}

int main() {
    SuffixAutomation::solve();
    return 0;
}
```
### 「SPOJ-8222」NSUBSTR - Substrings
**链接:** [SPOJ-8222](http://www.spoj.com/problems/NSUBSTR/)

题意: $f[i]$ 指长度为 $i$ 的串出现次数的最大值。这里的不同出现指，可以有重复串，只要起始位置不同就视为不同的出现。
求 $f[1] \cdots f[n]$。

对于一个结点 $s$，它的出现次数是 $|endPos(s)|$，因此用 $|endPos(s)|$ 去更新 $ans[len(s)]$。由于一个结点出现的范围是 $[len(s->fa)+1, len(s)]$，因此最后要用 $ans[i + 1]$ 更新 ans[i]。由于 $ans[i]$ 一定不小于 $ans[i + 1]$，因此不会出现错误。

关键就在于如何求 $endPos$ 了，这就需要拓扑排序。先把 $Suffix Link$ 上所有叶子结点的 $endPos$ 设成 $1$，然后按照 $len$ 从大到小的顺序更新。

**值得注意**的是此题用 $DFS$ 也许不行，还是写拓扑排序比较靠谱，可以不用写基排，利用 $vector$ 是一个很好的做法。

> 附上神犇的总结:一个串的子串有多少之类的问题，或是询问子串/后缀的问题，常用子边转移（自动机性质）。而计算一个串重复出现次数（$right / endPos$ 集合的问题），回退到最长匹配状态（$LCS$ 问题），就用父边转移（后缀树性质）。

``` cpp
/*
 * created by xehoth on 15-03-2017
 * 
 */
/* #pragma GCC diagnostic error "-std=c++11" */
#include <bits/stdc++.h>

namespace SuffixAutomation {

const int MAXN = 500005;

struct Node {
    Node *next[26], *fa;

    int max, endPosSize;

    Node(int max = 0) : max(max) {}

    Node(int max, Node *p) {
        *this = *p, this->max = max;
    }

    inline void *operator new(size_t);
} pool[MAXN], *cur = pool, *root, *last;

inline void *Node::operator new(size_t) {
    return cur++;
}

inline void init() {
    root = last = new Node();
}

inline Node *extend(int c, Node *p) {
    Node *np = new Node(p->max + 1);
    while (p && !p->next[c]) p->next[c] = np, p = p->fa;
    if (!p) {
        np->fa = root;
    } else {
        Node *q = p->next[c];
        if (q->max == p->max + 1) {
            np->fa = q;
        } else {
            Node *nq = new Node(p->max + 1, q);
            q->fa = np->fa = nq;
            while (p && p->next[c] == q) p->next[c] = nq, p = p->fa;
        }
    }
    return np;
}


inline void getEndPosSize(const char *s, const int n) {
    /*将Suffix Link 上的所有叶子节点的endPosSize设置为1*/
    Node *p = root;
    for (register int i = 0; i < n; i++)
        p = p->next[*s++ - 'a'], p->endPosSize++;
    /*按照 len 从大到小的顺序更新*/
    static std::vector<Node *> buc[MAXN];
    static int ans[MAXN];
    for (Node *p = pool; p != cur; p++) buc[p->max].push_back(p);
    for (register int i = n; i; i--) {
        for (auto p : buc[i]) {
            ans[i] = std::max(ans[i], p->endPosSize);
            p->fa->endPosSize += p->endPosSize;
        }
    }
    for (register int i = n - 1; i; i--) ans[i] = std::max(ans[i], ans[i + 1]);
    for (register int i = 1; i <= n; i++) std::cout << ans[i] << "\n";
}

inline void solve() {
    init();
    static char s[MAXN];
    scanf("%s", s);
    register int n = strlen(s);
    for (register int i = 0; i < n; i++) 
        last = extend(s[i] - 'a', last);
    getEndPosSize(s, n);
}

}

int main() {
#ifndef ONLINE_JUDGE
    freopen("in.in", "r", stdin);
#endif
    SuffixAutomation::solve();
    return 0;
}
```
### 「SPOJ-7258」SUBLEX - Lexicographical Substring Search
**链接:** [SPOJ-7258](http://www.spoj.com/problems/SUBLEX/)

题意:把一个字符串所有的不同的字串全拿出来，按字典序排序，求第 $k$ 小的字符串。

明显是后缀数组题(而且感觉时间也更靠谱)，但为了练习，这里我们来想一想后缀自动机怎么做。

上面的总结也提到了，子串问题显然就是子边转移，先再次明确一下 $endPos$ 集合的概念，它表示的是从这个结点开始能够的到的后缀，而它的大小就可以表示字符串的出现次数了。在后缀自动机中，$root$ 出发到任意一个状态的路径对应一个子串，而且不重复，而求不同子串个数的话，对于一个结点需要从它能够转移到的更长子串通过递推得到，同样需要拓扑排序，询问时暴力 $dfs$ 找到第 $k$ 小就好了。

**注意:** 据说 $SPOJ$ 评测机太慢，卡常数，据说需要使用基排/计排来完成拓扑排序，但它好像不卡 $STL$，同上题做法，我们利用 $vector$ 来进行拓扑排序并预先记录每一个结点能够转移到的非空结点，从而优化常数，不用输入输出优化和~~奇怪的~~拓扑排序技巧就能轻松过去。

``` cpp
/*
 * created by xehoth on 15-03-2017
 * 
 */
/* #pragma GCC diagnostic error "-std=c++11" */
#include <bits/stdc++.h>

namespace SuffixAutomation {

const int MAXN = 180005;

struct Node {
    Node *next[26], *fa;

    int max, cnt;

    Node(int max = 0) : max(max) {}

    Node(int max, Node *p) {
        *this = *p, this->max = max;
    }

    inline void *operator new(size_t);
} pool[MAXN], *cur = pool, *root, *last;

inline void *Node::operator new(size_t) {
    return cur++;
}

inline void init() {
    root = last = new Node();
}

inline Node *extend(int c, Node *p) {
    Node *np = new Node(p->max + 1);
    while (p && !p->next[c]) p->next[c] = np, p = p->fa;
    if (!p) {
        np->fa = root;
    } else {
        Node *q = p->next[c];
        if (q->max == p->max + 1) {
            np->fa = q;
        } else {
            Node *nq = new Node(p->max + 1, q);
            q->fa = np->fa = nq;
            while (p && p->next[c] == q) p->next[c] = nq, p = p->fa;
        }
    }
    return np;
}

std::vector<Node *> buc[MAXN];
typedef std::pair<Node *, int> Pair;
std::vector<Pair> edge[MAXN];

/*预处理从每个节点出发，还有多少不同的子串可以到达。*/
inline void prepare(const char *s, const int n) {
    for (Node *p = pool; p != cur; p++) p->cnt = 1, buc[p->max].push_back(p);
    for (register int i = n; i >= 0; i--) {
        for (auto p : buc[i]) {
            for (register int j = 0; j < 26; j++) {
                if (p->next[j]) {
                    edge[p - pool].push_back(Pair(p->next[j], j));
                    /*这里是预处理，保证时间复杂度，并不是 endPos 集合，记录的是当前节点不同子串个数*/
                    p->cnt += p->next[j]->cnt;
                }
            }
        }
    }
}

inline void dfs(Node *p, int k) {
    if (--k == 0) return;
    for (auto i : edge[p - pool]) {
        if (i.first->cnt < k) {
            k -= i.first->cnt;
        } else {
            putchar('a' + i.second), dfs(i.first, k);
            break;
        }
    }
}

inline void solve() {
    static char s[MAXN];
    scanf("%s", s);
    register int n = strlen(s);
    init();
    for(register int i = 0; i < n; i++) last = extend(s[i] - 'a', last);
    prepare(s, n);
    register int q;
    scanf("%d", &q);
    for (register int i = 1, k; i <= q; i++) {
        scanf("%d", &k), dfs(root, k + 1), putchar('\n');
    }
}

}

int main() {
#ifndef ONLINE_JUDGE
    freopen("in.in", "r", stdin);
#endif
    SuffixAutomation::solve();
}
```
### 「BZOJ-2882」工艺
此题同「POJ1509」Glass Beads，但是字符集大小过大，需要利用 $map$ 储存节点，直接找最小循环表示就好了。
``` cpp
/*
 * created by xehoth on 15-03-2017
 * 
 */
/* #pragma GCC diagnostic error "-std=c++11" */
#include <bits/stdc++.h>

inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    if (s == t) {
        t = (s = buf) + fread(buf, 1, IN_LEN, stdin);
        if (s == t) return -1;
    }
    return *s++;
}

template<class T>
inline void read(T &x) {
    static bool iosig;
    static char c;
    for (iosig = false, c = read(); !isdigit(c); c = read()) {
        if (c == -1) return;
        if (c == '-') iosig = true;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    if (iosig) x = -x;
}

const int OUT_LEN = 1000000;
char obuf[OUT_LEN], *oh = obuf;
inline void print(char c) {
    if (oh == obuf + OUT_LEN) fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf;
    *oh++ = c;
}

template<class T>
inline void print(T x) {
    static int buf[30], cnt;
    if (x == 0) {
        print('0');
    } else {
        if (x < 0) print('-'), x = -x;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 + 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}

namespace SuffixAutomation {

const int MAXN = 300005 << 1;

struct Node {
    typedef std::map<int, Node *> Map;
    Map next;
    Node *fa;
    int max;

    Node(int max = 0) : max(max) {}

    Node(int max, Node *p) {
        *this = *p, this->max = max;
    }

    inline void *operator new(size_t);
} pool[MAXN << 1], *cur = pool, *root, *last;


inline void *Node::operator new(size_t) {
    return cur++;
}

inline void init() {
    root = last = new Node();
}

inline Node *extend(int c, Node *p) {
    Node *np = new Node(p->max + 1);
    while (p && p->next.find(c) == p->next.end()) p->next[c] = np, p = p->fa;
    if (!p) {
        np->fa = root;
    } else {
        Node *q = p->next[c];
        if (q->max == p->max + 1) {
            np->fa = q;
        } else {
            Node *nq = new Node(p->max + 1, q);
            q->fa = np->fa = nq;
            while (p && p->next[c] == q) p->next[c] = nq, p = p->fa;
        }
    }
    return np;
}

inline void solve() {
    init();
    register int n;
    read(n);
    static int buf[MAXN];
    for (register int i = 0; i < n; i++) read(buf[i]);
    for (register int i = 0; i < n; i++) last = extend(buf[i], last);
    for (register int i = 0; i < n; i++) last = extend(buf[i], last);
    Node *p = root;
    for (register int i = 1; i < n; i++) {
        print(p->next.begin()->first), print(' ');
        p = p->next.begin()->second;
    }
    print(p->next.begin()->first);
}

}

int main() {
#ifndef ONLINE_JUDGE
    freopen("in.in", "r", stdin);
#endif
    SuffixAutomation::solve();
    flush();
    return 0;
}
```
### 「SPOJ-1812」LCS2
**链接:** [SPOJ-7258](http://www.spoj.com/problems/LCS2/)
题意: 求多个串的最长公共子串长度。

依次加入每一个串，在更新答案时，对于同一个串，在每一个结点上保存匹配长度的最大值。再遍历一遍，更新所有串在每一个结点上的匹配长度的最小值，其中的最大值就是对于当前串的答案。

需要注意的点：

- 计算结点 $p$ 上的答案时，不要忘记更新 $p->fa$ 的答案为 $p->fa->max$。
- 最开始结点 $p$ 上的答案(minMatch)是有初始值的，即 $p->max$。
- 并不需要基排，$vector$ 仍然能实现(需要开输入优化)。


``` cpp
/*
 * created by xehoth on 15-03-2017
 * clang C++14
 */
/* #pragma GCC diagnostic error "-std=c++11" */
#include <bits/stdc++.h>

const int IN_LEN = 1000000;
char buf[IN_LEN], *s, *t;

inline char read() {
    if (s == t) {
        t = (s = buf) + fread(buf, 1, IN_LEN, stdin);
        if (s == t) return -1;
    }
    return *s++;
}

template<class T>
inline void read(T &x) {
    static bool iosig;
    static char c;
    for (iosig = false, c = read(); !isdigit(c); c = read()) {
        if (c == '-') iosig = true;
        if (c == -1) return;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    if (iosig) x = -x;
}

inline int read(char *buf) {
    register size_t s = 0;
    register char ch;
    while (ch = read(), isspace(ch) && ch != -1);
    if (ch == EOF) {
        *buf = '\0';
        return -1;
    }
    do buf[s++] = ch; while (ch = read(), !isspace(ch) && ch != -1);
    buf[s] = '\0';
    return s;
}

namespace SuffixAutomation {

const int MAXN = 200001;

struct Node {
    Node *next[26], *fa;

    int max;
    int minMatchLen, maxMatchLen;
    Node(int max = 0) : max(max), minMatchLen(max), maxMatchLen(0), fa(NULL) {}

    Node(int max, Node *p) {
        *this = *p, this->max = max, minMatchLen = max, maxMatchLen = 0;
    }

    inline void *operator new(size_t);
} pool[MAXN], *cur = pool, *root, *last;

inline void *Node::operator new(size_t) {
    return cur++;
}

inline void init() {
    cur = pool;
    root = last = new Node();
}

inline Node *extend(int c, Node *p) {
    Node *np = new Node(p->max + 1);
    while (p && !p->next[c]) p->next[c] = np, p = p->fa;
    if (!p) {
        np->fa = root;
    } else {
        Node *q = p->next[c];
        if (q->max == p->max + 1) {
            np->fa = q;
        } else {
            Node *nq = new Node(p->max + 1, q);
            q->fa = np->fa = nq;
            while (p && p->next[c] == q) p->next[c] = nq, p = p->fa;
        }
    }
    return np;
}

std::vector<Node *> buc[MAXN];
Node *top[MAXN];
int tot;

inline void topoSort(const int n) {
    for (Node *p = pool; p != cur; p++) buc[p->max].push_back(p);
    for (register int i = 0; i <= n; i++)
        for (register int p = 0; p < buc[i].size(); p++)
            top[tot++] = buc[i][p];
}

inline int solve(const char *s, const int len) {
    Node *p = root;
    register int res = 0, max = 0;
    for (register int i = 0; i < len; i++) {
        if (p->next[s[i] - 'a']) {
            max++, p = p->next[s[i] - 'a'];
        } else {
            while (p && !p->next[s[i] - 'a']) p = p->fa;
            if (!p) max = 0, p = root;
            else max = p->max + 1, p = p->next[s[i] - 'a'];
        }
        p->maxMatchLen = std::max(p->maxMatchLen, max);
    }
    for (register int i = tot - 1; i; i--) {
        top[i]->minMatchLen = std::min(top[i]->minMatchLen, top[i]->maxMatchLen);
        top[i]->fa->maxMatchLen = std::max(top[i]->maxMatchLen,
                                           top[i]->fa->maxMatchLen);
        top[i]->maxMatchLen = 0, res = std::max(res, top[i]->minMatchLen);
    }
    return res;
}

inline void solve() {
    init();
    static char s[MAXN];
    register int n = read(s);
    for (register int i = 0; i < n; i++) last = extend(s[i] - 'a', last);
    topoSort(n);
    register int ans = n;
    while (~(n = read(s))) {
        ans = solve(s, n);
    }
    std::cout << ans;
}

}

int main() {
#ifndef ONLINE_JUDGE
    freopen("in.in", "r", stdin);
#endif
    SuffixAutomation::solve();
    return 0;
}
```
### 「Codevs-3160」最长公共子串
**链接:** [Codevs-3160](http://codevs.cn/problem/3160/)
此题同 SPOJ-LCS，再练一发模板就好了(此题还同POJ-2774)。

### 「POJ-1743」Musical Theme
**链接:** [POJ-1743](http://poj.org/problem?id=1743)
**题意:** 
有 $N(1 <= N <=20000)$ 个音符的序列来表示一首乐曲，每个音符都是 $1..88$ 范围内的整数，现在要找一个重复的主题。“主题”是整个音符序列的一个子串，它需要满足如下条件：

1. 长度至少为 $5$ 个音符。
2. 在乐曲中重复出现。(可能经过转调，“转调”的意思是主题序列中每个音符都被加上或减去了同一个整数值)
3. 重复出现的同一主题不能有公共部分。

后缀数组经典裸题，但我们还是可以用后缀自动机来做。

先差分，处理出每一个结点的 $endpos$ 集合中的最大和最小值, $maxPos - minPos -1$ 和 $max$ 之间的最小值就是这个结点上的答案。

注意最后答案需要 $+1$，因为在最开始差分了。

``` cpp
/*
 * created by xehoth on 19-03-2017
 */
#include <cstdio>
#include <vector>
#include <cstring>
#include <iostream>

namespace SuffixAutomation {

const int MAXN = 20005;

struct Node {
    Node *fa, *next[175];

    int max, minPos, maxPos;

    Node(int max = 0) : max(max), minPos(20000), maxPos(0), fa(NULL) {
        memset(next, 0, sizeof(next));
    }

    Node(int max, Node *p) {
        *this = *p, this->max = max;
    }

    inline void *operator new(size_t);
} pool[MAXN << 1], *cur = pool, *root, *last;

int n, a[MAXN];
std::vector<Node *> buc[MAXN];

inline void *Node::operator new(size_t) {
    return cur++;
}

inline void init() {
    cur = pool;
    root = last = new Node();
    for (register int i = 0; i <= n; i++) buc[i].clear();
}

inline Node *extend(int c, Node *p) {
    Node *np = new Node(p->max + 1);
    while (p && !p->next[c]) p->next[c] = np, p = p->fa;
    if (!p) {
        np->fa = root;
    } else {
        Node *q = p->next[c];
        if (q->max == p->max + 1) {
            np->fa = q;
        } else {
            Node *nq = new Node(p->max + 1, q);
            q->fa = np->fa = nq;
            while (p && p->next[c] == q) p->next[c] = nq, p = p->fa;
        }
    }
    return np;
}

inline int getAns() {
    register int res = 0;
    Node *p = root;
    p->minPos = p->maxPos = 0;
    for (register int i = 0; i < n; i++)
        p = p->next[a[i]], p->maxPos = p->minPos = i + 1;
    for (Node *i = pool; i != cur; i++) buc[i->max].push_back(i);
    for (register int i = n; i; i--) {
        for (register int j = 0; j < buc[i].size(); j++) {
            Node *tmp = buc[i][j];
            res = std::max(res, std::min(tmp->max, tmp->maxPos - tmp->minPos - 1));
            tmp->fa->minPos = std::min(tmp->fa->minPos, tmp->minPos);
            tmp->fa->maxPos = std::max(tmp->fa->maxPos, tmp->maxPos);
        }
    }
    return res < 4 ? 0 : res + 1;
}

inline void solve() {
    while (scanf("%d", &n), n) {
        for (register int i = 0; i < n; i++) scanf("%d", a + i);
        n--;
        for (register int i = 0; i < n; i++) a[i] = a[i + 1] - a[i] + 87;
        init();
        for (register int i = 0; i < n; i++) last = extend(a[i], last);
        std::cout << getAns() << "\n";
    }
}
}

int main() {
#ifndef ONLINE_JUDGE
    freopen("in.in", "r", stdin);
#endif
    SuffixAutomation::solve();
    return 0;
}
```
### 「SPOJ-DISUBSTR」Distinct Substrings
**链接:** [SPOJ-DISUBSTR](http://www.spoj.com/problems/DISUBSTR/)

**题意:** 问互不相同的子串个数。

其实就是每一个结点能够表示的字符串个数的和。$p->max - p->fa->max$ 加起来就好了。

**注意:** 题目没有说只有大写字母...
``` cpp
/*
 * created by xehoth on 19-03-2017
 */
#include <bits/stdc++.h>

namespace SuffixAutomation {

const int MAXN = 1005;

struct Node {
    Node *fa, *next[128];

    int max;

    Node(int max = 0) : max(max), fa(NULL) {
        memset(next, 0, sizeof(next));
    }

    Node(int max, Node *q) {
        *this = *q, this->max = max;
    }

    inline void *operator new(size_t);
} pool[MAXN << 1], *cur = pool, *root, *last;

inline void *Node::operator new(size_t) {
    return cur++;
}

int ans;

inline void init() {
    cur = pool;
    root = last = new Node();
    ans = 0;
}

inline Node *extend(int c, Node *p) {
    Node *np = new Node(p->max + 1);
    while (p && !p->next[c]) p->next[c] = np, p = p->fa;
    if (!p) {
        np->fa = root;
    } else {
        Node *q = p->next[c];
        if (q->max == p->max + 1) {
            np->fa = q;
        } else {
            Node *nq = new Node(p->max + 1, q);
            q->fa = np->fa = nq;
            while (p && p->next[c] == q) p->next[c] = nq, p = p->fa;
        }
    }
    ans += np->max - np->fa->max;
    return np;
}

inline void solve() {
    register int n;
    scanf("%d", &n);
    for (register int i = 0; i < n; i++) {
        static char s[MAXN];
        scanf("%s", s);
        init();
        register int len = strlen(s);
        for (register int i = 0; i < len; i++) last = extend(s[i], last);
        std::cout << ans << "\n";
    }
}
}

int main() {
#ifndef ONLINE_JUDGE
    freopen("in.in", "r", stdin);
#endif
    SuffixAutomation::solve();
    return 0;
}
```
### 「SPOJ-SUBST1」New Distinct Substrings
**链接** [SPOJ-SUBST1](http://www.spoj.com/problems/SUBST1/)

**题意:** 同上

只是上一题的数据加强版，可以再打一遍板熟悉熟悉...
``` cpp
/*
 * created by xehoth on 19-03-2017
 */
#include <bits/stdc++.h>

namespace SuffixAutomation {

const int MAXN = 50000;

struct Node {
    Node *fa, *next[128];

    int max;

    Node(int max = 0) : max(max), fa(NULL) {
        memset(next, 0, sizeof(next));
    }

    Node(int max, Node *q) {
        *this = *q, this->max = max;
    }

    inline void *operator new(size_t);
} pool[MAXN + 1 << 1], *cur = pool, *root, *last;

inline void *Node::operator new(size_t) {
    return cur++;
}

int ans;

inline void init() {
    cur = pool;
    ans = 0;
    root = last = new Node();
}

inline Node *extend(int c, Node *p) {
    Node *np = new Node(p->max + 1);
    while (p && !p->next[c]) p->next[c] = np, p = p->fa;
    if (!p) {
        np->fa = root;
    } else {
        Node *q = p->next[c];
        if (q->max == p->max + 1) {
            np->fa = q;
        } else {
            Node *nq = new Node(p->max + 1, q);
            q->fa = np->fa = nq;
            while (p && p->next[c] == q) p->next[c] = nq, p = p->fa;
        }
    }
    ans += np->max - np->fa->max;
    return np;
}

inline void solve() {
    register int n;
    scanf("%d", &n);
    for (register int i = 0; i < n; i++) {
        static char s[MAXN];
        scanf("%s", s);
        init();
        register int len = strlen(s);
        for (register int i = 0; i < len; i++) last = extend(s[i], last);
        std::cout << ans << "\n";
    }
}
}

int main() {
    SuffixAutomation::solve();
    return 0;
}
```
### 「BZOJ-2946」[Poi2000]公共串
**链接:** [BZOJ-2946](http://www.lydsy.com/JudgeOnline/problem.php?id=2946)

此题不就是 SPOJ LCS2 吗?
``` cpp
/*
 * created by xehoth on 19-03-2017
 */
#include <bits/stdc++.h>

const int IN_LEN = 1000000;
char buf[IN_LEN], *s, *t;

inline char read() {
    if (s == t) {
        t = (s = buf) + fread(buf, 1, IN_LEN, stdin);
        if (s == t) return -1;
    }
    return *s++;
}

template<class T>
inline void read(T &x) {
    static bool iosig;
    static char c;
    for (iosig = false, c = read(); !isdigit(c); c = read()) {
        if (c == '-') iosig = true;
        if (c == -1) return;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    if (iosig) x = -x;
}

inline int read(char *buf) {
    register size_t s = 0;
    register char ch;
    while (ch = read(), isspace(ch) && ch != -1);
    if (ch == EOF) {
        *buf = '\0';
        return -1;
    }
    do buf[s++] = ch; while (ch = read(), !isspace(ch) && ch != -1);
    buf[s] = '\0';
    return s;
}

namespace SuffixAutomation {

const int MAXN = 200001;

struct Node {
    Node *next[26], *fa;

    int max;
    int minMatchLen, maxMatchLen;
    Node(int max = 0) : max(max), minMatchLen(max), maxMatchLen(0), fa(NULL) {}

    Node(int max, Node *p) {
        *this = *p, this->max = max, minMatchLen = max, maxMatchLen = 0;
    }

    inline void *operator new(size_t);
} pool[MAXN], *cur = pool, *root, *last;

inline void *Node::operator new(size_t) {
    return cur++;
}

inline void init() {
    cur = pool;
    root = last = new Node();
}

inline Node *extend(int c, Node *p) {
    Node *np = new Node(p->max + 1);
    while (p && !p->next[c]) p->next[c] = np, p = p->fa;
    if (!p) {
        np->fa = root;
    } else {
        Node *q = p->next[c];
        if (q->max == p->max + 1) {
            np->fa = q;
        } else {
            Node *nq = new Node(p->max + 1, q);
            q->fa = np->fa = nq;
            while (p && p->next[c] == q) p->next[c] = nq, p = p->fa;
        }
    }
    return np;
}

std::vector<Node *> buc[MAXN];
Node *top[MAXN];
int tot;

inline void topoSort(const int n) {
    for (Node *p = pool; p != cur; p++) buc[p->max].push_back(p);
    for (register int i = 0; i <= n; i++)
        for (register int p = 0; p < buc[i].size(); p++)
            top[tot++] = buc[i][p];
}

inline int solve(const char *s, const int len) {
    Node *p = root;
    register int res = 0, max = 0;
    for (register int i = 0; i < len; i++) {
        if (p->next[s[i] - 'a']) {
            max++, p = p->next[s[i] - 'a'];
        } else {
            while (p && !p->next[s[i] - 'a']) p = p->fa;
            if (!p) max = 0, p = root;
            else max = p->max + 1, p = p->next[s[i] - 'a'];
        }
        p->maxMatchLen = std::max(p->maxMatchLen, max);
    }
    for (register int i = tot - 1; i; i--) {
        top[i]->minMatchLen = std::min(top[i]->minMatchLen, top[i]->maxMatchLen);
        top[i]->fa->maxMatchLen = std::max(top[i]->maxMatchLen,
                                           top[i]->fa->maxMatchLen);
        top[i]->maxMatchLen = 0, res = std::max(res, top[i]->minMatchLen);
    }
    return res;
}

inline void solve() {
    init();
    static char s[MAXN];
    register int n;
    read(n), n = read(s);
    for (register int i = 0; i < n; i++) last = extend(s[i] - 'a', last);
    topoSort(n);
    register int ans = n;
    while (~(n = read(s))) {
        ans = solve(s, n);
    }
    std::cout << ans;
}

}

int main() {
#ifndef ONLINE_JUDGE
    freopen("in.in", "r", stdin);
#endif
    SuffixAutomation::solve();
    return 0;
}
```

