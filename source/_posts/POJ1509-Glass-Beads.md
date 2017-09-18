---
title: 「POJ1509」Glass Beads-后缀自动机
date: 2017-03-12 16:24:03
tags:
  - 字符串
  - 后缀自动机
categories:
  - OI
  - 字符串
  - 后缀自动机
---
Once upon a time there was a famous actress. As you may expect, she played mostly Antique Comedies most of all. All the people loved her. But she was not interested in the crowds. Her big hobby were beads of any kind. Many bead makers were working for her and they manufactured new necklaces and bracelets every day. One day she called her main Inspector of Bead Makers (IBM) and told him she wanted a very long and special necklace. 

The necklace should be made of glass beads of different sizes connected to each other but without any thread running through the beads, so that means the beads can be disconnected at any point. The actress chose the succession of beads she wants to have and the IBM promised to make the necklace. But then he realized a problem. The joint between two neighbouring beads is not very robust so it is possible that the necklace will get torn by its own weight. The situation becomes even worse when the necklace is disjoined. Moreover, the point of disconnection is very important. If there are small beads at the beginning, the possibility of tearing is much higher than if there were large beads. IBM wants to test the robustness of a necklace so he needs a program that will be able to determine the worst possible point of disjoining the beads. 

The description of the necklace is a string A = a1a2 ... am specifying sizes of the particular beads, where the last character am is considered to precede character a1 in circular fashion. 

The disjoint point i is said to be worse than the disjoint point j if and only if the string aiai+1 ... ana1 ... ai-1 is lexicografically smaller than the string ajaj+1 ... ana1 ... aj-1. String a1a2 ... an is lexicografically smaller than the string b1b2 ... bn if and only if there exists an integer i, i <= n, so that aj=bj, for each j, 1 <= j < i and ai < bi
<!-- more -->

### 题解
题意就是给一个字符串 $S$，每次可以将它的第一个字符移到最后面，求这样能得到的字典序最小的字符串。输出开始下标。
此题可用最小表示法，但用后缀自动机练习板子还是挺不错的，我们把原串复制一遍建立 $SAM$，然后考虑贪心，每次跳到最左的节点，走 $len$ 次即为原串的循环最小表示。

### 代码
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
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=836330&auto=1&height=66"></iframe>