---
title: 「NOIP 2006」明明的随机数
date: 2016-05-24 14:22:05
tags:
  - 排序
categories:
  - OI
  - 排序
---
## 明明的随机数
### 题目背景
NOIP 2006 普及组试题1。
### 题目描述
明明想在学校中请一些同学一起做一项问卷调查，为了实验的客观性，他先用计算机生成了 $N$ 个 $1$ 到 $1000$ 之间的随机整数（$N \leq 100$），对于其中重复的数字，只保留一个，把其余相同的数去掉，不同的数对应着不同的学生的学号。然后再把这些数从小到大排序，按照排好的顺序去找同学做调查。请你协助明明完成**去重**与**排序**的工作。
### 输入格式
输入文件有 $2$ 行:
第 $1$ 行为 $1$ 个正整数，表示所生成的随机数的个数：$N$
第 $2$ 行有 $N$ 个用空格隔开的正整数，为所产生的随机数。
### 输出格式
输出文件也是 $2$ 行：
第 $1$ 行为 $1$ 个正整数 $M$，表示不相同的随机数的个数。
第 $2$ 行为 $M$ 个用空格隔开的正整数，为从小到大排好序的不相同的随机数。
<!-- more -->
### 样例数据 1
输入
``` bash
10
20 40 32 67 40 20 89 300 400 15
```
输出
``` bash
8
15 20 32 40 67 89 300 400
```
### 源码
#### Java实现
``` java
import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(new BufferedReader(new InputStreamReader(System.in)));
        List<Integer> list = new ArrayList<Integer>();
        sc.nextInt();
        while (sc.hasNextInt())
            list.add(sc.nextInt());
        for (int i = 0; i < list.size() - 1; i++) 
            for (int j = list.size() - 1; j > i; j--) 
                if (list.get(j).equals(list.get(i))) 
                    list.remove(j);
        Integer[] num = list.toArray(new Integer[0]);
        Arrays.sort(num);
        System.out.println(list.size());
        for (int i : num)
            System.out.print(i + " ");
    }
}
```
#### C++实现
``` cpp
#include <cstdio>
int a[1001];
int main() {
    int i, n, t;
    int count = 0;
    scanf("%d", &n);
    for (i = 1; i <= n; i++) {
        scanf("%d", &t);
        if (a[t] == 0) {
            a[t] = 1;
            count++;
        }
    }
    printf("%d\n", count);
    for (i = 1; i <= 1000; i++)
        if (a[i] == 1) printf("%d ", i);
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=832877&auto=1&height=66"></iframe>