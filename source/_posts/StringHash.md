---
title: 字符串 Hash 学习总结
date: 2016-11-04 21:28:21
tags:
  - 字符串
  - Hash
  - 学习笔记
categories:
  - OI
  - 学习笔记
---
## 字符串Hash学习总结
### 定义
字符串Hash简单来说就是：**把字符串有效地转换为一个整数**。
### Hash函数
> 就是使得每一个字符串都能够映射到某一个整数上的函数

<!-- more -->
常见的Hash函数网上都能找到这里就不说了。
### BKDRHash
 本算法由于在Brian Kernighan与Dennis Ritchie的《The C Programming Language》一书被展示而得名，是一种**简单高效的**Hash算法，也是Java目前采用的字符串的Hash算法（累乘因子为`31`）。

 $hash[i]=hash[i-1] \times p + str[i]$

 这样做相比其他Hash函数还有一个极大的好处：

 我们可以预处理 $p$ 的幂，假设字符串 $str$ 从`1`开始编号，那么有$hash[l..r]=hash[r]-hash[l-1] \times p^{r-l+1}$。

 这样我们就可以$O(len)$预处理出一个字符串的Hash值，然后$O(1)$得到其任意区间内的Hash值。

 **注意是否取模的问题**，见下。
### 双Hash
只使用BKDRHash来比较字符串还是有很多冲突的(因为它默认对$2^{64}$等取模)，我们可以考虑自己取模，我们选取Java采用的累乘因子$p=31$，因为实践得到这个累乘因子效率很高，我们考虑取两个模数$mod1=1e9+7,mod2=1e9+9$，这是一对孪生素数，这样做以后，冲突概率就**极小**，可以较为放心地使用。

**取模问题参见下面代码**
### 双Hash实现
**例题：**字符串匹配，给定两个字符串 $s$ ，$t$，求出 $t$ 在 $s$ 中的匹配位置，如果无法匹配，则输出$No$。
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
} S, T;
inline void getPow(int n) {
    pow1[0] = pow2[0] = 1;
    for (int i = 1; i <= n; i++)
        pow1[i] = (pow1[i - 1] * h) % mod1, pow2[i] = (pow2[i - 1] * h) % mod2;
}
char s[MAX], l[MAX];
int lens, lenl;
int main() {
    ios::sync_with_stdio(0);
    cin.tie(0);
    cin >> s + 1 >> l + 1;
    lens = strlen(s + 1);
    lenl = strlen(l + 1);
    getPow(lens);
    S.init(s, lens);
    T.init(l, lenl);
    register int L_hash1 = T.getIntervalHashCode1(1, lenl), L_hash2 = T.getIntervalHashCode2(1, lenl);
    register bool flag = true;
    for (register int i = 1, range = lens - lenl + 1, len1 = i + lenl - 1; i <= range; i++, len1 = i + lenl - 1)
        if (S.getIntervalHashCode1(i, len1) == L_hash1 && S.getIntervalHashCode2(i, len1) == L_hash2)
                cout << i << "\n", flag = false;
    if (flag) cout << "NO";
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=714698&auto=1&height=66"></iframe>