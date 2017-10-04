---
title: IO优化模板
date: 2016-07-25 21:40:15
tags:
  - IO
categories: 
  - OI
  - IO
---
## IO优化模板
为什么要优化IO?请见上一道题[志愿者选拔](https://blog.xehoth.cc/2016/07/24/%E5%BF%97%E6%84%BF%E8%80%85%E9%80%89%E6%8B%94/)
被此题卡疯的我,写了一个大量优化的IO模板。
### 普通IO优化
我相信多数同学都是用getchar()+*10,就是下面这个代码:
``` cpp
inline void get(int &x) {
    static int t;
    while (!((x = getchar()) >= '0' && x <= '9'))
        ;
    x -= '0';
    while ((t = getchar()) >= '0' && t <= '9') x = x * 10 + t - '0';
}
```
但*10,getchar(),和-'0',是还可以继续优化的。
<!-- more -->
### cin解绑+位运算优化
大家都知道,cin比scanf慢,但cout比printf快(前提是不中间刷新缓存)。
而解绑后的cin速度与scanf相当,甚至更快。
**注意:cin解绑后不要用scanf,printf**
#### 解绑代码
``` cpp
std::ios::sync_with_stdio(false);
std::cin.tie(NULL);
```
#### cin.get()
cin.get()解绑后,实测比getchar()快很多。
#### 位运算
x=x*10等价于x=(x<<1)+(x<<3)
而由于'0'~'9'字符值的特殊性,我们可以用^代替-。
#### 源码
``` cpp
char ch;
bool signum;
inline bool readInt(int& l) {
    l = 0;
    do {
        ch = cin.get();
        if (ch == -1) return false;
    } while ((ch < '0' || ch > '9') && (ch ^ '0') && (ch ^ '-'));
    if (ch == '-') signum = true, ch = cin.get();
    while (ch >= '0' && ch <= '9')
        l = (l << 1) + (l << 3) + (ch ^ '0'), ch = cin.get();
    if (signum) l = -l, signum = false;
    return true;
}
```
### fread+fwrite
cin.get()和getchar()每次都只读一个字符,为什么不一次多读一些呢?
fread和fwrite就好了...
**输出int是输出优化的瓶颈,如果用普通转换会很慢**
我用的Java8 中Integer.toString()的方法。
#### 源码
``` cpp
#include <bits/stdc++.h>
#ifndef XEHOTH
#define XEHOTH
#ifndef XEHOTH_IO
#define XEHOTH_IO
typedef long long Long;
/**     缓存区大小*/
#define XEHOTH_IO_SIZE 1048576
/**  读入缓存                输出缓存                读入首指针,尾指针
 * 输出首指针   重复使用字符*/
char IO_rbuf[XEHOTH_IO_SIZE], IO_wbuf[XEHOTH_IO_SIZE + 1], *IO_S, *IO_T,
    *IO_S1 = IO_wbuf, IO_c;
/**  符号boolean值*/
bool IO_signum;
/**读入一个字符*/
inline char freadChar() {
    /**已满或未读,fread一次性读入XEHOTH_IO_SIZE,使用stdin,方便标准输入输出*/
    if (IO_S == IO_T) {
        IO_T = (IO_S = IO_rbuf) + fread(IO_rbuf, 1, XEHOTH_IO_SIZE, stdin);
        /*读完了返回-1,由于字符无负数,方便bfreadInt*/
        if (IO_S == IO_T) return -1;
    }
    return *IO_S++;
}
/**返回当前指针所指向的字符,若无返回-1*/
inline char fpeek() {
    if (IO_S == IO_T) return -1;
    return *IO_S;
}
/**读取一个整数
 *实现了:
 *1.跳过非数字符号
 *2.跳过前导0
 *3.可读负数
 *4.跳过符号后前导0
 *5.位运算优化
 *6.可用于不定长数据的读取
 */
inline bool bfreadInt(int &x) {
    IO_signum = false;
    for (IO_c = freadChar(); IO_c < '0' || IO_c > '9'; IO_c = freadChar()) {
        if (IO_c == -1) return false;
        if (IO_c == '-') IO_signum = true;
    }
    x = 0;
    while (IO_c == '0') IO_c = freadChar();
    for (;; IO_c = freadChar()) {
        if (IO_c < '0' || IO_c > '9') break;
        x = (x << 3) + (x << 1) + (IO_c ^ '0');
    }
    if (IO_signum) x = -x;
    return true;
}
inline bool bfreadLong(Long &x) {
    IO_signum = false;
    for (IO_c = freadChar(); IO_c < '0' || IO_c > '9'; IO_c = freadChar()) {
        if (IO_c == -1) return false;
        if (IO_c == '-') IO_signum = true;
    }
    x = 0;
    while (IO_c == '0') IO_c = freadChar();
    for (;; IO_c = freadChar()) {
        if (IO_c < '0' || IO_c > '9') break;
        x = (x << 3) + (x << 1) + (IO_c ^ '0');
    }
    if (IO_signum) x = -x;
    return true;
}
/**跳过空格读取字符串,直到flag为止*/
inline void freadString(std::string &str, char flag = ' ') {
    str = "";
    for (IO_c = freadChar(); IO_c == ' '; IO_c = freadChar())
        if (IO_c == -1) return;
    str += IO_c;
    for (IO_c = freadChar(); IO_c ^ flag;) {
        if (IO_c == -1) return;
        str += IO_c, IO_c = freadChar();
    }
}
/*输出一个字符,若缓存区满了才输出,否则请自行调用flushIO()*/
inline void fwriteChar(char c) {
    if (IO_S1 == IO_wbuf + XEHOTH_IO_SIZE) {
        fwrite(IO_wbuf, 1, XEHOTH_IO_SIZE, stdout);
        IO_S1 = IO_wbuf;
    }
    *IO_S1++ = c;
}
/*输出字符串*/
inline void fwriteString(const std::string &str) {
    for (register int i = 0, range = str.length(); i < range; i++)
        fwriteChar(str[i]);
}
inline void fwriteCharArray(const char *str, int len) {
    for (register int i = 0; i < len; i++) fwriteChar(str[i]);
}
/*输出整数*/
/*重写Java8Integer.toString来实现fwriteInt*/
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
void fwriteInt(int i) {
    if (i == MIN_VALUE) fwriteCharArray("-2147483648", 11);
    int size = (i < 0) ? stringSize(-i) + 1 : stringSize(i);
    char buf[size];
    getChars(i, size, buf);
    fwriteCharArray(buf, size);
}
/*flush缓存*/
inline void flushIO() { fwrite(IO_wbuf, 1, IO_S1 - IO_wbuf, stdout); }
#endif
#endif
int main(int argc, char const *argv[]) {
    using namespace std;
    return 0;
}
/*******************************测试结果**************************************/
/*******************************fpeek测试*************************************/
/**测试代码
int main(int argc, char const *argv[]){
        using namespace std;
        freopen("IO_TEST","r",stdin);
        int x;
        while(bfreadInt(x)) cout<<x<<endl;
        cout<<(int)fpeek()<<endl;;
        return 0;
}
*/
/**测试输入
        1
                        2
                   3
        -1
        0001
         -0000023
*/
/**测试输出
1
2
3
-1
1
-23
-1
*/
/*测试结果:通过!*/
/*************************void freadInt(int&)测试*****************************/
/**测试代码
int main(int argc, char const *argv[]){
        using namespace std;
        freopen("IO_TEST","r",stdin);
        int x;
        freadInt(x),cout<<x<<endl;
        freadInt(x),cout<<x<<endl;
        freadInt(x),cout<<x<<endl;
        freadInt(x),cout<<x<<endl;
        freadInt(x),cout<<x<<endl;
        freadInt(x),cout<<x<<endl;
        freadInt(x),cout<<x<<endl;
        return 0;
}
*
/**测试输入
1
2
3
-1
0001
-0000023
*/
/**测试输出
1
2
3
-1
1
-23
*/
/*测试结果:通过!*/
/*************************bool bfreadInt(int&)测试*****************************/
/**测试代码
int main(int argc, char const *argv[]){
        using namespace std;
        freopen("IO_TEST","r",stdin);
        int x;
        while(bfreadInt(x)) cout<<x<<endl;
        return 0;
}
*/
/**测试输入1
1
2
3
-1
0001
-0000023
*/
/**测试输出1
1
2
3
-1
1
-23
*/
/**测试输入2
        1
                        2
                   3
        -1
        0001
         -0000023
*/
/**测试输出2
1
2
3
-1
1
-23
*/
/*测试结果:通过!*/
/***********************freadString测试***************************/
/**测试代码
int main(int argc, char const *argv[]){
        using namespace std;
        freopen("IO_TEST","r",stdin);
        string str;
        freadString(str,'#');
        cout<<str;
        return 0;
}
*/
/**测试输入1
   1
  2
    3
     -1
      001#
      -0000023
*/
/**测试输出1
1
  2
    3
     -1
      001
*/
/**测试输入2
   1
  2
    3
     -1
      001
      -0000023
*/
/**测试输出2
1
  2
    3
     -1
      001
      -0000023
*/
/*测试结果:通过!*/
```
