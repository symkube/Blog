---
title: KMP 算法学习笔记
date: 2016-11-08 23:44:59
tags:
  - KMP
  - 字符串
  - 学习笔记
categories:
  - oi
  - 学习笔记
---
## KMP算法学习总结
KMP（Knuth-Morris-Pratt）是一种改进的字符串匹配算法，也是算法竞赛中常用的字符串匹配算法之一，它可以有效地利用失配信息来使得匹配全过程中不回溯，从而在线性时间内完成匹配。
<!-- more -->
### 原理
设模式串 `pattern` 为 `"utqqutnu"`，目标串 `target` 为 `"utqlwutqqutnu"`，使用朴素算法进行匹配时（`"-"` 表示匹配成功，`"|"` 表示在此字符失配）：
``` bash
utqqutlwutqqutnu
------|
utqqutnu
```
#### 朴素算法
首先，将两串首对齐，逐个字符匹配，可见在字符 `'l'` 处失配，按照朴素算法的思想，我们需要把模式串右移一个字符，然后再从模式串首开始匹配，即：
``` bash
utqqutlwutqqutnu
 |
 utqqutnu
```
这时发现从第一个字符起就不匹配，还要继续右移  \cdots  \cdots 
#### kmp
但是，似乎有一种更好的策略：我们可以直接把模式串的开头对齐目标串的 `"ut"` 处，就可以一次跳过几个字符，并且模式串无需回溯：
假设我们知道一个 $next$ 数组（怎样求等会儿再说），它的值为：
``` bash
utqqutnu
00001201
```
> 那么模式串的移动位数 =  已匹配的字符数 - 对应的 $next$ 数组的值

``` bash
utqqutlwutqqutnu
------|
utqqutnu
```
刚才我们匹配到 `'l'`时失配了，查 $next$ 数组得，匹配 `"utqqut"` 时，$next = 2$，所以移动位数 $= 6 - 2 = 4$
``` bash
utqqutlwutqqutnu
    --|
    utqqutnu
```
所以我们将模式串向后移 $4$ 位

KMP 算法就是利用了失配后的**部分匹配**信息来选择模式串的移动方式，尽可能地避免无用的匹配。
### next数组的利用
通过上述例子我们可以观察到，如果**部分匹配**的串有对称的**前后缀**，则我们可以直接将**模式串**中部分匹配串的**前缀**与目标串中部分匹配串的**后缀**对齐，如：
例子中的部分匹配串为 `"utqqut"`，有对称的前后缀 `"ut"`，则可以直接将目标串的第二个 `"ut"` 与模式串的第一个 `"ut"` 对齐。

再来看这个例子，模式串为 `"ttitty"`，目标串为 `"ttittitty"`
``` bash
ttittittypoi
-----|
ttitty
```
此时的部分匹配串为 `"ttitt"`，它有两个对称的前后缀，分别是 `"tt"` 和 `"t"`，我们会想，以 `"t"` 对齐，可以移动更长的距离，事实上呢？
``` bash
ttittittypoi
    -|
    ttitty
```
在模式串第二个 `'t'` 处失配后，继续匹配，最终结果是匹配失败。
然而，如果我们以 `"tt"` 对齐，则有：
``` bash
ttittittypoi
   ------
   ttitty
```
这个例子告诉我们，当部分匹配串有多个对称前后缀时，需要选择**最长的**，以保证匹配结果的正确。
### 求解next数组
通过刚才的结论，我们已经可以发现 $next$ 数组就是模式串前缀的最长公共前后缀的长度。
``` bash
utqqutnu
模式串前缀      前缀          后缀           next
u              -            -              0
ut             u            t              0
utq           u,ut         q,tq            0
utqq        u,ut,utq      q,qq,tqq         0
utqqu    u,ut,utq,utqq    u,qu,qqu,tqqu    1
utqqut u,ut,utq,utqq,utqqu   ······        2
utqqutn  ······              ······        0
utqqutnu ······              ······        1
```
求解 $next$，我们可以看成将模式串和模式串匹配的过程。
### 实现
``` cpp
#include <iostream>
#include <cstring>
#include <cstdio>
const int MAX_LEN = 1000005;
using namespace std;
/**
 *求解next数组
 *@param pattern 模式串
 *@param next next数组
 *@param len p的长度
 */
inline void getNext(const char *pattern, int *next, int len) {
    for (int i = 1, j = 0; i < len; i++) {
        while (j && pattern[i] != pattern[j]) j = next[j - 1];
        if (pattern[i] == pattern[j]) j++;
        next[i] = j;
    }
}
/**
 *kmp算法，返回是否能匹配
 *@param target 目标串
 *@param pattern 模式串
 */
inline bool kmp(const char *target, const char *pattern) {
    static int next[MAX_LEN];
    int targetLen = strlen(target), patternLen = strlen(pattern);
    bool isMatched = false;
    getNext(pattern, next, patternLen);
    for (int i = 0, j = 0; i < targetLen; i++) {
        while (j && target[i] != pattern[j]) j = next[j - 1];
        if (target[i] == pattern[j]) j++;
        if (j == patternLen) isMatched = true, cout << i - patternLen + 2 << "\n";
    }
    return isMatched;
}
char target[MAX_LEN], pattern[MAX_LEN];
int main() {
#ifndef ONLINE_JUDGE
    freopen ("in.in", "r", stdin);
#endif
    scanf("%s\n%s", target, pattern);
    if (!kmp(target, pattern)) cout << "NO";
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=729715&auto=1&height=66"></iframe>