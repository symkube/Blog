---
title: 「BJ模拟」「CF-Gym101190B」Binary Code-2-SAT
date: 2017-03-27 20:44:27
tags:
  - 图论
  - Tarjan
  - 2-SAT
categories:
  - oi
  - 图论
  - Tarjan
---
Ben 最近学习了二进制信息。一条二进制信息由 $n$ 个二进制码组成，第 $i$ 个二进制码记为 $s_i$ 。二进制码就是一个只包含 ′0′ 和 ′1′ 的字符串。一条二进制信息被称为“漂亮的二进制信息”当且仅当对于任意的 $i \neq j$，$s_i$ 都不是 $s_j$ 的前缀。二进制码 $x$ 是二进制码 $w$ 的前缀当且仅当存在一个二进制码 $y$ （长度可以为 $0$），使得 $xy = w$ ，例如 $x = 11$ 是 $w = 110$ 的前缀，$x = 0100$ 是 $w = 0100$ 的前缀。

Ben找到一张纸，上面写着二进制信息。可是，这张纸有点旧了，有些字符看不清。但是很幸运，每个二进制码都只包含最多一个看不清的字符。

Ben 想知道这 $n$ 个二进制码能否表示一条“漂亮的二进制信息”。也就是说，是否存在一种方案，用 ′0′ 或 ′1′ 替换那些看不清的字符，使得这条信息变为漂亮的二进制信息。
<!-- more -->
### 链接
[CF-Gym101190B](http://codeforces.com/gym/101190/attachments)
### 题解
首先召唤正解：

{% pdf /pdf/20170327B.pdf %}

然而我考场上的建图太麻烦了，并且评测机只有 $8MB$ 栈空间是几个意思QAQ......

~~然而我们只需要内联汇编开栈就好了啊....~~
### 代码
``` cpp
/*
 * created by xehoth on 27-03-2017
 */
#include <bits/stdc++.h>

inline int read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *h, *t;
    if (h == t) {
        t = (h = buf) + fread(buf, 1, IN_LEN, stdin);
        if (h == t) return -1;
    }
    return *h++;
}

template<class T>
inline bool read(T &x) {
    static bool iosig = 0;
    static char c;
    for (iosig = 0, c = read(); !isdigit(c); c = read()) {
        if (c == -1) return false;
        if (c == '-') iosig = 1;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    if (iosig) x = -x;
    return true;
}

inline int read(char *s) {
    register char c = read();
    register int len = 0;
    for (; !(c == '0' || c == '1' || c == '?'); c = read());
    for (; c == '0' || c == '1' || c == '?'; s[++len] = c, c = read());
    s[++len] = 0;
    return len - 1;
}

#define long long long

namespace TwoSat {

const int MAXN = 4000005;

std::vector<int> edge[MAXN];

inline void addEdge(const int u, const int v) {
    edge[u].push_back(v);
}

int idx;
int dfn[MAXN], low[MAXN];
int inComponent[MAXN], cnt;
std::stack<int> st;

inline void tarjan(int u) {
    dfn[u] = low[u] = ++idx, st.push(u);
    for (auto v : edge[u]) {
        if (!dfn[v]) tarjan(v), low[u] = std::min(low[u], low[v]);
        else if (!inComponent[v]) low[u] = std::min(low[u], dfn[v]);
    }
    if (low[u] == dfn[u]) {
        cnt++;
        register int v;
        do {
            v = st.top(), st.pop();
            inComponent[v] = cnt;
        } while (u != v);
    }
}
}

namespace Trie {

const int MAXN = 1000005;

int pos[MAXN << 1];

struct Node {
    Node *next[2], *fa;

    Node(Node *fa = NULL) : fa(fa) {}

    inline void *operator new(size_t);
} pool[MAXN], *cur = pool, *root;

inline void *Node::operator new(size_t) {
    return cur++;
}

inline void insert(const char *s, const int len, const int id) {
    Node *p = root;
    for (register int i = 1; i <= len; i++) {
        register int t = (s[i] == '1');
        if (!p->next[t]) p->next[t] = new Node(p);
        p = p->next[t];
    }
    Trie::pos[id] = p - pool;
}

inline void init() {
    root = new Node();
}
}

namespace Task {

const int MAXN = 1000005;

std::vector<int> last[MAXN];
int n, tot;
int blank[MAXN], ans[MAXN];
char s[MAXN << 1];
int len;
char *str[TwoSat::MAXN];

inline void init() {
    Trie::init();
    char *s = Task::s;
    read(n);
    for (register int i = 0; i < n; i++) {
        len = read(str[i] = s);
        s = str[i] + len + 1, *s = '\n';
        register int t = 0;
        for (register int j = 1; j <= len; j++) if (str[i][j] == '?') t = j;
        blank[i] = t;
        if (!t) {
            Trie::insert(str[i], len, i << 1);
            Trie::pos[i << 1 | 1] = Trie::pos[i << 1];
            TwoSat::addEdge(i << 1, i << 1 | 1);
        } else {
            str[i][t] = '0';
            Trie::insert(str[i], len, i << 1);
            str[i][t] = '1';
            Trie::insert(str[i], len, i << 1 | 1);
        }
    }
}

inline void build() {

    tot = n << 1;

    for (Trie::Node *p = Trie::root; p != Trie::cur; p++) {
        if (p->next[0]) {
            TwoSat::addEdge(tot + ((p - Trie::pool) << 1), tot +
                            ((p->next[0] - Trie::pool) << 1));
            TwoSat::addEdge(tot + ((p->next[0] - Trie::pool) << 1 | 1),
                            tot + ((p - Trie::pool) << 1 | 1));
        }
        if (p->next[1]) {
            TwoSat::addEdge(tot + ((p - Trie::pool) << 1), tot +
                            ((p->next[1] - Trie::pool) << 1));
            TwoSat::addEdge(tot + ((p->next[1] - Trie::pool) << 1 | 1),
                            tot + ((p - Trie::pool) << 1 | 1));
        }
    }

    for (register int i = 0; i < (n << 1); i++) {
        last[Trie::pos[i]].push_back(i);
        if (Trie::pool[Trie::pos[i]].next[0]) {
            TwoSat::addEdge(i, tot + ((Trie::pool[Trie::pos[i]].next[0] -
                                       Trie::pool) << 1));
        }
        if (Trie::pool[Trie::pos[i]].next[1]) {
            TwoSat::addEdge(i, tot + ((Trie::pool[Trie::pos[i]].next[1] -
                                       Trie::pool) << 1));
        }

        TwoSat::addEdge(i, tot + ((Trie::pool[Trie::pos[i]].fa -
                                   Trie::pool) << 1 | 1));
        TwoSat::addEdge(tot + (Trie::pos[i] << 1), i ^ 1);
        TwoSat::addEdge(tot + (Trie::pos[i] << 1 | 1), i ^ 1);
    }

    register int ncnt = Trie::cur - Trie::pool;
    tot = tot + (ncnt << 1);
    for (register int i = 0; i < ncnt; i++) {
        if (last[i].size() > 1) {
            register int tmp = tot;
            for (register int j = 0; j < last[i].size(); j++) {
                TwoSat::addEdge(tmp + j, last[i][j] ^ 1);
                if (j - 1 >= 0)
                    TwoSat::addEdge(tmp + j, tmp + j - 1);
            }
            tmp += last[i].size();
            for (register int j = 0; j < last[i].size(); j++) {
                TwoSat::addEdge(tmp + j, last[i][j] ^ 1);
                if (j + 1 < last[i].size())
                    TwoSat::addEdge(tmp + j, tmp + j + 1);
            }
            for (register int j = 0; j < last[i].size(); j++) {
                if (j - 1 >= 0)
                    TwoSat::addEdge(last[i][j], tot + j - 1);
                if (j + 1 < last[i].size())
                    TwoSat::addEdge(last[i][j], tmp + j + 1);
            }
            tot += 2 * last[i].size();
        }
    }
}

inline void solve() {
    init();
    build();

    for (register int i = 0; i < tot; i++)
        if (!TwoSat::dfn[i])
            TwoSat::tarjan(i);
    for (register int i = 0; i < n; i++)
        if (TwoSat::inComponent[i << 1] == TwoSat::inComponent[i << 1 | 1])
            printf("NO\n"), exit(0);
        else
            ans[i] = TwoSat::inComponent[i << 1] <
                     TwoSat::inComponent[i << 1 | 1] ? 0 : 1;
    for (register int i = 0; i < n; i++)
        if (blank[i])
            str[i][blank[i]] = '0' + ans[i];
    printf("YES\n");
    printf("%s", Task::s + 1);
}
}

extern int optimizedMain(void) __asm__ ("optimizedMain");

int optimizedMain() {
    Task::solve();
    exit(0);
}

int main() {
#ifndef ONLINE_JUDGE
    freopen("in.in", "r", stdin);
#endif
    int size = 80 << 20;  /* 80Mb */
    char *p = (char *)malloc(size) + size;
    __asm__ __volatile__(
        "movq  %0, %%rsp\n"
        "pushq $exit\n" 
        "jmp optimizedMain\n"
        :: "r"(p));
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=744674&auto=1&height=66"></iframe>