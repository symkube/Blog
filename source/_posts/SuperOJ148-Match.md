---
title: 「SuperOJ148」表达式括号匹配
date: 2016-07-08 08:08:19
tags:
  - 字符串
  - 栈
  - 数据结构
categories:
  - OI
  - 数据结构
  - 栈
---
## 表达式括号匹配
### 题目描述
假设一个表达式有英文字母（小写）,运算符（+，—，*，/）和左右小（圆）括号构成，以“@”作为表达式的结束符。

请编写一个程序检查表达式中的左右圆括号是否匹配，若匹配，则返回“YES”；否则返回“NO”。假设表达式长度小于 255，左圆括号少于 20 个。
### 输入格式
输入一行，一个表达式。
### 输出格式
如果括号匹配，输出“YES”,否则输出“NO”。
<!-- more -->
### 样例数据 1
输入
``` bash
2*(x+y)@
```
输出
``` bash
YES
```
### 样例数据 2
输入
``` cpp
(25+x)*(a*(a+b+b)@
```
输出
``` cpp
NO
```
### 分析
栈的运用,很简单。
### 源码
``` cpp
#include <algorithm>
#include <cstdio>
#include <iostream>
#include <stack>
using namespace std;
/*继承STL stack重写pop()方法*/
template <class T>
class Stack : public std::stack<T> {
   public:
    T pop() {
        T tmp = std::stack<T>::top();
        std::stack<T>::pop();
        return tmp;
    }
};
Stack<char> st;
int main(int argc, char const *argv[]) {
    /* code */
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    int flag = 0;
    char buffer;
    do {
        buffer = getchar();
        st.push(buffer);
    } while (buffer != '@');
    while (!st.empty()) {
        switch (st.pop()) {
            case '(':
                flag++;
                break;
            case ')':
                flag--;
                break;
        }
    }
    cout << (flag ? "NO" : "YES");
    return 0;
}
```
