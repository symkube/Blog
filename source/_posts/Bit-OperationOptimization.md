---
title: 位运算优化
date: 2016-07-24 20:55:21
tags:
  - 位运算
categories:
  - OI
  - 位运算
---
## 位运算优化
大家都知道OI中TLE是经常碰到的,位运算是优化性能的利器。
### swap
``` cpp
inline void swap(int &a, int &b){
    a ^= b;  
    b ^= a;  
    a ^= b; 
}
```
<!-- more -->
### abs
这个东西实测比(n>0 ? n:-n)快了不少。
``` cpp
inline int abs(int n){
     return (n ^ (n >> 31)) - (n >> 31);  
}
```
### max
这个在某次DP中拯救了我200ms,直接从TLE卡成了AC...
``` cpp
#define max(x,y) (x ^ ((x ^ y) & -(x < y)))
```
### min
同max,效率差距不是一般的大
``` cpp
#define min(x,y) (y ^ ((x ^ y) & -(x < y)))
```
### *10
多数同学的读入优化写的*10...
改成这个,某不开 O2 的并查集题可以快整整500ms+
``` cpp
x *= 10
x = x + (4 * x), x = x + x
x = x + (x << 2) << 1
```
### int转String
这个是从Java JDK1.8 Integer.toString()学来的,用来手写输出优化也不错,感觉自从被志愿者选拔卡输入输出之后,优化了好多东西。
``` cpp
#define MIN_VALUE 0x80000000
const int sizeTable[] = {9,      99,      999,      9999,      99999,
                         999999, 9999999, 99999999, 999999999, 0x7fffffff};
inline int stringSize(int x) {
    for (int i = 0;; i++)
        if (x <= sizeTable[i]) return i + 1;
}
const char DigitOnes[] = {
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '1', '2', '3', '4',
    '5', '6', '7', '8', '9', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '1', '2', '3', '4',
    '5', '6', '7', '8', '9', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '1', '2', '3', '4',
    '5', '6', '7', '8', '9', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
};
const char DigitTens[] = {
    '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1',
    '1', '1', '1', '1', '1', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2',
    '3', '3', '3', '3', '3', '3', '3', '3', '3', '3', '4', '4', '4', '4', '4',
    '4', '4', '4', '4', '4', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5',
    '6', '6', '6', '6', '6', '6', '6', '6', '6', '6', '7', '7', '7', '7', '7',
    '7', '7', '7', '7', '7', '8', '8', '8', '8', '8', '8', '8', '8', '8', '8',
    '9', '9', '9', '9', '9', '9', '9', '9', '9', '9',
};
const char digits[] = {'0', '1', '2', '3', '4', '5', '6', '7', '8',
                       '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
                       'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',
                       'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'};
inline void getChars(int i, int index, char buf[]) {
    int q, r;
    int charPos = index;
    char sign = 0;
    if (i < 0) {
        sign = '-';
        i = -i;
    }
    /* Generate two digits per iteration */
    while (i >= 65536) {
        q = i / 100;
        /* really: r = i - (q * 100); */
        r = i - ((q << 6) + (q << 5) + (q << 2));
        i = q;
        buf[--charPos] = DigitOnes[r];
        buf[--charPos] = DigitTens[r];
    }

    /* Fall thru to fast mode for smaller numbers */
    /* assert(i <= 65536, i); */
    for (;;) {
        q = ((unsigned int)(i * 52429)) >> (16 + 3);
        r = i - ((q << 3) + (q << 1));  /* r = i-(q*10) ... */
        buf[--charPos] = digits[r];
        i = q;
        if (i == 0) break;
    }
    if (sign != 0) {
        buf[--charPos] = sign;
    }
}
inline string toString(int i) {
    if (i == MIN_VALUE) return string("-2147483648");
    int size = (i < 0) ? stringSize(-i) + 1 : stringSize(i);
    char buf[size];
    getChars(i, size, buf);
    return string(buf);
}
```
