---
title: C++加速输入
date: 2016-06-23 23:11:59
tags:
  - IO
categories: 
  - oi
  - IO
---
## C++加速输入
### cin, cout
`cin` 的速度其实并不慢,流的读取速度相当快,其速度与设定缓存区大小,硬盘速度有关。C++ 为了兼容 C 的 IO(scanf,printf), 使 `cin`, `cout` 与之同步,导致 `cin` 速度不如 `scanf`。

我们可以取消 `cin` 与其的绑定,并取消 `cin` 与 `cout` 的绑定,加速读取,使 `cin` 的速度与 `scanf` 相差无几,甚至超过`scanf`。

**注意：**取消绑定之后不能再使用 `scanf`, `printf`, 否则会出现读取失败或提前输出的问题,**`getchar()` 可以使用**。
<!-- more -->
``` cpp
/*加快cin,cout的速度*/
/*取消C++ IO与C的同步*/
std::ios::sync_with_stdio(false);
/*取消cin与cout的绑定*/
std::cin.tie(NULL);/*等价于cin.tie(0);*/
```
### 读取整数
读取整数相比用 `getchar()` 手写, `cin` 会很慢,直接放代码。
``` cpp
/*读取字符的缓存*/
char ch_buffer;
/*符号*/
bool signum;
inline void read(int& l) {
    l = 0;
    /*跳过非数字部分*/
    do
        ch_buffer = getchar();
    while ((ch_buffer < '0' || ch_buffer > '9') && ch_buffer != '0' &&
           ch_buffer != '-');
    /*判断是否为负*/
    if (ch_buffer == '-') ch_buffer = getchar(), signum = true;
    /*关键的读取,使用位运算,(l<<3)+(l<<1)等价于l * 10 请不要在 O2 下使用,
     *但速度更快,尤其是对于数据大的情况*/
    while (ch_buffer <= '9' && ch_buffer >= '0')
        l = (l << 3) + (l << 1) + ch_buffer - '0', ch_buffer = getchar();
    if (signum) l = -l, signum = false;
}
```
``` cpp
/*这样也可以*/
inline void read(int& x) {
    x = 0;
    char c;
    for (c = getchar(); c < '0' || c > '9'; c = getchar())
        ;
    for (; c >= '0' && c <= '9'; c = getchar())
        x = (x << 3) + (x << 1) + c - '0';
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=27746534&auto=1&height=66"></iframe>