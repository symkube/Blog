---
title: "替罪羊树学习笔记[模板]"
date: 2016-11-26 23:00:35
tags:
  - 平衡树
  - 学习笔记
categories:
  - OI
  - 学习笔记
---
## 替罪羊树学习总结\[模板\]
传说中效率极高且较为好写的平衡树(抛开丧心病狂的红黑树和veb树)，替罪羊树写法相当暴力，不用旋转，它只会选择性地重新构树来保证复杂度。
<!-- more -->
### 实现
#### 实现动态内存静态化
动态内存确实好啊，尤其是线段树合并时，但缺点就是太慢了，我们将动态内存静态化（带垃圾回收），就能达到动态的优点并保证效率。

先分配好足量的内存，然后在 $new$ 时调用 $alloc$，在 $delete$ 时调用 $recycle$ 就好了。

**注意：recycle后并未清空数据，最好在每次alloc后，修改 T 的每个值或写一个clear之类的**
``` cpp
template<class T, size_t size>
struct MemoryPool {
    T buf[size], *tail;
    T *st[size];
    int top;
    MemoryPool() : top(0), tail(buf) {}
    inline T *alloc() {
        return top ? st[--top] : tail++;
    }
    inline void recycle(T *p) {
        st[top++] = p;
    }
};
```
#### 重构
重构允许重构整棵替罪羊树，也允许重构替罪羊树其中的一棵子树。
重构这个操作看似高端，实则十分暴力。主要操作就是把需要重构的子树拍平，然后拎起序列的中点，作为根部，剩下的左半边序列为左子树，右半边序列为右子树，接着递归对左边和右边进行同样的操作，直到最后形成的树中包含的全部为点而不是序列。
#### 插入
由于替罪羊树是重量平衡树，插入操作一开始和普通的二叉搜索树无异，但在插入操作结束以后，从插入位置开始一层一层往上回溯的时候，对于每一层都进行一次判断 $h(v)>log(\frac{1}{\alpha})\times size(tree)$ ($\alpha$ 为常数，可以通过调整 $\alpha$ 的大小来控制树的平衡度)，一直找到最后一层不满足该条件的层序号，然后从该层开始重构以该层为根的子树。

每次插入操作的复杂度为$O(logn)$，每次重构树的复杂度为$O(n)$，但由于不会每次都要进行重构，也不会每次都重构一整棵树，所以均摊下来的复杂度还是$O(logn)$。
#### 删除
替罪羊树没有直接删除，而是打上标记（懒惰操作），当删除的数量超过树的节点数的一半时，直接重构233333！
#### 模板\[bzoj3224\]
题目：[普通平衡树bzoj3224](http://www.lydsy.com/JudgeOnline/problem.php?id=3224)
``` cpp
#include <bits/stdc++.h>
using namespace std;
template<class T, size_t size>
struct MemoryPool {
    T buf[size], *tail;
    T *st[size];
    int top;
    MemoryPool() : top(0), tail(buf) {}
    inline T *alloc() {
        return top ? st[--top] : tail++;
    }
    inline void recycle(T *p) {
        st[top++] = p;
    }
};
struct ScapegoatTree {
    static const double alpha = 0.75;
    static const int MAXN = 100010;
    struct Node {
        Node * ch[2];
        int key, size, cover; /* size为有效节点的数量，cover为节点总数量 */
        bool exist; /* 是否存在（即是否被删除） */
        inline void update() {
            size = ch[0]->size + ch[1]->size + (int)exist, cover = ch[0]->cover + ch[1]->cover + 1;
        }
        inline bool check(void) { /* 判断是否需要重构 */
            return ((ch[0]->cover > cover * alpha + 5) || (ch[1]->cover > cover * alpha + 5));
        }
    };
    Node *root, *null;
    MemoryPool<Node, MAXN> pool;
    Node *newNode(int key) {
        Node *p = pool.alloc();
        p->ch[0] = p->ch[1] = null, p->size = p->cover = 1, p->exist = true, p->key = key;
        return p;
    }
    inline void travel(Node *p, std::vector<Node *> &v) {
        if (p == null) return;
        travel(p->ch[0], v);
        if (p->exist) v.push_back(p); /* 构建序列 */
        else pool.recycle(p); /* 回收 */
        travel(p->ch[1], v);
    }
    inline Node *divide(std::vector<Node *> &v, int l, int r) {
        if (l >= r) return null;
        int mid = l + r >> 1;
        Node *p = v[mid];
        p->ch[0] = divide(v, l, mid);
        p->ch[1] = divide(v, mid + 1, r);
        p->update(); /* 自底向上维护，先维护子树 */
        return p;
    }
    inline void rebuild(Node *&p) {
        static std::vector<Node *> v;
        v.clear(), travel(p, v), p = divide(v, 0, v.size());
    }
    inline Node **insert(Node *&p, int val) {
        if (p == null) {
            p = newNode(val);
            return &null;
        } else {
            p->size++, p->cover++;
            /* 返回值储存需要重构的位置，若子树也需要重构，本节点开始也需要重构，以本节点为根重构 */
            Node **res = insert(p->ch[val >= p->key], val);
            if (p->check()) res = &p;
            return res;
        }
    }
    inline void erase(Node *p, int id) {
        p->size--;
        register int offset = p->ch[0]->size + p->exist;
        if (p->exist && id == offset) {
            p->exist = false;
            return;
        } else {
            if (id <= offset) erase(p->ch[0], id);
            else erase(p->ch[1], id - offset);
        }
    }
    ScapegoatTree() {
        null = pool.alloc();
        null->ch[0] = null->ch[1] = null;
        null->cover = null->size = null->key = 0;
        root = null;
    }
    inline void insert(int val) {
        Node **p = insert(root, val);
        if (*p != null) rebuild(*p);
    }
    inline int rank(int val) {
        Node *p = root;
        register int ans = 1;
        while (p != null) {
            if (p->key >= val) p = p->ch[0];
            else {
                ans += p->ch[0]->size + p->exist;
                p = p->ch[1];
            }
        }
        return ans;
    }
    inline int select(int k) {
        Node * p = root;
        while (p != null) {
            if (p->ch[0]->size + 1 == k && p->exist) return p->key;
            else if (p->ch[0]->size >= k) p = p->ch[0];
            else k -= p->ch[0]->size + p->exist, p = p->ch[1];
        }
    }
    inline void erase(int k) {
        erase(root, rank(k));
        if (root->size < alpha * root->cover) rebuild(root);
    }
    inline void eraseByRank(int k) {
        erase(root, k);
        if (root->size < alpha * root->cover) rebuild(root);
    }
};
inline char read(void) {
    static char buf[100000], *p1 = buf, *p2 = buf;
    if (p1 == p2) {
        p2 = (p1 = buf) + fread(buf, 1, 100000, stdin);
        if (p1 == p2) return EOF;
    }
    return *p1++;
}
inline void read(int &x) {
    static char c; c = read(); int b = 1;
    for (x = 0; !isdigit(c); c = read()) if (c == '-') b = -b;
    for (; isdigit(c); x = (x << 1) + (x << 3) + (c ^ '0'), c = read()); x *= b;
}
ScapegoatTree tree;
int n, k, m;
int main(void) {
    read(n);
    while (n--) {
        read(k), read(m);
        switch (k) {
        case 1: tree.insert(m); break;
        case 2: tree.erase(m); break;
        case 3: printf("%d\n", tree.rank(m)); break;
        case 4: printf("%d\n", tree.select(m)); break;
        case 5: printf("%d\n", tree.select(tree.rank(m) - 1)); break;
        case 6: printf("%d\n", tree.select(tree.rank(m + 1))); break;
        }
    }
    return 0;
}
```
### 参考资料
- [g1n0st知乎专栏](https://zhuanlan.zhihu.com/p/21263304)
- WJMZBMR论文
- [Galperin93](http://www.akira.ruc.dk/~keld/teaching/algoritmedesign_f07/Artikler/03/Galperin93.pdf)


