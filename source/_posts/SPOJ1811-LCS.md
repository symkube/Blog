---
title: 「SPOJ-1811」LCS-后缀自动机
date: 2017-03-12 20:35:34
tags:
  - 字符串
  - 后缀自动机
categories:
  - oi
  - 字符串
  - 后缀自动机
---
A string is finite sequence of characters over a non-empty finite set Σ.

In this problem, Σ is the set of lowercase letters.

Substring, also called factor, is a consecutive sequence of characters occurrences at least once in a string.

Now your task is simple, for two given strings, find the length of the longest common substring of them.

Here common substring means a substring of two or more strings.
<!-- more -->
### 链接
[SPOJ-1811](http://www.spoj.com/problems/LCS/)

### 题解
题意：求两个字符串A,B的最长公共子串。字符串长度不超过 $250000$。

我们先构造 $A$ 的 $SAM$，然后用 $A$ 的 $SAM$ 一次读入 $B$ 的每一个字符，初始时状态在 $root$ 处，此时最大匹配数为 $0$，（这里的最大匹配数是指以当前读入的字符结尾，往前能匹配的最大长度），设当前到达的状态为 $p$，最大匹配数为 $res$，读入的字符为 $x$，若 $p->next[x]!=NULL$，则说明可从当前状态读入一个字符 $x$ 到达下一个状态，则 $res++,p=p->next[x]$,否则，找到 $p$ 的第一个祖先 $s$，$s->next[x]!=NULL$,若 $s$ 不存在，则说明以 $x$ 结尾的字符串无法和 $A$ 串的任何位置匹配，则设 $res=0,p=root$。否则，设 $res=s->res+1,p=s->next[x]$。我们求$res$ 所达到的最大值即为所求．

### 代码
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
     //   memset(next, 0, sizeof(next));
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

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=706175&auto=1&height=66"></iframe>