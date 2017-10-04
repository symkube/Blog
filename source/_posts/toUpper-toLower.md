---
title: 大小写转化的奇怪技巧
date: 2016-12-30 19:22:02
tags:
  - 字符串
  - 学习笔记
  - 黑科技
categories:
  - OI
  - 学习笔记
---
通常情况下，我们可以使用函数 $toupper()$ 和 $tolower()$ 来实现字母大小写的转化，但在需要~~常数优化~~的情况下，这是较慢的。
<!-- more -->
### 大小写字符特点
在 $ASCII$ 表中，大写字符与小写字符相差 $32$，我们可以简单的通过加减 $32$ 来实现。
### 神奇的空格
注意空格`' '`这个字符，它的值为 $32$，我们考虑将大小写字符 $xor$ 上空格符，这样不仅大小写转换写法相同，而且利用位运算~~减小常数~~。

~~以上均为神奇的技巧，我也不知道有什么用....~~
``` cpp
#include <bits/stdc++.h>
inline void toUpper(char &c) { c ^= ' '; }
inline void toLower(char &c) { c ^= ' '; }
inline void toOppositeCase(char &c) { c ^= ' '; }
int main() {
    for (char i = 'a', j = 'A'; i <= 'z'; i++, j++)
        std::cout << i - j << " ";
    std::endl(std::cout);
    char c = 'a';
    toUpper(c);
    toLower(c);
    std::cout << c << std::endl;
    std::cout << static_cast<int>(' ');
    toupper(c);
    return 0;
}
```

