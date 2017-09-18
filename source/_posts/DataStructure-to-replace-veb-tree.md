---
title: 「乱搞」一种支持高效完成 VEB 树操作的数据结构
date: 2017-04-17 11:33:01
tags:
  - 补档计划
  - 乱搞
  - 黑科技
categories:
  - OI
  - 补档计划
---
前几天看 ZKW 线段树，ZKW 说用 Trie 式方法可以解决空间问题从而使 ZKW 线段树能当平衡树用，和 wuvin 讨论了一下发现这么做，时间要么只能优化插入，要么只能优化第 $k$ 大。
想了想，感觉可以将 Trie 树，ZKW 线段树，32 叉线段树，以及压位计算结合起来，这样就得到了一个空间消耗比 32 叉线段树小得多，时间效率比 ZKW 线段树快，结构类似 Trie 的神奇数据结构，~~常数可是比 VEB 小了太多~~....
实测效率相当高，若用数组实现，空间消耗为值域大小。
<!-- more -->
### 结构
大体上我们使用 Trie 树的结构，每个结点有 $8$ 个子结点的线段树，然后每个结点压位维护 $8$ 个子树是否非空，与 32 叉线段树不同的地方在于每个数除以 $8^n$ 的商存在了 Trie 节点上，而这个数转化为的 $8$ 进制数依次存在了 $Trie$ 每层对应节点二进制压位的数里，而这个数表示的就是对应子树是否为空。
### 操作
#### 寻址
根据 ZKW 的特性，ZKW 可以直接找到叶子节点，但我们这个数据结构变为了 $8$ 叉，怎么办？
直接预处理每个状态最左/右非空子树位置，以及用来提取当前位的表。
这样就可以每次 $O(1)$ 找到需要找的数的下层位置，以及最值的上层位置。
``` cpp
int lbound[256 + 1], rbound[256 + 1];
int lc[8], rc[8];

inline void init() {
    for (register int i = 1; i < 256; i++) {
        register int j = 0;
        while (!(i & 1 << j)) j++;
        // 最右边 1 的位置，下标从 0 开始，表示最左非空子树位置
        lbound[i] = j;
        j = 7;
        while (!(i & 1 << j)) j--;
        // 最左边 1 的位置，最高只有 7 位，表示最右非空子树位置
        rbound[i] = j;
    }
    // 预处理提取表
    for (register int i = 0; i < 8; i++) lc[i] = 255 >> 8 - i, rc[i] = 255 & (255 << i + 1);
    /*  其实就是下表
        00000000 11111110
        00000001 11111100
        00000011 11111000
        00000111 11110000
        00001111 11100000
        00011111 11000000
        00111111 10000000
        01111111 00000000
     */
}
```
### 插入
先假设值域不大，我们开一个 `bool` 数组 $d$ 记录一个数是否在树里，~~若值域变大写 `HashMap` 吧...~~
自底向上修改，拆 $8$ 进制按商插入，一层一层走下去就好了。
``` cpp
inline void insert(int x) {
    if (d[x]) return;
    d[x] = 1;
    for (register int i = 1; i <= 7; i++, x >>= 3) val[i][x >> 3] |= 1 << (x & 7);
}
```
### 删除
与插入没什么区别，直接把压位中的操作换成 `xor` 就好了。
``` cpp
inline void erase(int x) {
    if (d[x]) d[x] = 0;
    else return;
    for (register int i = 1; i <= 7; i++, x >>= 3) if (val[i][x >> 3] ^= 1 << (x & 7)) return;
}
```
### 最值
从最底下往上跳，沿最左/最有非空子树跳回根就好了。
``` cpp
inline int getMin() {
    if (!val[7][0]) return -1;
    register int p = lbound[val[7][0]];
    for (register int i = 6; i; i--) p = (p << 3) + lbound[val[i][p]];
    return p;
}

inline int getMax() {
    if (!val[7][0]) return -1;
    register int p = rbound[val[7][0]];
    for (register int i = 6; i; i--) p = (p << 3) + rbound[val[i][p]];
    return p;
}
```
### 前驱与后继
查询前驱后继时自底向上找到前驱或后继所在区间再利用与处理的表向下找到其具体位置。
``` cpp
inline int precursor(int p) {
    if (!val[7][0]) return -1;
    register int s = val[1][p >> 3] & lc[p & 7];
    if (s) return (p ^ (p & 7)) | rbound[s];
    for (register int i = 2; i <= 7; i++) {
        p >>= 3;
        s = val[i][p >> 3] & lc[p & 7];
        if (s) {
            p = (p ^ (p & 7)) | rbound[s];
            for (register int j = i - 1; j; j--) p = (p << 3) | rbound[val[j][p]];
            return p;
        }
    }
    return -1;
}

inline int successor(int p) {
    if (!val[7][0]) return -1;
    register int s = val[1][p >> 3] & rc[p & 7];
    if (s) return (p ^ (p & 7)) | lbound[s];
    for (register int i = 2; i <= 7; i++) {
        p >>= 3;
        s = val[i][p >> 3] & rc[p & 7];
        if (s) {
            p = (p ^ (p & 7)) | lbound[s];
            for (register int j = i - 1; j; j--) p = (p << 3) | lbound[val[j][p]];
            return p;
        }
    }
    return -1;
}
```
### 总结
在值域不是特别大时(< 2097152)时，所有操作均为常数，若值域变大，假设 HashMap 复杂度为 $O(1)$ 的情况下，$val$ 为值域的最大值，各种操作的复杂度是 $log_8 val$ 的。
在使用数组实现时，空间消耗 $O(val)$，使用 HashMap，空间复杂度降为 $O(n \text{ log}_8 val)$，值得注意的是由于压位，并且是 $8$ 叉，我们使用了 `unsigned char` 储存，这样免去了 `int` 空间消耗的常数 $4$。

至于作用,当然是替代 veb 树,在值域较小时替代堆或 set,反正插入，删除和最值写起来很短，效率也极高。
### 例题
[BZOJ-3685](http://www.lydsy.com/JudgeOnline/problem.php?id=3685)
976ms，15064 KB，rk4，也说明了这个乱搞出来的数据结构时间效率的优秀，空间消耗甚至好于许多平衡树。
``` cpp
/*
 * created by xehoth on 17-04-2017
 */
#include <bits/stdc++.h>

inline char read() {
    static const int IN_LEN = 10000000;
    static char buf[IN_LEN], *s, *t;
    if (s == t) {
        t = (s = buf) + fread(buf, 1, IN_LEN, stdin);
        if (s == t) return -1;
    }
    return *s++;
}

template<class T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
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

bool d[2097154];
unsigned char val[8][1000001 + 1];
int lbound[256 + 1], rbound[256 + 1];
int lc[8], rc[8];

inline void insert(int x) {
    if (d[x]) return;
    d[x] = 1;
    for (register int i = 1; i <= 7; i++, x >>= 3) val[i][x >> 3] |= 1 << (x & 7);
}

inline void erase(int x) {
    if (d[x]) d[x] = 0;
    else return;
    for (register int i = 1; i <= 7; i++, x >>= 3) if (val[i][x >> 3] ^= 1 << (x & 7)) return;
}

inline int getMin() {
    if (!val[7][0]) return -1;
    register int p = lbound[val[7][0]];
    for (register int i = 6; i; i--) p = (p << 3) + lbound[val[i][p]];
    return p;
}

inline int getMax() {
    if (!val[7][0]) return -1;
    register int p = rbound[val[7][0]];
    for (register int i = 6; i; i--) p = (p << 3) + rbound[val[i][p]];
    return p;
}

inline int precursor(int p) {
    if (!val[7][0]) return -1;
    register int s = val[1][p >> 3] & lc[p & 7];
    if (s) return (p ^ (p & 7)) | rbound[s];
    for (register int i = 2; i <= 7; i++) {
        p >>= 3;
        s = val[i][p >> 3] & lc[p & 7];
        if (s) {
            p = (p ^ (p & 7)) | rbound[s];
            for (register int j = i - 1; j; j--) p = (p << 3) | rbound[val[j][p]];
            return p;
        }
    }
    return -1;
}

inline int successor(int p) {
    if (!val[7][0]) return -1;
    register int s = val[1][p >> 3] & rc[p & 7];
    if (s) return (p ^ (p & 7)) | lbound[s];
    for (register int i = 2; i <= 7; i++) {
        p >>= 3;
        s = val[i][p >> 3] & rc[p & 7];
        if (s) {
            p = (p ^ (p & 7)) | lbound[s];
            for (register int j = i - 1; j; j--) p = (p << 3) | lbound[val[j][p]];
            return p;
        }
    }
    return -1;
}

int n, m, a, b;

int main() {
    // freopen("in.in", "r", stdin); 
    for (register int i = 1; i < 256; i++) {
        register int j = 0;
        while (!(i & 1 << j)) j++;
        lbound[i] = j;
        j = 7;
        while (!(i & 1 << j)) j--;
        rbound[i] = j;
    }
    for (register int i = 0; i < 8; i++) lc[i] = 255 >> 8 - i, rc[i] = 255 & (255 << i + 1);
    read(n), read(m);
    for (int i = 0; i < m; i++) {
        read(a);
        if (a < 3) {
            read(b);
            if (a == 1) insert(b);
            else if (a == 2) erase(b);
        } else if (a > 4) {
            read(b);
            if (a == 5) print(precursor(b)), print('\n');
            else if (a == 6) print(successor(b)), print('\n');
            else if (a == 7) print(d[b] && val[1][b >> 3] & 1 << (b & 7) ? 1 : -1), print('\n');
        } else if (a == 3) {
            print(getMin()), print('\n');
        } else if (a == 4) {
            print(getMax()), print('\n');
        }
    }
    flush();
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=27746534&auto=1&height=66"></iframe>