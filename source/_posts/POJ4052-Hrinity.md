---
title: 「POJ-4052」Hrinity-AC自动机
date: 2017-01-02 17:29:32
tags:
  - 字符串
  - AC自动机
categories:
  - oi
  - 字符串
  - AC自动机
---
In the Christian religion, the Trinity is the union of the Father, the Son, and the
Holy Spirit in one God. Recently in a far-far-away country, a new word "Hrinity" was
created and became very popular. "Hrinity" means "The son is the father, and the
father is the son." But the word "Hrinity" has nothing to do with God or any religion.
It's about a writer and his son.
When the son was in high school, he failed all exams of all courses. As a none
famous writer, the son's worrying father carried out a bold plan: he wrote a long novel
and declared that it's his 16 year old son's work. An idiot kid can write a long novel?
That made a press interested and the press published the novel. Since then, the son got
famous and rich, and his father has been keep writing novels and articles on his son's
name.
<!-- more -->
### 链接
[POJ-4052](http://poj.org/problem?id=4052)

[题目链接](/pdf/poj4044-4053.pdf)
### 题解
这是一道神题，写挂了 7 次才调过，用母串 $S$ 在 $trie$ 图上遍历，走到未被忽略的终止节点 $x$，则将 $x$ 标记为已经匹配，并且半忽略 $x$。走到危险但非终止的节点 $y$, 则沿着 $y$ 的前缀指针链找到第一个终止节点 $x$,将 $x$ 标记为已经匹配，并且半忽略 $x$。统计匹配且未被忽略的模式串数目设置标记，处理过的危险节点和终止节点就不用再处理。

**注意不要重复计算一些多余的信息，注意节点的新建，各种恶心细节**
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
#include <bitset>
#include <queue>
#include <climits>
using namespace std;
char ch[2505][1105];
int vis[3000], n;
const int SIGMA = 26;
struct Node {
    int id, cnt;
    struct Node *next[SIGMA], *fail;
    Node() { id = 0, memset(next, 0, sizeof(next)); }
} *root;
inline int getIndex(char c) { return c - 'A'; }
inline void insert(const char *s, int t) {
    register int i = 0;
    Node *p = root;
    while (s[i]) {
        if (!p->next[getIndex(s[i])]) p->next[getIndex(s[i])] = new Node();
        p = p->next[getIndex(s[i])];
        i++;
    }
    p->id = 1, p->cnt = t;
}
inline void build() {
    root->fail = root;
    std::queue<Node *> q;
    q.push(root);
    while (!q.empty()) {
        Node *t = q.front(); q.pop();
        Node *p = 0;
        for (int i = 0; i < SIGMA; i++) {
            if (t->next[i] != 0) {
                if (t == root)  t->next[i]->fail = root;
                else {
                    p = t->fail;
                    while (p != root && p->next[i] == 0) p = p->fail;
                    if (p->next[i]) t->next[i]->fail = p->next[i];
                    else t->next[i]->fail = root;
                }
                q.push(t->next[i]);
            }
        }
    }
}
inline int bfs(char *s) {
    register int i = 0, sum = 0, len = strlen(s);
    Node *p = root;
    while (s[i]) {
        while (p->next[getIndex(s[i])] == 0 && p != root) p = p->fail;
        p = (p->next[getIndex(s[i])] == 0) ? root : p->next[getIndex(s[i])];
        Node *t = p;
        while (t != root && t->id != -3) {
            if (abs(t->id) == 1 && vis[t->cnt]) vis[t->cnt] = 0;
            t->id = -3, t = t->fail;
        }
        i++;
    }
}
inline int solve(char *s) {
    register int i = 0, sum = 0;
    Node *p = root;
    while (s[i]) {
        while (p->next[getIndex(s[i])] == 0 && p != root) p = p->fail;
        p = (p->next[getIndex(s[i])] == 0) ? root : p->next[getIndex(s[i])];
        Node *t = p;
        while (t != root && t->id != -4) {
            if (abs(t->id) == 1) sum ++;
            t->id = -4, t = t->fail;
        }
        i++;
    }
    return sum;
}
inline int query(char *s) {
    register int i = 0, sum = 0;
    Node *p = root;
    while (s[i]) {
        while (p->next[getIndex(s[i])] == 0 && p != root) p = p->fail;
        p = (p->next[getIndex(s[i])] == 0) ? root : p->next[getIndex(s[i])];
        Node *t = p;
        while (t != root && t->id >= 0) {
            if (t->id == 1) vis[t->cnt] = 1, t->id = -1;
            else t->id = -2;
            t = t->fail;
        }
        i++;
    }
    for (register int i = 1; i <= n; i++)
        if (vis[i])
            bfs(ch[i]), insert(ch[i], i);
    sum = solve(s);
    return sum;
}
char str1[5100009], str2[5100009];
int main() {
    register int m, T, i, j;
    scanf("%d", &T);
    while (T--) {
        memset(vis, 0, sizeof(vis));
        root = new Node();
        scanf("%d", &n);
        for (register int t = 1; t <= n; t++) {
            scanf("%s", str1 + 1);
            for (i = 1, j = 1; str1[i]; i++) {
                if (str1[i] >= 'A' && str1[i] <= 'Z') str2[j++] = str1[i];
                else {
                    i++;
                    register int k = str1[i] - '0';
                    i++;
                    while (str1[i] < 'A' || str1[i] > 'Z') k = (k << 1) + (k << 3) + (str1[i++] ^ '0');
                    while (k--) str2[j++] = str1[i];
                    i++;
                }
            }
            str2[j] = '\0', strcpy(ch[t], str2 + 1), insert(str2 + 1, t);
        }
        build();
        scanf("%s", str1 + 1);
        for (i = 1, j = 1; str1[i]; i++) {
            if (str1[i] >= 'A' && str1[i] <= 'Z') str2[j++] = str1[i];
            else {
                i++;
                register int k = str1[i] - '0';
                i++;
                while (str1[i] < 'A' || str1[i] > 'Z') k = (k << 1) + (k << 3) + (str1[i++] ^ '0');
                while (k--) str2[j++] = str1[i];
                i++;
            }
        }
        str2[j] = '\0';
        register int ans = query(str2 + 1);
        printf("%d\n", ans);
    }
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=27709038&auto=1&height=66"></iframe>
