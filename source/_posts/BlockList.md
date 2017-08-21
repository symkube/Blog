---
title: 块状链表模板
date: 2017-01-11 13:24:34
tags:
  - 数据结构
  - 学习笔记
categories:
  - oi
  - 学习笔记
---
在进行算法设计时，我们常用的两种线性数据结构是数组和链表。它们各有优缺点。数组特点是元素在内存中紧挨着存储，因而优点是定位快 $O(1)$，缺点是插入删除慢 $O(n)$；而链表则不同，它通过指针将不同位置的元素链接起来，因而优缺点与数组正好相反：定位慢 $O(n)$，插入删除快 $O(1)$。而块状链表，它将数组和链表的优点结合来，各种操作的时间复杂度均为 $O(\sqrt n)$。
<!-- more -->
### 代码
``` cpp
/*
 * created by xehoth on 11-01-2017
 * an implement of BlockList
 */
#include <bits/stdc++.h>

inline int read() {
    int x = 0;
    bool iosig = false;
    char c = getchar();
    for (; !isdigit(c); c = getchar()) if (c == '-') iosig = 1;
    for (; isdigit(c); c = getchar()) x = (x << 1) + (x << 3) + (c ^ '0');
    return iosig ? -x : x;
}

class BlockList {
private:
    typedef int DataType;
    typedef std::vector<DataType> Vector;

    int blockSize; /* 块大小,一般为sqrt(n) */

    /* 块 */
    struct Block {
        Vector data;
    };


    typedef std::list<Block> List;

    List list;

public:

    /**
     *返回x的下一个块
     * @param x the current iterator of the BlockList
     * @return the next block's iterator
     */
    inline List::iterator nextBlock(List::iterator x) {
        return ++x;
    }

    /**
     *返回整个块链中,下标p所在的块,下标默认从1开始
     *@param x the key, the position begin with 1
     *@return the iterator of the block
     */
    inline List::iterator findBlock(const DataType &x) {
        register int cnt = 0;
        for (List::iterator it = list.begin(); it != list.end(); it++) {
            cnt += it->data.size();
            if (cnt >= x) return it;
        }
        return list.end();
    }

    /**
     *尾迭代器,仅用于单次判断
     *@return the end of the list
     */
    inline List::iterator end() {
        return list.end();
    }

    /**
     *将b合并给a
     *@param two iterators
     */
    inline void merge(List::iterator a, List::iterator b) {
        a->data.insert(a->data.end(), b->data.begin(), b->data.end());
    }

    /**
     *维护块链的形态,保证每块的元素数恰当
     */
    inline void maintain() {
        List::iterator cur = list.begin(), next;
        while (cur != list.end()) {
            next = nextBlock(cur);
            while (next != list.end() && cur->data.size() + next->data.size() <= blockSize) {
                merge(cur, next), next = nextBlock(cur);
            }
            cur++;
        }
    }

    /**
     *在cur的p前分裂该块
     *@param cur a block iterator
     *@param p the pos
     */
    inline void split(List::iterator cur, int p) {
        if (p == cur->data.size()) return;
        List::iterator newBlock = list.insert(nextBlock(cur), Block());
        newBlock->data.assign(cur->data.begin() + p, cur->data.end());
        cur->data.erase(cur->data.begin() + p, cur->data.end());
    }

    /**
     *在p处插入x个数,待插入的权值均为v
     *@param p pos
     *@param x the count of the v
     */
    inline void insert(const int p, const int x, const DataType &v) {
        List::iterator cur = findBlock(p), newBlock;
        split(cur, p);
        register int cnt = 0;
        while (cnt + blockSize <= x) {
            newBlock = list.insert(nextBlock(cur), Block());
            newBlock->data.assign(blockSize, v);
            cur = newBlock;
            cnt += blockSize;
        }
        if (x != cnt) {
            newBlock = list.insert(nextBlock(cur), Block());
            cur->data.assign(blockSize, v);
        }
        maintain();
    }

    /**
     *删除块链中从p位置开始的x个数
     *@param p pos
     */
    inline void erase(const int p, int x) {
        List::iterator cur = findBlock(p);
        split(cur, p), cur++;
        List::iterator next = cur;
        while (next != list.end() && x > next->data.size()) {
            x -= next->data.size();
            next++;
        }
        split(next, x);
        list.erase(cur, nextBlock(next));
        maintain();
    }

    BlockList(int n = 10000) : blockSize(sqrt(n)) {}

    BlockList(int n, int size) {
        blockSize = size;
    }

    inline void clear() {
        list.clear(), blockSize = 0;
    }

    inline void init(int n) {
        blockSize = sqrt(n);
    }

    inline void init(int n, int size) {
        blockSize = size;
    }

};

int main() {

    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=730861&auto=1&height=66"></iframe>