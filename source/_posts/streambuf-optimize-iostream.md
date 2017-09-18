---
title: 「黑科技」使用 streambuf 加速 iostream
date: 2017-06-23 16:16:45
tags:
  - 补档计划
  - IO
  - 黑科技
categories:
  - OI
  - IO
---
使用 streambuf 使 cin / cout 效率高于 fread / fwrite。  
{% black iostream 翻身了!!! | 你什么都没有看到 %}
<!-- more -->
### iostream
作为一个 C++ 标准库，如果各项功能都赶不上 C 语言的 IO，那还要它有何用？  
cin 和 cout 在 OI 中几乎是公认的慢了，但是这其实是使用的问题所造成的。

### sync
首先解除 iostream 与 C IO 的绑定，然后解除 cin 与 cout 的绑定，这几个操作相信大家都知道了。
``` cpp
std::ios::sync_with_stdio(false);
std::cin.tie(NULL);
std::cout.tie(NULL);
```
### streambuf
iostream 底层使用了 streambuf，也就是说 cin 和 cout 底层有流缓冲区，我们可以推测导致 cin / cout 慢的原因是对于各种类型的抽取与解析，事实上也是这样。  

#### 获取 streambuf
我们首先得拿到 iostream 的 streambuf。
##### rdbuf
> rdbuf 方法返回当前 stream 的 streambuf。

``` cpp
std::streambuf *fb = std::cin.rdbuf();
```
#### 输入
##### sgetc
> sgetc 返回 streambuf 中的下一个字符，用法相当于 getchar，但效率甚至高于 getchar_unlocked。

``` cpp
char c = fb->sgetc();
```
##### sgetn
> sgetn 读入 streambuf 中的 $n$ 个字符，作用等价于 fread，但效率甚至高于 fread_unlocked。

``` cpp
const int MAXN = 1000000;
char obuf[MAXN];

inline void input() {
    fb->sgetn(obuf, MAXN);
}
```

#### 输出
##### sputc
> sputc 输出一个字符，用法相当于 putchar，但效率甚至高于 putchar_unlocked。

``` cpp
char c = 't';
fb->sputc(c);
```
##### sputn
> sputn(buf, n) 输出 buf 中的 $n$ 个字符，作用等价于 fwrite，但效率甚至高于 fwrite_unlocked。

``` cpp
const int MAXN = 1000000;
char obuf[MAXN];

inline void output() {
    fb->sputn(obuf, MAXN);
}
```
### 示例
[LOJ 110](https://loj.ac/problem/110)
``` cpp
/**
 * test std::streambuf and std::cout.rdbuf
 * @author xehoth
 */
#include <bits/stdc++.h>

const int OUT_LEN = 10000000;

char obuf[OUT_LEN], *oh = obuf;
std::streambuf *fb;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fb->sputn(obuf, OUT_LEN), oh = obuf) : 0;
    *oh++ = c;
}

template <class T>
inline void print(T x) {
    static int buf[30], cnt;
    for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
    while (cnt) print((char)buf[cnt--]);
}

inline void flush() { fb->sputn(obuf, oh - obuf); }

#define long long long

const int MAXN = 3000001;

int inv[MAXN];

int main() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(NULL);
    std::cout.tie(NULL);
    fb = std::cout.rdbuf();
    register int n, mod;
    std::cin >> n >> mod;
    inv[1] = 1;
    for (int i = 2; i <= n; i++)
        inv[i] = (long)(mod - mod / i) * inv[mod % i] % mod;
    for (register int i = 1; i <= n; i++) print(inv[i]), print('\n');
    flush();
    return 0;
}
```

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=477839763&auto=1&height=66"></iframe>
