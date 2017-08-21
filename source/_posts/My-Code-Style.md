---
title: My Code Style
date: 2017-01-09 19:27:24
tags:
---
由于我以前常写 $Java$，以此来统一本人 $C++$ 的代码风格及规范，此文以后，本博客代码均遵守此规范。
### 文件组织
#### 文件后缀
1. 头文件使用 $.h$ 后缀
2. 源代码使用 $.cpp$ 后缀

<!-- more -->
#### 文件编码
使用 UTF-8 编码
#### 源文件
源文件必须包含开头注释，包含引入语句。
#### 开头注释
所有的源文件都应该在开头有一个 $C$ 语言风格的注释，其中列出类名,版本信息,日期和版权声明等：
``` cpp
/* 
 * Classname
 *  
 * Version information
 * 
 * Date
 * 
 * Copyright
 */ 
```
#### 引入语句
引入语句必须置于开头注释下方。
#### 注释
1. 变量注释采用单行注释
2. 类/接口实现采用文档注释
3. 函数/方法采用实现注释(若不使用文档注释的话)

### 缩进排版
$4$ 个空格为缩进单位，保存文件时禁止保存 $tab$ 字符，必须使用空格替代 $tab$。
#### 行长度
尽量避免一行超过 $80$ 个字符。
#### 换行
当一个表达式无法容纳在一行内时，可以依据如下一般规则断开之： - 在一个逗号后面断开
- 在一个操作符前面断开 
- 宁可选择较高级别(higher-level)的断开，而非较低级别(lower-level)的断开 
- 新的一行应该与上一行同一级别表达式的开头处对齐 
- 如果以上规则导致你的代码混乱或者使你的代码都堆挤在右边，那就代之以缩进8个空格。

#### 花括号
所有"{"应与当前语句所处同一行。
#### 空行
下列情况应该总是使用两个空行： 
- 一个源文件的两个片段(section)之间 
- 类声明和接口声明之间  

下列情况应该总是使用一个空行： 
- 两个方法之间 
- 方法内的局部变量和方法的第一条语句之间 
- 块注释或单行注释之前 
- 一个方法内的两个逻辑段之间，用以提高可读性 

### 声明
#### 每行声明变量的数量
按使用的类别区分，通常一类为一行。
#### 初始化
尽量在声明局部变量的同时初始化。唯一不这么做的理由是变量的初始值依赖于某些先前发生的计算。
#### 布局
只在代码块的开始处声明变量。（一个块是指任何被包含在大括号"{"和"}"中间的代码。）不要在首次用到该变量时才声明之。
#### 类和结构体的声明
- 在方法名与其参数列表之前的左括号"("间不要有空格 
- 左大括号"{"位于声明语句同行的末尾 
- 右大括号"}"另起一行，与相应的声明语句对齐，除非是一个空语句，"}"应紧跟在"{"之后 

如：
``` cpp
class Sample : Object {
    int var1;
    int var2;

    Sample() {}

    Sample(int i, int j) : var1(i), var2(j) {
        /* do some statements */
    }

    void emptyMethod() {}
};
```
### 语句
#### 简单语句
一行至多包含一条语句，在 $C++$ 中可用 `,`　连接多个类似语句，如：
``` cpp
argv++;    /* correct */
argc--;    /* correct */
argv++; argc--;    /* avoid */
argv++, argc--;    /* correct */
```
#### 符合语句
- 被括其中的语句应该较之复合语句缩进一个层次 
- 左大括号"{"应位于复合语句起始行的行尾；右大括号"}"应另起一行并与复合语句首行对齐。
- 大括号可以被用于所有语句，包括单个语句，只要这些语句是诸如if-else或for控制结构的一部分。
- 禁止将大括号提行。

#### 返回语句
一个带返回值的 $return$ 语句不使用小括号"()"，除非它们以某种方式使返回值更为显见。例如： 
``` cpp
return;  
return myDisk.size();  
return (size ? size : defaultSize);
```
#### 条件语句
`if-else` 语句应具有如下格式：
``` cpp
if (condition) {
    statements;
}

if (condition) {
    statements;
} else {
    statements;
}

if (condition) {
    statements;
} else if (condition) {
    statements;
} else {
    statements;
}
```
只允许使用 $boolean$ 类型进行判断。
**当且仅当** **这些语句** 中都只有 **一条** 语句时，大括号可以省略。
#### 循环语句
``` cpp
for (initialization; condition; update) {
    statements;
}

for (initialization; condition; update)
    ;

while (condition) {
    statements;
}

while (condition)
    ;

do {
    statements;
} while (condition);
```
**当且仅当** **这些语句** 中都只有 **一条** 语句时，大括号可以省略。
#### switch语句
``` cpp
switch (condition) {
    case A:
        statements;
    /* falls through */
    case B:
        statements;
        break;
    default:
        statements;
        break;
}
```
### 命名规范
#### 类和结构体
类名是个一名词，采用大小写混合的方式，每个单词的首字母大写。尽量使类名简洁而富于描述。使用完整单词，避免缩写词(除非该缩写词被更广泛使用，像URL，HTML)
如：
``` cpp
class Main;
struct Edge;
```
#### 方法
方法名是一个动词，采用大小写混合的方式，第一个单词的首字母小写，其后单词的首字母大写。
``` cpp
run();
dis(a, b);
getBackground();
```
#### 变量
除了变量名外，所有实例，包括类，类常量，均采用大小写混合的方式(均采用**小驼峰命名法**)，第一个单词的**首字母小写**，其后单词的**首字母大写**。变量名**不应以**下划线或美元符号开头，尽管这在语法上是允许的。 变量名应简短且富于描述。变量名的选用应该易于记忆，即，能够指出其用途。尽量避免单个字符的变量名，除非是一次性的临时变量。**临时变量**通常被取名为i，j，k，m 和 n，它们一般用于**整型**；c，d，e，它们一般用于**字符型**;
``` cpp
int count;
int myWidth;
char c;
```
#### 实例变量
大小写规则和变量名相似，除了前面需要一个下划线。
``` cpp
Customer _customer;
int _employeeId;
```
#### 常量
类常量和ANSI常量的声明，应该全部大写，单词间用下划线隔开。
``` cpp
static const int MIN_WIDTH = 4;
static const int MAX_WIDTH = 999;
static const int GET_THE_CPU = 1;
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=707862&auto=1&height=66"></iframe>