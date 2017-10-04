---
title: NOIP赛前总结
date: 2016-11-15 19:56:02
tags:
categories:
  - OI
---
## NOIP赛前总结
### 算法
#### 基础算法
- ~~模拟~~
- ~~排序~~(注意合理使用 $sort$ 与 $stable\_sort$ 及手写线性排序)
- ~~贪心~~(注意对拍验证)
- 分治
- ~~递推~~
- ~~二分答案~~(注意边界设定)
- ~~逆序对~~(树状数组，注意是否需要离散化)
- ~~中位数~~($nth\_element$)
- ~~离散化~~(效率$Hash > sort + unique +$ 指针扫$> sort + unique+lower\_bound>set$)
- **倍增法**
- **构造法**(大胆猜想+写拍)
- **三分答案**
<!-- more -->
#### 数学算法
- ~~gcd~~(一行递归性或几行非递归价比高，不要写位运算+非递归，不要用__gcd)
- **分解质因数**(Pollard Rho)
- **素数测试**(Miller Rabin)
- ~~快速幂~~ (记得$O(1)$实现的$long long$内快速乘)
- ~~扩展欧几里德~~ (递归性价比高)
- ~~模运算~~ (小心浮点数例外)
- **排列组合**(逆元与阶乘预处理)
- **高精度**(压$9$位与可选$FFT$优化乘法及符号判断)
- ~~高斯消元~~(精度)
- 容斥原理(推导)
- ~~欧拉函数~~(线筛)
- ~~费马小定理~~
- ~~矩阵乘法~~($i$放前面，寻址优化)

#### 字符串
- ~~KMP~~($next$从$0$开始的优化)
- **扩展KMP**(不太熟练)
- ~~Trie树~~
- **最长公共回文字符串**(manacher)
- **后缀数组**
- **AC自动机**
- **后缀自动机**
- **回文树**
- **后缀平衡树**
- ~~字符串Hash~~(以上算法不熟练的$Hash$就好了23333)

#### 搜索
- ~~DFS~~
- ~~BFS~~
- **A\***
- **Dancing Links**
- **折半搜索**
- **状压及Hash**

#### 动态规划
- ~~最长公共子序列~~
- ~~背包~~
- ~~最长不下降子序列~~($O(nlogn)$)
- **动规优化**
- ~~最大连续子段和~~(单调性优化)
- ~~滚动数组降维~~
- **记忆化搜索**
- **状态压缩**

#### 数据结构
- ~~栈~~
- ~~队列~~
- ~~链表~~(不要作死手写双向链表)
- ~~二叉堆~~(优先队列)
- ~~并查集~~(启发式优化)
- ~~树的遍历~~
- ~~树状数组~~
- ~~LCA~~(st，tarjan，倍增)
- ~~rmq~~(st)
- ~~线段树~~
- **主席树**
- **treap**
- **splay**
- **树链剖分**
- **树的直径**
- **树的重心**
- **dfs序和欧拉序**
- ~~STL~~(map，set，list，stack，queue，priority_queue，vector，tr1::array，tr1::unordered_map)

#### 图论
- ~~图的遍历~~
- ~~最短路~~(SPFA，Floyd，dijkstra+堆)
- ~~第K短路~~
- ~~差分约束系统~~
- ~~最小生成树~~
- **次小生成树**
- **拓扑排序**
- ~~tarjan~~
- **割点割边**
- **欧拉回路**

### 部分模板
#### 排序
基数排序
``` cpp
inline int maxBit(int *data, int n) {
    register int d = 1, p = 10;
    for (register int i = 0; i < n; i++)
        while (data[i] >= p)
            p = (p << 1) + (p << 3), d++;
    return d;
}
inline void radixSort(int *data, int n) {
    int d = maxBit(data, n), tmp[n], count[10];
    register int i, j, k, radix = 1;
    for (i = 1; i <= d; i++) {
        for (j = 0; j < 10; j++)
            count[j] = 0;
        for (j = 0; j < n; j++)
            k = (data[j] / radix) % 10, count[k]++;
        for (j = 1; j < 10; j++)
            count[j] = count[j - 1] + count[j];
        for (j = n - 1; j >= 0; j--)
            k = (data[j] / radix) % 10, tmp[count[k] - 1] = data[j], count[k]--;
        for (j = 0; j < n; j++)
            data[j] = tmp[j];
        radix = (radix << 1) + (radix << 3);
    }
}
```
#### 对拍
**Linux**
``` cpp
#include <bits/stdc++.h>
using namespace std;
const int times = 10000;
int main(int argc, char const *argv[]) {
    for (int i = 0; i < times; i++) {
        cout << "Case " << i << "\n";
        system("./data > in.in");
        system("./std < in.in > std.out");
        system("./me < in.in > me.out");
        if (system("diff me.out std.out")) cout << "Not Accept!\n", exit(0);
        cout << "Accept!\n";
    }
    cout << "All Tests Accept!!\n";
    return 0;
}
```
**windows**
``` cpp
#include <bits/stdc++.h>
using namespace std;
const int times = 10000;
int main(int argc, char const *argv[]) {
    for (int i = 0; i < times; i++) {
        cout << "Case " << i << "\n";
        system("data.exe > in.in");
        system("std.exe < in.in > std.out");
        system("me.exe < in.in > me.out");
        if (system("diff me.out std.out")) cout << "Not Accept!\n", exit(0);
        cout << "Accept!\n";
    }
    cout << "All Tests Accept!!\n";
    return 0;
}
```
#### 高精度+压9位+符号
``` cpp
#include <bits/stdc++.h>
using namespace std;
struct BigInteger {
    typedef long long ll;
    static const ll DIGIT = 100000000;
    static const int DIGIT_LEN = 9;
    static const int SIZE = 305;
    ll a[SIZE];
    int len, sig;
    BigInteger() {
        len = 1;
        memset(a, 0, sizeof(a));
    }
    BigInteger(char *s) {
        len = 1;
        memset(a, 0, sizeof(a));
        *this = s;
    }
    BigInteger(ll x) {
        len = 1;
        memset(a, 0, sizeof(a));
        *this = x;
    }
    inline void clear() {
        memset(a, 0, sizeof(ll) * (len + 1));
        len = 1;
        sig = 0;
    }
    inline void fix() {
        while (len > 1 && !a[len]) len--;
    }
    inline void minus(BigInteger &a, BigInteger &b, BigInteger &c) {
        if (b.sig) {
            b.sig = 0, add(a, b, c), b.sig = 1;
            return;
        }
        if (a.sig) {
            a.sig = 0, add(a, b, c), a.sig = 1, c.sig = 1;
            return;
        }
        c.clear();
        register int flag = 0, i = 1;
        BigInteger *x = &a, *y = &b;
        if (a < b) flag = 1, swap(x, y);
        for (; i <= x->len; i++) {
            c.a[i] += x->a[i] - y->a[i];
            if (c.a[i] < 0) c.a[i] += DIGIT, c.a[i + 1]--;
        }
        c.len = i;
        c.fix();
        c.sig = flag;
    }
    inline void add(BigInteger &a, BigInteger &b, BigInteger &c) {
        if (b.sig) {
            b.sig = 0, minus(a, b, c), b.sig = 1;
            return;
        }
        if (a.sig) {
            a.sig = 0, minus(b, a, c), a.sig = 1;
            return;
        }
        c.clear();
        int i = 1, l = max(a.len, b.len); ll k = 0;
        for (; i <= l || k; ++i) {
            c.a[i] = a.a[i] + b.a[i] + k;
            k = c.a[i] / DIGIT;
            if (c.a[i] >= DIGIT) c.a[i] %= DIGIT;
        }
        c.len = i;
        c.fix();
    }
    inline void multiply(BigInteger &a, BigInteger &b, BigInteger &c) {
        c.clear();
        for (register int i = 1; i <= a.len; i++) {
            for (register int j = 1; j <= b.len; j++) {
                register int pos = i + j - 1;
                c.a[pos] += a.a[i] * b.a[j];
                c.a[pos + 1] += c.a[pos] / DIGIT;
                c.a[pos] %= DIGIT;
            }
        }
        c.len = a.len + b.len;
        c.fix();
        c.sig = a.sig ^ b.sig;
        if (c.a[1] == 0 && c.len == 1) c.sig = 0;
    }
    inline void divide(BigInteger &a, ll b, BigInteger &c) {
        c.clear(); ll t = 0;
        for (int i = len; i; --i) {
            c.a[i] = (a.a[i] + t) / b;
            t = ((a.a[i] + t) % b) * DIGIT;
        }
        c.len = len;
        c.fix();
    }
    inline void divide(BigInteger &a, BigInteger &b, BigInteger &c) {
        c.clear();
        BigInteger l, r = a, mid, TP, ONE = (ll)1;
        while (l <= r) {
            add(l, r, TP); divide(TP, 2, mid);
            multiply(mid, b, TP);
            if (TP <= a) add(mid, ONE, l);
            else minus(mid, ONE, r);
        }
        minus(l, ONE, c);
        c.sig = a.sig ^ b.sig;
        if (c.a[1] == 0 && c.len == 1) c.sig = 0;
    }
    inline BigInteger sqrt() {
        BigInteger l, r = *this, mid, TP, ONE = (ll)1;
        while (l <= r) {
            add(l, r, TP); divide(TP, 2, mid);
            multiply(mid, mid, TP);
            if (TP <= *this) add(mid, ONE, l);
            else minus(mid, ONE, r);
        }
        minus(l, ONE, TP);
        return TP;
    }
    inline bool operator<(BigInteger &b) {
        if (b.sig && !sig) return 0;
        if (!b.sig && sig) return 1;
        if (b.sig && sig) { sig = b.sig = 0; bool ret = b < *this; sig = b.sig = 1; return ret; }
        if (len != b.len) return len < b.len;
            for (register int i = len; i >= 1; i--) if (a[i] < b.a[i]) return true; else if (a[i] > b.a[i]) return false; /*这里一定要注意*/
        return false;
    }
    inline BigInteger& operator= (ll b) {
        clear();
        len = 0;
        if (b == 0) { len = 1; return *this; }
        if (b < 0) sig = 1, b = -b;
        while (b) { a[++len] = b % DIGIT; b /= DIGIT; }
        return *this;
    }
    inline BigInteger& operator= (char *s) {
        clear();
        if (s[0] == '-') sig = 1, ++s;
        len = 0; int l = strlen(s), t = 0, k = 1;
        for (register int i = l - 1; i >= 0; i--) {
            t = t + (s[i] ^ '0') * k;
            k = (k << 1) + (k << 3);
            if (k >= DIGIT) a[++len] = t % DIGIT, t = 0, k = 1;
        }
        if (k != 1) a[++len] = t % DIGIT;
        return *this;
    }
    inline BigInteger& operator= (const BigInteger &x) {
        clear();
        memcpy(a, x.a, sizeof(ll) * (x.len + 1));
        len = x.len, sig = x.sig;
        return *this;
    }
    inline BigInteger operator+ (BigInteger x) { BigInteger c; add(*this, x, c); return c; }
    inline BigInteger operator- (BigInteger x) { BigInteger c; minus(*this, x, c); return c; }
    inline BigInteger operator* (BigInteger x) { BigInteger c; multiply(*this, x, c); return c; }
    inline BigInteger operator/ (BigInteger x) { BigInteger c; divide(*this, x, c); return c; }
    inline BigInteger operator/ (ll x) { BigInteger c; divide(*this, x, c); return c; }
    inline BigInteger& operator+= (BigInteger x) { BigInteger c; add(*this, x, c); return *this = c; }
    inline BigInteger& operator-= (BigInteger x) { BigInteger c; minus(*this, x, c); return *this = c; }
    inline BigInteger& operator*= (BigInteger x) { BigInteger c; multiply(*this, x, c); return *this = c; }
    inline BigInteger& operator/= (BigInteger x) { BigInteger c; divide(*this, x, c); return *this = c; }
    inline BigInteger& operator/= (ll x) { BigInteger c; divide(*this, x, c); return *this = c; }
    inline BigInteger& operator++ () { return *this += 1; }
    inline BigInteger operator++ (int) { BigInteger ret = *this; ++*this; return ret; }
    inline BigInteger& operator-- () { return *this -= 1; }
    inline BigInteger operator-- (int) { BigInteger ret = *this; --*this; return ret; }
    inline bool operator> (BigInteger &x) { return x < *this; }
    inline bool operator== (BigInteger &x) { return x <= *this && x >= *this; }
    inline bool operator<= (BigInteger &x) { return !(x < *this); }
    inline bool operator>= (BigInteger &x) { return !(x > *this); }
    inline void print() {
        if (sig) putchar('-');
        printf("%d", (int)a[len]);
        char od[8]; od[0] = '%'; od[1] = '0';
        sprintf(od + 2, "%d", DIGIT_LEN - 1);
        int l = strlen(od); od[l] = 'd'; od[l + 1] = '\0';
        for (register int i = len - 1; i >= 1; i--) printf(od, (int)a[i]);
    }
};
```
#### 三分答案
``` cpp
double solve(double l, double r){
    double eps = 1e-5;
    while(l + eps < r){
        double lmid = l + (r - l) / 3, rmid = r - (r - l) / 3;
        if (val(lmid) < val(rmid)) {
            r = rmid;
        } else {
            l = lmid;
        }
    }
    return val(l);
}
```
#### 二分边界
``` cpp
inline int binarySearch(int l, int r) {
    while (l < r - 1) {
        register int mid = l + r >> 1;
        if (check(mid)) l = mid;
        else r = mid;
    }
    return l;
}
```
#### Hash
``` cpp
#include <bits/stdc++.h>
using namespace std;
const int mod1 = 1e9 + 7;
const int mod2 = 1e9 + 9;
const int h = 31;
typedef unsigned long long HashType;
const int MAX = 1000005;
HashType pow1[MAX], pow2[MAX];
struct HashString {
    HashType h1[MAX], h2[MAX];
    inline HashType getIntervalHashCode1(int l, int r) {
        return (h1[r] - ((h1[l - 1] * pow1[r - l + 1]) % mod1) + mod1) % mod1;
    }
    inline HashType getIntervalHashCode2(int l, int r) {
        return (h2[r] - ((h2[l - 1] * pow2[r - l + 1]) % mod2) + mod2) % mod2;
    }
    inline void init(const char *s, int len) {
        for (register int i = 1; i <= len; i++)
            h1[i] = ((h1[i - 1] * h) % mod1 + s[i]) % mod1, h2[i] = ((h2[i - 1] * h)  % mod2 + s[i]) % mod2;
    }
};
inline void getPow(int n) {
    pow1[0] = pow2[0] = 1;
    for (int i = 1; i <= n; i++)
        pow1[i] = (pow1[i - 1] * h) % mod1, pow2[i] = (pow2[i - 1] * h) % mod2;
}
```
#### $O(n)$中位数
``` cpp
nth_element(a + 1, a + n / 2 + 1, a + n + 1);
```
### 错误&经验总结
1. 检查文件名。
2. 对拍要打$srand(time(0))$。
3. lcr名言：脑子有病的人才卡SPFA，但出题人往往脑子有病。
4. RE可能是数组越界，重复删除指针，容器为空时取元素，死循环。
5. 读入优化不要忘了判负。
6. 注意是否需要求逆元。
7. dp注意初始化边界。
8. 二分边界。
9. 学会取舍正解与暴力。
10. 数学推导要耐心，配合打表找规律。
11. 不要尝试使用 ~~垃圾~~ dev的单步调试，养成自己打调试语句的习惯。
12. $n$ 和 $m$ 一定不能打反。
13. bitset可以强行优化一些常数。
14. 注意离散化的多种方法。

