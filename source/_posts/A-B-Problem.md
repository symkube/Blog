---
title: A+B Problem
date: 2016-05-24 11:54:38
tags:
categories:
  - OI
---
## A+B Problem
### 题目背景
新手入门。
### 题目描述
计算两个整数的和。
### 输入格式
输入只有一行，包括两个整数 $a, b$，每个整数之间用一个空格分隔。
### 输出格式
输出只有一行，包含一个整数为 $a + b$ 的计算结果。
<!-- more -->
### 样例数据 1
输入
``` bash
1 2
```
输出
``` bash
3
```
### 源码
#### C++
``` cpp
#include <iostream>
using namespace std;
int main(int argc, char const *argv[]) {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}
```
#### Java
``` java
import java.io.BufferedInputStream;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(new BufferedInputStream(System.in));
        System.out.println(sc.nextInt() + sc.nextInt());
    }
}
```

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=766217&auto=1&height=66"></iframe>