---
title: 「HDU-2222」Keywords Search-AC自动机
date: 2017-01-02 08:04:04
tags:
  - 字符串
  - AC自动机
categories:
  - OI
  - 字符串
  - AC自动机
---
In the modern time, Search engine came into the life of everybody like Google, Baidu, etc.
Wiskey also wants to bring this feature to his image retrieval system.
Every image have a long description, when users type some keywords to find the image, the system will match the keywords with description of image and show the image which the most keywords be matched.
To simplify the problem, giving you a description of image, and some keywords, you should tell me how many keywords will be match.
<!-- more -->
### 链接
[HDU-2222](http://acm.hdu.edu.cn/showproblem.php?pid=2222)
### 题解
~~直接套板子，还需要什么题解?~~
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
#include <queue>
char str[1000000 + 100];
struct Node {
    int cnt;
    Node *next[26];
    Node *fail;
    inline Node *init() { return memset(next, 0, sizeof(next)), cnt = 0, fail = NULL, this; }
} *root;
template<class T, size_t size>
struct MemoryPool {
    T buf[size], *st[size], *tail, *end;
    int top;
    MemoryPool() : top(0), tail(buf), end(buf + size) {}
    inline T *alloc() {
        if (top) return st[--top];
        if (tail != end) return tail++;
        return new T;
    }
    inline void recycle(T *x) {
        if (top > size) delete x;
        else st[top++] = x;
    }
};
MemoryPool<Node, 1000000> pool;
inline void insert() {
    register int len = strlen(str);
    Node *p = root;
    for (register int k = 0; k < len; k++) {
        register int pos = str[k] - 'a';
        if (p->next[pos] == NULL) p->next[pos] = pool.alloc()->init(), p = p->next[pos];
        else p = p->next[pos];
    }
    p->cnt++;
}
inline void build() {
    Node *p = root, *next;
    std::queue<Node *>q;
    q.push(root);
    while (!q.empty()) {
        p = q.front(), q.pop();
        for (register int i = 0; i < 26; ++i) {
            if (p->next[i]) {
                next = p->fail;
                while (next && !next->next[i]) next = next->fail;
                p->next[i]->fail = (next ? next->next[i] : root), q.push(p->next[i]);
            }
        }
    }
}
inline void query() {
    register int len = strlen(str), cnt = 0;
    Node *p = root, *tmp;
    for (register int i = 0; i < len; i++) {
        register int pos = str[i] - 'a';
        while (!p->next[pos] && p != root) p = p->fail;
        p = p->next[pos];
        if (!p) p = root;
        tmp = p;
        while (tmp != root) {
            if (tmp->cnt >= 0) cnt += tmp->cnt, tmp->cnt = -1;
            else break;
            tmp = tmp->fail;
        }
    }
    printf("%d\n", cnt);
}
int main() {
    register int cas, n;
    scanf("%d", &cas);
    while (cas--) {
        root = pool.alloc()->init();
        root->fail = NULL;
        scanf("%d", &n);
        getchar();
        for (register int i = 0; i < n; i++) gets(str), insert();
        build(), gets(str), query();
    }
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=28524850&auto=1&height=66"></iframe>
